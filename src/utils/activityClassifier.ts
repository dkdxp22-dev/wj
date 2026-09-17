import { ActivityCategory, ZoningCategory } from "../types";

export interface ActivityClassificationResult {
  primaryCategory: ActivityCategory;
  categoryTitle: string;
  confidence: number; // 0 ~ 100
  secondaryCategories?: ActivityCategory[];
  reasoning: string;
  matchedKeywords: string[];
  suggestedInputs?: {
    alterationType?: "CUT" | "FILL" | "LEVEL" | "PAVE" | "RECLAMATION";
    structureType?: "BUILDING" | "STRUCTURE" | "VINYL_HOUSE";
    isAgriculturalPurpose?: boolean;
    hasBuildingOnPlot?: boolean;
    heightOrDepthCm?: number;
    subdivisionAreaM2?: number;
    stockpileDurationMonths?: number;
  };
  keyLegalBasis: string;
}

/**
 * 개발 내용 텍스트로부터 국토계획법 제56조 제1항 5대 행위 유형을 규칙 기반으로 고속 판단하는 함수
 */
export function classifyActivityFromDescription(text: string): ActivityClassificationResult {
  const clean = text.trim();
  if (!clean) {
    return {
      primaryCategory: "LAND_ALTERATION",
      categoryTitle: "토지의 형질변경",
      confidence: 50,
      reasoning: "입력된 내용이 없어 가장 일반적인 개발행위인 토지형질변경으로 기본 설정되었습니다.",
      matchedKeywords: [],
      keyLegalBasis: "국토계획법 제56조제1항제2호",
    };
  }

  const scores: Record<ActivityCategory, { score: number; keywords: string[]; hints: any }> = {
    BUILDING_STRUCTURE: { score: 0, keywords: [], hints: {} },
    LAND_ALTERATION: { score: 0, keywords: [], hints: {} },
    ROCK_EXCAVATION: { score: 0, keywords: [], hints: {} },
    LAND_SUBDIVISION: { score: 0, keywords: [], hints: {} },
    STOCKPILING_GOODS: { score: 0, keywords: [], hints: {} },
  };

  // 1. 건축물의 건축 또는 공작물의 설치
  const buildingPatterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }> = [
    { regex: /건축|신축|증축|개축|재축|이전|빌라|단독주택|다가구|다세대|근생|근린생활시설|상가|공장|창고|사무소|카페/g, weight: 12, word: "건축/건물 신축", hint: { structureType: "BUILDING" } },
    { regex: /가설건축물|컨테이너|농막|이동식주택|가설창고/g, weight: 10, word: "가설건축물/컨테이너", hint: { structureType: "STRUCTURE" } },
    { regex: /공작물|태양광|발전시설|철탑|기계식주차|광고탑|담장|옹벽|골프연습장|사일로/g, weight: 12, word: "공작물/발전시설/철탑", hint: { structureType: "STRUCTURE" } },
    { regex: /비닐하우스|온실|유리온실|스마트팜/g, weight: 9, word: "비닐하우스/온실", hint: { structureType: "VINYL_HOUSE", isAgriculturalPurpose: true } },
    { regex: /건물짓|집짓|건물|주택/g, weight: 8, word: "건물 짓기", hint: { structureType: "BUILDING" } },
  ];

  // 2. 토지의 형질변경
  const alterationPatterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }> = [
    { regex: /성토|흙돋우|돋우|객토|되메우기|흙채우기|흙받/g, weight: 12, word: "성토(흙 채우기/돋우기)", hint: { alterationType: "FILL" } },
    { regex: /절토|깎아|땅파|절개|터파기|사면깎기/g, weight: 12, word: "절토(땅 깎기)", hint: { alterationType: "CUT" } },
    { regex: /정지|평탄화|땅고르기|나라시|지반정리|부지조성|부지 정리/g, weight: 12, word: "정지(평탄화)", hint: { alterationType: "LEVEL" } },
    { regex: /포장|아스콘|아스팔트|콘크리트포장|바닥포장|자갈깔기|쇄석/g, weight: 11, word: "포장(콘크리트/아스콘)", hint: { alterationType: "PAVE" } },
    { regex: /매립|공유수면|간척|물메우기|웅덩이메우기/g, weight: 14, word: "공유수면 매립", hint: { alterationType: "RECLAMATION" } },
    { regex: /영농|농작물|경작|과수원|밭갈이|농지개량|다년생식물/g, weight: 8, word: "영농/농지개량", hint: { isAgriculturalPurpose: true } },
    { regex: /형질변경|토공사|토목공사|옹벽설치|석축/g, weight: 11, word: "토목/형질변경", hint: {} },
    { regex: /지목변경|대지로변경|잡종지로변경/g, weight: 9, word: "지목변경", hint: {} },
  ];

  // 3. 토석의 채취
  const rockPatterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }> = [
    { regex: /토석채취|석산|모래채취|자갈채취|암석채취|골재채취/g, weight: 18, word: "토석/골재 채취" },
    { regex: /토석|골재|쇄석채취|광물채취|마사토채취/g, weight: 14, word: "마사토/골재 채취" },
    { regex: /돌캐|모래캐|흙파서판매|토사반출|토석반출/g, weight: 15, word: "토사/토석 반출·판매" },
  ];

  // 4. 토지분할
  const subdivisionPatterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }> = [
    { regex: /토지분할|필지분할|땅나누|분할|필지나누|지번분할/g, weight: 16, word: "토지/필지 분할" },
    { regex: /지분쪼개기|기획부동산|여러개필지|필지 쪼개|지분 분할/g, weight: 15, word: "다수 필지 분할" },
    { regex: /단독필지화|대지분할|진입로분할/g, weight: 12, word: "진입로/대지 분할" },
  ];

  // 5. 물건을 쌓아놓는 행위 (적치)
  const stockpilingPatterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }> = [
    { regex: /야적|물건적치|적치|쌓아놓|물건쌓기|자재보관|자재적재|컨테이너적치/g, weight: 16, word: "야적/물건 적치" },
    { regex: /고철|파지|폐기물보관|골재야적|원자재적치|모래야적|목재야적|중장비주차/g, weight: 14, word: "자재/골재 야적" },
    { regex: /1개월이상|장기보관|야외적치/g, weight: 10, word: "1개월 이상 야적" },
  ];

  // 패턴 매칭 평가
  const evaluateList = (
    category: ActivityCategory,
    patterns: Array<{ regex: RegExp; weight: number; word: string; hint?: any }>
  ) => {
    for (const p of patterns) {
      const matches = clean.match(p.regex);
      if (matches && matches.length > 0) {
        scores[category].score += p.weight * matches.length;
        if (!scores[category].keywords.includes(p.word)) {
          scores[category].keywords.push(p.word);
        }
        if (p.hint) {
          scores[category].hints = { ...scores[category].hints, ...p.hint };
        }
      }
    }
  };

  evaluateList("BUILDING_STRUCTURE", buildingPatterns);
  evaluateList("LAND_ALTERATION", alterationPatterns);
  evaluateList("ROCK_EXCAVATION", rockPatterns);
  evaluateList("LAND_SUBDIVISION", subdivisionPatterns);
  evaluateList("STOCKPILING_GOODS", stockpilingPatterns);

  // 수치 파싱 보조 (높이 cm 등)
  const heightMatch = clean.match(/(\d+)\s*(m|미터|cm|센티)/);
  if (heightMatch) {
    const val = parseFloat(heightMatch[1]);
    const unit = heightMatch[2];
    const cm = unit.startsWith("m") || unit === "미터" ? Math.round(val * 100) : Math.round(val);
    scores.LAND_ALTERATION.hints.heightOrDepthCm = cm;
    if (cm >= 200) {
      scores.LAND_ALTERATION.score += 5;
    }
  }

  // 랭킹 정렬
  const ranked = (Object.keys(scores) as ActivityCategory[])
    .map((cat) => ({
      cat,
      score: scores[cat].score,
      keywords: scores[cat].keywords,
      hints: scores[cat].hints,
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];

  // 단일 매칭이 없거나 점수가 너무 낮을 때의 기본 처리
  let primaryCategory: ActivityCategory = top.score > 0 ? top.cat : "LAND_ALTERATION";
  let confidence = top.score > 0 ? Math.min(95, Math.max(55, Math.round(50 + top.score * 2.5))) : 40;

  // 복합 행위 여부 파악 (예: 건축을 위한 성토/토지형질변경)
  const secondaryCategories: ActivityCategory[] = [];
  if (second.score >= 8) {
    secondaryCategories.push(second.cat);
  }

  const categoryTitles: Record<ActivityCategory, string> = {
    BUILDING_STRUCTURE: "건축물의 건축 또는 공작물의 설치",
    LAND_ALTERATION: "토지의 형질변경 (절토·성토·정지·포장·매립)",
    ROCK_EXCAVATION: "토석의 채취 (흙·모래·자갈·바위 채취)",
    LAND_SUBDIVISION: "토지분할 (건축물이 없는 토지의 분할)",
    STOCKPILING_GOODS: "물건을 쌓아놓는 행위 (1개월 이상 야적)",
  };

  const legalBases: Record<ActivityCategory, string> = {
    BUILDING_STRUCTURE: "국토의 계획 및 이용에 관한 법률 제56조 제1항 제1호",
    LAND_ALTERATION: "국토의 계획 및 이용에 관한 법률 제56조 제1항 제2호",
    ROCK_EXCAVATION: "국토의 계획 및 이용에 관한 법률 제56조 제1항 제3호",
    LAND_SUBDIVISION: "국토의 계획 및 이용에 관한 법률 제56조 제1항 제4호",
    STOCKPILING_GOODS: "국토의 계획 및 이용에 관한 법률 제56조 제1항 제5호",
  };

  // 추론 근거 작성
  let reasoning = "";
  if (top.keywords.length > 0) {
    reasoning = `입력 내용 중 '${top.keywords.join(
      ", "
    )}' 관련 표현이 감지되어 국토계획법상 [${categoryTitles[primaryCategory]}]에 해당할 가능성이 가장 높습니다.`;
    if (secondaryCategories.length > 0) {
      reasoning += ` 또한 [${categoryTitles[secondaryCategories[0]]}] 행위도 수반되는 복합 개발행위일 수 있습니다.`;
    }
  } else {
    reasoning =
      "명확한 법정 개발행위 키워드가 적어 포괄적 부지 조성 행위인 [토지의 형질변경]으로 1차 분류되었습니다. 필요시 변경 가능합니다.";
  }

  return {
    primaryCategory,
    categoryTitle: categoryTitles[primaryCategory],
    confidence,
    secondaryCategories,
    reasoning,
    matchedKeywords: top.keywords,
    suggestedInputs: top.hints,
    keyLegalBasis: legalBases[primaryCategory],
  };
}

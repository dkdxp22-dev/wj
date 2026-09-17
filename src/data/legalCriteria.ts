import { ActivityCategory, ZoningCategory, LegalStatute, FaqItem } from "../types";

export const ZONING_DATA: Record<
  ZoningCategory,
  {
    name: string;
    categoryGroup: "도시지역" | "관리지역" | "농림지역" | "자연환경보전지역";
    maxScaleM2: number; // 시행령 제55조 개발행위허가 규모 상한
    description: string;
    isCityOrDistrictPlanArea: boolean; // 도시지역 또는 지구단위계획구역 여부
  }
> = {
  RESIDENTIAL: {
    name: "주거지역",
    categoryGroup: "도시지역",
    maxScaleM2: 10000,
    description: "거주의 안녕과 건전한 생활환경의 보호를 위해 필요한 지역 (1만㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  COMMERCIAL: {
    name: "상업지역",
    categoryGroup: "도시지역",
    maxScaleM2: 10000,
    description: "상업이나 그 밖의 업무의 편익을 증진하기 위해 필요한 지역 (1만㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  INDUSTRIAL: {
    name: "공업지역",
    categoryGroup: "도시지역",
    maxScaleM2: 30000,
    description: "공업의 편익을 증진하기 위해 필요한 지역 (3만㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  NATURAL_GREEN: {
    name: "자연녹지지역",
    categoryGroup: "도시지역",
    maxScaleM2: 10000,
    description: "도시의 녹지공간 확보, 장래 도시용지의 공급 등을 위해 보전할 필요가 있는 지역 (1만㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  PRODUCTION_GREEN: {
    name: "생산녹지지역",
    categoryGroup: "도시지역",
    maxScaleM2: 10000,
    description: "농업적 생산을 위해 개발을 유보할 필요가 있는 지역 (1만㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  PRESERVATION_GREEN: {
    name: "보전녹지지역",
    categoryGroup: "도시지역",
    maxScaleM2: 5000,
    description: "도시의 자연환경·경관·산림 및 녹지공간을 보전할 필요가 있는 지역 (5천㎡ 미만)",
    isCityOrDistrictPlanArea: true,
  },
  PLANNED_MANAGEMENT: {
    name: "계획관리지역",
    categoryGroup: "관리지역",
    maxScaleM2: 30000,
    description: "도시지역으로의 편입이 예상되거나 체계적 관리가 필요한 지역 (3만㎡ 미만)",
    isCityOrDistrictPlanArea: false,
  },
  PRODUCTION_MANAGEMENT: {
    name: "생산관리지역",
    categoryGroup: "관리지역",
    maxScaleM2: 30000,
    description: "농업·임업·어업 생산 등을 위해 관리가 필요하나 농림지역 지정이 곤란한 지역 (3만㎡ 미만)",
    isCityOrDistrictPlanArea: false,
  },
  PRESERVATION_MANAGEMENT: {
    name: "보전관리지역",
    categoryGroup: "관리지역",
    maxScaleM2: 30000,
    description: "자연환경 보호, 산림 보호 등을 위해 관리가 필요하나 자연환경보전지역 지정이 곤란한 지역 (3만㎡ 미만)",
    isCityOrDistrictPlanArea: false,
  },
  AGRICULTURE_FORESTRY: {
    name: "농림지역",
    categoryGroup: "농림지역",
    maxScaleM2: 30000,
    description: "도시지역에 속하지 않는 농지법에 따른 농업진흥지역 또는 산지관리법에 따른 보전산지 등 (3만㎡ 미만)",
    isCityOrDistrictPlanArea: false,
  },
  NATURE_ENVIRONMENT: {
    name: "자연환경보전지역",
    categoryGroup: "자연환경보전지역",
    maxScaleM2: 5000,
    description: "자연환경·수자원·해안·생태계·상수원 및 문화재의 보전과 수산자원의 보호·육성을 위해 필요한 지역 (5천㎡ 미만)",
    isCityOrDistrictPlanArea: false,
  },
};

export const ACTIVITY_CATEGORIES: Record<
  ActivityCategory,
  {
    title: string;
    subtitle: string;
    iconName: string;
    description: string;
    statutoryRef: string;
    keyPoints: string[];
  }
> = {
  BUILDING_STRUCTURE: {
    title: "건축물의 건축 또는 공작물의 설치",
    subtitle: "건축법상 건축물 및 인공 시설물 축조",
    iconName: "Building2",
    description: "건축법에 따른 건축물의 건축 또는 인공을 가하여 제작한 시설물(옹벽, 철탑, 태양광발전시설 등)의 설치",
    statutoryRef: "법 제56조제1항제1호, 영 제51조제1항제1호",
    keyPoints: [
      "건축법에 따른 건축허가/신고 시 개발행위허가가 일괄 의제협의됨",
      "경미한 공작물(도시지역: 50톤·50㎥·25㎡ 이하, 비도시: 150톤·150㎥·75㎡ 이하)은 허가 면제",
      "농림어업용 비닐하우스(단, 양식장 또는 골조 제외)는 원칙적 면제",
    ],
  },
  LAND_ALTERATION: {
    title: "토지의 형질변경",
    subtitle: "절토·성토·정지·포장 및 매립",
    iconName: "Layers",
    description: "절토(땅깎기), 성토(흙쌓기), 정지(땅고르기), 포장 등의 방법으로 토지의 형상을 변경하는 행위 및 공유수면의 매립",
    statutoryRef: "법 제56조제1항제2호, 영 제51조제1항제2호",
    keyPoints: [
      "높이/깊이 50cm 이내 절토·성토·정지는 지목변경이 없고 포장이 없으면 경미한 행위로 면제",
      "비도시지역 660㎡ 이하 토지의 지목변경 없는 형질변경은 허가 면제",
      "영농 목적 성토라도 2m 이상(국토부 지침)이거나 지자체 조례에 따라 옹벽 설치/배수장애 우려 시 허가 대상",
    ],
  },
  ROCK_EXCAVATION: {
    title: "토석의 채취",
    subtitle: "흙·모래·자갈·바위 등의 굴착·채취",
    iconName: "Mountain",
    description: "흙·모래·자갈·바위 등의 토석을 채취하는 행위 (단, 토지의 형질변경을 목적으로 하는 것은 형질변경에 포함)",
    statutoryRef: "법 제56조제1항제3호, 영 제51조제1항제3호",
    keyPoints: [
      "형질변경 목적의 굴착은 형질변경허가에 흡수됨",
      "경미한 채취: 도시지역 25㎡ 이하 토지에서 부피 50㎥ 이하 채취는 면제",
      "경미한 채취: 비도시지역 250㎡ 이하 토지에서 부피 500㎥ 이하 채취는 면제",
    ],
  },
  LAND_SUBDIVISION: {
    title: "토지분할",
    subtitle: "건축물이 없는 토지의 필지 분할",
    iconName: "SplitSquareVertical",
    description: "건축법 제57조에 따른 건축물이 있는 대지의 분할을 제외한, 건축물이 없는 토지의 필지 분할",
    statutoryRef: "법 제56조제1항제4호, 영 제51조제1항제4호",
    keyPoints: [
      "기획부동산식 바둑판 쪼개기 방지를 위한 핵심 규제",
      "녹지·관리·농림·자연환경보전지역 안에서 조례로 정하는 면적 미만 분할은 허가 필수",
      "관계 법령에 의한 인허가 없이 행하는 너비 5m 이하의 분할은 허가 필수",
      "사도개설허가 토지나 공공용지 편입 분할 등은 경미한 행위로 면제",
    ],
  },
  STOCKPILING_GOODS: {
    title: "물건을 쌓아놓는 행위 (적치)",
    subtitle: "울타리 밖 토지에 1개월 이상 야적",
    iconName: "Boxes",
    description: "녹지·관리·자연환경보전지역 안에서 건축물의 울타리 안(대지 안)에 위치하지 아니한 토지에 물건을 1개월 이상 쌓아놓는 행위",
    statutoryRef: "법 제56조제1항제5호, 영 제51조제1항제5호",
    keyPoints: [
      "주거·상업·공업지역 및 농림지역은 법령상 적치허가 대상 지역이 아님",
      "건축물의 울타리(대지) 안은 허가 대상이 아님",
      "1개월 미만의 일시적 적치 또는 경미한 규모(50톤/150톤 이하 등)는 허가 면제",
    ],
  },
};

export const STATUTES_LIBRARY: LegalStatute[] = [
  {
    articleNo: "국토계획법 제56조 제1항",
    title: "개발행위의 허가 대상",
    category: "허가대상",
    summary: "다음 각 호의 어느 하나에 해당하는 행위로서 대통령령으로 정하는 행위를 하려는 자는 시장 또는 군수의 허가를 받아야 한다.",
    fullText: `제56조(개발행위의 허가) ① 다음 각 호의 어느 하나에 해당하는 행위로서 대통령령으로 정하는 행위(이하 "개발행위"라 한다)를 하려는 자는 특별시장·광역시장·특별자치시장·특별자치도지사·시장 또는 군수(이하 "시장 또는 군수"라 한다)의 허가(이하 "개발행위허가"라 한다)를 받아야 한다. 다만, 도시·군계획사업에 의한 행위는 그러하지 아니하다.
1. 건축물의 건축 또는 공작물의 설치
2. 토지의 형질 변경(절토·성토·정지·포장 등의 방법으로 토지의 형상을 변경하는 행위와 공유수면의 매립을 말한다. 이하 같다)
3. 토석의 채취
4. 토지 분할(「건축법」 제57조에 따른 건축물이 있는 대지의 분할은 제외한다. 이하 같다)
5. 녹지지역·관리지역 또는 자연환경보전지역에 물건을 1개월 이상 쌓아놓는 행위`,
    relatedNotes: "도시·군계획시설사업이나 도시개발사업 등 법정 공공계획사업은 별도 인가를 받으므로 본 허가에서 제외됩니다.",
  },
  {
    articleNo: "국토계획법 제56조 제4항",
    title: "허가를 받지 아니하여도 되는 응급조치",
    category: "응급조치",
    summary: "재해복구나 재난수습을 위한 응급조치는 허가를 받지 않고 할 수 있으나, 1개월 이내에 관할청에 사후 신고해야 함.",
    fullText: `제56조 ④ 다음 각 호의 어느 하나에 해당하는 행위는 제1항에도 불구하고 개발행위허가를 받지 아니하고 할 수 있다. 다만, 제1호의 행위를 한 자는 1개월 이내에 시장 또는 군수에게 신고하여야 한다.
1. 재해복구 또는 재난수습을 위한 응급조치
2. 「건축법」에 따라 신고하고 설치할 수 있는 건축물의 개축·증축 또는 재축과 이에 필요한 범위에서의 토지의 형질 변경(도시·군계획시설사업이 시행되지 아니하고 있는 지구단위계획구역인 경우에 한정한다)
3. 그 밖에 대통령령으로 정하는 경미한 행위`,
    relatedNotes: "응급조치 후 1개월 내 신고를 누락할 경우 과태료 처분을 받을 수 있습니다.",
  },
  {
    articleNo: "국토계획법 시행령 제53조",
    title: "허가를 받지 아니하여도 되는 경미한 행위",
    category: "경미한행위",
    summary: "50cm 이내 절토·성토, 경미한 공작물, 비도시지역 660㎡ 이하 형질변경, 조경 목적 등은 허가 없이 가능.",
    fullText: `영 제53조(허가를 받지 아니하여도 되는 경미한 행위) 법 제56조제4항제3호에서 "대통령령으로 정하는 경미한 행위"란 다음 각 호의 행위를 말한다. 다만, 다음 각 호에 해당하는 행위로서 도시·군계획조례로 따로 정하는 경우에는 그에 따른다.
1. 건축물의 건축: 건축법에 따른 허가나 신고 대상이 아닌 건축
2. 공작물의 설치: 도시지역/지구단위계획구역은 50톤·50㎥·25㎡ 이하, 그 외 150톤·150㎥·75㎡ 이하
3. 토지의 형질변경:
  가. 높이 50센티미터 이내 또는 깊이 50센티미터 이내의 절토·성토·정지 등 (포장 제외, 지목변경 미수반)
  나. 도시지역·자연환경보전지역 및 지구단위계획구역 외의 지역에서 면적이 660제곱미터 이하인 토지에 대한 지목변경을 수반하지 아니하는 절토·성토·정지·포장 등
  다. 조경을 위한 토지의 형질변경(건축물의 건축을 위한 형질변경은 제외한다)
  라. 농작물의 경작 등 조례로 정하는 영농을 위한 토지의 형질변경
4. 토석채취: 도시지역 25㎡/50㎥ 이하, 그 외 250㎡/500㎥ 이하
5. 토지분할: 사도개설허가 토지 분할, 공공용지 편입 분할 등
6. 물건 적치: 도시지역 50톤·50㎥·25㎡ 이하, 그 외 150톤·150㎥·75㎡ 이하`,
    relatedNotes: "단서 조항에 따라 각 지자체 도시·군계획조례에서 경미한 행위의 범위를 축소하거나 추가 요건을 둘 수 있습니다.",
  },
  {
    articleNo: "국토계획법 시행령 제55조",
    title: "개발행위허가의 규모 상한",
    category: "허가규모",
    summary: "용도지역별 면적 기준을 초과하는 경우 개발행위허가가 제한되거나 도시계획위원회 심의·지구단위계획 수립이 필요함.",
    fullText: `영 제55조(개발행위허가의 규모) ① 법 제58조제1항제1호 본문에서 "대통령령으로 정하는 용도지역별 특성을 고려하여 대통령령으로 정하는 기준"이란 다음 각 호의 구분에 따른 규모 미만인 경우를 말한다.
1. 도시지역
  가. 주거지역·상업지역·자연녹지지역·생산녹지지역: 1만 제곱미터
  나. 공업지역: 3만 제곱미터
  다. 보전녹지지역: 5천 제곱미터
2. 관리지역: 3만 제곱미터
3. 농림지역: 3만 제곱미터
4. 자연환경보전지역: 5천 제곱미터`,
    relatedNotes: "연접개발제한은 폐지되었으나, 대규모 개발 시에는 도시계획위원회 심의를 거쳐 기반시설(도로, 상하수도) 확보 기준이 매우 엄격해집니다.",
  },
  {
    articleNo: "국토계획법 제140조 및 제133조",
    title: "무허가 개발행위 처벌 및 원상회복명령",
    category: "벌칙",
    summary: "무허가 개발행위 시 3년 이하의 징역 또는 3천만원 이하의 벌금에 처해지며 원상회복명령이 부과됨.",
    fullText: `제140조(벌칙) 다음 각 호의 어느 하나에 해당하는 자는 3년 이하의 징역 또는 3천만원 이하의 벌금에 처한다.
1. 제56조제1항 또는 제2항을 위반하여 허가 또는 변경허가를 받지 아니하거나 속임수나 그 밖의 부정한 방법으로 허가를 받아 개발행위를 한 자

제133조(법률 등의 위반자에 대한 행정처분) ① 시장 또는 군수는 이 법 또는 이 법에 따른 명령이나 처분을 위반한 자에게 공사의 중지, 건축물·공작물의 개축 또는 철거, 그 밖에 필요한 처분을 하거나 조치를 명할 수 있다.`,
    relatedNotes: "불법 형질변경 토지는 원상복구 전까지 건축허가 및 지목변경이 영구 제한될 수 있습니다.",
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "토지형질변경 / 농지",
    question: "농지(전·답)에 흙을 1m 높여 돋우려고(성토) 합니다. 영농 목적이면 무조건 허가를 안 받아도 되나요?",
    answer: "아닙니다. 과거에는 영농 목적 성토가 폭넓게 인정되었으나, 국토교통부 '개발행위허가운영지침' 개정 및 지자체 조례에 따라 통상 2m 이상의 절토·성토는 영농 목적이라도 반드시 개발행위허가를 받아야 합니다. 또한 50cm~2m 미만이라도 옹벽 설치가 수반되거나 비탈면 발생으로 인접 농지 배수 장애 또는 토사 유출 우려가 있는 경우 지자체 조례에 의해 개발행위허가 대상이 될 수 있습니다. 순수한 양질의 흙(재활용 골재나 오염 토사 불가)을 사용해야 하며 지목변경이 없어야 합니다.",
    statuteReference: "국토계획법 시행령 제53조 제3호 라목, 국토부 개발행위허가운영지침 1-5-3",
    practicalTip: "성토 전 관할 시·군 농지부서 및 도시계획과에 해당 지자체 조례의 '영농 목적 성토 허가 기준 높이'를 유선 확인하고, 인접 토지 소유자 동의 및 배수로 확보 계획을 미리 세우세요.",
  },
  {
    id: "faq-2",
    category: "건축물 / 가설건축물",
    question: "농막(가설건축물 20㎡ 이하)을 설치할 때도 국토계획법상 개발행위허가를 받아야 하나요?",
    answer: "농막 자체는 건축법상 가설건축물 축조신고 대상이지만, 농막을 안착하기 위해 콘크리트 바닥 타설, 자갈 포장, 진입로 개설, 절토/성토 등 '토지의 형질변경'이 수반되는 경우에는 별도의 국토계획법상 개발행위허가(토지형질변경)를 받아야 합니다. 토지의 형상 변경 없이 이동식 구조로 농지 위에 얹어놓기만 하는 경우 형질변경은 없으나, 농지법상 농막 기준(20㎡ 이하, 연면적 산정, 주거 목적 불가)을 충족해야 합니다.",
    statuteReference: "국토계획법 제56조 제1항 제1호·제2호, 건축법 제20조, 농지법 시행규칙 제3조의2",
    practicalTip: "잡석 깔기나 진입로 포장 등을 함께 진행할 계획이라면 건축부서(가설건축물)와 개발행위부서에 동시 복합민원으로 상담받아야 불법 형질변경 원상복구 명령을 피할 수 있습니다.",
  },
  {
    id: "faq-3",
    category: "토지분할 / 기획부동산",
    question: "건물이 없는 밭이나 임야를 3필지로 나누어 매매하고 싶은데 허가가 필요한가요?",
    answer: "네, 허가 대상일 확률이 매우 높습니다. 건축물이 없는 토지의 분할은 국토계획법 제56조 제1항 제4호의 허가 대상입니다. 특히 녹지지역, 관리지역, 농림지역, 자연환경보전지역에서는 지자체 조례가 정하는 분할제한면적 미만으로의 분할이나, 관계 법령에 따른 인허가 없이 너비 5미터 이하로 쪼개는 행위는 원칙적으로 엄격히 금지되며 허가를 받아야 합니다. 기획부동산의 무분별한 쪼개기 방지를 위해 도로 개설 계획이나 구체적 개발 목적이 입증되지 않으면 분할허가가 불허될 수 있습니다.",
    statuteReference: "국토계획법 제56조 제1항 제4호, 동법 시행령 제51조 제1항 제4호",
    practicalTip: "분할 목적(진입도로 확보, 매매 사유, 건축 계획)과 현황 도로 너비가 법적 요건을 만족하는지 측량설계사무소와 사전 검토가 필수적입니다.",
  },
  {
    id: "faq-4",
    category: "물건 적치",
    question: "공장에 원자재나 고철 파레트를 마당에 3달 동안 쌓아두려는데 적치 허가를 받아야 하나요?",
    answer: "공장 용지가 속한 용도지역과 위치에 따라 다릅니다. ① 공장 부지가 일반공업지역이나 준공업지역 등 공업지역에 위치한다면 국토계획법상 물건 적치 허가 대상이 아닙니다(녹지·관리·자연환경보전지역만 대상). ② 만약 계획관리지역이나 자연녹지지역에 위치한 공장이라 하더라도 '건축물의 울타리 안(적법한 공장 대지 경계 안)'에 쌓아놓는 것이라면 허가 대상에서 제외됩니다. 울타리 밖 빈 공터에 1개월 이상 야적할 때 비로소 허가 대상이 됩니다.",
    statuteReference: "국토계획법 제56조 제1항 제5호, 시행령 제51조 제1항 제5호",
    practicalTip: "적치 장소가 울타리(담장) 구획선 내부인지 확인하고, 환경오염물질이나 침출수 발생 우려 품목인 경우 폐기물관리법 등 타 법령 저촉 여부도 체크해야 합니다.",
  },
  {
    id: "faq-5",
    category: "도로 / 맹지",
    question: "진입도로가 없는 맹지인데 개발행위허가를 받을 수 있나요?",
    answer: "원칙적으로 불가능합니다. 국토계획법 제58조 및 동법 시행령 별표 1의2(개발행위허가기준)에 따르면, 개발행위 부지는 해당 건축물·공작물의 이용에 지장이 없는 적정 너비의 진입도로가 확보되어야 합니다. 국토교통부 지침상 개발규모 5,000㎡ 미만은 너비 4m 이상(농업용 주택 등 일부 3m), 5,000㎡~30,000㎡ 미만은 너비 6m 이상의 도로에 접해야 합니다. 맹지라면 사도개설허가나 도로점용허가, 인접 토지 소유자의 토지사용승낙서를 통해 진입도로를 법적으로 확보해야만 개발행위허가가 가능합니다.",
    statuteReference: "국토계획법 제58조, 시행령 별표 1의2, 개발행위허가운영지침 3-3-2",
    practicalTip: "지적도상 도로가 있어도 현황 폭이 미달하거나, 현황 도로가 있어도 사유지 통행권이 없으면 불허되므로 진입로 현황 조사가 최우선입니다.",
  },
  {
    id: "faq-6",
    category: "규모 초과 / 심의",
    question: "토지 면적이 15,000㎡인 자연녹지지역 부지를 개발하려 합니다. 허가가 가능한가요?",
    answer: "자연녹지지역의 개발행위허가 상한 규모는 1만㎡ 미만(시행령 제55조제1항제1호)이므로, 단일 개발행위로는 1만㎡를 초과하여 원칙적으로 일반 개발행위허가를 받을 수 없습니다. 1만㎡ 이상을 개발하려면 지구단위계획을 수립하여 구역 지정을 받거나, 국토계획법 시행령 제55조 제3항 각 호에 따라 도시계획위원회의 심의를 거쳐 완화 적용을 받아야 합니다.",
    statuteReference: "국토계획법 시행령 제55조 제1항 및 제3항",
    practicalTip: "부지를 1만㎡ 미만으로 나누어 순차적으로 허가를 신청하더라도, 개발 주체와 목적이 동일한 경우 하나의 개발행위로 연계 심사될 수 있으므로 사전에 시·군 도시계획위원회 심의 가능성을 검토해야 합니다.",
  },
];

export const PRESET_CASES = [
  {
    title: "영농 목적 밭 1.5m 성토 및 배수로 정비",
    category: "LAND_ALTERATION" as ActivityCategory,
    zoning: "NATURAL_GREEN" as ZoningCategory,
    landArea: 1500,
    promptText: "지목이 '답'인 자연녹지지역 토지 1,500㎡에 벼농사 대신 밭작물을 심기 위해 외부 양질토사로 평균 1.5미터 흙을 돋우고(성토) 가장자리에 석축 옹벽(높이 1.2m)을 쌓으려 합니다. 지목은 그대로 농지(전)로 유지할 계획입니다.",
    details: {
      alterationType: "FILL" as const,
      heightOrDepthCm: 150,
      isChangeOfLandCategory: false,
      isAgriculturalPurpose: true,
      hasRetainingWall: true,
      retainingWallHeightM: 1.2,
    },
  },
  {
    title: "계획관리지역 주말농장 농막 컨테이너 설치",
    category: "BUILDING_STRUCTURE" as ActivityCategory,
    zoning: "PLANNED_MANAGEMENT" as ZoningCategory,
    landArea: 660,
    promptText: "계획관리지역 밭 660㎡에 주말 영농을 위해 바닥면적 18㎡짜리 컨테이너식 농막을 설치하고 바닥에 잡석을 20cm 정도 평탄하게 깔려고 합니다.",
    details: {
      structureType: "BUILDING" as const,
      buildingApprovalType: "TEMPORARY_BUILDING" as const,
      alterationType: "LEVEL" as const,
      heightOrDepthCm: 20,
      isAgriculturalPurpose: true,
      isChangeOfLandCategory: false,
    },
  },
  {
    title: "생산녹지지역 임야 3필지 매매용 분할",
    category: "LAND_SUBDIVISION" as ActivityCategory,
    zoning: "PRODUCTION_GREEN" as ZoningCategory,
    landArea: 3500,
    promptText: "생산녹지지역 내 건축물이 없는 토지 3,500㎡를 가족 상속 및 매매를 목적으로 각각 1,000㎡, 1,200㎡, 1,300㎡ 3필지로 분할하고자 합니다. 진입로는 폭 6미터 현황 도로에 접해 있습니다.",
    details: {
      hasBuildingOnPlot: false,
      subdivisionWidthM: 6,
      subdivisionAreaM2: 1000,
      isPublicLandSubdivision: false,
      isAlreadyOver5mWidth: true,
    },
  },
  {
    title: "보전관리지역 야외 부지에 중고 기계 3개월 적치",
    category: "STOCKPILING_GOODS" as ActivityCategory,
    zoning: "PRESERVATION_MANAGEMENT" as ZoningCategory,
    landArea: 1200,
    promptText: "보전관리지역 공터(지목: 잡종지, 울타리 없음) 약 400㎡ 부지에 건설 중장비 및 철재 파이프 약 80톤을 임시로 3개월간 보관해두려고 합니다.",
    details: {
      isInsideFenceOrLot: false,
      stockpileDurationMonths: 3,
      stockpileWeightTon: 80,
      stockpileVolumeM3: 60,
      stockpileAreaM2: 400,
    },
  },
];

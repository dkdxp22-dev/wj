import {
  DiagnosticInput,
  DiagnosticResult,
  PermissionVerdict,
} from "../types";
import { ZONING_DATA, ACTIVITY_CATEGORIES } from "../data/legalCriteria";

export function evaluateDevelopmentPermission(input: DiagnosticInput): DiagnosticResult {
  const { category, zoning, landCategory, landAreaM2, details } = input;
  const zoningInfo = ZONING_DATA[zoning];
  const activityInfo = ACTIVITY_CATEGORIES[category];
  const maxScale = zoningInfo.maxScaleM2;
  const isScaleExceeded = landAreaM2 > maxScale;

  // 지목 특성에 따른 사전 안내
  const landCategoryNotice = landCategory
    ? `[선택 지목: ${landCategory}] ${
        ["전", "답", "과수원"].includes(landCategory)
          ? "농지로서 영농 외 목적 개발 시 농지전용허가/신고가 병행됩니다."
          : landCategory === "임야"
          ? "임야(산지)로서 산지관리법상 산지전용허가 및 경사도·표고 기준이 엄격히 적용됩니다."
          : landCategory === "대"
          ? "이미 조성된 대지로서 신규 형질변경보다는 건축인허가 의제협의 기준이 우선합니다."
          : "해당 지목 특성에 따른 관련 개별 법령 인허가 연계를 확인하세요."
      }`
    : "";

  // 1. 재해복구 또는 재난수습 응급조치 여부 (법 제56조제4항제1호)
  if (details.isEmergencyDisaster) {
    return {
      verdict: "EMERGENCY_REPORT",
      verdictTitle: "재난수습 응급조치 (허가 불요, 1개월 내 사후신고 필수)",
      verdictDescription:
        "재해복구 또는 재난수습을 위한 응급조치는 사전 개발행위허가를 받지 않고 즉시 착수할 수 있습니다. 다만, 착수한 날부터 1개월 이내에 관할 시장·군수·구청장에게 반드시 사후 신고하여야 합니다.",
      statutoryBasis: {
        law: "국토의 계획 및 이용에 관한 법률",
        articles: ["제56조 제4항 제1호"],
        summary: "재해복구 또는 재난수습을 위한 응급조치는 허가를 받지 아니하고 할 수 있다(1개월 내 신고 의무).",
      },
      keyFindings: [
        "재해 발생 또는 급박한 재난 위험에 대응하기 위한 응급조치로 인정됩니다.",
        "사전 허가 절차 없이 긴급 복구공사 즉시 시행 가능합니다.",
        "공사 착수 후 30일 이내에 행위 내용 및 사진을 첨부하여 지자체에 사후신고서를 제출해야 합니다.",
      ],
      maxPermissibleScale: maxScale,
      isScaleExceeded: false,
      requiredDocuments: [
        "재해복구 등 응급조치 신고서 (국토계획법 시행규칙 별지)",
        "현장 재해 피해 전·후 사진",
        "토지 위치도 및 응급조치 내역서",
      ],
      localOrdinanceWarnings: [
        "응급조치 범위를 넘어선 영구 시설물 축조나 대규모 추가 형질변경은 별도의 일반 개발행위허가를 받아야 합니다.",
      ],
      recommendedSteps: [
        "현장 긴급 복구공사 진행 중 현장 사진(착공 전/중/후) 상세 촬영",
        "착수일 기준 1개월 이내 시·군·구청 도시계획과(또는 재난안전과)에 사후신고서 접수",
      ],
    };
  }

  // 2. 규모 상한 초과 검토 (시행령 제55조)
  if (isScaleExceeded) {
    return {
      verdict: "SCALE_EXCEEDED",
      verdictTitle: "개발행위허가 규모 초과 (도시계획위원회 심의 또는 지구단위계획 수립 필요)",
      verdictDescription: `신청 부지 면적(${landAreaM2.toLocaleString()}㎡)이 해당 용도지역(${zoningInfo.name})의 법정 개발행위허가 규모 상한(${maxScale.toLocaleString()}㎡ 미만)을 초과하였습니다. 일반적인 단독 개발행위허가로는 진행할 수 없으며, 시·군·구 도시계획위원회 심의 또는 지구단위계획구역 지정을 통한 개발계획 수립이 선행되어야 합니다.`,
      statutoryBasis: {
        law: "국토의 계획 및 이용에 관한 법률 시행령",
        articles: ["제55조 제1항 및 제3항", "법 제59조"],
        summary: `${zoningInfo.name}의 개발행위허가 규모 상한은 ${maxScale.toLocaleString()}㎡ 미만입니다. 초과 시 도시계획위원회 심의 또는 지구단위계획 수립이 필요합니다.`,
      },
      keyFindings: [
        `용도지역 법정 상한(${maxScale.toLocaleString()}㎡) 대비 ${(landAreaM2 - maxScale).toLocaleString()}㎡ 초과`,
        "단순 개발행위허가 신청 시 규모 초과로 반려 처분 대상",
        "도시계획위원회 심의(영 제55조제3항 각 호 요건) 또는 지구단위계획 수립 절차 필요",
        "진입도로 너비(통상 6m~8m 이상) 및 기반시설 용량 확보 기준 대폭 강화",
      ],
      maxPermissibleScale: maxScale,
      isScaleExceeded: true,
      requiredDocuments: [
        "개발행위허가 신청서 (도시계획위원회 심의용)",
        "교통성검토서 및 환경성검토서",
        "기반시설(도로, 상·하수도, 우수처리) 확보계획서",
        "주변 경관 및 방재계획서",
        "도시계획위원회 심의 신청서 및 심의도서",
      ],
      localOrdinanceWarnings: [
        "지자체별로 연접하여 개발하거나 단계적 분할 개발 시에도 합산 면적으로 심의 대상을 산정하므로 쪼개기식 편법 허가는 엄격히 제한됩니다.",
      ],
      recommendedSteps: [
        "도시계획 전문 엔지니어링사 및 관할 지자체 도시계획과 사전 심의 상담",
        "지구단위계획 수립 또는 도시계획위원회 심의 안건 상정 일정 협의",
      ],
    };
  }

  // 3. 행위 유형별 세부 판정
  switch (category) {
    case "BUILDING_STRUCTURE": {
      // 건축물 vs 공작물 vs 비닐하우스
      if (details.structureType === "VINYL_HOUSE" || details.isAgriculturalGreenhouse) {
        if (details.hasSteelFramedAquaculture) {
          return createResult(
            "PERMIT_REQUIRED",
            "개발행위허가 대상 (철골조/양식시설 비닐하우스)",
            "농업용 온실이라도 철골조를 사용하거나 수산물 육상양식시설을 설치하는 경우에는 경미한 행위에서 제외되어 개발행위허가 대상이 됩니다.",
            ["법 제56조 제1항 제1호", "영 제53조 제2호 다목 단서"],
            [
              "일반 단순 비닐하우스가 아닌 철골 구조물 또는 양식시설 포함",
              "토지 기초공사 및 구조적 안전성, 환경오염 방지 심사 필요",
            ],
            maxScale,
            [
              "개발행위허가 신청서",
              "구조설계도서 및 배치도",
              "토지 소유권 또는 사용승낙 증명서",
              "오염방지 및 배수계획서",
            ]
          );
        }
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (농림어업용 온실/비닐하우스 경미한 행위)",
          "녹지지역·관리지역 또는 농림지역 안에서 농업·임업 또는 어업용 비닐하우스의 설치는 국토계획법상 허가를 받지 아니하여도 되는 경미한 행위입니다.",
          ["법 제56조 제4항 제3호", "영 제53조 제2호 다목"],
          [
            "순수 농림어업용 비닐하우스로 경미한 시설물에 해당",
            "개발행위허가 면제",
            "단, 토지 형질변경(절성토 50cm 초과, 바닥 콘크리트 타설 등)이 수반되는 경우 형질변경허가는 별도 검토 필요",
          ],
          maxScale,
          ["지자체 농지부서 또는 읍·면·동 농업경영체 등록 확인 (필요시)"]
        );
      }

      if (details.structureType === "BUILDING") {
        if (details.buildingApprovalType === "BUILDING_PERMIT" || details.buildingApprovalType === "BUILDING_REPORT") {
          return createResult(
            "DEEMED_CONSULTATION",
            "건축 인허가 시 개발행위허가 의제협의 대상",
            "건축법에 따른 건축허가 또는 건축신고를 신청할 때 국토계획법 제56조 개발행위허가 신청 서류를 함께 제출하면, 건축부서가 도시계획부서와 일괄 협의하여 의제 처리합니다.",
            ["건축법 제11조 제5항 제3호", "국토계획법 제56조 제1항"],
            [
              "별도의 개별 개발행위허가 신청서 접수 불필요 (건축인허가 신청서로 원스톱 처리)",
              "단, 건축허가 서류 내에 국토계획법상 개발행위 심사기준(진입도로, 배수, 경사도) 도서 필수 첨부",
            ],
            maxScale,
            [
              "건축허가(신고) 신청서",
              "토지의 소유권 또는 사용권 증명서류",
              "배치도, 평면도, 입면도 등 설계도서",
              "토지형질변경 및 위해방지·환경오염방지 계획서 (토목설계도서)",
            ]
          );
        }

        if (details.buildingApprovalType === "TEMPORARY_BUILDING") {
          const needsLandAlteration =
            (details.heightOrDepthCm ?? 0) > 50 ||
            details.hasRetainingWall ||
            details.alterationType === "PAVE";
          if (needsLandAlteration) {
            return createResult(
              "PERMIT_REQUIRED",
              "개발행위허가 대상 (가설건축물 안착을 위한 토지형질변경 수반)",
              "가설건축물(농막, 컨테이너 등) 자체는 건축법상 축조신고 대상이지만, 이를 설치하기 위한 부지조성(50cm 초과 절·성토, 포장, 옹벽 설치 등)이 수반되므로 국토계획법상 토지형질변경 허가를 반드시 사전에 받아야 합니다.",
              ["법 제56조 제1항 제2호", "건축법 제20조"],
              [
                "가설건축물 축조신고 외에 토지형질변경 허가 병행 필요",
                "농막의 경우 농지법상 20㎡ 이하 기준 및 정주형 주택 개조 금지",
              ],
              maxScale,
              [
                "가설건축물 축조신고서",
                "토지형질변경 개발행위허가 신청서",
                "배치도 및 토공설계도",
                "피해방지계획서",
              ]
            );
          }
          return createResult(
            "PERMIT_EXEMPT_MINOR",
            "개발행위허가 불요 (형질변경 없는 단순 가설건축물 축조신고 대상)",
            "대지의 절토·성토 등 토지 형상의 변경 없이 단순 거치하는 이동식 가설건축물은 국토계획법상 개발행위허가 대상이 아니며, 건축법에 따른 가설건축물 축조신고만 이행하시면 됩니다.",
            ["건축법 제20조", "영 제53조 제1호"],
            [
              "토지 형질변경이 없어 국토계획법상 허가 면제",
              "시·군·구청 건축과에 가설건축물 축조신고서 제출 필요",
            ],
            maxScale,
            ["가설건축물 축조신고서", "평면도 및 배치도", "대지 사용승낙서(타인 토지인 경우)"]
          );
        }
      }

      // 공작물의 설치 (무게, 부피, 면적 검토)
      const weight = details.structureWeight ?? 0;
      const volume = details.structureVolume ?? 0;
      const area = details.structureArea ?? 0;

      const isCity = zoningInfo.isCityOrDistrictPlanArea;
      const limitWeight = isCity ? 50 : 150;
      const limitVolume = isCity ? 50 : 150;
      const limitArea = isCity ? 25 : 75;

      const isMinor = weight <= limitWeight && volume <= limitVolume && area <= limitArea;

      if (isMinor && weight > 0 && volume > 0 && area > 0) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          `허가 불요 (경미한 공작물 설치: ${isCity ? "도시지역 50톤·50㎥·25㎡ 이하" : "비도시 150톤·150㎥·75㎡ 이하"})`,
          `설치하려는 공작물의 규격(무게 ${weight}톤, 부피 ${volume}㎥, 면적 ${area}㎡)이 시행령 제53조제2호의 경미한 공작물 기준(${isCity ? "도시지역: 50톤, 50㎥, 25㎡ 이하" : "비도시: 150톤, 150㎥, 75㎡ 이하"}) 이내이므로 개발행위허가를 받지 않고 설치할 수 있습니다.`,
          ["법 제56조 제4항 제3호", "영 제53조 제2호"],
          [
            `공작물 규격이 법정 경미한 기준 이내로 면제 충족`,
            `도시·군계획조례에서 별도 제한이 있는지 최종 확인 권장`,
          ],
          maxScale,
          ["자체 시공 계획서 (인허가 제출 불요)"]
        );
      }

      return createResult(
        "PERMIT_REQUIRED",
        "개발행위허가 대상 (공작물의 설치 기준 초과)",
        `설치하려는 공작물이 경미한 기준(${isCity ? "50톤, 50㎥, 25㎡" : "150톤, 150㎥, 75㎡"})을 초과하거나 건축법령상 공작물 축조신고/개발행위허가 대상에 해당합니다.`,
        ["법 제56조 제1항 제1호", "영 제51조 제1항 제1호"],
        [
          "공작물의 안전성, 주변 경관 저해 여부, 구조적 안정성 심사 대상",
          "태양광 발전시설, 철탑, 옹벽 등의 경우 지자체 이격거리 조례 필수 확인",
        ],
        maxScale,
        [
          "개발행위허가 신청서",
          "공작물 구조도면 및 시방서",
          "토지소유권 증빙",
          "위해방지·경관조경계획서",
        ]
      );
    }

    case "LAND_ALTERATION": {
      const height = details.heightOrDepthCm ?? 0;
      const isLandCategoryChange = !!details.isChangeOfLandCategory;
      const isAgri = !!details.isAgriculturalPurpose;
      const hasWall = !!details.hasRetainingWall;
      const wallHeight = details.retainingWallHeightM ?? 0;
      const isPaved = details.alterationType === "PAVE";

      // 1) 영농 목적 토지형질변경
      if (isAgri) {
        if (height >= 200) {
          return createResult(
            "PERMIT_REQUIRED",
            "개발행위허가 대상 (영농 목적 성토라도 2m 이상 시 필수 허가)",
            "농작물의 경작 등 영농을 위한 성토라도 국토교통부 개발행위허가운영지침 및 지자체 조례에 따라 높이 2미터 이상의 절토·성토는 안전성 확보 및 불법 토사 매립 방지를 위해 반드시 개발행위허가를 받아야 합니다.",
            ["법 제56조 제1항 제2호", "영 제53조 제3호 라목", "국토부 개발행위허가운영지침 1-5-3"],
            [
              `성토/절토 높이(${height}cm)가 2m(200cm) 기준 이상`,
              "인접 농지 배수 영향, 붕괴 위험, 양질 토사(건설폐기물 순환골재 사용 절대 금지) 심사 필수",
              "비탈면 안정성 검토 및 옹벽·석축 설계도서 구비 필요",
            ],
            maxScale,
            [
              "개발행위허가 신청서 (토지형질변경)",
              "토공 계획도 및 종·횡단면도",
              "토사 반입 계획서 및 토질 시험성적서 (양질토 증명)",
              "배수계획도 및 위해방지계획서",
            ]
          );
        }

        if (hasWall || wallHeight > 0) {
          return createResult(
            "PERMIT_REQUIRED",
            "개발행위허가 대상 (옹벽·석축 설치 수반 영농 성토)",
            "영농 목적의 토지 돋우기라 하더라도 옹벽이나 석축(구조물)을 쌓는 행위가 수반되는 경우에는 지자체 도시·군계획조례에 따라 경미한 행위에서 배제되어 개발행위허가 대상이 됩니다.",
            ["법 제56조 제1항 제2호", "영 제53조 제3호 라목", "지자체 도시계획조례"],
            [
              `옹벽 축조(높이 ${wallHeight || "설치"}m)로 구조 안전 및 경계 피해방지 심의 필요`,
              "인접지와의 이격거리 및 우수 배수로 연결 필수 확인",
            ],
            maxScale,
            [
              "개발행위허가 신청서",
              "옹벽 구조계산서 및 단면도",
              "인접 토지 배수처리 계획서",
            ]
          );
        }

        if (height <= 50 && !isLandCategoryChange && !isPaved) {
          return createResult(
            "PERMIT_EXEMPT_MINOR",
            "허가 불요 (50cm 이내의 경미한 영농 성토·정지)",
            "지목변경을 수반하지 않고 높이 50cm 이내로 흙을 돋우거나 고르는 통상적인 영농 행위는 국토계획법상 허가를 받지 아니하여도 되는 경미한 행위에 해당합니다.",
            ["법 제56조 제4항 제3호", "영 제53조 제3호 가목 및 라목"],
            [
              "높이 50cm 이내로 경미한 변경 충족",
              "지목변경 없음 (농지 유지)",
              "오염되지 않은 양질의 흙을 사용하여야 함",
            ],
            maxScale,
            ["인허가 제출 서류 없음 (영농 계속 진행)"]
          );
        }

        // 50cm 초과 2m 미만 영농 성토
        return createResult(
          "ORDINANCE_RESTRICTED",
          "지자체 조례 확인 필요 (50cm 초과 2m 미만 영농 성토)",
          `신청 성토 높이(${height}cm)는 법령상 50cm를 초과하므로 지자체 도시·군계획조례의 영농 성토 허가 기준(지자체에 따라 50cm, 70cm, 1m, 2m 등 상이)에 따라 허가 대상 여부가 최종 결정됩니다.`,
          ["영 제53조 제3호 라목", "해당 시·군 도시·군계획조례"],
          [
            `법령 기본 경미 기준(50cm)을 초과함`,
            `국토부 지침 개정으로 지자체별로 50cm~100cm 이상 시 조례상 허가 대상으로 규정하는 곳이 많음`,
            "재활용 골재, 무기성 오니, 오염 토사 반입 시 형사 처벌 대상",
          ],
          maxScale,
          [
            "해당 시·군청 도시계획과/농지과 유선 확인 후 서류 준비",
            "개발행위허가 신청서(허가 대상인 경우)",
          ],
          [
            "공사 전 반드시 관할 시·군청 도시계획팀에 '영농 성토 조례 기준'을 유선 문의하세요.",
          ]
        );
      }

      // 2) 조경 목적 (건축물 건축 제외)
      if (details.isLandscaping) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (순수 조경을 위한 토지의 형질변경)",
          "건축물의 건축을 위한 부지 조성이 아닌, 순수 조경 식재 및 정원 가꾸기를 위한 토지의 형질변경은 경미한 행위로 허가가 면제됩니다.",
          ["영 제53조 제3호 다목"],
          ["순수 조경 목적으로 경미한 행위 인정", "향후 건축물 건축 시에는 별도 형질변경허가 필요"],
          maxScale,
          ["별도 제출 서류 없음"]
        );
      }

      // 3) 비도시지역 660㎡ 이하 경미한 형질변경 (영 제53조제3호나목)
      const isNonCityExemptArea =
        !zoningInfo.isCityOrDistrictPlanArea && zoning !== "NATURE_ENVIRONMENT";
      if (isNonCityExemptArea && landAreaM2 <= 660 && !isLandCategoryChange && !hasWall) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (비도시지역 660㎡ 이하 지목변경 없는 형질변경)",
          "도시지역·자연환경보전지역 및 지구단위계획구역 외의 지역(관리지역, 농림지역)에서 면적이 660㎡ 이하인 토지에 대하여 지목변경을 수반하지 아니하는 절토·성토·정지·포장은 허가 없이 가능합니다.",
          ["법 제56조 제4항 제3호", "영 제53조 제3호 나목"],
          [
            `비도시지역(${zoningInfo.name}) 소재`,
            `면적 ${landAreaM2}㎡ (660㎡ 이하 요건 충족)`,
            "지목변경 없음, 옹벽 미설치",
          ],
          maxScale,
          ["별도 제출 서류 없음"]
        );
      }

      // 4) 50cm 이내 경미한 형질변경 (영 제53조제3호가목)
      if (height <= 50 && !isLandCategoryChange && !isPaved && !hasWall) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (높이/깊이 50cm 이내 경미한 절토·성토·정지)",
          "높이 50센티미터 이내 또는 깊이 50센티미터 이내의 절토·성토·정지 등은 지목변경을 수반하지 않고 포장이 아니면 허가를 받지 않아도 됩니다.",
          ["법 제56조 제4항 제3호", "영 제53조 제3호 가목"],
          ["높이/깊이 50cm 이내", "포장 없음", "지목변경 없음"],
          maxScale,
          ["별도 제출 서류 없음"]
        );
      }

      // 일반 형질변경 허가 대상
      const reasons: string[] = [];
      if (height > 50) reasons.push(`절토/성토 높이(${height}cm)가 50cm 기준 초과`);
      if (isPaved) reasons.push("아스팔트/콘크리트 등 포장 행위 수반");
      if (isLandCategoryChange) reasons.push("지목변경 수반 (예: 임야/전/답 -> 대지, 잡종지)");
      if (hasWall) reasons.push("옹벽 또는 석축 구조물 설치 수반");

      return createResult(
        "PERMIT_REQUIRED",
        "개발행위허가 대상 (토지의 형질변경)",
        "토지의 형상을 변경하는 행위(절토, 성토, 정지, 포장)로서 법정 경미한 행위 기준을 초과하므로 반드시 사전 개발행위허가를 받아야 합니다.",
        ["법 제56조 제1항 제2호", "영 제51조 제1항 제2호"],
        reasons,
        maxScale,
        [
          "개발행위허가 신청서 (토지형질변경)",
          "토지의 소유권 또는 사용권 증명서류",
          "토공계획 평면도 및 종·횡단면도",
          "구조물(옹벽, 석축) 설계도서 (해당 시)",
          "우수 배수계획서 및 토사유출 방지계획서",
          "지목변경 계획서 (지목변경 수반 시)",
        ]
      );
    }

    case "ROCK_EXCAVATION": {
      if (details.isForLandAlteration) {
        return createResult(
          "PERMIT_REQUIRED",
          "개발행위허가 대상 (토지형질변경 허가에 흡수)",
          "토지의 형질변경을 목적으로 토석을 채취하는 경우에는 별도의 토석채취허가가 아닌 '토지의 형질변경' 허가로 일괄 신청 및 심사합니다.",
          ["영 제51조 제1항 제3호 단서"],
          ["부지조성을 위한 절토·토석 채취이므로 형질변경허가로 진행"],
          maxScale,
          ["개발행위허가 신청서 (토지형질변경)", "토공계획서 및 단면도"]
        );
      }

      const area = details.rockExcavationArea ?? 0;
      const volume = details.rockExcavationVolume ?? 0;
      const isCity = zoningInfo.isCityOrDistrictPlanArea;
      const limitArea = isCity ? 25 : 250;
      const limitVolume = isCity ? 50 : 500;

      if (area <= limitArea && volume <= limitVolume && area > 0 && volume > 0) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          `허가 불요 (경미한 토석채취: ${isCity ? "25㎡/50㎥ 이하" : "250㎡/500㎥ 이하"})`,
          `채취면적(${area}㎡)과 부피(${volume}㎥)가 법정 경미한 기준(${isCity ? "도시: 25㎡/50㎥" : "비도시: 250㎡/500㎥"}) 이내이므로 허가 없이 채취할 수 있습니다.`,
          ["영 제53조 제4호"],
          ["경미한 면적 및 부피 기준 충족"],
          maxScale,
          ["자체 작업 (인허가 불요)"]
        );
      }

      return createResult(
        "PERMIT_REQUIRED",
        "개발행위허가 대상 (토석채취)",
        "흙·모래·자갈·바위 등 토석의 채취 규모가 경미한 기준을 초과하므로 관할 지자체의 개발행위(토석채취) 허가를 받아야 합니다.",
        ["법 제56조 제1항 제3호", "영 제51조 제1항 제3호"],
        [
          "토석 채취에 따른 발파 진동, 소음, 비산먼지 저감 계획 심사",
          "채취 완료 후 원상복구 및 경관 차폐 계획 필수",
        ],
        maxScale,
        [
          "개발행위허가 신청서 (토석채취)",
          "채취구역 실측도 및 종·횡단면도",
          "채취량 산출서",
          "환경오염 및 위해방지계획서",
          "원상회복 복구계획서 및 복구비 예치금 산출서",
        ]
      );
    }

    case "LAND_SUBDIVISION": {
      if (details.hasBuildingOnPlot) {
        return createResult(
          "DEEMED_CONSULTATION",
          "국토계획법 허가 제외 (건축물이 있는 대지는 건축법 제57조 적용)",
          "국토계획법상 개발행위허가에 따른 토지분할은 '건축물이 없는 토지'를 대상으로 합니다. 이미 건축물이 있는 대지의 분할은 건축법 제57조(대지의 분할제한)에 따라 건축과에서 심사합니다.",
          ["법 제56조 제1항 제4호 괄호", "건축법 제57조"],
          [
            "건축물이 존재하는 대지이므로 국토계획법 개발행위허가 대상에서 제외",
            "건축법상 용적률·건폐율 및 분할제한면적(주거 60㎡, 상업·공업 150㎡, 녹지 200㎡ 등) 충족 여부 확인",
          ],
          maxScale,
          ["건축물대장 현황도", "대지분할 허가/신고서 (건축법)", "지적측량성과도"]
        );
      }

      if (details.isPrivateRoadPermitted || details.isPublicLandSubdivision || details.isDisposedAdminProperty) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (공공용지 편입 또는 사도개설허가 토지 분할 등 경미한 행위)",
          "사도법에 따른 사도개설허가를 받은 토지의 분할이나, 공공용지·공용지 편입, 행정재산 용도폐지 분할 등은 경미한 행위로서 개발행위허가를 받지 않고 분할할 수 있습니다.",
          ["영 제53조 제5호 가목·나목·다목"],
          ["법정 공익/공적 인허가 연계 분할로 허가 면제"],
          maxScale,
          ["사도개설허가증 또는 공공용지 편입 증빙", "분할측량성과도"]
        );
      }

      const width = details.subdivisionWidthM ?? 0;
      if (width > 0 && width <= 5 && !details.isAlreadyOver5mWidth) {
        return createResult(
          "PERMIT_REQUIRED",
          "개발행위허가 대상 (너비 5m 이하의 토지분할)",
          "관계 법령에 따른 인가·허가 등을 받지 아니하고 토지를 너비 5미터 이하로 쪼개는 분할은 기획부동산식 바둑판 쪼개기를 방지하기 위해 엄격한 개발행위허가 대상입니다.",
          ["법 제56조 제1항 제4호", "영 제51조 제1항 제4호 다목"],
          [
            `분할 후 너비(${width}m)가 5m 이하로 엄격 심사 대상`,
            "도로 미확보 시 허가 반려 가능성 높음",
            "투기 목적 쪼개기 여부 집중 심사",
          ],
          maxScale,
          [
            "개발행위허가 신청서 (토지분할)",
            "분할계획도 (가분할도)",
            "분할 사유서 및 토지이용계획서",
            "지적도 및 토지등기부등본",
          ]
        );
      }

      return createResult(
        "PERMIT_REQUIRED",
        "개발행위허가 대상 (건축물 없는 토지의 분할)",
        `해당 지역(${zoningInfo.name}) 내 건축물이 없는 토지의 분할은 국토계획법 및 지자체 조례가 정하는 분할기준(최소면적, 도로확보, 분할필지수 등)을 충족하여 허가를 받아야 합니다.`,
        ["법 제56조 제1항 제4호", "영 제51조 제1항 제4호"],
        [
          "조례상 분할제한면적 이상 여부 및 분할 횟수 제한 검토",
          "기획부동산 쪼개기 방지 조례 기준 확인 필수",
        ],
        maxScale,
        [
          "개발행위허가 신청서 (토지분할)",
          "분할계획도면",
          "토지이용계획확인서",
          "분할 목적 입증 서류",
        ]
      );
    }

    case "STOCKPILING_GOODS": {
      // 주거, 상업, 공업, 농림지역은 제외
      const allowedZoning = ["NATURAL_GREEN", "PRODUCTION_GREEN", "PRESERVATION_GREEN", "PLANNED_MANAGEMENT", "PRODUCTION_MANAGEMENT", "PRESERVATION_MANAGEMENT", "NATURE_ENVIRONMENT"];
      if (!allowedZoning.includes(zoning)) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          `국토계획법 허가 대상 제외 (${zoningInfo.name}은 적치허가 비대상 지역)`,
          `국토계획법 제56조 제1항 제5호에 따른 물건 적치 허가는 '녹지지역, 관리지역, 자연환경보전지역'에만 적용됩니다. ${zoningInfo.name}은 본 조항에 따른 적치허가 대상 지역이 아닙니다. (단, 폐기물관리법, 도로교통법 등 개별 법률 확인 필요)`,
          ["법 제56조 제1항 제5호"],
          [
            `신청 지역(${zoningInfo.name})은 국토계획법상 물건 적치 규제 지역이 아님`,
            "폐기물, 위험물, 재활용자원인 경우 환경/폐기물 관련 법령 별도 체크",
          ],
          maxScale,
          ["국토계획법 제출 서류 없음"]
        );
      }

      if (details.isInsideFenceOrLot) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (건축물의 울타리 안/대지 안 적치)",
          "건축물의 울타리 안(적법한 공장·창고 대지 내부 등)에 위치한 토지에 물건을 쌓아놓는 행위는 법령상 허가 대상에서 명시적으로 제외됩니다.",
          ["법 제56조 제1항 제5호 괄호"],
          ["건축물의 울타리(대지) 내부이므로 허가 면제", "담장 밖 공터로 침범하지 않도록 관리"],
          maxScale,
          ["별도 제출 서류 없음"]
        );
      }

      const months = details.stockpileDurationMonths ?? 0;
      if (months < 1) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          "허가 불요 (1개월 미만의 일시적 적치)",
          "물건을 1개월 미만 동안 임시로 쌓아놓는 행위는 국토계획법상 허가 대상이 아닙니다.",
          ["법 제56조 제1항 제5호"],
          ["적치 기간이 1개월 미만으로 규제 미적용", "1개월 이상으로 연장될 경우 사전 허가 필요"],
          maxScale,
          ["별도 제출 서류 없음"]
        );
      }

      const weight = details.stockpileWeightTon ?? 0;
      const volume = details.stockpileVolumeM3 ?? 0;
      const area = details.stockpileAreaM2 ?? 0;
      const isCity = zoningInfo.isCityOrDistrictPlanArea;
      const limitWeight = isCity ? 50 : 150;
      const limitVolume = isCity ? 50 : 150;
      const limitArea = isCity ? 25 : 75;

      const isMinor = weight <= limitWeight && volume <= limitVolume && area <= limitArea;
      if (isMinor && weight > 0 && volume > 0 && area > 0) {
        return createResult(
          "PERMIT_EXEMPT_MINOR",
          `허가 불요 (경미한 물건 적치: ${isCity ? "50톤·50㎥·25㎡ 이하" : "150톤·150㎥·75㎡ 이하"})`,
          `적치하려는 물건의 규모(무게 ${weight}톤, 부피 ${volume}㎥, 면적 ${area}㎡)가 법정 경미한 기준 이내이므로 허가 없이 적치할 수 있습니다.`,
          ["영 제53조 제6호"],
          ["경미한 규격 기준 충족"],
          maxScale,
          ["자체 보관 (인허가 불요)"]
        );
      }

      return createResult(
        "PERMIT_REQUIRED",
        "개발행위허가 대상 (물건을 쌓아놓는 행위)",
        `녹지·관리·자연환경보전지역 내 울타리 밖 토지에 물건을 1개월 이상 야적하며 경미한 기준을 초과하므로 관할 지자체의 개발행위(적치) 허가를 받아야 합니다.`,
        ["법 제56조 제1항 제5호", "영 제51조 제1항 제5호"],
        [
          "주변 경관 훼손, 비산먼지, 오염물질 유출 방지 대책 심사",
          "가림막(차폐 휀스) 설치 및 침출수 차단 시설 요구될 수 있음",
        ],
        maxScale,
        [
          "개발행위허가 신청서 (물건적치)",
          "물건을 쌓아놓을 토지의 소유권 또는 사용권 증명서류",
          "적치 계획 평면도 및 품목 명세서",
          "위해방지 및 환경오염방지 계획서 (비산먼지/침출수 차단)",
        ]
      );
    }
  }

  // 기본 반환
  return createResult(
    "PERMIT_REQUIRED",
    "개발행위허가 검토 필요",
    "국토계획법 제56조에 따른 일반적인 개발행위허가 검토 대상입니다.",
    ["법 제56조 제1항"],
    ["상세 요건에 따라 지자체 허가 필요"],
    maxScale,
    ["개발행위허가 신청서", "토지사용승낙서 또는 등기부등본"]
  );
}

function createResult(
  verdict: PermissionVerdict,
  title: string,
  desc: string,
  articles: string[],
  keyFindings: string[],
  maxScale: number,
  requiredDocuments: string[],
  warnings: string[] = []
): DiagnosticResult {
  return {
    verdict,
    verdictTitle: title,
    verdictDescription: desc,
    statutoryBasis: {
      law: "국토의 계획 및 이용에 관한 법률",
      articles,
      summary: `${articles.join(", ")}에 의거하여 판단되었습니다.`,
    },
    keyFindings,
    maxPermissibleScale: maxScale,
    isScaleExceeded: false,
    requiredDocuments,
    localOrdinanceWarnings: [
      "국토계획법 제56조제4항 단서에 따라 지자체 '도시·군계획조례'에서 경미한 행위의 범위를 축소하거나 별도 기준을 둘 수 있으므로 착공 전 관할 시·군·구청에 최종 확인을 권장합니다.",
      ...warnings,
    ],
    recommendedSteps: [
      "진단 결과를 바탕으로 관할 시·군·구청 도시계획과 또는 개발행위허가팀 사전 상담",
      "필요시 측량설계사무소를 통한 지적 및 현황 측량, 설계도서 작성",
      "허가 승인 후 공사 착공 및 완료 시 '준공검사' 수검 필수",
    ],
  };
}

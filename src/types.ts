/**
 * 국토의 계획 및 이용에 관한 법률(국토계획법) 개발행위허가 관련 공통 타입 정의
 */

export type ActivityCategory =
  | "BUILDING_STRUCTURE" // 건축물의 건축 또는 공작물의 설치
  | "LAND_ALTERATION"   // 토지의 형질변경 (절토, 성토, 정지, 포장, 공유수면매립)
  | "ROCK_EXCAVATION"   // 토석의 채취
  | "LAND_SUBDIVISION"  // 토지분할 (건축물이 없는 토지)
  | "STOCKPILING_GOODS"; // 물건을 쌓아놓는 행위 (적치)

export type ZoningCategory =
  // 도시지역
  | "RESIDENTIAL"          // 주거지역 (1만㎡ 미만)
  | "COMMERCIAL"           // 상업지역 (1만㎡ 미만)
  | "INDUSTRIAL"           // 공업지역 (3만㎡ 미만)
  | "NATURAL_GREEN"        // 자연녹지지역 (1만㎡ 미만)
  | "PRODUCTION_GREEN"     // 생산녹지지역 (1만㎡ 미만)
  | "PRESERVATION_GREEN"   // 보전녹지지역 (5천㎡ 미만)
  // 관리지역
  | "PLANNED_MANAGEMENT"   // 계획관리지역 (3만㎡ 미만)
  | "PRODUCTION_MANAGEMENT"// 생산관리지역 (3만㎡ 미만)
  | "PRESERVATION_MANAGEMENT" // 보전관리지역 (3만㎡ 미만)
  // 농림 및 자연환경보전지역
  | "AGRICULTURE_FORESTRY" // 농림지역 (3만㎡ 미만)
  | "NATURE_ENVIRONMENT";  // 자연환경보전지역 (5천㎡ 미만)

export type PermissionVerdict =
  | "PERMIT_REQUIRED"       // 허가 대상 (법 제56조제1항)
  | "PERMIT_EXEMPT_MINOR"   // 경미한 행위로 허가 면제 (시행령 제53조)
  | "SCALE_EXCEEDED"        // 허가규모 초과 (도시계획위원회 심의 또는 지구단위계획 필요)
  | "EMERGENCY_REPORT"      // 재난응급조치 (허가 불요, 1개월 이내 사후신고 필수)
  | "DEEMED_CONSULTATION"   // 타 법률(건축허가 등) 인허가 시 의제협의 처리
  | "ORDINANCE_RESTRICTED"; // 지자체 조례 등에 의한 별도 제한/기준 확인 필요

export interface ActivityDetailInputs {
  // 공통
  isEmergencyDisaster?: boolean; // 재해복구 또는 재난수습 응급조치 여부
  hasBuildingOnPlot?: boolean;   // 건축물이 이미 있는 대지인지 여부

  // 1. 건축물 또는 공작물
  structureType?: "BUILDING" | "STRUCTURE" | "VINYL_HOUSE";
  buildingApprovalType?: "BUILDING_PERMIT" | "BUILDING_REPORT" | "TEMPORARY_BUILDING" | "NONE";
  structureWeight?: number; // 공작물 무게 (톤)
  structureVolume?: number; // 공작물 부피 (㎥)
  structureArea?: number;   // 수평투영면적 (㎡)
  isAgriculturalGreenhouse?: boolean; // 농림어업용 비닐하우스 여부
  hasSteelFramedAquaculture?: boolean; // 철골조 또는 양식장 포함 여부

  // 2. 토지의 형질변경
  alterationType?: "CUT" | "FILL" | "LEVEL" | "PAVE" | "RECLAMATION"; // 절토, 성토, 정지, 포장, 매립
  heightOrDepthCm?: number; // 절토 높이/성토 높이/굴착 깊이 (cm)
  isChangeOfLandCategory?: boolean; // 지목변경 수반 여부 (예: 전/답 -> 대/잡종지)
  isAgriculturalPurpose?: boolean; // 영농 목적(농작물 경작, 다년생식물 재배) 여부
  hasRetainingWall?: boolean; // 옹벽 설치 또는 비탈면 붕괴/토사유출 위험 유무
  retainingWallHeightM?: number; // 옹벽 높이 (m)
  isLandscaping?: boolean; // 순수 조경 목적 여부 (건축물 건축을 위한 형질변경 제외)

  // 3. 토석채취
  rockExcavationArea?: number; // 채취 면적 (㎡)
  rockExcavationVolume?: number; // 채취 부피 (㎥)
  isForLandAlteration?: boolean; // 토지형질변경 목적인지 여부 (형질변경에 포함됨)

  // 4. 토지분할
  subdivisionWidthM?: number; // 분할 후 너비 (m)
  subdivisionAreaM2?: number; // 분할 후 각 필지 면적 (㎡)
  isPublicLandSubdivision?: boolean; // 공공용지/공용지 편입을 위한 분할인지
  isPrivateRoadPermitted?: boolean; // 사도개설허가를 받은 토지의 분할인지
  isDisposedAdminProperty?: boolean; // 행정재산 용도폐지 또는 일반재산 매각 등 분할인지
  isAlreadyOver5mWidth?: boolean; // 너비 5m 이상으로 이미 분할된 토지의 기준면적 이상 분할인지

  // 5. 물건 적치
  isInsideFenceOrLot?: boolean; // 건축물의 울타리 안(대지 안)에 적치하는지 여부
  stockpileDurationMonths?: number; // 적치 기간 (개월)
  stockpileWeightTon?: number; // 적치 무게 (톤)
  stockpileVolumeM3?: number; // 적치 부피 (㎥)
  stockpileAreaM2?: number; // 적치 면적 (㎡)
}

export interface DiagnosticInput {
  category: ActivityCategory;
  zoning: ZoningCategory;
  landCategory?: string; // 토지의 지목 (전, 답, 과수원, 목장용지, 임야, 대, 공장용지, 잡종지 등)
  landAreaM2: number;
  activityName: string;
  locationDescription?: string;
  details: ActivityDetailInputs;
}

export interface ActivityPermissionGuide {
  id: ActivityCategory;
  title: string;
  subtitle: string;
  legalBasis: string;
  coreCriteria: {
    title: string;
    description: string;
    details: string[];
  }[];
  planningLimits: {
    buildingCoverageRatio?: string; // 건폐율
    floorAreaRatio?: string;        // 용적률
    heightLimit?: string;          // 높이제한
    greenOpenSpace?: string;       // 녹지/조경 면적 확보
    roadAccess?: string;           // 진입도로 기준
    drainagePrevention?: string;   // 배수 및 재해방지
  };
  requiredDocuments: {
    category: string;
    items: string[];
  }[];
  procedureSteps: {
    step: number;
    name: string;
    actor: string;
    duration: string;
    description: string;
  }[];
  exemptionsMinor: string[];
}

export interface LocalOrdinanceInfo {
  region: string;
  ordinanceName: string;
  keyRestrictions: {
    slopeLimit: string; // 평균경사도 제한
    elevationLimit: string; // 표고/고도 제한
    forestDensity: string; // 입목축적도
    agriculturalFillLimit: string; // 영농성토 허가기준 높이
    solarFacilityDistance: string; // 태양광 이격거리
  };
  specialNotes: string[];
}

export interface SearchableLawItem {
  id: string;
  hierarchy: "법률" | "시행령" | "시행규칙" | "조례/지침";
  article: string;
  title: string;
  keywords: string[];
  summary: string;
  fullText: string;
  practicalImplication: string;
}

export interface DiagnosticResult {
  verdict: PermissionVerdict;
  verdictTitle: string;
  verdictDescription: string;
  statutoryBasis: {
    law: string;
    articles: string[];
    summary: string;
  };
  keyFindings: string[];
  maxPermissibleScale: number; // 해당 용도지역 허가규모 상한 (㎡)
  isScaleExceeded: boolean;
  requiredDocuments: string[];
  localOrdinanceWarnings: string[];
  recommendedSteps: string[];
}

export interface LegalStatute {
  articleNo: string;
  title: string;
  category: string;
  summary: string;
  fullText: string;
  relatedNotes: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  statuteReference: string;
  practicalTip: string;
}

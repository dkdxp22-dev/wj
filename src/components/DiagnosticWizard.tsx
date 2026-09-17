import React, { useState } from "react";
import {
  ActivityCategory,
  ZoningCategory,
  DiagnosticInput,
  DiagnosticResult,
  ActivityDetailInputs,
} from "../types";
import { ZONING_DATA, ACTIVITY_CATEGORIES, PRESET_CASES } from "../data/legalCriteria";
import { LAND_CATEGORIES } from "../data/detailedPermissionData";
import { evaluateDevelopmentPermission } from "../utils/diagnosticEngine";
import { ActivityAutoJudger } from "./ActivityAutoJudger";
import {
  Building2,
  Layers,
  Mountain,
  SplitSquareVertical,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileText,
  Printer,
  Copy,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  ShieldAlert,
} from "lucide-react";

interface DiagnosticWizardProps {
  onGoToAiWithCase?: (casePrompt: string, activityType: string, zoning: string, size: string) => void;
  initialPreset?: {
    category?: ActivityCategory;
    zoning?: ZoningCategory;
    landCategory?: string;
    area?: number;
    step?: number;
  } | null;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({ onGoToAiWithCase, initialPreset }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialPreset?.step ?? 1);

  // Form State
  const [category, setCategory] = useState<ActivityCategory>(initialPreset?.category ?? "LAND_ALTERATION");
  const [zoning, setZoning] = useState<ZoningCategory>(initialPreset?.zoning ?? "NATURAL_GREEN");
  const [landCategory, setLandCategory] = useState<string>(initialPreset?.landCategory ?? "전");
  const [landAreaM2, setLandAreaM2] = useState<number>(initialPreset?.area ?? 1000);
  const [activityName, setActivityName] = useState<string>("");
  const [locationDescription, setLocationDescription] = useState<string>("");

  // Sync when initialPreset updates
  React.useEffect(() => {
    if (initialPreset) {
      if (initialPreset.category) setCategory(initialPreset.category);
      if (initialPreset.zoning) setZoning(initialPreset.zoning);
      if (initialPreset.landCategory) setLandCategory(initialPreset.landCategory);
      if (initialPreset.area) setLandAreaM2(initialPreset.area);
      if (initialPreset.step) setCurrentStep(initialPreset.step);
    }
  }, [initialPreset]);

  const [details, setDetails] = useState<ActivityDetailInputs>({
    isEmergencyDisaster: false,
    hasBuildingOnPlot: false,
    // 토지형질변경 기본값
    alterationType: "FILL",
    heightOrDepthCm: 80,
    isChangeOfLandCategory: false,
    isAgriculturalPurpose: true,
    hasRetainingWall: false,
    retainingWallHeightM: 0,
    isLandscaping: false,
    // 건축물/공작물
    structureType: "STRUCTURE",
    buildingApprovalType: "TEMPORARY_BUILDING",
    structureWeight: 20,
    structureVolume: 20,
    structureArea: 15,
    isAgriculturalGreenhouse: false,
    hasSteelFramedAquaculture: false,
    // 토석채취
    rockExcavationArea: 20,
    rockExcavationVolume: 40,
    isForLandAlteration: false,
    // 토지분할
    subdivisionWidthM: 6,
    subdivisionAreaM2: 500,
    isPublicLandSubdivision: false,
    isPrivateRoadPermitted: false,
    isDisposedAdminProperty: false,
    isAlreadyOver5mWidth: true,
    // 물건적치
    isInsideFenceOrLot: false,
    stockpileDurationMonths: 2,
    stockpileWeightTon: 60,
    stockpileVolumeM3: 60,
    stockpileAreaM2: 50,
  });

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Helper for updating details
  const updateDetail = <K extends keyof ActivityDetailInputs>(key: K, value: ActivityDetailInputs[K]) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleRunDiagnosis = () => {
    const input: DiagnosticInput = {
      category,
      zoning,
      landCategory,
      landAreaM2,
      activityName: activityName.trim() || `${ACTIVITY_CATEGORIES[category].title} 계획`,
      locationDescription: locationDescription.trim(),
      details,
    };
    const diagResult = evaluateDevelopmentPermission(input);
    setResult(diagResult);
    setCurrentStep(4);
  };

  const handleLoadPreset = (presetIdx: number) => {
    const preset = PRESET_CASES[presetIdx];
    if (!preset) return;
    setCategory(preset.category);
    setZoning(preset.zoning);
    setLandAreaM2(preset.landArea);
    setActivityName(preset.title);
    setLocationDescription(preset.promptText);
    setDetails((prev) => ({ ...prev, ...preset.details }));
    setCurrentStep(3);
  };

  const handleAutoSelectCategory = (cat: ActivityCategory, suggestedDetails?: any, text?: string) => {
    setCategory(cat);
    if (text) {
      setActivityName(text.slice(0, 40));
      setLocationDescription(text);
    }
    if (suggestedDetails) {
      setDetails((prev) => ({ ...prev, ...suggestedDetails }));
    }
    setCurrentStep(2);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setResult(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[국토계획법 제56조 개발행위허가 자가진단 검토의견서]
■ 행위 유형: ${ACTIVITY_CATEGORIES[category].title}
■ 토지 지목: ${landCategory}
■ 용도지역: ${ZONING_DATA[zoning].name} (법정 상한: ${ZONING_DATA[zoning].maxScaleM2.toLocaleString()}㎡)
■ 신청 부지면적: ${landAreaM2.toLocaleString()}㎡ (${(landAreaM2 * 0.3025).toFixed(1)}평)
■ 진단 판정: ${result.verdictTitle}
■ 판정 요약: ${result.verdictDescription}
■ 법적 근거: ${result.statutoryBasis.law} ${result.statutoryBasis.articles.join(", ")}
■ 핵심 검토사항:
${result.keyFindings.map((f) => `- ${f}`).join("\n")}
■ 필수 제출서류:
${result.requiredDocuments.map((d) => `• ${d}`).join("\n")}
■ 지자체 조례 주의사항:
${result.localOrdinanceWarnings.map((w) => `! ${w}`).join("\n")}
※ 본 진단 결과는 국토의 계획 및 이용에 관한 법률 및 시행령 기준의 사전 자가진단이며, 최종 인허가는 지자체 도시·군계획조례 및 현장 여건에 따라 결정됩니다.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getVerdictStyle = (verdict: DiagnosticResult["verdict"]) => {
    switch (verdict) {
      case "PERMIT_EXEMPT_MINOR":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-950",
          badgeBg: "bg-emerald-600 text-white",
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />,
          label: "허가 면제 (경미한 행위)",
        };
      case "PERMIT_REQUIRED":
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-950",
          badgeBg: "bg-rose-600 text-white",
          icon: <AlertOctagon className="w-8 h-8 text-rose-600 flex-shrink-0" />,
          label: "개발행위허가 필수 대상",
        };
      case "SCALE_EXCEEDED":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-950",
          badgeBg: "bg-amber-600 text-white",
          icon: <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />,
          label: "규모 초과 (도시계획위원회 심의 필요)",
        };
      case "EMERGENCY_REPORT":
        return {
          bg: "bg-blue-50 border-blue-300 text-blue-950",
          badgeBg: "bg-blue-600 text-white",
          icon: <Info className="w-8 h-8 text-blue-600 flex-shrink-0" />,
          label: "재난응급조치 (1개월 내 사후신고)",
        };
      case "DEEMED_CONSULTATION":
        return {
          bg: "bg-indigo-50 border-indigo-300 text-indigo-950",
          badgeBg: "bg-indigo-600 text-white",
          icon: <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />,
          label: "의제 협의 대상 (건축인허가 일괄 처리)",
        };
      case "ORDINANCE_RESTRICTED":
      default:
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-950",
          badgeBg: "bg-amber-600 text-white",
          icon: <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />,
          label: "지자체 조례 확인 필요",
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Progress Bar */}
      <div className="mb-8 print:hidden">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { step: 1, label: "행위 유형 선택" },
            { step: 2, label: "용도지역·면적" },
            { step: 3, label: "세부 계획 입력" },
            { step: 4, label: "종합 진단 결과" },
          ].map((item, idx) => {
            const isActive = currentStep === item.step;
            const isDone = currentStep > item.step;
            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : item.step}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium ${
                      isActive ? "text-blue-900 font-semibold" : isDone ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      currentStep > item.step ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Presets for Step 1 */}
        {currentStep === 1 && (
          <div className="mt-6 p-4 bg-slate-100/80 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                자주 묻는 대표 실사례 바로 불러오기:
              </span>
              <span className="text-[11px] text-slate-600">원클릭 프리셋 입력</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_CASES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(idx)}
                  className="text-left px-3 py-2 text-xs bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-lg text-slate-800 transition shadow-xs"
                >
                  <p className="font-semibold text-slate-900 truncate">{preset.title}</p>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    {ZONING_DATA[preset.zoning].name} · {preset.landArea}㎡
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: 행위 유형 선택 */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* 개발 내용 입력 시 행위 유형 자동 판별기 */}
          <ActivityAutoJudger
            onSelectCategory={handleAutoSelectCategory}
            currentCategory={category}
            landCategory={landCategory}
            zoning={ZONING_DATA[zoning].name}
          />

          <div className="text-center max-w-xl mx-auto pt-2">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-12 bg-slate-200"></div>
              <span className="text-xs font-semibold text-slate-600">또는 아래 5대 행위 유형 직접 선택</span>
              <div className="h-px w-12 bg-slate-200"></div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">국토계획법 제56조 5대 개발행위 유형</h2>
            <p className="mt-1 text-xs text-slate-600">
              해당하는 법정 개발행위를 직접 클릭하여 선택하실 수도 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(ACTIVITY_CATEGORIES) as ActivityCategory[]).map((catKey) => {
              const catInfo = ACTIVITY_CATEGORIES[catKey];
              const isSelected = category === catKey;

              const IconComp =
                catKey === "BUILDING_STRUCTURE"
                  ? Building2
                  : catKey === "LAND_ALTERATION"
                  ? Layers
                  : catKey === "ROCK_EXCAVATION"
                  ? Mountain
                  : catKey === "LAND_SUBDIVISION"
                  ? SplitSquareVertical
                  : Boxes;

              return (
                <div
                  key={catKey}
                  onClick={() => setCategory(catKey)}
                  className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all shadow-xs flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-500"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 text-base">{catInfo.title}</h3>
                    <p className="text-xs font-medium text-blue-700 mt-0.5">{catInfo.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{catInfo.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {catInfo.statutoryRef}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
            >
              다음: 용도지역 및 면적 입력
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 용도지역 및 부지 면적 */}
      {currentStep === 2 && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">토지의 용도지역과 면적을 알려주세요</h2>
            <p className="mt-1 text-sm text-slate-600">
              국토계획법 시행령 제55조에 따라 용도지역별로 개발행위허가 규모 상한(5천㎡ / 1만㎡ / 3만㎡)이 다릅니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            {/* 용도지역 선택 */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                해당 토지의 국토계획법상 용도지역 <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-600 mb-3">
                토지이용계획확인서의 [국토의 계획 및 이용에 관한 법률에 따른 지역·지구] 항목을 확인하세요.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(ZONING_DATA) as ZoningCategory[]).map((zoneKey) => {
                  const z = ZONING_DATA[zoneKey];
                  const isSelected = zoning === zoneKey;
                  return (
                    <button
                      key={zoneKey}
                      type="button"
                      onClick={() => setZoning(zoneKey)}
                      className={`text-left p-3 rounded-lg border text-xs transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{z.name}</span>
                        <span className="text-[11px] text-slate-600 font-normal">
                          {z.maxScaleM2 >= 10000 ? `${z.maxScaleM2 / 10000}만㎡` : `${z.maxScaleM2 / 1000}천㎡`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{z.categoryGroup}</p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Zoning Info Box */}
              <div className="mt-3 p-3 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{ZONING_DATA[zoning].name}</span>의 법정 개발행위허가 규모 상한:{" "}
                  <strong className="text-blue-950 underline">
                    {ZONING_DATA[zoning].maxScaleM2.toLocaleString()}㎡ 미만
                  </strong>
                  <p className="text-blue-700 text-[11px] mt-0.5">{ZONING_DATA[zoning].description}</p>
                </div>
              </div>
            </div>

            {/* 토지 지목 선택 */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-900 mb-1">
                토지의 지목(地目) 선택 <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-600 mb-3">
                토지대장 또는 등기사항증명서상 지목을 선택하세요. 지목(농지·임야·대지 등)에 따라 연계 인허가 및 형질변경 기준이 달라집니다.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LAND_CATEGORIES.map((cat) => {
                  const isSelected = landCategory === cat.code;
                  return (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => setLandCategory(cat.code)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{cat.name}</span>
                        <span className="text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-600">
                          {cat.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.note}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 토지 면적 입력 */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-900 mb-1">
                신청 또는 사업 부지 면적 (㎡) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    value={landAreaM2}
                    onChange={(e) => setLandAreaM2(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm font-semibold"
                    placeholder="예: 1500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-600">㎡</span>
                </div>
                <div className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-nowrap">
                  약 <strong>{(landAreaM2 * 0.3025).toLocaleString(undefined, { maximumFractionDigits: 1 })}</strong> 평
                </div>
              </div>

              {landAreaM2 > ZONING_DATA[zoning].maxScaleM2 && (
                <div className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    주의: 부지 면적({landAreaM2.toLocaleString()}㎡)이 {ZONING_DATA[zoning].name} 상한(
                    {ZONING_DATA[zoning].maxScaleM2.toLocaleString()}㎡)을 초과하여 도시계획위원회 심의 또는
                    지구단위계획 수립이 필요합니다.
                  </span>
                </div>
              )}
            </div>

            {/* 재해복구 응급조치 토글 */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!details.isEmergencyDisaster}
                  onChange={(e) => updateDetail("isEmergencyDisaster", e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    재해복구 또는 재난수습을 위한 응급조치에 해당합니까? (법 제56조제4항제1호)
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    산사태, 수해, 축대 붕괴 위험 등으로 인한 긴급 복구 작업인 경우 사전 허가 없이 착수 가능하며 착수 후
                    1개월 이내 사후 신고합니다.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              이전
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
            >
              다음: 세부 계획 입력
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: 행위별 세부 계획 입력 */}
      {currentStep === 3 && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {ACTIVITY_CATEGORIES[category].title}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">구체적인 행위 계획을 입력해주세요</h2>
            <p className="mt-1 text-sm text-slate-600">
              입력하신 수치와 세부 조건에 따라 시행령 제53조(경미한 행위) 해당 여부를 정밀 계산합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            {/* 1. 토지의 형질변경 세부 폼 */}
            {category === "LAND_ALTERATION" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">형질변경 주된 방식</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: "FILL", label: "성토 (흙쌓기/돋우기)" },
                      { key: "CUT", label: "절토 (흙깎기/파내기)" },
                      { key: "LEVEL", label: "정지 (평탄화/땅고르기)" },
                      { key: "PAVE", label: "포장 (콘크리트/아스팔트)" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => updateDetail("alterationType", item.key as any)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold transition ${
                          details.alterationType === item.key
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 절토/성토 높이/깊이 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-bold text-slate-900">
                      절토·성토의 높이 또는 굴착 깊이:{" "}
                      <span className="text-blue-600 text-base font-extrabold">{details.heightOrDepthCm ?? 0}</span> cm
                    </label>
                    <span className="text-xs text-slate-600">
                      경미한 행위 법정 기준선: <strong>50cm 이내</strong>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={400}
                    step={5}
                    value={details.heightOrDepthCm ?? 0}
                    onChange={(e) => updateDetail("heightOrDepthCm", Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                    <span>0cm</span>
                    <span className="text-emerald-600 font-semibold">50cm (경미한 기준)</span>
                    <span className="text-amber-600 font-semibold">200cm (2m 영농 허가선)</span>
                    <span>400cm</span>
                  </div>
                </div>

                {/* 추가 조건 체크박스들 */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.isAgriculturalPurpose}
                      onChange={(e) => updateDetail("isAgriculturalPurpose", e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        농작물 경작 또는 다년생식물 재배 등 영농 목적의 형질변경입니까?
                      </span>
                      <p className="text-xs text-slate-600">
                        영농 목적이라도 2m 이상 또는 옹벽 설치 수반 시 개발행위허가를 받아야 합니다.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.hasRetainingWall}
                      onChange={(e) => updateDetail("hasRetainingWall", e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        옹벽 또는 석축 구조물 축조가 수반됩니까?
                      </span>
                      <p className="text-xs text-slate-600">
                        옹벽 축조 시 높이와 무관하게 붕괴 방지 심사를 위해 조례상 허가 대상이 될 수 있습니다.
                      </p>
                    </div>
                  </label>

                  {details.hasRetainingWall && (
                    <div className="ml-7 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">예상 옹벽 높이:</label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={details.retainingWallHeightM ?? 1.0}
                        onChange={(e) => updateDetail("retainingWallHeightM", Number(e.target.value) || 0)}
                        className="w-24 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                      />
                      <span className="text-xs text-slate-600">미터(m)</span>
                    </div>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.isChangeOfLandCategory}
                      onChange={(e) => updateDetail("isChangeOfLandCategory", e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        지목변경(예: 전·답·임야 → 대지, 잡종지 등)을 수반합니까?
                      </span>
                      <p className="text-xs text-slate-600">
                        지목변경을 수반하는 절토·성토는 50cm 이내라도 경미한 행위에서 제외되어 허가 대상이 됩니다.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.isLandscaping}
                      onChange={(e) => updateDetail("isLandscaping", e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        순수 조경(수목 식재, 정원 가꾸기) 목적입니까? (건축물 건축 제외)
                      </span>
                      <p className="text-xs text-slate-600">
                        건축물 부지 조성을 위한 것이 아닌 순수 조경 목적 형질변경은 경미한 행위로 면제됩니다.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* 2. 건축물의 건축 또는 공작물의 설치 */}
            {category === "BUILDING_STRUCTURE" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">건축물 또는 시설물의 종류</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: "BUILDING", label: "일반 건축물 / 가설건축물", desc: "주택, 근린생활시설, 농막, 창고" },
                      { key: "STRUCTURE", label: "공작물 (인공 시설물)", desc: "옹벽, 담장, 철탑, 태양광발전, 탱크" },
                      { key: "VINYL_HOUSE", label: "농업용 온실 / 비닐하우스", desc: "작물 재배, 육묘장 온실" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => updateDetail("structureType", item.key as any)}
                        className={`p-3 rounded-lg border text-left text-xs transition ${
                          details.structureType === item.key
                            ? "border-blue-600 bg-blue-50 text-blue-950 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {details.structureType === "BUILDING" && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">건축법상 인허가 구분</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "BUILDING_PERMIT", label: "건축허가 (일반)", desc: "개발행위허가 의제협의 처리" },
                        { key: "BUILDING_REPORT", label: "건축신고 (소규모)", desc: "개발행위허가 의제협의 처리" },
                        { key: "TEMPORARY_BUILDING", label: "가설건축물 축조신고", desc: "농막, 컨테이너 창고 등" },
                        { key: "NONE", label: "건축법상 허가/신고 불요 대상", desc: "극소형 가설물" },
                      ].map((sub) => (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => updateDetail("buildingApprovalType", sub.key as any)}
                          className={`p-2 rounded border text-left text-xs ${
                            details.buildingApprovalType === sub.key
                              ? "border-blue-600 bg-blue-50 font-semibold text-blue-900"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <p className="font-semibold">{sub.label}</p>
                          <p className="text-[10px] text-slate-600">{sub.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {details.structureType === "STRUCTURE" && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">공작물의 예상 규모</span>
                      <span className="text-[11px] text-blue-700 font-medium">
                        {ZONING_DATA[zoning].isCityOrDistrictPlanArea
                          ? "도시지역 기준: 50톤, 50㎥, 25㎡ 이하 시 면제"
                          : "비도시지역 기준: 150톤, 150㎥, 75㎡ 이하 시 면제"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">무게 (톤)</label>
                        <input
                          type="number"
                          value={details.structureWeight ?? 0}
                          onChange={(e) => updateDetail("structureWeight", Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">부피 (㎥)</label>
                        <input
                          type="number"
                          value={details.structureVolume ?? 0}
                          onChange={(e) => updateDetail("structureVolume", Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">수평투영면적 (㎡)</label>
                        <input
                          type="number"
                          value={details.structureArea ?? 0}
                          onChange={(e) => updateDetail("structureArea", Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {details.structureType === "VINYL_HOUSE" && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!details.hasSteelFramedAquaculture}
                        onChange={(e) => updateDetail("hasSteelFramedAquaculture", e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          철골조 구조이거나 육상 양식시설을 포함합니까?
                        </span>
                        <p className="text-[11px] text-slate-600">
                          일반 파이프 비닐하우스는 허가 면제이나, 철골 구조 또는 양식장은 개발행위허가 대상입니다.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* 3. 토석채취 세부 폼 */}
            {category === "ROCK_EXCAVATION" && (
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!details.isForLandAlteration}
                    onChange={(e) => updateDetail("isForLandAlteration", e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900">
                      부지조성(토지의 형질변경)을 목적으로 하는 굴착입니까?
                    </span>
                    <p className="text-xs text-slate-600">
                      형질변경 목적의 토석 채취는 '토지의 형질변경' 허가로 흡수되어 일괄 처리됩니다.
                    </p>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">채취 면적 (㎡)</label>
                    <input
                      type="number"
                      value={details.rockExcavationArea ?? 0}
                      onChange={(e) => updateDetail("rockExcavationArea", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      {ZONING_DATA[zoning].isCityOrDistrictPlanArea ? "도시지역 기준: 25㎡ 이하" : "비도시 기준: 250㎡ 이하"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">채취 부피 (㎥)</label>
                    <input
                      type="number"
                      value={details.rockExcavationVolume ?? 0}
                      onChange={(e) => updateDetail("rockExcavationVolume", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      {ZONING_DATA[zoning].isCityOrDistrictPlanArea ? "도시지역 기준: 50㎥ 이하" : "비도시 기준: 500㎥ 이하"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 토지분할 세부 폼 */}
            {category === "LAND_SUBDIVISION" && (
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!details.hasBuildingOnPlot}
                    onChange={(e) => updateDetail("hasBuildingOnPlot", e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900">
                      분할하려는 필지 위에 이미 건축물이 있습니까?
                    </span>
                    <p className="text-xs text-slate-600">
                      건축물이 있는 대지는 국토계획법이 아닌 건축법 제57조(대지의 분할제한)가 적용됩니다.
                    </p>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      분할 후 예상 최소 너비 (m)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={details.subdivisionWidthM ?? 6}
                      onChange={(e) => updateDetail("subdivisionWidthM", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      관계법령 인허가 없이 너비 5m 이하 분할은 엄격 허가 대상
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      분할 후 각 필지 최소 면적 (㎡)
                    </label>
                    <input
                      type="number"
                      value={details.subdivisionAreaM2 ?? 500}
                      onChange={(e) => updateDetail("subdivisionAreaM2", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.isPublicLandSubdivision}
                      onChange={(e) => updateDetail("isPublicLandSubdivision", e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>공공용지 또는 공용지로 편입하기 위한 분할입니까? (경미한 행위 면제)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!details.isPrivateRoadPermitted}
                      onChange={(e) => updateDetail("isPrivateRoadPermitted", e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>사도법에 따른 사도개설허가를 받은 토지의 분할입니까? (경미한 행위 면제)</span>
                  </label>
                </div>
              </div>
            )}

            {/* 5. 물건적치 세부 폼 */}
            {category === "STOCKPILING_GOODS" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 inline mr-1" />
                  물건 적치 허가는 <strong>녹지지역, 관리지역, 자연환경보전지역</strong>에서 건축물 울타리 밖 토지에 1개월 이상 야적할 때만 대상이 됩니다.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-start gap-2.5 cursor-pointer p-3 border rounded-lg bg-slate-50">
                    <input
                      type="checkbox"
                      checked={!!details.isInsideFenceOrLot}
                      onChange={(e) => updateDetail("isInsideFenceOrLot", e.target.checked)}
                      className="mt-1 text-blue-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">건축물의 울타리 안(대지 내부) 적치</span>
                      <p className="text-[11px] text-slate-600">적법한 공장·창고 대지 안은 허가 대상에서 제외됩니다.</p>
                    </div>
                  </label>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">예상 적치 기간 (개월)</label>
                    <input
                      type="number"
                      value={details.stockpileDurationMonths ?? 1}
                      onChange={(e) => updateDetail("stockpileDurationMonths", Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    />
                    <span className="text-[11px] text-slate-600 mt-1 block">1개월 미만은 허가 면제</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">무게 (톤)</label>
                    <input
                      type="number"
                      value={details.stockpileWeightTon ?? 0}
                      onChange={(e) => updateDetail("stockpileWeightTon", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">부피 (㎥)</label>
                    <input
                      type="number"
                      value={details.stockpileVolumeM3 ?? 0}
                      onChange={(e) => updateDetail("stockpileVolumeM3", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">면적 (㎡)</label>
                    <input
                      type="number"
                      value={details.stockpileAreaM2 ?? 0}
                      onChange={(e) => updateDetail("stockpileAreaM2", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              이전
            </button>
            <button
              onClick={handleRunDiagnosis}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition shadow-md hover:shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              개발행위허가 최종 판정하기
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: 종합 진단 결과서 */}
      {currentStep === 4 && result && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs print:hidden">
            <button
              onClick={handleReset}
              className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              처음부터 다시 진단하기
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "복사 완료!" : "검토의견서 복사"}
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                인쇄 / PDF 저장
              </button>
            </div>
          </div>

          {/* Printable Report Document */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none">
            {/* Report Header */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  국토의 계획 및 이용에 관한 법률 제56조
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  개발행위허가 대상 여부 자가진단 검토의견서
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  진단 일시: {new Date().toLocaleDateString("ko-KR")} · 국토교통부 개발행위허가운영지침 기준
                </p>
              </div>
              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-[11px] text-slate-600 block">진단 대상 토지</span>
                <span className="font-bold text-slate-900 text-sm">
                  {ZONING_DATA[zoning].name} · 지목 [{landCategory}]
                </span>
                <span className="text-xs text-slate-600 block">
                  {landAreaM2.toLocaleString()}㎡ (약 {(landAreaM2 * 0.3025).toFixed(1)}평)
                </span>
              </div>
            </div>

            {/* Verdict Card */}
            {(() => {
              const vStyle = getVerdictStyle(result.verdict);
              return (
                <div className={`p-5 sm:p-6 rounded-xl border-2 ${vStyle.bg} flex items-start gap-4`}>
                  {vStyle.icon}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${vStyle.badgeBg}`}>
                        {vStyle.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {result.statutoryBasis.articles.join(", ")}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black">{result.verdictTitle}</h2>
                    <p className="text-sm mt-2 leading-relaxed opacity-90">{result.verdictDescription}</p>
                  </div>
                </div>
              );
            })()}

            {/* Statutory Basis & Key Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  법적 근거 및 규정 조항
                </h3>
                <div className="text-xs text-slate-700 space-y-1.5">
                  <p>
                    <strong>적용 법률:</strong> {result.statutoryBasis.law}
                  </p>
                  <p>
                    <strong>인용 조항:</strong> {result.statutoryBasis.articles.join(", ")}
                  </p>
                  <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    {result.statutoryBasis.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  핵심 판단 사유
                </h3>
                <ul className="space-y-1.5">
                  {result.keyFindings.map((finding, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>필수 구비서류 및 준비 목록</span>
                <span className="text-xs font-normal text-slate-600">
                  {result.verdict === "PERMIT_EXEMPT_MINOR" ? "경미한 행위로 서류 제출 생략" : "지자체 제출용"}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Ordinance & Penalties Box */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                지자체 도시·군계획조례 주의사항 & 무허가 개발행위 처벌 규정
              </div>
              <ul className="space-y-1 text-xs text-amber-900/90 list-disc list-inside">
                {result.localOrdinanceWarnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
                <li>
                  <strong>무허가 개발행위 처벌(국토계획법 제140조):</strong> 3년 이하의 징역 또는 3천만원 이하의 벌금에 처해지며, 동법 제133조에 따른 원상회복명령이 부과됩니다.
                </li>
              </ul>
            </div>

            {/* Consultation CTA to AI */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  복합 인허가나 경계 분쟁 등 특수 사례가 있으신가요?
                </span>
                <h4 className="text-base font-bold mt-1">
                  Gemini AI 법률 고문관에게 이 사례를 심층 질의해보세요
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  진입도로 기준, 농지전용 연계, 옹벽 설치 기준 등 지자체 조례 쟁점을 맞춤형으로 분석해 드립니다.
                </p>
              </div>
              {onGoToAiWithCase && (
                <button
                  onClick={() => {
                    const prompt = `[자가진단 결과 기반 질의]
- 행위유형: ${ACTIVITY_CATEGORIES[category].title}
- 용도지역: ${ZONING_DATA[zoning].name}
- 부지면적: ${landAreaM2}㎡
- 진단결과: ${result.verdictTitle}
- 세부내용: ${JSON.stringify(details)}
위 내용을 바탕으로 인접 토지 배수 대책, 지자체 조례에서 특히 유의할 점, 그리고 허가 취득을 위한 최적의 행정 절차를 상세히 안내해주세요.`;
                    onGoToAiWithCase(prompt, ACTIVITY_CATEGORIES[category].title, ZONING_DATA[zoning].name, `${landAreaM2}㎡`);
                  }}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap shadow-md transition"
                >
                  AI 심층 검토 요청하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

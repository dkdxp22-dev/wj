import React, { useState } from "react";
import {
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layers,
  Search,
  Play,
  X,
  ExternalLink,
} from "lucide-react";
import { ActivityCategory, ZoningCategory } from "../types";
import { ZONING_DATA, ACTIVITY_CATEGORIES } from "../data/legalCriteria";
import { LAND_CATEGORIES } from "../data/detailedPermissionData";

interface InteractiveHeroProps {
  onStartDiagnosis: (options?: { category?: ActivityCategory; zoning?: ZoningCategory; landCategory?: string; area?: number }) => void;
  onNavigateTab: (tab: "wizard" | "guides" | "laws" | "ai" | "criteria" | "faq") => void;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  onStartDiagnosis,
  onNavigateTab,
}) => {
  // Video player modal state
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Interactive mini-simulator state
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory>("LAND_ALTERATION");
  const [selectedZoning, setSelectedZoning] = useState<ZoningCategory>("NATURAL_GREEN");
  const [selectedLandCat, setSelectedLandCat] = useState<string>("전");
  const [simulatedArea, setSimulatedArea] = useState<number>(1500);

  // Quick simulation calculation
  const maxAllowedScale = ZONING_DATA[selectedZoning].maxScaleM2;
  const isScaleExceeded = simulatedArea > maxAllowedScale;
  const zoningInfo = ZONING_DATA[selectedZoning];

  // Quick statutory insight
  const getQuickInsight = () => {
    switch (selectedActivity) {
      case "LAND_ALTERATION":
        return {
          title: "성토·절토 50cm 초과 시 허가 필수",
          desc: "통상 50cm 이하의 농지개량은 경미한 행위이나, 2m 이상 성토 또는 옹벽 축조 시 반드시 지자체 허가를 받아야 합니다.",
          badge: "시행령 제53조제3호",
        };
      case "BUILDING_STRUCTURE":
        return {
          title: "건축허가·신고 시 개발행위 의제 협의",
          desc: "건축법에 따른 건축허가 신청 시 국토계획법 개발행위허가가 함께 의제 처리되며, 4m 진입도로 확보가 핵심 기준입니다.",
          badge: "시행령 제51조제1항",
        };
      case "ROCK_EXCAVATION":
        return {
          title: "토석채취 면적·부피 기준 엄격 적용",
          desc: `${zoningInfo.isCityOrDistrictPlanArea ? "도시지역: 25㎡/50㎥ 이하 경미" : "비도시지역: 250㎡/500㎥ 이하 경미"} 채취 초과 시 허가 필수입니다.`,
          badge: "시행령 제53조제4호",
        };
      case "LAND_SUBDIVISION":
        return {
          title: "건축물이 없는 토지 분할 면적 제한",
          desc: `녹지지역 200㎡, 주거지역 60㎡ 등 건축법령 최소 분할면적 미만 또는 너비 5m 이하 분할은 기획부동산 방지 기준이 적용됩니다.`,
          badge: "시행령 제51조제1항제4호",
        };
      case "STOCKPILING_GOODS":
        return {
          title: "녹지·관리지역 내 1개월 이상 야적",
          desc: `도시지역 주거·상업·공업지역은 대상이 아니며, 녹지/관리/자연환경보전지역에서 1개월 이상 야적 시 허가 대상입니다.`,
          badge: "법 제56조제1항제5호",
        };
    }
  };

  const insight = getQuickInsight();

  const handleLaunchDirect = () => {
    onStartDiagnosis({
      category: selectedActivity,
      zoning: selectedZoning,
      landCategory: selectedLandCat,
      area: simulatedArea,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white text-slate-900 border-b border-slate-200">
      {/* Background Soft Ambient Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Statutory Top Banner Ribbon */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200 text-[11px]">
              국토계획법 제56조
            </span>
            <span className="text-slate-700 font-medium">
              대한민국 5대 개발행위허가 기준 및 지자체 도시계획조례 원스톱 판정 시스템
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              시행령 제53조 경미한 행위 완벽 탑재
            </span>
            <span className="hidden sm:flex items-center gap-1 text-blue-700 font-semibold">
              <Scale className="w-3.5 h-3.5" />
              시행령 제55조 용도지역별 허가규모 자동 계산
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>실시간 인터랙티브 법률 판단 시뮬레이터</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              토지 개발 인허가 대상 여부, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                법정 기준 30초 즉시 시뮬레이션
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              복잡한 국토계획법 법령·시행령과 전국 지자체 도시계획조례를 자동 대조합니다.
              개발 내용, 지목, 용도지역, 부지 면적에 따른 <strong>허가 대상 여부</strong>와 <strong>경미한 행위 제외 기준</strong>을 바로 검토해보세요.
            </p>

            {/* Quick Feature Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
                <div className="text-blue-600 font-black text-lg">5개 유형</div>
                <div className="text-slate-500 text-xs mt-0.5 font-medium">법정 5대 행위 자동판별</div>
              </div>
              <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
                <div className="text-emerald-600 font-black text-lg">28개 지목</div>
                <div className="text-slate-500 text-xs mt-0.5 font-medium">농지·산지전용 연계 분석</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
                <div className="text-amber-600 font-black text-lg">시군구 조례</div>
                <div className="text-slate-500 text-xs mt-0.5 font-medium">경사도·표고 위임기준</div>
              </div>
            </div>

            {/* Navigation Quick Shortcuts & YouTube Video Guide */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-500 font-medium">빠른 탐색:</span>
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 shadow-xs transition cursor-pointer flex items-center gap-1.5 font-bold"
                title="개발행위허가 실무 해설 영상 시청"
              >
                <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                </div>
                <span>해설 영상 보기</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("guides")}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-xs transition cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>행위별 허가기준</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("laws")}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-xs transition cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>법령·조례 검색</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab("ai")}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-xs transition cursor-pointer flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI 사례 질의</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Quick Simulator Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">실시간 빠른 인허가 시뮬레이터</h3>
                    <p className="text-[11px] text-slate-500">조건을 변경하면 즉시 법정 상한 및 기준이 계산됩니다</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Interactive
                </span>
              </div>

              {/* 1. 개발행위 유형 선택 인터랙션 */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>1. 행위 유형 선택</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{ACTIVITY_CATEGORIES[selectedActivity].title}</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(ACTIVITY_CATEGORIES) as ActivityCategory[]).map((cat) => {
                    const isSelected = selectedActivity === cat;
                    const item = ACTIVITY_CATEGORIES[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedActivity(cat)}
                        className={`p-2 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 border text-xs ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold ring-2 ring-blue-100"
                            : "bg-slate-50 hover:bg-blue-50/60 text-slate-700 border-slate-200 hover:border-blue-200"
                        }`}
                        title={item.title}
                      >
                        <span className="text-base">{cat === "LAND_ALTERATION" ? "🚜" : cat === "BUILDING_STRUCTURE" ? "🏗️" : cat === "ROCK_EXCAVATION" ? "⛰️" : cat === "LAND_SUBDIVISION" ? "📐" : "📦"}</span>
                        <span className="text-[10px] leading-tight truncate w-full font-medium">
                          {cat === "LAND_ALTERATION" ? "형질변경" : cat === "BUILDING_STRUCTURE" ? "건축·공작" : cat === "ROCK_EXCAVATION" ? "토석채취" : cat === "LAND_SUBDIVISION" ? "토지분할" : "물건야적"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. 용도지역 및 지목 인터랙션 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    2. 용도지역 (시행령 제55조)
                  </label>
                  <select
                    value={selectedZoning}
                    onChange={(e) => setSelectedZoning(e.target.value as ZoningCategory)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  >
                    {(Object.keys(ZONING_DATA) as ZoningCategory[]).map((zKey) => (
                      <option key={zKey} value={zKey}>
                        {ZONING_DATA[zKey].name} ({ZONING_DATA[zKey].maxScaleM2.toLocaleString()}㎡ 상한)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    3. 토지 지목 (농지·산지 등)
                  </label>
                  <select
                    value={selectedLandCat}
                    onChange={(e) => setSelectedLandCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                  >
                    {LAND_CATEGORIES.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.code} ({cat.name} · {cat.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. 면적 슬라이더 인터랙션 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">4. 사업 부지 면적 실시간 조절</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-blue-700 text-sm">{simulatedArea.toLocaleString()}㎡</span>
                    <span className="text-slate-500 text-[11px] font-sans">(약 {(simulatedArea * 0.3025).toFixed(1)}평)</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={100}
                  max={40000}
                  step={100}
                  value={simulatedArea}
                  onChange={(e) => setSimulatedArea(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>100㎡</span>
                  <span>5,000㎡(녹지)</span>
                  <span>10,000㎡(자연녹지)</span>
                  <span>30,000㎡(관리지역)</span>
                  <span>40,000㎡</span>
                </div>
              </div>

              {/* Real-time Calculation Result Preview Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">허가 규모 적합도:</span>
                  {isScaleExceeded ? (
                    <span className="inline-flex items-center text-rose-600 font-bold gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      법정 규모 초과 ({simulatedArea.toLocaleString()}㎡ &gt; {maxAllowedScale.toLocaleString()}㎡)
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-emerald-700 font-bold gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      일반 허가규모 적합 (상한 {maxAllowedScale.toLocaleString()}㎡ 미만)
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-700 leading-relaxed">
                  <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold mb-1">
                    <span>💡 {insight.title}</span>
                    <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 border border-blue-200 font-semibold">
                      {insight.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{insight.desc}</p>
                </div>
              </div>

              {/* Launch Full Diagnostic Wizard with Selected State */}
              <button
                type="button"
                onClick={handleLaunchDirect}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>이 설정으로 정밀 자가진단 계속하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full max-w-3xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    국토계획법 개발행위허가 해설 & 실무 가이드 영상
                  </h3>
                  <p className="text-[11px] text-slate-500">YouTube 관련 실무 강의 및 해설</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.youtube.com/watch?v=7SahfL1xRXY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                  title="유튜브 새 창에서 열기"
                >
                  <span>YouTube에서 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Container (Responsive 16:9) */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/7SahfL1xRXY?autoplay=1"
                title="국토계획법 개발행위허가 해설 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer / Summary */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
              <span>💡 영상 시청 후 자가진단 탭에서 본인 토지의 구체적 허가 요건을 직접 확인해보세요.</span>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition cursor-pointer self-end sm:self-auto"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

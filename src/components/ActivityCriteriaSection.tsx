import React, { useState } from "react";
import {
  ACTIVITY_PERMISSION_GUIDES,
  MAJOR_LOCAL_ORDINANCES,
} from "../data/detailedPermissionData";
import { ActivityCategory } from "../types";
import {
  Building2,
  Layers,
  Mountain,
  SplitSquareVertical,
  Boxes,
  FileCheck2,
  FileText,
  Clock,
  ShieldAlert,
  ChevronRight,
  MapPin,
  HelpCircle,
  Building,
  CheckCircle,
} from "lucide-react";

export const ActivityCriteriaSection: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory>("BUILDING_STRUCTURE");
  const [selectedSubTab, setSelectedSubTab] = useState<"criteria" | "documents" | "procedure" | "exemptions">("criteria");
  const [selectedOrdinanceRegion, setSelectedOrdinanceRegion] = useState<string>("경기도 용인시");

  const guide = ACTIVITY_PERMISSION_GUIDES[selectedActivity];
  const activeOrdinance = MAJOR_LOCAL_ORDINANCES.find((o) => o.region === selectedOrdinanceRegion) || MAJOR_LOCAL_ORDINANCES[0];

  const getIcon = (id: ActivityCategory) => {
    switch (id) {
      case "BUILDING_STRUCTURE":
        return <Building2 className="w-5 h-5" />;
      case "LAND_ALTERATION":
        return <Layers className="w-5 h-5" />;
      case "ROCK_EXCAVATION":
        return <Mountain className="w-5 h-5" />;
      case "LAND_SUBDIVISION":
        return <SplitSquareVertical className="w-5 h-5" />;
      case "STOCKPILING_GOODS":
        return <Boxes className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <FileCheck2 className="w-3.5 h-3.5" />
            국토계획법 제56조 제1항 5대 주요 행위별 상세 허가 기준
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            개발행위 유형별 법정 허가기준 및 처리 절차
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            건축물의 건축·공작물 설치, 토지의 형질변경, 토석채취, 토지분할, 물건 적치 등 각 행위별
            법정 허가기준(건폐율·용적률, 높이제한, 녹지면적 확보, 진입도로)과 신청 시 필요 구비서류 및 6단계 처리 절차를 확인하세요.
          </p>
        </div>
      </div>

      {/* 5 Main Activity Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(ACTIVITY_PERMISSION_GUIDES) as ActivityCategory[]).map((key) => {
          const item = ACTIVITY_PERMISSION_GUIDES[key];
          const isSelected = selectedActivity === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedActivity(key)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {getIcon(key)}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-200" />
                )}
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-snug ${isSelected ? "text-blue-950" : "text-slate-900"}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Title Bar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-600 text-white rounded-lg">{getIcon(guide.id)}</span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{guide.title}</h3>
                <p className="text-xs text-blue-700 font-medium">{guide.legalBasis}</p>
              </div>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedSubTab("criteria")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === "criteria" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              허가 기준 & 계획한도
            </button>
            <button
              onClick={() => setSelectedSubTab("documents")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === "documents" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              신청 구비서류
            </button>
            <button
              onClick={() => setSelectedSubTab("procedure")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === "procedure" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              처리 절차 (6단계)
            </button>
            <button
              onClick={() => setSelectedSubTab("exemptions")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === "exemptions" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              경미한 행위 (면제)
            </button>
          </div>
        </div>

        {/* Content Views */}
        <div className="p-6">
          {selectedSubTab === "criteria" && (
            <div className="space-y-6">
              {/* Planning Limits Metric Grid (건폐율, 용적률, 높이, 녹지, 도로) */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  법정 계획 및 설계 제한 기준
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {guide.planningLimits.buildingCoverageRatio && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">건폐율 (Building Coverage)</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.buildingCoverageRatio}</p>
                    </div>
                  )}
                  {guide.planningLimits.floorAreaRatio && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">용적률 (Floor Area Ratio)</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.floorAreaRatio}</p>
                    </div>
                  )}
                  {guide.planningLimits.heightLimit && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">높이 및 사면 제한</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.heightLimit}</p>
                    </div>
                  )}
                  {guide.planningLimits.greenOpenSpace && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">녹지 면적 및 조경 확보</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.greenOpenSpace}</p>
                    </div>
                  )}
                  {guide.planningLimits.roadAccess && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">진입도로 너비 기준</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.roadAccess}</p>
                    </div>
                  )}
                  {guide.planningLimits.drainagePrevention && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-600 block">배수 및 재해 방지</span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{guide.planningLimits.drainagePrevention}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Core Legal Criteria list */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  핵심 법률 심사 기준 (국토계획법 제58조 연동)
                </h4>
                <div className="space-y-3">
                  {guide.coreCriteria.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-slate-900">{c.title}</h5>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>
                          <ul className="mt-2 space-y-1">
                            {c.details.map((d, di) => (
                              <li key={di} className="text-xs text-slate-700 flex items-start gap-1.5">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSubTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  개발행위허가 신청 시 법정 구비서류
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  국토의 계획 및 이용에 관한 법률 시행규칙 제2조 및 지자체 조례에 따라 허가 신청 시 제출해야 하는 필수 및 복합도서 목록입니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guide.requiredDocuments.map((cat, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded inline-block mb-2.5">
                          {cat.category}
                        </span>
                        <ul className="space-y-2">
                          {cat.items.map((item, ii) => (
                            <li key={ii} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                        ※ 타인 소유 토지인 경우 사용승낙서 및 인감증명서 필수
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSubTab === "procedure" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  개발행위허가 신청부터 준공검사까지 6단계 처리 절차
                </h4>
                <p className="text-xs text-slate-600 mb-5">
                  법정 처리 기한은 접수일로부터 15일 이내이나, 관련 부서 협의·보완 요구·도시계획위원회 심의 기간은 산입되지 않습니다.
                </p>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-blue-200 hidden sm:block">
                  {guide.procedureSteps.map((step) => (
                    <div key={step.step} className="relative flex items-start gap-4 pl-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center z-10 shadow-xs flex-shrink-0 ring-4 ring-white">
                        {step.step}
                      </div>
                      <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{step.name}</span>
                            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {step.actor}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-blue-600">{step.duration}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile version */}
                <div className="sm:hidden space-y-3">
                  {guide.procedureSteps.map((step) => (
                    <div key={step.step} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {step.step}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">{step.duration}</span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 mt-2">{step.name}</h5>
                      <span className="text-[11px] text-slate-600 block mt-0.5">{step.actor}</span>
                      <p className="text-xs text-slate-600 mt-1.5">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSubTab === "exemptions" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  허가 면제 대상 (시행령 제53조 경미한 행위)
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  국토계획법 시행령 제53조에 따라 개발행위허가를 받지 않고 바로 착수할 수 있는 행위입니다.
                  단, 각 지자체 조례에서 경미한 행위 기준을 축소했을 경우 조례가 우선합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guide.exemptionsMinor.map((ex, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm mt-0.5">✓</span>
                    <span className="text-xs text-slate-800 font-medium leading-relaxed">{ex}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>유의사항:</strong> 경미한 행위라 하더라도 농지법상 농지전용, 산지관리법상 산지전용, 또는
                  건축법상 가설건축물 축조신고 등 개별 법률에서 요구하는 별도의 인허가나 신고 의무는 면제되지 않습니다.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local Ordinance Cross-Reference Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">지방자치단체 도시계획 조례 비교표</h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              개발행위허가는 지자체 조례로 경사도, 표고, 입목축적도, 영농성토 허가기준 등을 대폭 강화하여 적용합니다.
            </p>
          </div>

          {/* Region selector buttons */}
          <div className="flex flex-wrap gap-1.5">
            {MAJOR_LOCAL_ORDINANCES.map((ord) => (
              <button
                key={ord.region}
                onClick={() => setSelectedOrdinanceRegion(ord.region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedOrdinanceRegion === ord.region
                    ? "bg-indigo-600 text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {ord.region}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ordinance Details */}
        <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-indigo-200/60">
            <span className="text-sm font-bold text-indigo-950">{activeOrdinance.ordinanceName}</span>
            <span className="text-xs text-indigo-700 font-medium">{activeOrdinance.region} 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-600 block">평균경사도 기준</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{activeOrdinance.keyRestrictions.slopeLimit}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-600 block">표고/고도 제한</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{activeOrdinance.keyRestrictions.elevationLimit}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-600 block">임목축적도</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{activeOrdinance.keyRestrictions.forestDensity}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-600 block">영농성토 조례 기준</span>
              <p className="text-xs font-bold text-rose-700 mt-1">{activeOrdinance.keyRestrictions.agriculturalFillLimit}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs sm:col-span-2">
              <span className="text-[11px] font-semibold text-slate-600 block">태양광 발전시설 이격거리</span>
              <p className="text-xs font-bold text-slate-900 mt-1">{activeOrdinance.keyRestrictions.solarFacilityDistance}</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-950 block mb-1.5">지역별 특화 규제 주의사항:</span>
            <ul className="space-y-1">
              {activeOrdinance.specialNotes.map((note, idx) => (
                <li key={idx} className="text-xs text-indigo-900 flex items-start gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

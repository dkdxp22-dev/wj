import React, { useState } from "react";
import { ZONING_DATA, ACTIVITY_CATEGORIES, STATUTES_LIBRARY } from "../data/legalCriteria";
import { Scale, BookOpen, Layers, Check, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { ZoningCategory } from "../types";

export const LegalReferenceTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"scale" | "minor" | "standards" | "statutes">("scale");
  const [expandedStatuteIdx, setExpandedStatuteIdx] = useState<number | null>(0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          국토계획법 개발행위허가 법령 & 기준표
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          국토의 계획 및 이용에 관한 법률 제56조, 시행령 제51조·제53조·제55조 및 국토교통부 개발행위허가운영지침의 핵심 기준을 한눈에 대조해보세요.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { key: "scale", label: "용도지역별 허가규모 상한", icon: Scale },
          { key: "minor", label: "경미한 행위 (허가면제)", icon: Check },
          { key: "standards", label: "허가 심사 5대 기준", icon: ShieldCheck },
          { key: "statutes", label: "법령 원문 라이브러리", icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: 용도지역별 허가규모 상한 (시행령 제55조) */}
      {activeTab === "scale" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>법적 근거 (시행령 제55조제1항):</strong> 토지의 형질변경 등 개발행위허가는 아래 용도지역별 면적 규모 미만이어야 합니다. 규모를 초과할 경우 도시계획위원회의 심의를 거치거나 지구단위계획을 수립하여야 합니다.
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-3.5">구분</th>
                    <th className="p-3.5">용도지역</th>
                    <th className="p-3.5">법정 허가규모 상한</th>
                    <th className="p-3.5">평수 환산</th>
                    <th className="p-3.5">특이사항 및 심의 요건</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(Object.keys(ZONING_DATA) as ZoningCategory[]).map((key) => {
                    const z = ZONING_DATA[key];
                    const pyeong = (z.maxScaleM2 * 0.3025).toLocaleString(undefined, { maximumFractionDigits: 0 });
                    return (
                      <tr key={key} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-semibold text-slate-500">{z.categoryGroup}</td>
                        <td className="p-3 font-bold text-slate-900">{z.name}</td>
                        <td className="p-3 font-extrabold text-blue-700">
                          {z.maxScaleM2 >= 10000 ? `${z.maxScaleM2 / 10000}만㎡ 미만` : `${z.maxScaleM2 / 1000}천㎡ 미만`}
                        </td>
                        <td className="p-3 text-slate-600">약 {pyeong}평</td>
                        <td className="p-3 text-slate-600">{z.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 경미한 행위 (허가면제) 대조표 (시행령 제53조) */}
      {activeTab === "minor" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
            <strong>법적 근거 (법 제56조제4항, 시행령 제53조):</strong> 아래 기준을 충족하는 행위는 사전 개발행위허가를 받지 않고 착수할 수 있습니다. 단, 도시·군계획조례에서 별도 규정이 있는 경우 조례가 우선합니다.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Layers className="w-4 h-4" />
                토지의 형질변경 경미한 기준 (영 제53조 제3호)
              </div>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>50cm 이내 절·성토:</strong> 높이 50cm 이내 또는 깊이 50cm 이내의 절토·성토·정지 (포장 제외, 지목변경 미수반)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>비도시 660㎡ 이하:</strong> 관리·농림지역에서 660㎡ 이하 토지에 대한 지목변경 없는 절·성토·정지·포장
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>순수 조경:</strong> 조경을 위한 형질변경 (건축물 건축을 위한 부지조성은 제외)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>영농 목적:</strong> 조례로 정하는 농작물 경작 형질변경 (단, 통상 2m 이상 또는 옹벽 축조 시 허가 대상)
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Scale className="w-4 h-4" />
                공작물의 설치 경미한 기준 (영 제53조 제2호)
              </div>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>도시지역 / 지구단위계획구역:</strong> 무게 50톤 이하, 부피 50㎥ 이하, 수평투영면적 25㎡ 이하
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>비도시지역:</strong> 무게 150톤 이하, 부피 150㎥ 이하, 수평투영면적 75㎡ 이하
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>농업용 비닐하우스:</strong> 녹지·관리·농림지역 안 농림어업용 비닐하우스 (철골조 및 육상양식장 제외)
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                토지분할 경미한 기준 (영 제53조 제5호)
              </div>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>사도법에 따른 사도개설허가를 받은 토지의 분할</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>토지의 일부를 공공용지 또는 공용지로 편입하기 위한 분할</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>행정재산 중 용도폐지된 부분의 분할 또는 일반재산 매각·양여를 위한 분할</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>이미 너비 5m 이상으로 분할된 토지의 분할제한면적 이상 분할</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                토석채취 & 물건적치 경미한 기준 (영 제53조 제4호·제6호)
              </div>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>토석채취 (도시):</strong> 면적 25㎡ 이하인 토지에서 부피 50㎥ 이하 채취
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>토석채취 (비도시):</strong> 면적 250㎡ 이하인 토지에서 부피 500㎥ 이하 채취
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>물건적치:</strong> 건축물 울타리 안(대지 안)은 허가 불요, 1개월 미만 불요, 도시 50톤·50㎥·25㎡ 이하 면제
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 허가 심사 5대 기준 (법 제58조) */}
      {activeTab === "standards" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">국토계획법 제58조 개발행위허가의 5대 기준</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              행정청은 개발행위허가 신청이 들어왔을 때 아래 5개 항목을 종합적으로 심사하여 허가 여부를 결정합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "1. 용도지역별 특성에의 적합성 (제1호)",
                desc: "해당 용도지역의 지정 목적에 부합하여야 하며, 법정 개발행위 규모 상한(5천/1만/3만㎡ 미만)을 초과하지 아니할 것.",
              },
              {
                title: "2. 도시·군관리계획 및 성장관리계획 부합성 (제2호)",
                desc: "해당 지역의 도시·군기본계획, 관리계획의 내용에 어긋나지 아니하고, 성장관리계획이 수립되어 있는 경우 그 기준에 맞을 것.",
              },
              {
                title: "3. 도시·군계획사업 시행에 지장 여부 (제3호)",
                desc: "이미 결정·고시된 도시·군계획시설사업, 지구단위계획사업 등 공공계획의 시행에 지장을 주지 아니할 것.",
              },
              {
                title: "4. 주변지역 토지이용·경관과의 조화 (제4호)",
                desc: "주변 지역의 토지이용실태 또는 토지이용계획, 건축물의 높이, 경사도, 수목의 상태, 물의 배수, 하천·호수·습지의 오염 등 주변 환경이나 경관과 조화를 이룰 것.",
              },
              {
                title: "5. 기반시설 확보 및 위해방지 계획 (제5호)",
                desc: "해당 개발행위에 따른 진입도로(통상 너비 4m 이상), 상수도 및 하수도 등 기반시설의 설치나 그에 필요한 용지의 확보계획이 적절할 것. 토사유출·산사태 방지 대책이 마련될 것.",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-blue-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 법령 원문 라이브러리 */}
      {activeTab === "statutes" && (
        <div className="space-y-3">
          {STATUTES_LIBRARY.map((item, idx) => {
            const isExpanded = expandedStatuteIdx === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div
                  onClick={() => setExpandedStatuteIdx(isExpanded ? null : idx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                      {item.articleNo}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <p className="text-xs text-slate-700 leading-relaxed">{item.summary}</p>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {item.fullText}
                    </div>
                    {item.relatedNotes && (
                      <p className="text-[11px] text-blue-800 font-medium">
                        ※ 참고: {item.relatedNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

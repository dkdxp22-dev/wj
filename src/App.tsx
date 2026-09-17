/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Navbar, NavTab } from "./components/Navbar";
import { DiagnosticWizard } from "./components/DiagnosticWizard";
import { AiCaseConsultant } from "./components/AiCaseConsultant";
import { LegalReferenceTable } from "./components/LegalReferenceTable";
import { CaseFaqSection } from "./components/CaseFaqSection";
import { ActivityCriteriaSection } from "./components/ActivityCriteriaSection";
import { LegalSearchAndOrdinance } from "./components/LegalSearchAndOrdinance";
import { InteractiveHero } from "./components/InteractiveHero";
import { ActivityCategory, ZoningCategory } from "./types";
import { Scale, CheckCircle2, ShieldCheck, Sparkles, FileText, AlertCircle } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("wizard");
  const [wizardPreset, setWizardPreset] = useState<{
    category?: ActivityCategory;
    zoning?: ZoningCategory;
    landCategory?: string;
    area?: number;
    step?: number;
  } | null>(null);

  const [aiPresetData, setAiPresetData] = useState<{
    prompt: string;
    activity: string;
    zoning: string;
    size: string;
  }>({
    prompt: "",
    activity: "",
    zoning: "",
    size: "",
  });

  const handleStartDiagnosisFromHero = (options?: {
    category?: ActivityCategory;
    zoning?: ZoningCategory;
    landCategory?: string;
    area?: number;
  }) => {
    if (options) {
      setWizardPreset({
        ...options,
        step: 2, // 바로 상세 조건 검토 단계로 진입
      });
    }
    setCurrentTab("wizard");
    setTimeout(() => {
      const wizardElem = document.getElementById("diagnostic-wizard-section");
      if (wizardElem) {
        wizardElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleGoToAiWithCase = (casePrompt: string, activityType: string, zoning: string, size: string) => {
    setAiPresetData({
      prompt: casePrompt,
      activity: activityType,
      zoning,
      size,
    });
    setCurrentTab("ai");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Interactive Hero Simulator Section */}
      <InteractiveHero
        onStartDiagnosis={handleStartDiagnosisFromHero}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1" id="diagnostic-wizard-section">
        {currentTab === "wizard" && (
          <DiagnosticWizard
            onGoToAiWithCase={handleGoToAiWithCase}
            initialPreset={wizardPreset}
          />
        )}
        {currentTab === "guides" && <ActivityCriteriaSection />}
        {currentTab === "laws" && <LegalSearchAndOrdinance />}
        {currentTab === "ai" && (
          <AiCaseConsultant
            initialPrompt={aiPresetData.prompt}
            initialActivity={aiPresetData.activity}
            initialZoning={aiPresetData.zoning}
            initialSize={aiPresetData.size}
          />
        )}
        {currentTab === "criteria" && <LegalReferenceTable />}
        {currentTab === "faq" && <CaseFaqSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white text-slate-600 border-t border-slate-200 py-8 text-xs print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">국토계획법 개발행위허가 자가진단 솔루션</p>
                <p className="text-slate-500 text-[11px]">
                  국토의 계획 및 이용에 관한 법률 및 국토교통부 개발행위허가운영지침 기반
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-500 font-medium">
              <button
                onClick={() => setCurrentTab("wizard")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                정밀 자가진단
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab("guides")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                행위별 허가기준
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab("laws")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                법령·조례 검색
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab("ai")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                AI 사례 질의
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab("criteria")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                규모 대조표
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab("faq")}
                className="hover:text-blue-600 transition cursor-pointer"
              >
                유권해석 FAQ
              </button>
              <span>·</span>
              <a
                href="https://www.youtube.com/watch?v=7SahfL1xRXY"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-600 transition flex items-center gap-1 font-semibold text-rose-600"
              >
                <span>실무 해설 영상 (YouTube)</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>법적 고지:</strong> 본 서비스의 진단 및 분석 결과는 국토의 계획 및 이용에 관한 법률과 시행령 기준에 따른 사전 참고용 정보이며, 각 지방자치단체 '도시·군계획조례'의 위임 기준(경사도, 표고, 옹벽 설치 기준, 영농성토 높이 등) 및 도로현황, 현지 실측 결과에 따라 실제 행정청(시·군·구청 도시계획과/건축과)의 인허가 판단이 상이할 수 있습니다. 사업 시행 전 반드시 관할 행정청 또는 전문 측량설계사무소와 최종 협의하시기 바랍니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

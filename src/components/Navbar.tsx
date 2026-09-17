import React from "react";
import { Scale, FileCheck, Sparkles, BookOpen, HelpCircle, Layers, Search } from "lucide-react";

export type NavTab = "wizard" | "guides" | "laws" | "ai" | "criteria" | "faq";

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange("wizard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm font-bold flex-shrink-0">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">국토계획법 개발행위허가 판단 솔루션</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  제56조 법령·조례
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                국토의 계획 및 이용에 관한 법률 기준 5대 주요 행위 허가기준·구비서류·절차 및 조례 검색
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
            <button
              onClick={() => onTabChange("wizard")}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "wizard"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>정밀 자가진단</span>
            </button>

            <button
              onClick={() => onTabChange("guides")}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "guides"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>행위별 허가기준·절차</span>
            </button>

            <button
              onClick={() => onTabChange("laws")}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "laws"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>법령·조례 검색</span>
            </button>

            <button
              onClick={() => onTabChange("ai")}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "ai"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI 사례 판정</span>
            </button>

            <button
              onClick={() => onTabChange("criteria")}
              className={`hidden lg:flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "criteria"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>규모 상한표</span>
            </button>

            <button
              onClick={() => onTabChange("faq")}
              className={`flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                currentTab === "faq"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>유권해석 FAQ</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

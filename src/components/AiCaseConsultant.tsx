import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { Sparkles, Send, Loader2, Copy, Check, FileText, HelpCircle, ArrowRight, Wand2 } from "lucide-react";
import { PRESET_CASES, ZONING_DATA, ACTIVITY_CATEGORIES } from "../data/legalCriteria";
import { ActivityCategory, ZoningCategory } from "../types";
import { classifyActivityFromDescription } from "../utils/activityClassifier";

interface AiCaseConsultantProps {
  initialPrompt?: string;
  initialActivity?: string;
  initialZoning?: string;
  initialSize?: string;
}

export const AiCaseConsultant: React.FC<AiCaseConsultantProps> = ({
  initialPrompt = "",
  initialActivity = "",
  initialZoning = "",
  initialSize = "",
}) => {
  const [caseDetails, setCaseDetails] = useState<string>(initialPrompt);
  const [activityType, setActivityType] = useState<string>(initialActivity || "토지의 형질변경 (절토·성토·정지·포장)");
  const [zoning, setZoning] = useState<string>(initialZoning || "자연녹지지역 (1만㎡ 미만)");
  const [landSize, setLandSize] = useState<string>(initialSize || "1,500㎡");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetectingType, setIsDetectingType] = useState<boolean>(false);
  const [detectedHint, setDetectedHint] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialPrompt) {
      setCaseDetails(initialPrompt);
    }
    if (initialActivity) setActivityType(initialActivity);
    if (initialZoning) setZoning(initialZoning);
    if (initialSize) setLandSize(initialSize);
  }, [initialPrompt, initialActivity, initialZoning, initialSize]);

  // 내용 입력 시 행위 유형 자동 판별
  const handleAutoDetectActivity = async () => {
    if (!caseDetails.trim()) return;
    setIsDetectingType(true);
    setDetectedHint(null);

    // 1단계: 룰 기반 즉시 판정
    const localResult = classifyActivityFromDescription(caseDetails);
    setActivityType(localResult.categoryTitle);
    setDetectedHint(`감지: [${localResult.categoryTitle}] (${localResult.matchedKeywords.join(", ")})`);

    // 2단계: AI 판정 호출
    try {
      const resp = await fetch("/api/ai/classify-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: caseDetails, zoning }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.result?.categoryTitle) {
          setActivityType(data.result.categoryTitle);
          setDetectedHint(`AI 판단: [${data.result.categoryTitle}] - ${data.result.reasoning}`);
        }
      }
    } catch {
      // 룰 기반 결과 유지
    } finally {
      setIsDetectingType(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!caseDetails.trim() && !activityType) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseDetails,
          activityType,
          zoning,
          landSize,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "분석 요청 중 서버 오류가 발생했습니다.");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "분석을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPreset = (idx: number) => {
    const p = PRESET_CASES[idx];
    if (!p) return;
    setCaseDetails(p.promptText);
    setActivityType(ACTIVITY_CATEGORIES[p.category].title);
    setZoning(ZONING_DATA[p.zoning].name);
    setLandSize(`${p.landArea.toLocaleString()}㎡`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          국토교통부 지침 & 법제처 유권해석 학습 AI
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          AI 개발행위허가 실사례 법률 분석기
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          복잡한 토지 이용 상황이나 애매한 경계 조건을 일상 언어로 입력하시면, 국토계획법 제56조 및 국토부 지침을 바탕으로 허가 대상 여부와 대처 방안을 심층 분석해 드립니다.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 block mb-2">자주 묻는 실제 질문 예시 (클릭 시 자동 입력):</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_CASES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(idx)}
              className="text-left p-2.5 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs transition"
            >
              <span className="font-bold text-slate-900 block">{preset.title}</span>
              <span className="text-[11px] text-slate-600 block line-clamp-1 mt-0.5">{preset.promptText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        {/* Context Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">개발행위 유형</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            >
              <option value="토지의 형질변경 (절토·성토·정지·포장)">토지의 형질변경 (절토·성토·정지·포장)</option>
              <option value="건축물의 건축 또는 공작물의 설치">건축물의 건축 또는 공작물의 설치</option>
              <option value="토석의 채취">토석의 채취</option>
              <option value="토지분할 (건축물 없는 토지)">토지분할 (건축물 없는 토지)</option>
              <option value="물건을 쌓아놓는 행위 (적치)">물건을 쌓아놓는 행위 (적치)</option>
              <option value="복합 개발행위 (건축+형질변경)">복합 개발행위 (건축+형질변경)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">용도지역</label>
            <select
              value={zoning}
              onChange={(e) => setZoning(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            >
              <option value="자연녹지지역 (1만㎡ 미만)">자연녹지지역 (1만㎡ 미만)</option>
              <option value="생산녹지지역 (1만㎡ 미만)">생산녹지지역 (1만㎡ 미만)</option>
              <option value="보전녹지지역 (5천㎡ 미만)">보전녹지지역 (5천㎡ 미만)</option>
              <option value="계획관리지역 (3만㎡ 미만)">계획관리지역 (3만㎡ 미만)</option>
              <option value="생산관리지역 (3만㎡ 미만)">생산관리지역 (3만㎡ 미만)</option>
              <option value="보전관리지역 (3만㎡ 미만)">보전관리지역 (3만㎡ 미만)</option>
              <option value="농림지역 (3만㎡ 미만)">농림지역 (3만㎡ 미만)</option>
              <option value="주거지역 (1만㎡ 미만)">주거지역 (1만㎡ 미만)</option>
              <option value="상업지역 (1만㎡ 미만)">상업지역 (1만㎡ 미만)</option>
              <option value="공업지역 (3만㎡ 미만)">공업지역 (3만㎡ 미만)</option>
              <option value="자연환경보전지역 (5천㎡ 미만)">자연환경보전지역 (5천㎡ 미만)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">토지/사업 면적</label>
            <input
              type="text"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="예: 1,500㎡ (약 450평)"
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Detailed Case Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-800">
              구체적 개발 내용 및 현장 상황 <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAutoDetectActivity}
              disabled={!caseDetails.trim() || isDetectingType}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-2.5 py-1 rounded-md border border-indigo-200 transition cursor-pointer"
            >
              {isDetectingType ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3 text-indigo-600" />
              )}
              내용 분석 후 행위 유형 자동 판별
            </button>
          </div>
          <textarea
            rows={5}
            value={caseDetails}
            onChange={(e) => setCaseDetails(e.target.value)}
            placeholder="예시: 지목이 답인 토지에 밭농사를 짓기 위해 흙을 1.2미터 높이로 돋우려고 합니다. 인접한 옆 밭보다 높아져서 돌을 쌓아 옹벽(높이 약 1m)을 만들려고 하는데, 영농 목적이어도 허가를 받아야 하나요? 배수로는 어떻게 처리해야 행정처분을 받지 않는지 궁금합니다."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
          />
          {detectedHint && (
            <div className="mt-2 p-2.5 bg-indigo-50/80 rounded-lg border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{detectedHint}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-600 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            현황 지목, 인접 토지와의 고저차, 도로 접도 상태를 적어주시면 더욱 정밀한 답변이 가능합니다.
          </p>

          <button
            type="submit"
            disabled={isLoading || (!caseDetails.trim() && !activityType)}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-md transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                국토계획법령 심층 검토 중...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                AI 전문가 검토의견서 생성
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* Analysis Result Display */}
      {analysis && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-indigo-200 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">국토계획법령 전문 검토의견서</h3>
                <p className="text-xs text-slate-600">
                  근거: 국토계획법 제56조 및 국토교통부 개발행위허가운영지침
                </p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? "복사 완료" : "의견서 복사"}
            </button>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-3 prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-base prose-h3:text-sm prose-p:leading-relaxed prose-li:my-0.5 prose-strong:text-indigo-950">
            <Markdown>{analysis}</Markdown>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg">
            ※ 본 AI 분석 결과는 행정청의 공식 인허가 처분이나 법적 효력을 갖는 유권해석이 아니며, 지자체별 조례 및 세부 현장 여건에 따라 실제 처분 결과가 달라질 수 있으므로 관할 지자체 허가 담당부서와 최종 확인하시기 바랍니다.
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { ActivityCategory } from "../types";
import { classifyActivityFromDescription, ActivityClassificationResult } from "../utils/activityClassifier";
import {
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
  Layers,
  Mountain,
  SplitSquareVertical,
  Boxes,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface ActivityAutoJudgerProps {
  onSelectCategory: (category: ActivityCategory, suggestedDetails?: any, userInputText?: string) => void;
  currentCategory?: ActivityCategory;
  landCategory?: string;
  zoning?: string;
}

const EXAMPLE_PROMPTS = [
  "전(밭)에 농사지으려고 흙을 1.5m 정도 돋우고(성토) 축대 옹벽을 쌓으려고 합니다.",
  "자연녹지지역 토지에 주말농장 관리용 18㎡ 컨테이너 농막을 놓으려고 합니다.",
  "부모님께 물려받은 임야 1필지를 자녀 3명에게 각 1,000㎡씩 필지 분할하고 싶습니다.",
  "공장 옆 공터 800㎡에 건축 철골 자재 및 원자재를 6개월간 야외에 쌓아두려 합니다.",
  "계획관리지역 토지에서 흙과 모래 3,000㎥를 굴착하여 인근 현장으로 반출 판매하려 합니다.",
  "기존 밭에 단독주택 1동 신축 및 마당 콘크리트 포장을 하려고 합니다.",
];

export const ActivityAutoJudger: React.FC<ActivityAutoJudgerProps> = ({
  onSelectCategory,
  currentCategory,
  landCategory,
  zoning,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ActivityClassificationResult | null>(null);
  const [preliminaryHint, setPreliminaryHint] = useState<string>("");
  const [usedAi, setUsedAi] = useState<boolean>(false);

  const getIcon = (cat: ActivityCategory) => {
    switch (cat) {
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

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze ?? inputText).trim();
    if (!text) return;

    // 1단계: 즉각적인 고속 규칙 기반 분석
    const ruleResult = classifyActivityFromDescription(text);
    setResult(ruleResult);
    setUsedAi(false);
    setPreliminaryHint("");

    // 2단계: 백그라운드 AI 심층 검증 호출 (서버가 켜져 있으면 심층 분류 수행)
    setIsAiLoading(true);
    try {
      const resp = await fetch("/api/ai/classify-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          landCategory,
          zoning,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.result && data.result.primaryCategory) {
          setResult({
            primaryCategory: data.result.primaryCategory,
            categoryTitle: data.result.categoryTitle,
            confidence: data.result.confidence || 90,
            secondaryCategories: data.result.secondaryCategories || [],
            reasoning: data.result.reasoning || ruleResult.reasoning,
            matchedKeywords: data.result.matchedKeywords || ruleResult.matchedKeywords,
            suggestedInputs: data.result.suggestedInputs || ruleResult.suggestedInputs,
            keyLegalBasis: data.result.keyLegalBasis || ruleResult.keyLegalBasis,
          });
          if (data.result.preliminaryVerdictHint) {
            setPreliminaryHint(data.result.preliminaryVerdictHint);
          }
          setUsedAi(true);
        }
      }
    } catch (e) {
      // 오프라인이거나 API 오류 시에도 ruleResult로 원활히 동작
      console.log("AI Classifier fallback to rules:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onSelectCategory(result.primaryCategory, result.suggestedInputs, inputText);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-slate-50 p-5 sm:p-6 rounded-2xl border border-blue-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              개발 내용으로 행위 유형 자동 판별
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                국토계획법 제56조 제1항
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              하고자 하는 토지 이용·공사 계획을 자연어로 자유롭게 입력하시면 법정 5대 행위 유형 중 어디에 해당하는지 즉시 판단해 드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            placeholder="예: '밭에 흙을 1.5m 돋우고 축대를 쌓으려 함', '컨테이너 농막 20㎡ 설치', '밭을 3필지로 쪼개기', '공터에 건축자재 6개월간 야적' 등"
            className="w-full p-3.5 pr-28 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-slate-600 bg-white shadow-inner resize-none font-medium leading-relaxed"
          />
          <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={!inputText.trim() || isAiLoading}
              className="inline-flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  판단 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  유형 판단
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            예시 클릭:
          </span>
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(prompt);
                handleAnalyze(prompt);
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 transition cursor-pointer text-left truncate max-w-[280px]"
              title={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="p-4 bg-white rounded-xl border-2 border-blue-300 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                {getIcon(result.primaryCategory)}
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {result.keyLegalBasis}
                </span>
                <h4 className="text-base font-black text-slate-900 mt-0.5">
                  판단 결과: <span className="text-blue-600">[{result.categoryTitle}]</span>
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] text-slate-600 block">판단 적합도</span>
                <span className="text-xs font-black text-blue-700">{result.confidence}%</span>
              </div>
              {usedAi && (
                <span className="text-[10px] px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> AI 정밀검증
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <strong>판단 근거:</strong> {result.reasoning}
            </p>

            {result.matchedKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold">감지된 핵심 키워드:</span>
                {result.matchedKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px]">
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {result.secondaryCategories && result.secondaryCategories.length > 0 && (
              <div className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>복합 행위 유의:</strong> 본 계획은 [토지의 형질변경]과 [건축물의 건축] 등이 동시에 수반되는 복합 개발행위일 수 있어, 주된 행위 기준 허가 시 타 행위가 일괄 의제협의 처리될 수 있습니다.
                </span>
              </div>
            )}

            {preliminaryHint && (
              <div className="text-blue-900 bg-blue-50/70 p-2.5 rounded-lg border border-blue-200 text-[11px] leading-relaxed">
                <strong>💡 법적 사전 힌트:</strong> {preliminaryHint}
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              아래 버튼을 누르면 해당 행위 유형이 자동 지정되고 다음 진단 단계로 즉시 이동합니다.
            </span>
            <button
              type="button"
              onClick={handleApply}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <span>이 유형으로 바로 자가진단 계속하기</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

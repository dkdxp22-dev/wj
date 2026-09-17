import React, { useState } from "react";
import { FAQ_DATA } from "../data/legalCriteria";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb, Play, ExternalLink } from "lucide-react";

export const CaseFaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "faq-1": true });

  const categories = ["ALL", ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];

  const filteredFaqs =
    selectedCategory === "ALL" ? FAQ_DATA : FAQ_DATA.filter((f) => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          자주 묻는 질문 & 행정 유권해석
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          국토교통부 질의회신집, 법제처 법령해석례, 대법원 주요 판결에 기초하여 가장 분쟁이 잦은 쟁점을 정리했습니다.
        </p>
      </div>

      {/* Featured YouTube Video Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                개발행위허가 실무 해설 & 강의 영상
              </h3>
              <p className="text-xs text-slate-500">
                복잡한 법령 조항과 실무 사례를 알기 쉽게 설명한 추천 영상입니다
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/watch?v=7SahfL1xRXY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
          >
            <span>YouTube 바로가기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7SahfL1xRXY"
            title="개발행위허가 실무 해설 영상"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat === "ALL" ? "전체 보기" : cat}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div key={faq.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 block mb-1">{faq.category}</span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{faq.question}</h3>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3.5">
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-9">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>

                  <div className="ml-9 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      관련 법조항 및 유권해석 근거:
                    </div>
                    <p className="text-slate-600 pl-5">{faq.statuteReference}</p>

                    <div className="flex items-start gap-1.5 font-bold text-amber-900 pt-1 border-t border-slate-100 mt-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      실무 대처 팁:
                    </div>
                    <p className="text-slate-700 pl-5 leading-relaxed">{faq.practicalTip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

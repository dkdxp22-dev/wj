import React, { useState, useMemo } from "react";
import { SEARCHABLE_LAWS, MAJOR_LOCAL_ORDINANCES } from "../data/detailedPermissionData";
import { SearchableLawItem } from "../types";
import {
  Search,
  BookOpen,
  MapPin,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Building,
} from "lucide-react";

export const LegalSearchAndOrdinance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHierarchy, setSelectedHierarchy] = useState<string>("ALL");
  const [expandedLawId, setExpandedLawId] = useState<string | null>("law-56");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered law statutes
  const filteredLaws = useMemo(() => {
    return SEARCHABLE_LAWS.filter((item) => {
      const matchHierarchy = selectedHierarchy === "ALL" || item.hierarchy === selectedHierarchy;
      if (!matchHierarchy) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inArticle = item.article.toLowerCase().includes(q);
      const inTitle = item.title.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      const inSummary = item.summary.toLowerCase().includes(q);
      const inFull = item.fullText.toLowerCase().includes(q);
      return inArticle || inTitle || inKeywords || inSummary || inFull;
    });
  }, [searchQuery, selectedHierarchy]);

  // Filtered ordinances
  const filteredOrdinances = useMemo(() => {
    if (selectedCity === "ALL") return MAJOR_LOCAL_ORDINANCES;
    return MAJOR_LOCAL_ORDINANCES.filter((o) => o.region.includes(selectedCity));
  }, [selectedCity]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              개발행위허가 법령·시행령·시행규칙·조례 통합 검색기
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              국토의 계획 및 이용에 관한 법률 및 시행령·시행규칙 조문, 경미한 행위(영 제53조), 허가규모(영 제55조), 지자체 조례 기준을 검색하세요.
            </p>
          </div>

          {/* Quick Keyword Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-600 font-semibold mr-1">추천 검색:</span>
            {["경미한 행위", "성토", "토지분할", "건폐율", "옹벽", "진입도로", "응급조치"].map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchQuery(kw)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition cursor-pointer"
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & Hierarchy Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="조문 번호(예: 제56조, 영 제53조), 키워드(예: 50cm, 맹지, 절토, 용적률) 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100"
              >
                초기화
              </button>
            )}
          </div>

          {/* Hierarchy Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            {["ALL", "법률", "시행령", "시행규칙", "조례/지침"].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHierarchy(h)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedHierarchy === h
                    ? "bg-white text-blue-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {h === "ALL" ? "전체 법령" : h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Law Search Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-semibold">
          <span>
            검색 결과: <strong className="text-blue-700 font-bold">{filteredLaws.length}</strong>건의 법조문
          </span>
          {searchQuery && <span>"{searchQuery}" 키워드 검색 중</span>}
        </div>

        {filteredLaws.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-semibold text-sm">일치하는 법조문 또는 조례 규정이 없습니다.</p>
            <p className="text-xs text-slate-400">검색어를 단순화하거나 다른 키워드(예: 56조, 경미, 성토)로 검색해 보세요.</p>
          </div>
        ) : (
          filteredLaws.map((law) => {
            const isExpanded = expandedLawId === law.id;
            return (
              <div
                key={law.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                  isExpanded ? "border-blue-500 ring-1 ring-blue-400" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  onClick={() => setExpandedLawId(isExpanded ? null : law.id)}
                  className="p-4 sm:p-5 flex items-start justify-between cursor-pointer hover:bg-slate-50/70 transition gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          law.hierarchy === "법률"
                            ? "bg-blue-100 text-blue-800"
                            : law.hierarchy === "시행령"
                            ? "bg-indigo-100 text-indigo-800"
                            : law.hierarchy === "시행규칙"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {law.hierarchy}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{law.article}</span>
                      <span className="text-xs font-semibold text-blue-900">{law.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{law.summary}</p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {law.keywords.map((k) => (
                        <span key={k} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/60 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          법령 원문 내용
                        </span>
                        <button
                          onClick={() => handleCopyText(law.id, law.fullText)}
                          className="text-[11px] text-slate-600 hover:text-blue-600 flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 transition"
                        >
                          {copiedId === law.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">복사 완료</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>조문 복사</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-wrap text-slate-800 leading-relaxed shadow-2xs">
                        {law.fullText}
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950">
                      <strong className="font-bold text-blue-900 block mb-1">실무 해석 및 적용 주의점:</strong>
                      {law.practicalImplication}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Local Ordinances Reference Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              지방자치단체별 도시·군계획 조례 특화 기준 모음
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              국토계획법 제56조 및 영 제53조 단서에 따라 각 시·군 도시계획조례는 개발행위허가 기준을 다르게 정하고 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">지역 필터:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-medium bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="ALL">전체 지역 보기</option>
              <option value="용인">용인시</option>
              <option value="화성">화성시</option>
              <option value="춘천">춘천시</option>
              <option value="천안">천안시</option>
              <option value="제주">제주특별자치도</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrdinances.map((ord) => (
            <div
              key={ord.region}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{ord.region}</span>
                  <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium">
                    도시계획조례
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-600 mb-3">{ord.ordinanceName}</h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">평균경사도 상한:</span>
                    <span className="font-bold text-slate-800">{ord.keyRestrictions.slopeLimit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">표고(고도) 제한:</span>
                    <span className="font-bold text-slate-800">{ord.keyRestrictions.elevationLimit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">영농성토 허가기준:</span>
                    <span className="font-bold text-rose-700">{ord.keyRestrictions.agriculturalFillLimit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">태양광 이격거리:</span>
                    <span className="font-medium text-slate-800">{ord.keyRestrictions.solarFacilityDistance}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">핵심 특이사항:</span>
                <ul className="space-y-1">
                  {ord.specialNotes.map((n, ni) => (
                    <li key={ni} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <span className="text-blue-500">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

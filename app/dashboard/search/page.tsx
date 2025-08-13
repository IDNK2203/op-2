"use client";

import { useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, FileText, StickyNote, TrendingUp, Clock } from "lucide-react";

export default function SearchPage() {
  const [results, setResults] = useState<
    typeof api.search.searchAction._returnType
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#35174D]">
            AI-Powered Search
          </h1>
        </div>
        <p className="text-[#35174D]/60 max-w-2xl mx-auto">
          Search across all your documents and notes using natural language.
          Find exactly what you need with intelligent semantic search.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#35174D]/10 p-6 shadow-sm">
          <SearchForm
            setResults={(results) => {
              setResults(results);
              setHasSearched(true);
            }}
          />

          {/* Search Tips */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[#35174D]/50">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Try: &quot;compliance policies&quot;</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Recent: &quot;audit requirements&quot;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="max-w-4xl mx-auto">
          {Array.isArray(results) && results.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#35174D] mb-2">
                Search Results ({results.length})
              </h2>
              <p className="text-[#35174D]/60">
                Found {results.length} relevant{" "}
                {results.length === 1 ? "result" : "results"}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {Array.isArray(results) ? (
              results.length > 0 ? (
                results.map((result, i) => {
                  if (result.type === "note") {
                    return (
                      <Link href={`/dashboard/notes/${result._id}`} key={i}>
                        <div className="bg-white rounded-xl border border-[#35174D]/10 p-6 hover:border-[#A34280]/30 hover:shadow-md transition-all duration-200 group cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#62AE6E]/20 to-[#9CB18B]/20 rounded-lg flex items-center justify-center group-hover:from-[#62AE6E]/30 group-hover:to-[#9CB18B]/30 transition-colors">
                              <StickyNote className="w-5 h-5 text-[#62AE6E]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-[#62AE6E] bg-[#62AE6E]/10 px-2 py-1 rounded-full">
                                  Note
                                </span>
                                <span className="text-xs text-[#35174D]/50">
                                  Match score: {Math.round(result.score * 100)}%
                                </span>
                              </div>
                              <div className="text-[#35174D] leading-relaxed">
                                {result.text.length > 300
                                  ? result.text.substring(0, 300) + "..."
                                  : result.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  } else {
                    return (
                      <Link href={`/dashboard/documents/${result._id}`} key={i}>
                        <div className="bg-white rounded-xl border border-[#35174D]/10 p-6 hover:border-[#A34280]/30 hover:shadow-md transition-all duration-200 group cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#A34280]/20 to-[#35174D]/20 rounded-lg flex items-center justify-center group-hover:from-[#A34280]/30 group-hover:to-[#35174D]/30 transition-colors">
                              <FileText className="w-5 h-5 text-[#A34280]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-[#A34280] bg-[#A34280]/10 px-2 py-1 rounded-full">
                                  Document
                                </span>
                                <span className="text-xs text-[#35174D]/50">
                                  Match score: {Math.round(result.score * 100)}%
                                </span>
                              </div>
                              <h3 className="font-semibold text-[#35174D] mb-2 group-hover:text-[#A34280] transition-colors">
                                {result.title}
                              </h3>
                              {result.description && (
                                <p className="text-[#35174D]/70 leading-relaxed">
                                  {result.description.length > 200
                                    ? result.description.substring(0, 200) +
                                      "..."
                                    : result.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#35174D]/5 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Search className="w-8 h-8 text-[#35174D]/40" />
                  </div>
                  <h3 className="text-lg font-medium text-[#35174D] mb-2">
                    No results found
                  </h3>
                  <p className="text-[#35174D]/60">
                    Try different keywords or check your spelling. You can also
                    search with natural language questions.
                  </p>
                </div>
              )
            ) : (
              results && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 text-red-700">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Search Error</h3>
                      <p className="text-sm">
                        {typeof results === "object" && "message" in results
                          ? (results as { message: string }).message
                          : "An unexpected error occurred while searching"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Empty State - Show when no search has been performed */}
      {!hasSearched && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#A34280]/10 to-[#35174D]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Search className="w-10 h-10 text-[#A34280]" />
          </div>
          <h3 className="text-xl font-semibold text-[#35174D] mb-3">
            Discover your content with AI search
          </h3>
          <p className="text-[#35174D]/60 mb-8">
            Use natural language to find information across all your documents
            and notes. Try asking questions like &quot;What are our data
            retention policies?&quot; or &quot;Show me compliance audits from
            last quarter.&quot;
          </p>

          {/* Example Searches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-lg border border-[#35174D]/10 p-4">
              <h4 className="font-medium text-[#35174D] mb-2">
                Example searches:
              </h4>
              <ul className="text-sm text-[#35174D]/60 space-y-1">
                <li>• &quot;GDPR compliance requirements&quot;</li>
                <li>• &quot;Security audit checklist&quot;</li>
                <li>• &quot;Data breach procedures&quot;</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-[#35174D]/10 p-4">
              <h4 className="font-medium text-[#35174D] mb-2">Search tips:</h4>
              <ul className="text-sm text-[#35174D]/60 space-y-1">
                <li>• Ask natural language questions</li>
                <li>• Use specific terminology</li>
                <li>• Search works across all content</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchPage() {
  const [results, setResults] = useState<
    typeof api.search.searchAction._returnType
  >([]);

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>

      <SearchForm setResults={setResults} />

      <ul className="flex flex-col gap-4">
        {Array.isArray(results)
          ? results.map((result, i) => {
              if (result.type === "note") {
                return (
                  <Link href={`/dashboard/notes/${result._id}`} key={i}>
                    <li className="hover:bg-slate-700 bg-slate-800 rounded p-4 whitespace-pre-line">
                      type: Note {result.score}
                      {result.text.substring(0, 500) + "..."}
                    </li>
                  </Link>
                );
              } else {
                return (
                  <Link href={`/dashboard/documents/${result._id}`} key={i}>
                    <li className="hover:bg-slate-700 bg-slate-800 rounded p-4 whitespace-pre-line">
                      type: Document {result.score}
                      {result.title}
                      {result.description}
                    </li>
                  </Link>
                );
              }
            })
          : results && (
              <li className="text-red-500 p-4 bg-slate-800 rounded">
                Error:{" "}
                {typeof results === "object" && "message" in results
                  ? (results as { message: string }).message
                  : "Unknown error"}
              </li>
            )}
      </ul>
    </main>
  );
}

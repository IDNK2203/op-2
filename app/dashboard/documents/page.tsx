"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocumentCard from "./document-card";
import CreateDocumentBtn from "./create-document-btn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import NotFound from "../../../public/images/not-found-home.svg";
import { FileText } from "lucide-react";

export default function Home() {
  const fetchedDocs = useQuery(api.documents.fetchDocument);
  console.log("fetchedDocs", fetchedDocs);
  // states loading undefined, empty [], not-empty, error null

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#35174D] flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Documents
          </h1>
          <p className="text-[#35174D]/60 mt-1">
            Manage and organize your compliance documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          {/* <div className="hidden sm:flex items-center gap-2 bg-white border border-[#35174D]/10 rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-[#35174D]/40" />
            <input
              type="text"
              placeholder="Search documents..."
              className="flex-1 text-sm bg-transparent text-[#35174D] placeholder-[#35174D]/40 focus:outline-none"
            />
          </div> */}

          <CreateDocumentBtn />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#35174D]/60">Total Documents</p>
              <p className="text-2xl font-bold text-[#35174D]">
                {fetchedDocs?.length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#A34280]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#A34280]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#35174D]/60">This Month</p>
              <p className="text-2xl font-bold text-[#35174D]">
                {fetchedDocs?.filter((doc) => {
                  const docDate = new Date(doc._creationTime);
                  const thisMonth = new Date();
                  return (
                    docDate.getMonth() === thisMonth.getMonth() &&
                    docDate.getFullYear() === thisMonth.getFullYear()
                  );
                }).length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#E7B627]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#E7B627]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#35174D]/60">Categories</p>
              <p className="text-2xl font-bold text-[#35174D]">
                {(() => {
                  if (!fetchedDocs) return 0;

                  // Dummy category list
                  const dummyCategories = [
                    "Legal",
                    "Financial",
                    "Insurance",
                    "HR",
                    "Operations",
                  ];

                  // Assign random categories to simulate
                  const docsWithCats = fetchedDocs.map((doc) => ({
                    ...doc,
                    category:
                      dummyCategories[
                        Math.floor(Math.random() * dummyCategories.length)
                      ],
                  }));

                  // Get unique category count
                  const uniqueCats = new Set(
                    docsWithCats.map((doc) => doc.category)
                  );
                  return uniqueCats.size;
                })()}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#4C6EF5]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#4C6EF5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div>
        {typeof fetchedDocs === "undefined" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {new Array(6).fill("").map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {fetchedDocs && fetchedDocs?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedDocs?.map((el, i) => (
              <DocumentCard key={i} document={el} />
            ))}
          </div>
        )}

        {fetchedDocs && fetchedDocs?.length < 1 && <EmptyState />}
      </div>
    </div>
  );
}

const EmptyState = () => (
  <div className="flex flex-col justify-center items-center w-full">
    <div className="max-w-xl flex justify-center relative max-">
      <Image alt="child savings avatar" src={NotFound} className="" />{" "}
    </div>
    <div className=" my-4">
      <h2>You don&apos;t have any document</h2>
    </div>
    {/* <CreateDocumentBtn /> */}
  </div>
);

const CardSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <div className="animate-pulse space-y-4 ">
          <div className=" bg-slate-700 w-full h-6"></div>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="animate-pulse space-y-4 ">
        <div className=" bg-slate-700 w-full h-6"></div>
        <div className=" bg-slate-700 w-full h-6"></div>
      </div>
    </CardContent>
    <CardFooter>
      <div className="animate-pulse space-y-4 ">
        <div className=" bg-slate-700 w-12 h-6"></div>
      </div>
    </CardFooter>
  </Card>
);

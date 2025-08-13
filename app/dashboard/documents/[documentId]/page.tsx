"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { ChatPanel } from "./chat-panel";
import {
  Loader2,
  FileText,
  MessageSquare,
  Calendar,
  Download,
  Share,
  X,
} from "lucide-react";
import DeleteDocumentBtn from "@/app/dashboard/documents/delete-document-btn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SingleDocumentPage({
  params,
}: {
  params: Promise<{ documentId: Id<"document"> }>;
}) {
  const { documentId } = React.use(params);
  const document = useQuery(api.documents.fetchDocumentById, { documentId });

  if (typeof document === "undefined")
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-[#A34280] mb-4" />
        <p className="text-[#35174D]">Loading document...</p>
      </div>
    );

  if (!document)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <FileText className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-[#35174D]">Document not found or deleted.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {/* Left: Icon + Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#35174D]">
                {document.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#35174D]/60 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(document._creationTime).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#62AE6E] rounded-full"></div>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" /> Share
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  className="bg-[#A34280] hover:bg-[#8c366e] text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat with Document
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[500px] p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex justify-between items-center border-b p-4">
                  <h2 className="text-lg font-semibold text-[#35174D]">
                    AI Chat
                  </h2>
                  <X className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>
                <ChatPanel id={documentId} />
              </SheetContent>
            </Sheet>
            <DeleteDocumentBtn id={documentId} />
          </div>
        </div>

        {/* Optional Description */}
        {document.description && (
          <div className="mt-4 p-4 bg-[#35174D]/5 rounded-lg text-[#35174D]/70">
            {document.description}
          </div>
        )}
      </div>

      {/* Document Viewer */}
      <div className="bg-gray-50 p-6 rounded-xl border border-[#35174D]/10">
        {document?.documentUrl ? (
          <div className="shadow-lg border bg-white rounded-lg overflow-hidden">
            <iframe
              className="w-full h-[700px]"
              src={document.documentUrl}
              title="Document Viewer"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-[#35174D]/60">
            <FileText className="w-12 h-12 mr-2" />
            Document preview not available
          </div>
        )}
      </div>
    </div>
  );
}

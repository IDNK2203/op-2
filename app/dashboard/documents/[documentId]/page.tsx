"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import DeleteDocumentBtn from "@/app/dashboard/documents/delete-document-btn";
import { Button } from "@/components/ui/button";

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
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-[#A34280] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#35174D] mb-2">
            Loading document...
          </h3>
          <p className="text-[#35174D]/60">
            Please wait while we fetch your document.
          </p>
        </div>
      </div>
    );

  if (!document)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-[#35174D] mb-2">
            Document not found
          </h3>
          <p className="text-[#35174D]/60">
            You don&apos;t have access to this document or it may have been
            deleted.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#35174D] mb-2">
                {document.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#35174D]/60">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Added{" "}
                    {new Date(document._creationTime).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#62AE6E] rounded-full"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#35174D]/20 text-[#35174D] hover:bg-[#35174D]/5"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#35174D]/20 text-[#35174D] hover:bg-[#35174D]/5"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <DeleteDocumentBtn id={documentId} />
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="mt-4 p-4 bg-[#35174D]/5 rounded-lg">
            <p className="text-[#35174D]/70 leading-relaxed">
              {document.description}
            </p>
          </div>
        )}
      </div>

      {/* Tabs Content */}
      <div className="bg-white rounded-xl border border-[#35174D]/10 overflow-hidden">
        <Tabs defaultValue="document" className="w-full">
          <div className="border-b border-[#35174D]/10 px-6">
            <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
              <TabsTrigger
                value="document"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-[#A34280] data-[state=active]:border-b-2 data-[state=active]:border-[#A34280] rounded-none py-4"
              >
                <FileText className="w-4 h-4" />
                Document View
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:text-[#A34280] data-[state=active]:border-b-2 data-[state=active]:border-[#A34280] rounded-none py-4"
              >
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="document" className="m-0">
            {document?.documentUrl ? (
              <div className="h-[700px] w-full">
                <iframe
                  className="w-full h-full border-0"
                  src={document.documentUrl}
                  title="Document Viewer"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-[#35174D]/60">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-[#35174D]/40" />
                  <p>Document preview not available</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="m-0">
            <div className="h-[700px]">
              <ChatPanel id={documentId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

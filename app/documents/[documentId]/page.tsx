"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { ChatPanel } from "./chat-panel";
import { Loader2 } from "lucide-react";
import DeleteDocumentBtn from "@/app/delete-document-btn";

export default function SingleDocumentPage({
  params,
}: {
  params: Promise<{ documentId: Id<"document"> }>;
}) {
  const { documentId } = React.use(params);

  // console.log(documentId);
  const document = useQuery(api.documents.fetchDocumentById, { documentId });
  //   const fetchedDocs = useQuery(api.documents.fetchDocument);

  // {typeof fetchedDocs === "undefined" &&
  // new Array(8).fill("").map((_, i) => <CardSkeleton key={i} />)}
  if (typeof document === "undefined")
    return (
      <section className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-10" />
      </section>
    );

  if (!document)
    return (
      <section className="flex justify-center items-center h-screen">
        <div>You don have access to this document.</div>
      </section>
    );

  // if (!document) return <div>You don have access to this document.</div>;

  return (
    <>
      <section className="container max-w-7xl mx-auto p-4 flex items-center justify-between mt-10">
        <h1 className="text-3xl">My {document?.title}</h1>
        <DeleteDocumentBtn id={documentId} />
      </section>
      <section className="container  max-w-7xl mx-auto p-4 flex flex-grow gap-6 ">
        <Tabs defaultValue="document" className="w-full max-w-4xl ">
          <TabsList>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="document">
            {document?.documentUrl && (
              <div className="bg-gray-900 h-[600px]">
                <iframe className="w-full h-full" src={document?.documentUrl} />
              </div>
            )}
          </TabsContent>
          <TabsContent value="chat">
            <ChatPanel id={documentId} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}

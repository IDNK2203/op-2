"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

export default function SingleDocumentPage({
  params,
}: {
  params: Promise<{ documentId: Id<"document"> }>;
}) {
  const { documentId } = React.use(params);

  console.log(documentId);
  const document = useQuery(api.documents.fetchDocumentById, { documentId });
  //   const fetchedDocs = useQuery(api.documents.fetchDocument);

  if (!document) return <div>You don have access to this document.</div>;

  return (
    <>
      <section className="container mx-auto p-4 flex items-center justify-between mt-10">
        <h1 className="text-3xl">My {document?.title}</h1>
      </section>
      <section className="container mx-auto p-4 flex flex-grow gap-6 h-[600px]">
        {document?.documentUrl && (
          <div className="bg-gray-900 basis-4/6 h-full">
            <iframe className="w-full h-full" src={document?.documentUrl} />
          </div>
        )}
        <div className="basis-2/6 bg-gray-900 h-full"></div>
      </section>
    </>
  );
}

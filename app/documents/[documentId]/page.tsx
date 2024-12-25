"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
// import DocumentCard from "./document-card";
// import CreateDocumentBtn from "./create-document-btn";

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
    <div>
      <section className="container mx-auto p-4 flex items-center justify-between mt-10">
        <h1 className="text-3xl">My {document?.title}</h1>
        {/* <CreateDocumentBtn /> */}
      </section>
      <section className="container mx-auto p-4 grid grid-cols-4 gap-4">
        {/* {fetchedDocs?.map((el, i) => <DocumentCard key={i} document={el} />)} */}
      </section>
    </div>
  );
}

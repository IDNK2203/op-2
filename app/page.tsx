"use client";

import Header from "./header";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocumentCard from "./document-card";
import CreateDocumentBtn from "./create-document-btn";

export default function Home() {
  const fetchedDocs = useQuery(api.documents.fetchDocument);
  return (
    <main className="bg-background items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      <section className="container mx-auto p-4 flex items-center justify-between mt-10">
        <h1 className="text-3xl">My Documents </h1>
        <CreateDocumentBtn />
      </section>
      <section className="container mx-auto p-4 grid grid-cols-4 gap-4">
        {fetchedDocs?.map((el, i) => <DocumentCard key={i} document={el} />)}
      </section>
    </main>
  );
}

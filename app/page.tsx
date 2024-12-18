"use client";

// import { api } from "@/convex/_generated/api";

import Header from "./header";

export default function Home() {
  // const clickMeCaller = useMutation(api.documents.createDocument);
  // const fetchedDocs = useQuery(api.documents.fetchDocument);
  return (
    <main className="bg-background items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
    </main>
  );
}

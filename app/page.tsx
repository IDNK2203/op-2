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
import NotFound from "../public/images/not-found-home.svg";

export default function Home() {
  const fetchedDocs = useQuery(api.documents.fetchDocument);
  // states loading undefined, empty [], not-empty, error null

  return (
    <>
      <section className="container max-w-7xl mx-auto p-4 flex items-center justify-between mt-10">
        <h1 className="text-3xl">My Documents </h1>
        <CreateDocumentBtn />
      </section>
      <section className="container max-w-7xl mx-auto p-4 grid grid-cols-4 gap-4">
        {typeof fetchedDocs === "undefined" &&
          new Array(8).fill("").map((_, i) => <CardSkeleton key={i} />)}
        {fetchedDocs &&
          fetchedDocs?.length > 0 &&
          fetchedDocs?.map((el, i) => <DocumentCard key={i} document={el} />)}
      </section>
      {fetchedDocs && fetchedDocs?.length < 1 && <EmptyState />}
    </>
  );
}

const EmptyState = () => (
  <div className="flex flex-col justify-center items-center w-full">
    <div className="w-1/2 flex justify-center relative">
      <Image alt="child savings avatar" src={NotFound} className="" />{" "}
    </div>
    <div className=" my-4">
      <h2>You don`&apos;`t have any document</h2>
    </div>
    <CreateDocumentBtn />
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

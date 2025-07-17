"use client";

import { ReactNode } from "react";
import CreateNoteButton from "./create-note-btn";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Image from "next/image";
import NotFound from "../../../public/images/not-found-home.svg";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const notes = useQuery(api.notes.fetchNote);
  const { noteId } = useParams<{ noteId: Id<"note"> }>(); // Assuming you have a way to get the current note ID, e.g., from URL params

  const hasNotes = notes && notes.length > 0;

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Notes</h1>
        <CreateNoteButton />
      </div>
      {hasNotes && (
        <div className="flex gap-12">
          <ul className="space-y-2 w-[300px]">
            {notes?.map((note) => (
              <li
                key={note._id}
                className={cn("text-base hover:text-cyan-100", {
                  "text-cyan-300": note._id === noteId,
                })}
              >
                <Link href={`/dashboard/notes/${note._id}`}>
                  {note.text.substring(0, 24) + "..."}
                </Link>
              </li>
            ))}
          </ul>

          <div className="w-full">{children}</div>
        </div>
      )}
      {!hasNotes && <EmptyState />}
    </main>
  );
}

const EmptyState = () => (
  <div className="flex flex-col justify-center items-center w-full">
    <div className="max-w-xl flex justify-center relative max-">
      <Image alt="child savings avatar" src={NotFound} className="" />{" "}
    </div>
    <div className=" my-4">
      <h2>You don&apos;t have any notes</h2>
    </div>
    {/* <CreateDocumentBtn /> */}
  </div>
);

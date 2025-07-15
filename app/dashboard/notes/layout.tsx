"use client";

import { ReactNode } from "react";
import CreateNoteButton from "./create-note-btn";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const notes = useQuery(api.notes.fetchNote);
  const { noteId } = useParams<{ noteId: Id<"note"> }>(); // Assuming you have a way to get the current note ID, e.g., from URL params

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Notes</h1>
        <CreateNoteButton />
      </div>

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

        <div className="bg-slate-800 rounded p-4 w-full">{children}</div>
      </div>
    </main>
  );
}

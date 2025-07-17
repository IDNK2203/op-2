"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import DeleteNoteBtn from "../delete-note-btn";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: Id<"note"> }>();
  const note = useQuery(api.notes.fetchNoteById, {
    noteId: noteId,
  });
  if (!note) {
    return null;
  }

  return (
    <div className="relative bg-slate-800 rounded p-4 w-full ">
      <DeleteNoteBtn id={note._id} />

      <div className="pr-3 whitespace-pre-line">{note?.text}</div>
    </div>
  );
}

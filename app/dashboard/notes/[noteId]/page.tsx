"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: Id<"note"> }>();
  const note = useQuery(api.notes.fetchNoteById, {
    noteId: noteId,
  });

  return <div>{note?.text}</div>;
}

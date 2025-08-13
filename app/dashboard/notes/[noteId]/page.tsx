"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import DeleteNoteBtn from "../delete-note-btn";
import { StickyNote, Calendar, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: Id<"note"> }>();
  const note = useQuery(api.notes.fetchNoteById, {
    noteId: noteId,
  });

  if (!note) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#35174D]/5 rounded-full flex items-center justify-center mb-4 mx-auto">
            <StickyNote className="w-6 h-6 text-[#35174D]/40" />
          </div>
          <h3 className="text-lg font-medium text-[#35174D] mb-2">
            Note not found
          </h3>
          <p className="text-[#35174D]/60">
            This note may have been deleted or you don&#39;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#35174D]/10 overflow-hidden">
      {/* Note Header */}
      <div className="border-b border-[#35174D]/10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#62AE6E] to-[#9CB18B] rounded-xl flex items-center justify-center">
              <StickyNote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#35174D] mb-2">
                {note.text.split("\n")[0].substring(0, 50)}
                {note.text.split("\n")[0].length > 50 && "..."}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#35174D]/60">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created{" "}
                    {new Date(note._creationTime).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#62AE6E] rounded-full"></div>
                  <span>{note.text.length} characters</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#35174D]/20 text-[#35174D] hover:bg-[#35174D]/5"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <DeleteNoteBtn id={note._id} />
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="text-[#35174D] leading-relaxed whitespace-pre-wrap font-normal">
            {note.text}
          </div>
        </div>
      </div>

      {/* Note Footer */}
      <div className="border-t border-[#35174D]/10 px-6 py-4 bg-[#35174D]/5">
        <div className="flex items-center justify-between text-sm text-[#35174D]/60">
          <div className="flex items-center gap-4">
            <span>
              Last modified: {new Date(note._creationTime).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>
              Word count:{" "}
              {note.text.split(/\s+/).filter((word) => word.length > 0).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#62AE6E] rounded-full"></div>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

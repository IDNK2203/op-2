"use client";

import { ReactNode } from "react";
import CreateNoteButton from "./create-note-btn";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Plus, StickyNote } from "lucide-react";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const notes = useQuery(api.notes.fetchNote);
  const { noteId } = useParams<{ noteId: Id<"note"> }>();

  const hasNotes = notes && notes.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#35174D] flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#62AE6E] to-[#9CB18B] rounded-lg flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-white" />
            </div>
            Notes
          </h1>
          <p className="text-[#35174D]/60 mt-1">
            Quick notes and compliance reminders
          </p>
        </div>
        <CreateNoteButton />
      </div>

      {/* Loading State */}
      {typeof notes === "undefined" && <NotesSkeleton />}
      {/* Stats */}
      {hasNotes && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#35174D]/60">Total Notes</p>
                <p className="text-2xl font-bold text-[#35174D]">
                  {notes.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#62AE6E]/10 rounded-lg flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-[#62AE6E]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#35174D]/60">This Week</p>
                <p className="text-2xl font-bold text-[#35174D]">
                  {
                    notes.filter((note) => {
                      const noteDate = new Date(note._creationTime);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return noteDate > weekAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="w-10 h-10 bg-[#E7B627]/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#E7B627]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#35174D]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#35174D]/60">Average Length</p>
                <p className="text-2xl font-bold text-[#35174D]">
                  {Math.round(
                    notes.reduce((acc, note) => acc + note.text.length, 0) /
                      notes.length
                  )}{" "}
                  chars
                </p>
              </div>
              <div className="w-10 h-10 bg-[#A34280]/10 rounded-lg flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-[#A34280]" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Loaded State */}
      {hasNotes && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#35174D]/10 p-4 sticky top-8">
              <h3 className="font-semibold text-[#35174D] mb-4 px-2">
                Recent Notes
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {notes?.map((note) => (
                  <Link
                    key={note._id}
                    href={`/dashboard/notes/${note._id}`}
                    className={cn(
                      "block p-3 rounded-lg text-sm transition-all hover:bg-[#35174D]/5",
                      note._id === noteId
                        ? "bg-gradient-to-r from-[#A34280]/10 to-[#35174D]/10 text-[#35174D] border-l-2 border-[#A34280]"
                        : "text-[#35174D]/70 hover:text-[#35174D]"
                    )}
                  >
                    <div className="line-clamp-2 leading-relaxed">
                      {note.text.substring(0, 100)}
                      {note.text.length > 100 && "..."}
                    </div>
                    <div className="text-xs text-[#35174D]/40 mt-2">
                      {new Date(note._creationTime).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Note Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      )}

      {!hasNotes && typeof notes !== "undefined" && <EmptyState />}
    </div>
  );
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="flex flex-col items-center justify-center max-w-md text-center">
      <div className="w-16 h-16 bg-[#35174D]/5 rounded-full flex items-center justify-center mb-6">
        <StickyNote className="w-8 h-8 text-[#35174D]/40" />
      </div>
      <h3 className="text-xl font-semibold text-[#35174D] mb-2">
        No notes yet
      </h3>
      <p className="text-[#35174D]/60 mb-6">
        Create your first note to start organizing your compliance thoughts and
        reminders.
      </p>
      <CreateNoteButton />
    </div>
  </div>
);

/* -------------------------
   Skeleton Loader for Notes
------------------------- */
function NotesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#35174D]/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-6 bg-slate-300 rounded w-16"></div>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes List + Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar (Recent Notes) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#35174D]/10 p-4">
            <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#35174D]/10 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            <div className="h-4 bg-slate-100 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

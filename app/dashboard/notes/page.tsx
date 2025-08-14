import { StickyNote } from "lucide-react";

export default function NotesPage() {
  return (
    <div className="flex flex-col  items-center justify-center text-center  h-96 ">
      <div className="w-16 h-16 bg-gradient-to-br from-[#62AE6E]/20 to-[#9CB18B]/20 rounded-2xl flex items-center justify-center mb-6">
        <StickyNote className="w-8 h-8 text-[#62AE6E]" />
      </div>
      <h3 className="text-xl font-semibold text-[#35174D] mb-2">
        Select a note to view
      </h3>
      <p className="text-[#35174D]/60 max-w-sm">
        Choose a note from the list on the left to view its contents, or create
        a new note to get started.
      </p>
    </div>
  );
}

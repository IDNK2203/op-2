import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, FileText, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DocumentCard({
  document,
}: {
  document: Doc<"document">;
}) {
  return (
    <div className="group bg-white rounded-xl border border-[#35174D]/10 hover:border-[#A34280]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A34280]/10 to-[#35174D]/10 rounded-lg flex items-center justify-center group-hover:from-[#A34280]/20 group-hover:to-[#35174D]/20 transition-colors">
              <FileText className="w-5 h-5 text-[#A34280]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#35174D] text-lg group-hover:text-[#A34280] transition-colors line-clamp-1">
                {document.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#35174D]/50 mt-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(document._creationTime).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-2 h-2 bg-[#62AE6E] rounded-full"></div>
        </div>

        {/* Description */}
        <div className="mb-6">
          {document?.description ? (
            <p className="text-[#35174D]/70 text-sm leading-relaxed line-clamp-3">
              {document.description}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-[#35174D]/40">
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="text-sm">Processing document...</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#A34280]/90 to-[#35174D]/90 hover:from-[#A34280] hover:to-[#35174D] text-white group-hover:scale-[1.02] transition-transform"
        >
          <Link
            href={`/dashboard/documents/${document._id}`}
            className="flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Document
          </Link>
        </Button>
      </div>

      {/* Bottom Border Accent */}
      <div className="h-1 bg-gradient-to-r from-[#A34280] to-[#35174D] rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}

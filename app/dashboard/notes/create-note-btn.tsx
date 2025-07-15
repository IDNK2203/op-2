"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateNoteForm } from "./create-note-form";
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function CreateDocumentBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-3">
          {" "}
          <Upload /> Upload Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Note</DialogTitle>
          <DialogDescription>
            Upload your team note to witness lightening speed search with our AI
          </DialogDescription>
        </DialogHeader>
        <CreateNoteForm
          toggleDialog={() => {
            setIsOpen(false);
            toast("Note created", {
              description: "Your note has been created successfully.",
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

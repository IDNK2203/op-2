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
import { UploadDocumentForm } from "./upload-document-form";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function CreateDocumentBtn() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-3">
          {" "}
          <Upload /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Document</DialogTitle>
          <DialogDescription>
            Upload your team document to witness lightening speed search with
            our AI
          </DialogDescription>
        </DialogHeader>
        <UploadDocumentForm toggleDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

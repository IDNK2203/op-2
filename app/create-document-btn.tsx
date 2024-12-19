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

export default function CreateDocumentBtn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Document</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Document</DialogTitle>
          <DialogDescription>
            Upload your team document to witness lightening speed search with
            our AI
          </DialogDescription>
        </DialogHeader>
        <UploadDocumentForm />
      </DialogContent>
    </Dialog>
  );
}

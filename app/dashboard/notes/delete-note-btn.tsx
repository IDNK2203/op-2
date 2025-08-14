"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { UploadDocumentForm } from "./upload-document-form";
import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { LoadingBtn } from "@/components/loading-btn";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function DeleteNoteBtn({ id }: { id: Id<"note"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DeleteNoteHandler = useMutation(api.notes.DeleteNote);

  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="">
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure about deleting this note?</DialogTitle>
          <DialogDescription>
            Once you delete this note, it will be gone forever
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
          <LoadingBtn
            isLoading={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                await DeleteNoteHandler({ noteId: id });
                // setIsOpen(false);
                setIsLoading(false);
                router.push("/dashboard/notes");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Continue
          </LoadingBtn>
        </DialogFooter>

        {/* <UploadDocumentForm toggleDialog={() => setIsOpen(false)} /> */}
      </DialogContent>
    </Dialog>
  );
}

// components/enhanced-upload-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingBtn } from "@/components/loading-btn";
// import { getDocumentProxy } from "unpdf";
// import { PDFDocument } from "pdf-lib";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(256, { message: "Title must be at most 256 characters." }),
  content: z.string().min(1, { message: "Content is required." }),
});

// async function extractPDFText(file: File) {
//   const arrayBuffer = await file.arrayBuffer();
//   const pdfDoc = await PDFDocument.load(arrayBuffer);
//   let text = "";

//   const pages = pdfDoc.getPages();
//   for (const page of pages) {
//     text += page.getTextContent?.() ?? ""; // Needs text extraction helper
//   }

//   console.log(text);

//   return text;
// }

export function UploadDocumentForm({
  toggleDialog,
}: {
  toggleDialog: () => void;
}) {
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileProcessed, setFileProcessed] = useState(false);

  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const uploadDocHandler = useMutation(api.documents.createDocument);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    setIsProcessingFile(true);

    try {
      let content = "";

      if (file.type === "application/pdf") {
        // content = await extractPDFText(file);
        return;
      } else {
        content = await file.text();
      }

      form.setValue("content", content);

      // Auto-generate title from filename if not set
      if (!form.getValues("title")) {
        const titleFromFilename = file.name.replace(/\.[^/.]+$/, "");
        form.setValue("title", titleFromFilename);
      }

      setFileProcessed(true);
    } catch (error) {
      console.error("File processing error:", error);
      form.setError("content", {
        message:
          "Failed to process file. Please try again or paste content manually.",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Create a text file from the extracted content
    const textFile = new Blob([values.content], { type: "text/plain" });

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: textFile,
    });

    const { storageId } = await result.json();

    await uploadDocHandler({ title: values.title, storageId });
    toggleDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter document title..." {...field} />
              </FormControl>
              <FormDescription>
                Give your document a descriptive title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Upload File</FormLabel>
            <Input
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={(event) => {
                const file = event.target.files?.[0];
                handleFileChange(file);
              }}
              disabled={isProcessingFile}
            />
            <FormDescription>
              Upload a text file or PDF. PDFs will be processed automatically.
            </FormDescription>
          </div>

          {isProcessingFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 rounded-full border-t-blue-600"></div>
              <span>Processing file...</span>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="File content will appear here, or paste directly..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Review and edit the extracted content before uploading.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingBtn
          isLoading={form.formState.isSubmitting || isProcessingFile}
          disabled={!fileProcessed && !form.getValues("content")}
        >
          {isProcessingFile ? "Processing..." : "Upload Document"}
        </LoadingBtn>
      </form>
    </Form>
  );
}

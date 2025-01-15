"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingBtn } from "@/components/loading-btn";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "title must be at least 2 characters.",
    })
    .max(256, { message: "title must be at most 256 characters." }),
  file: z.instanceof(File),
});

export function UploadDocumentForm({
  toggleDialog,
}: {
  toggleDialog: () => void;
}) {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const uploadDocHandler = useMutation(api.documents.createDocument);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file.type },
      body: values.file,
    });
    const { storageId } = await result.json();

    await uploadDocHandler({ title: values.title, storageId });
    toggleDialog();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The will of fire" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.md,.mdx"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onChange(file);
                  }}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingBtn isLoading={form.formState.isSubmitting}>Submit</LoadingBtn>
      </form>
    </Form>
  );
}

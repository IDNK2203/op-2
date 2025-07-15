"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingBtn } from "@/components/loading-btn";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  // .max(25, { message: "title must be at most 256 characters." }),
});

export function CreateNoteForm({ toggleDialog }: { toggleDialog: () => void }) {
  const uploadDocHandler = useMutation(api.notes.createNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await uploadDocHandler({ text: values.text });
    toggleDialog();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder="Your note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingBtn isLoading={form.formState.isSubmitting}>Submit</LoadingBtn>
      </form>
    </Form>
  );
}

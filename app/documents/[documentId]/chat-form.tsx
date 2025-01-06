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
  //   FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { LoadingBtn } from "@/components/loading-btn";

const formSchema = z.object({
  question: z
    .string()
    .min(2, {
      message: "title must be at least 2 characters.",
    })
    .max(256, { message: "title must be at most 256 characters." }),
});

export function ChatForm({ id }: { id: Id<"document"> }) {
  const askDocument = useAction(api.documents.askDocument);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await askDocument({
      documentId: id,
      question: values.question,
    });
    form.reset();
    // await clickMeCaller({ title: values.title, storageId });
    // toggleDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              {/* <FormLabel>Title</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="what do you want to know?"
                  {...field}
                  className="mt-2"
                />
              </FormControl>
              <LoadingBtn isLoading={form.formState.isSubmitting}>
                Submit
              </LoadingBtn>
              <FormDescription>
                {/* This is your public display name. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
    //   <form onSubmit={handleSubmit} className="flex gap-2 py-2 ">
    //     <Input
    //       type="text"
    //       name="question"
    //       className="border border-slate-500"
    //     />
    //     <Button type="submit">Send</Button>
    //   </form>
  );
}

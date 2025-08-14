"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { LoadingBtn } from "@/components/loading-btn";
import { Send } from "lucide-react";

const formSchema = z.object({
  question: z
    .string()
    .min(2, {
      message: "Question must be at least 2 characters.",
    })
    .max(256, { message: "Question must be at most 256 characters." }),
});

export function ChatForm({ id }: { id: Id<"document"> }) {
  const askDocument = useAction(api.documentActions.askDocument);

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
  }

  return (
    <Form {...form}>
      <div className="flex gap-3 items-end">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Ask a question about this document..."
                    {...field}
                    className="pr-12 bg-[#35174D]/5 border-[#35174D]/20 focus:border-[#A34280] focus:ring-[#A34280]/20 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingBtn
          isLoading={form.formState.isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
          className="bg-gradient-to-r from-[#A34280] to-[#35174D] hover:from-[#35174D] hover:to-[#A34280] text-white rounded-xl h-10 px-4"
          disabled={!form.watch("question")?.trim()}
        >
          {form.formState.isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4" />
            </>
          )}
        </LoadingBtn>
      </div>
    </Form>
  );
}

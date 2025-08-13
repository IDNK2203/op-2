"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingBtn } from "@/components/loading-btn";
import { Search, Sparkles } from "lucide-react";

const formSchema = z.object({
  search: z.string().min(1, "Please enter a search query").max(250),
});

export function SearchForm({
  setResults,
}: {
  setResults: (notes: typeof api.search.searchAction._returnType) => void;
}) {
  const searchAction = useAction(api.search.searchAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await searchAction({ search: values.search }).then(setResults);
  }

  return (
    <Form {...form}>
      <div className="relative">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#35174D]/40" />
                    <div className="h-4 w-px bg-[#35174D]/20"></div>
                  </div>
                  <Input
                    placeholder="Search your documents and notes... Try asking natural language questions!"
                    {...field}
                    className="pl-16 pr-32 h-14 text-base bg-[#35174D]/5 border-[#35174D]/20 focus:border-[#A34280] focus:ring-[#A34280]/20 rounded-xl placeholder:text-[#35174D]/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LoadingBtn
                      isLoading={form.formState.isSubmitting}
                      onClick={form.handleSubmit(onSubmit)}
                      className="bg-gradient-to-r from-[#A34280] to-[#35174D] hover:from-[#35174D] hover:to-[#A34280] text-white rounded-lg h-8 px-4 text-sm"
                      disabled={!field.value?.trim()}
                    >
                      {form.formState.isSubmitting ? (
                        "Searching..."
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-1" />
                          Search
                        </>
                      )}
                    </LoadingBtn>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}

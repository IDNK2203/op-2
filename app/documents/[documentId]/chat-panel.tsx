import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";

export function ChatPanel({ id }: { id: Id<"document"> }) {
  const askDocument = useAction(api.documents.askDocument);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const question = formData.get("question") as string;
    const aiResponse = await askDocument({
      documentId: id,
      question,
    });
    console.log(aiResponse);

    console.log("submitting");
  };

  return (
    <section className="basis-2/6 bg-gray-900 h-full flex flex-col p-4 ">
      <ul className="flex flex-col gap-1 overflow-y-auto flex-grow bg-slate-500 p-2 rounded-md">
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
        <li>Yokozo</li>
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2 py-2 ">
        <Input
          type="text"
          name="question"
          className="border border-slate-500"
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
}

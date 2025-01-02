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
      <ul className="grid grid-cols-1 gap-1 overflow-y-auto p-2 mb-4 rounded-md">
        <ChatItem role="model" text="Hello there" />
        <ChatItem role="user" text="What is your mission?" />
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

function ChatItem({ role, text }: { role: "user" | "model"; text: string }) {
  return (
    <li
      className={`p-2 ${role === "user" ? "bg-slate-500 justify-self-end " : "bg-slate-700 justify-self-start"} rounded-md w-max max-w-[80%] justify-self-start `}
    >
      {text}
    </li>
  );
}

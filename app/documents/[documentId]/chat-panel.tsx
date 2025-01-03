import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ChatForm } from "./chat-form";

export function ChatPanel({ id }: { id: Id<"document"> }) {
  const getChats = useQuery(api.chats.fetchChat, { documentId: id });

  return (
    <section className="basis-2/6 bg-gray-900 h-full flex flex-col p-4 ">
      <ul className="grid grid-cols-1 gap-1 overflow-y-auto p-2 mb-4 rounded-md">
        {getChats &&
          getChats.map((chat, i) => (
            <ChatItem key={i} role={chat.role} text={chat.text} />
          ))}
        {/* <ChatItem role="model" text="Hello there" />
        <ChatItem role="user" text="What is your mission?" /> */}
      </ul>
      <ChatForm id={id} />
    </section>
  );
}

function ChatItem({ role, text }: { role: "user" | "model"; text: string }) {
  return (
    <li
      className={`p-2 mb-2 whitespace-pre-wrap ${role === "user" ? "bg-slate-500 justify-self-end " : "bg-slate-700 justify-self-start"} rounded-md w-max max-w-[80%] justify-self-start `}
    >
      {text}
    </li>
  );
}

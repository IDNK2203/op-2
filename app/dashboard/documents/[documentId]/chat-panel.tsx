import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ChatForm } from "./chat-form";
import { Bot, User, MessageSquare } from "lucide-react";

export function ChatPanel({ id }: { id: Id<"document"> }) {
  const getChats = useQuery(api.chats.fetchChat, { documentId: id });

  return (
    <div className="flex flex-col flex-grow h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-[#35174D]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#35174D]">AI Assistant</h3>
            <p className="text-sm text-[#35174D]/60">
              Ask questions about this document
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="overflow-y-auto p-6 space-y-4 flex-grow">
        {getChats && getChats.length > 0 ? (
          getChats.map((chat, i) => (
            <ChatItem key={i} role={chat.role} text={chat.text} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[#35174D]/5 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#35174D]/40" />
            </div>
            <h3 className="text-lg font-medium text-[#35174D] mb-2">
              Start a conversation
            </h3>
            <p className="text-[#35174D]/60 mb-6 max-w-sm">
              Ask questions about this document and get AI-powered insights and
              answers.
            </p>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-[#35174D]/10 p-4 h-[150px]">
        <ChatForm id={id} />
      </div>
    </div>
  );
}

function ChatItem({ role, text }: { role: "user" | "model"; text: string }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-[#A34280] to-[#35174D] text-white ml-auto"
              : "bg-[#35174D]/5 text-[#35174D]"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
        <div
          className={`text-xs text-[#35174D]/40 mt-1 ${isUser ? "text-right" : "text-left"}`}
        >
          {isUser ? "You" : "AI Assistant"}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-[#35174D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-[#35174D]" />
        </div>
      )}
    </div>
  );
}

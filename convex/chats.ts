import { v } from "convex/values";
// import { Id } from "@/convex/_generated/dataModel";
import { internalMutation, query } from "./_generated/server";
// import OpenAI from "openai";
// import { api } from "./_generated/api";

export const createChat = internalMutation({
  args: {
    documentId: v.id("document"),
    role: v.union(v.literal("model"), v.literal("user")),
    text: v.string(),
  },
  async handler(ctx, args_0) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return [];

    await ctx.db.insert("chat", {
      userToken: userToken,
      documentId: args_0.documentId,
      role: args_0.role,
      text: args_0.text,
    });
  },
});

export const fetchChat = query({
  args: {
    documentId: v.id("document"),
  },
  async handler(ctx, args) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return [];

    return await ctx.db
      .query("chat")
      .withIndex("by_userToken_documentId", (q) =>
        q.eq("userToken", userToken).eq("documentId", args.documentId)
      )
      .collect();
  },
});

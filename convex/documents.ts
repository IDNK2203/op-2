import { ConvexError, v } from "convex/values";
// import { Id } from "@/convex/_generated/dataModel";
import {
  action,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
// import OpenAI from "openai";
import { internal } from "./_generated/api";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Id } from "./_generated/dataModel";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const hasAccessToDocument = async (
  ctx: QueryCtx | MutationCtx,
  documentId: Id<"document">
) => {
  const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userToken) return null;
  const doc = await ctx.db.get(documentId);
  if (!doc) return null;
  if (doc.userToken !== userToken) return null;
  return {
    doc,
    userToken,
  };
};

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("document"),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    storageId: v.id("_storage"),
  },
  async handler(ctx, args_0) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return [];

    await ctx.db.insert("document", {
      title: args_0.title,
      userToken: userToken,
      storageId: args_0.storageId,
    });
  },
});

export const fetchDocument = query({
  async handler(ctx) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return [];

    return await ctx.db
      .query("document")
      .withIndex("by_userToken", (q) => q.eq("userToken", userToken))
      .collect();
  },
});

export const fetchDocumentById = query({
  args: {
    documentId: v.id("document"),
  },
  async handler(ctx, args) {
    const accessResult = await hasAccessToDocument(ctx, args.documentId);
    if (!accessResult) return null;
    const { doc } = accessResult;

    if (!doc) return null;
    return { ...doc, documentUrl: await ctx.storage.getUrl(doc.storageId) };
  },
});

export const askDocument = action({
  args: {
    documentId: v.id("document"),
    question: v.string(),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );

    if (!accessObj) return null;
    const { doc } = accessObj;
    if (!doc) throw new ConvexError("Document not found");

    const file = await ctx.storage.get(doc.storageId);

    if (!file) throw new ConvexError("file not found");

    const text = await file.text();
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Answer the following questions using this text file as context
              `,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: `Here is a text file ${text}` }],
        },
      ],
    });

    const result = await chat.sendMessage(`question: ${args.question}`);
    const textRes = result.response.text();

    // store  user prompt as a chat record
    await ctx.runMutation(internal.chats.createChat, {
      documentId: args.documentId,
      role: "user",
      text: args.question,
    });

    // store model response as a chat record
    await ctx.runMutation(internal.chats.createChat, {
      documentId: args.documentId,
      role: "model",
      text: textRes,
    });

    return textRes;
  },
});

// const result = await chat.sendMessage(`Here is a text file
//   ${file}

//   Answer the following questions about the text file
//   question: ${args.question}`);

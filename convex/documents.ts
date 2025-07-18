import { ConvexError, v } from "convex/values";
// import { Id } from "@/convex/_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
// import OpenAI from "openai";
import { internal } from "./_generated/api";

import { GoogleGenAI } from "@google/genai";
import { Id } from "./_generated/dataModel";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const hasAccessToDocument = async (
  ctx: QueryCtx | MutationCtx,
  documentId: Id<"document">
) => {
  try {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return null;
    const doc = await ctx.db.get(documentId);
    if (!doc) return null;
    if (doc.userToken !== userToken) return null;
    return {
      doc,
      userToken,
    };
  } catch (error) {
    console.log(error);
  }
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

    const doc = await ctx.db.insert("document", {
      title: args_0.title,
      userToken: userToken,
      storageId: args_0.storageId,
      description: "",
    });

    await ctx.scheduler.runAfter(0, internal.documents.generateDescription, {
      storageId: args_0.storageId,
      docId: doc,
    });
  },
});

export const generateDescription = internalAction({
  args: {
    storageId: v.id("_storage"),
    docId: v.id("document"),
  },
  handler: async (ctx, args) => {
    // console.log("runing scheduled action");

    const file = await ctx.storage.get(args.storageId);

    if (!file) throw new ConvexError("file not found");

    const text = await file.text();

    const contentParams = `using the content from the file below generate a short one sentence description for it

      File CONTENT:

      ${text},
      `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentParams,
    });

    const description = response.text;

    if (!description) {
      throw new ConvexError("Failed to generate description");
    }

    await ctx.runMutation(internal.documents.updateDocDescription, {
      id: args.docId,
      description: description,
    });
  },
});

export const updateDocDescription = internalMutation({
  args: { id: v.id("document"), description: v.string() },

  async handler(ctx, args_0) {
    await ctx.db.patch(args_0.id, { description: args_0.description });
  },
});

export const fetchDocument = query({
  async handler(ctx) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return null;

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

    //  const chat = ai.chats.create({
    //     model: "gemini-2.5-flash",
    //     history: [
    //       {
    //         role: "user",
    //         parts: [{ text: "Hello" }],
    //       },
    //       {
    //         role: "model",
    //         parts: [{ text: "Great to meet you. What would you like to know?" }],
    //       },
    //     ],
    //   });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
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

    const result = await chat.sendMessage({
      message: `question: ${args.question}`,
    });
    const textRes = result.text;

    if (!textRes) {
      throw new ConvexError("Failed to generate response");
    }

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

export const DeleteDocument = mutation({
  args: {
    documentId: v.id("document"),
  },
  async handler(ctx, args) {
    // call a query
    const accessResult = await hasAccessToDocument(ctx, args.documentId);
    if (!accessResult) return null;
    const { doc } = accessResult;

    if (!doc) return null;
    await ctx.storage.delete(doc.storageId);
    await ctx.db.delete(args.documentId);
  },
});

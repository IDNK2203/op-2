import { ConvexError, v } from "convex/values";
// import { Id } from "@/convex/_generated/dataModel";
import { action, mutation, query } from "./_generated/server";
// import OpenAI from "openai";
import { api } from "./_generated/api";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return null;
    const doc = await ctx.db.get(args.documentId);
    if (!doc) return null;

    return doc.userToken === userToken
      ? { ...doc, documentUrl: await ctx.storage.getUrl(doc.storageId) }
      : null;
  },
});

export const askDocument = action({
  args: {
    documentId: v.id("document"),
    question: v.string(),
  },
  async handler(ctx, args) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) throw new ConvexError("Unauthorized");

    const doc = await ctx.runQuery(api.documents.fetchDocumentById, {
      documentId: args.documentId,
    });
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
    // const result = await chat.sendMessage(`Here is a text file
    //   ${file}

    //   Answer the following questions about the text file
    //   question: ${args.question}`);

    const textRes = result.response.text();
    console.log(textRes);
    // const chatCompletion = await client.chat.completions.create({
    //   messages: [{ role: "user", content: args.question }],
    //   model: "gpt-4o-mini",
    // });

    return textRes;
  },
});

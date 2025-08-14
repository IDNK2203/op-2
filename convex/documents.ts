import { v } from "convex/values";
// import { Id } from "@/convex/_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
// import OpenAI from "openai";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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

    await ctx.scheduler.runAfter(
      0,
      internal.documentActions.generateDescription,
      {
        storageId: args_0.storageId,
        docId: doc,
      }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.documentActions.createEmbeddingIntAction,
      {
        docId: doc,
        storageId: args_0.storageId,
      }
    );
  },
});

export const updateDocwithEmbedding = internalMutation({
  args: {
    docId: v.id("document"),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.docId, { embedding: args.embedding });
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

import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { GoogleGenAI } from "@google/genai";
import { internal } from "./_generated/api";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const hasAccessToNote = async (
  ctx: QueryCtx | MutationCtx,
  noteId: Id<"note">
) => {
  try {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return null;
    const note = await ctx.db.get(noteId);
    if (!note) return null;
    if (note.tokenIdentifier !== userToken) return null;
    return {
      note,
      userToken,
    };
  } catch (error) {
    console.log(error);
  }
};

export const hasAccessToNoteQuery = internalQuery({
  args: {
    noteId: v.id("note"),
  },
  async handler(ctx, args) {
    return await hasAccessToNote(ctx, args.noteId);
  },
});

const createNoteEmbedding = async (text: string) => {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        outputDimensionality: 1536,
        taskType: "RETRIEVAL_QUERY",
      },
    });
    // Assuming response.embeddings is an array of ContentEmbedding objects
    // and each object has a 'values' property which is number[]
    // If the API returns a single embedding, adjust accordingly
    console.log(response);
    if (Array.isArray(response.embeddings) && response.embeddings.length > 0) {
      return response.embeddings[0].values;
    }
    throw new ConvexError("No embedding values found");
  } catch (error) {
    console.error("Error creating note embedding:", error);
    throw new ConvexError("Failed to create note embedding");
  }
};

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args_0) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return new ConvexError("Unauthorized");

    const note = await ctx.db.insert("note", {
      text: args_0.text,
      tokenIdentifier: userToken,
    });

    await ctx.scheduler.runAfter(0, internal.notes.createEmbeddingIntAction, {
      id: note,
      text: args_0.text,
    });
  },
});

export const createEmbeddingIntAction = internalAction({
  args: {
    id: v.id("note"),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await createNoteEmbedding(args.text);
    if (!embedding) {
      throw new ConvexError("Failed to create embedding");
    }
    await ctx.runMutation(internal.notes.updateNotewithEmbedding, {
      embedding,
      id: args.id,
    });
  },
});

export const updateNotewithEmbedding = internalMutation({
  args: {
    id: v.id("note"),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { embedding: args.embedding });
  },
});

export const fetchNote = query({
  async handler(ctx) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return null;

    return await ctx.db
      .query("note")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", userToken)
      )
      .collect();
  },
});

export const fetchNoteById = query({
  args: {
    noteId: v.id("note"),
  },
  async handler(ctx, args) {
    const accessResult = await hasAccessToNoteQuery(ctx, {
      noteId: args.noteId,
    });
    if (!accessResult) return null;
    const { note } = accessResult;

    if (!note) return null;
    return { ...note };
  },
});

export const DeleteNote = mutation({
  args: {
    noteId: v.id("note"),
  },
  async handler(ctx, args) {
    // call a query
    const accessResult = await hasAccessToNoteQuery(ctx, {
      noteId: args.noteId,
    });
    if (!accessResult) return null;
    const { note } = accessResult;

    if (!note) return null;
    await ctx.db.delete(args.noteId);
  },
});

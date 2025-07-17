import { ConvexError, v } from "convex/values";
import {
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

    return note;
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

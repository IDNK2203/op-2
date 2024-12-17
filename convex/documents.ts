import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDocument = mutation({
  args: {
    title: v.string(),
  },
  async handler(ctx, args_0) {
    await ctx.db.insert("document", {
      title: args_0.title,
    });
  },
});

export const fetchDocument = query({
  args: {},
  async handler(ctx) {
    return await ctx.db.query("document").collect();
  },
});

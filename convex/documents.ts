import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDocument = mutation({
  args: {
    title: v.string(),
  },
  async handler(ctx, args_0) {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userToken) return [];

    await ctx.db.insert("document", {
      title: args_0.title,
      userToken: userToken,
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

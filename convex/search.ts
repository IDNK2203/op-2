import { createEmbedding } from "./notes";
import { action, internalQuery } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";

type SearchResult =
  | (Doc<"note"> & { score: number; type: "note" })
  | (Doc<"document"> & { score: number; type: "document" });

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userToken) return new ConvexError("Unauthorized");
    // 1. Generate an embedding from you favorite third party API:
    const embedding = await createEmbedding(args.search, "RETRIEVAL_QUERY");
    if (!embedding) {
      throw new ConvexError("Failed to create embedding");
    }
    // 2. Then search for similar notes!
    const NoteResults = await ctx.vectorSearch("note", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("tokenIdentifier", userToken),
    });
    const DocResults = await ctx.vectorSearch("document", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userToken", userToken),
    });
    const results = [
      ...NoteResults.map((note) => ({ ...note, type: "note" })),
      ...DocResults.map((doc) => ({ ...doc, type: "document" })),
    ];

    const rawResults = (await ctx.runQuery(internal.search.fetchResults, {
      results,
    })) as SearchResult[];

    const searchResults = rawResults.map((result) => {
      if ("embedding" in result) {
        delete result.embedding;
      }
      return result;
    });

    // sort result by score
    searchResults.sort((a, b) => b.score - a.score);
    return searchResults;
  },
});

export const fetchResults = internalQuery({
  args: {
    results: v.array(
      v.object({
        _id: v.union(v.id("note"), v.id("document")),
        _score: v.number(),
        type: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const { _id, _score, type } of args.results) {
      const doc = await ctx.db.get(_id);
      if (doc === null) {
        continue;
      }
      results.push({ ...doc, score: _score, type });
    }
    return results;
  },
});

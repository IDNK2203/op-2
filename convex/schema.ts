import { defineSchema, defineTable } from "convex/server";
// import { Id } from "@/convex/_generated/dataModel";
import { v } from "convex/values";

export default defineSchema({
  document: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userToken: v.string(),
    storageId: v.id("_storage"),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_userToken", ["userToken"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userToken"],
    }),
  note: defineTable({
    text: v.string(),
    embedding: v.optional(v.array(v.float64())),
    tokenIdentifier: v.string(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"],
    }),
  chat: defineTable({
    documentId: v.id("document"),
    userToken: v.string(),
    role: v.union(v.literal("model"), v.literal("user")),
    text: v.string(),
  }).index("by_userToken_documentId", ["userToken", "documentId"]),
});

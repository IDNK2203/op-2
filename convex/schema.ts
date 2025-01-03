import { defineSchema, defineTable } from "convex/server";
// import { Id } from "@/convex/_generated/dataModel";
import { v } from "convex/values";

export default defineSchema({
  document: defineTable({
    title: v.string(),
    userToken: v.string(),
    storageId: v.id("_storage"),
  }).index("by_userToken", ["userToken"]),
  chat: defineTable({
    documentId: v.id("document"),
    userToken: v.string(),
    role: v.union(v.literal("model"), v.literal("user")),
    text: v.string(),
  }).index("by_userToken_documentId", ["userToken", "documentId"]),
});

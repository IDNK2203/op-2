import { defineSchema, defineTable } from "convex/server";
// import { Id } from "@/convex/_generated/dataModel";
import { v } from "convex/values";

export default defineSchema({
  document: defineTable({
    title: v.string(),
    userToken: v.string(),
    storageId: v.id("_storage"),
  }).index("by_userToken", ["userToken"]),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  document: defineTable({ title: v.string(), userToken: v.string() }).index(
    "by_userToken",
    ["userToken"]
  ),
});

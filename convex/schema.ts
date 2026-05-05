import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Companies being tracked
  companies: defineTable({
    name: v.string(),
    ticker: v.optional(v.string()),
    sector: v.string(), // "Tech", "Finance", "Retail", etc.
    totalEmployees: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  // Layoff events
  layoffs: defineTable({
    companyId: v.id("companies"),
    companyName: v.string(), // denormalized for easy display
    headline: v.string(),
    summary: v.string(),
    affectedCount: v.number(), // number of people laid off
    percentageOfWorkforce: v.optional(v.number()),
    aiRelated: v.boolean(), // true if AI-related
    aiReason: v.optional(v.string()), // explanation of AI connection
    sourceUrl: v.optional(v.string()),
    eventDate: v.number(),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
  })
    .index("by_date", ["eventDate"])
    .index("by_company", ["companyId"])
    .index("by_ai_related", ["aiRelated", "eventDate"]),

  // AI-generated analysis of layoff trends
  analyses: defineTable({
    content: v.string(),
    layoffIds: v.array(v.id("layoffs")),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
  }).index("by_date", ["createdAt"]),

  // User submissions (for crowdsourcing news)
  submissions: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    headline: v.string(),
    sourceUrl: v.optional(v.string()),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"]),
});

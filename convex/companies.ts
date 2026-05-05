import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("companies").collect();
  },
});

export const get = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    ticker: v.optional(v.string()),
    sector: v.string(),
    totalEmployees: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("companies", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("companies").first();
    if (existing) return; // Already seeded

    const companies = [
      { name: "Coinbase", ticker: "COIN", sector: "Tech/Crypto", totalEmployees: 3700 },
      { name: "Google", ticker: "GOOGL", sector: "Tech", totalEmployees: 182000 },
      { name: "Meta", ticker: "META", sector: "Tech", totalEmployees: 67000 },
      { name: "Amazon", ticker: "AMZN", sector: "Tech/Retail", totalEmployees: 1500000 },
      { name: "Microsoft", ticker: "MSFT", sector: "Tech", totalEmployees: 221000 },
      { name: "Salesforce", ticker: "CRM", sector: "Tech", totalEmployees: 72000 },
      { name: "IBM", ticker: "IBM", sector: "Tech", totalEmployees: 288000 },
      { name: "Dropbox", ticker: "DBX", sector: "Tech", totalEmployees: 2800 },
      { name: "Chegg", ticker: "CHGG", sector: "EdTech", totalEmployees: 1900 },
      { name: "Duolingo", ticker: "DUOL", sector: "EdTech", totalEmployees: 700 },
    ];

    for (const company of companies) {
      await ctx.db.insert("companies", {
        ...company,
        createdAt: Date.now(),
      });
    }
  },
});

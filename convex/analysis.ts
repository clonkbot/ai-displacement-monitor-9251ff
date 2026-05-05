import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const latest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("analyses")
      .withIndex("by_date")
      .order("desc")
      .first();
  },
});

export const save = mutation({
  args: {
    content: v.string(),
    layoffIds: v.array(v.id("layoffs")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.insert("analyses", {
      content: args.content,
      layoffIds: args.layoffIds,
      createdAt: Date.now(),
      createdBy: userId ?? undefined,
    });
  },
});

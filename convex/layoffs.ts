import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("layoffs")
      .withIndex("by_date")
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

export const listAiRelated = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("layoffs")
      .withIndex("by_ai_related", (q) => q.eq("aiRelated", true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allLayoffs = await ctx.db.query("layoffs").collect();
    const aiLayoffs = allLayoffs.filter((l) => l.aiRelated);

    const totalAffected = allLayoffs.reduce((sum, l) => sum + l.affectedCount, 0);
    const aiAffected = aiLayoffs.reduce((sum, l) => sum + l.affectedCount, 0);

    const companiesAffected = new Set(allLayoffs.map((l) => l.companyId)).size;

    // Get layoffs from last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentLayoffs = allLayoffs.filter((l) => l.eventDate > thirtyDaysAgo);
    const recentAffected = recentLayoffs.reduce((sum, l) => sum + l.affectedCount, 0);

    return {
      totalLayoffEvents: allLayoffs.length,
      aiRelatedEvents: aiLayoffs.length,
      totalAffected,
      aiAffected,
      companiesAffected,
      recentAffected,
      recentEvents: recentLayoffs.length,
    };
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    companyName: v.string(),
    headline: v.string(),
    summary: v.string(),
    affectedCount: v.number(),
    percentageOfWorkforce: v.optional(v.number()),
    aiRelated: v.boolean(),
    aiReason: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    eventDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.insert("layoffs", {
      ...args,
      createdAt: Date.now(),
      createdBy: userId ?? undefined,
    });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("layoffs").first();
    if (existing) return; // Already seeded

    const companies = await ctx.db.query("companies").collect();
    const getCompanyId = (name: string) => companies.find((c) => c.name === name)?._id;

    const layoffs = [
      {
        companyName: "Coinbase",
        headline: "Coinbase lays off 14% of workforce, citing AI transformation",
        summary: "Coinbase announced it will reduce headcount by approximately 14%, affecting over 500 employees. CEO Brian Armstrong cited the company's aggressive AI integration as enabling the same output with fewer people.",
        affectedCount: 518,
        percentageOfWorkforce: 14,
        aiRelated: true,
        aiReason: "Company explicitly stated AI tools have increased productivity enough to reduce headcount",
        eventDate: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      },
      {
        companyName: "IBM",
        headline: "IBM pauses hiring for roles AI could replace",
        summary: "IBM CEO Arvind Krishna announced the company expects to pause hiring for roles that could be replaced by AI, potentially affecting 7,800 jobs over the next five years in back-office functions.",
        affectedCount: 7800,
        percentageOfWorkforce: 2.7,
        aiRelated: true,
        aiReason: "Direct statement from CEO that AI will replace these positions",
        eventDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Dropbox",
        headline: "Dropbox cuts 16% of workforce amid AI pivot",
        summary: "Dropbox announced layoffs affecting 500 employees as the company pivots to AI-first strategy. CEO Drew Houston stated the company needs different skills for the AI era.",
        affectedCount: 500,
        percentageOfWorkforce: 16,
        aiRelated: true,
        aiReason: "Company restructuring to focus on AI products and needing AI-skilled workforce",
        eventDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Chegg",
        headline: "Chegg lays off 23% as ChatGPT decimates business",
        summary: "Education tech company Chegg announced significant layoffs after citing ChatGPT as an existential threat to its homework help business model.",
        affectedCount: 437,
        percentageOfWorkforce: 23,
        aiRelated: true,
        aiReason: "ChatGPT directly competing with core business, causing revenue decline",
        eventDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Google",
        headline: "Google restructures ad sales team with AI automation",
        summary: "Google is reorganizing its advertising division, with AI systems taking over many routine tasks previously done by human sales representatives.",
        affectedCount: 1200,
        percentageOfWorkforce: 0.6,
        aiRelated: true,
        aiReason: "AI automation of ad sales processes reducing need for human workers",
        eventDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Duolingo",
        headline: "Duolingo cuts contractors as AI takes over content creation",
        summary: "Duolingo has reduced its contractor workforce by approximately 10% as AI systems now handle much of the language content creation work.",
        affectedCount: 70,
        percentageOfWorkforce: 10,
        aiRelated: true,
        aiReason: "AI generating language learning content previously created by human contractors",
        eventDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Meta",
        headline: "Meta eliminates thousands in 'Year of Efficiency'",
        summary: "Meta continues layoffs as part of Mark Zuckerberg's efficiency drive, with AI tools cited as enabling smaller teams to accomplish more.",
        affectedCount: 10000,
        percentageOfWorkforce: 15,
        aiRelated: true,
        aiReason: "AI productivity tools enabling same output with reduced headcount",
        eventDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
      },
      {
        companyName: "Salesforce",
        headline: "Salesforce pauses hiring amid AI agent deployment",
        summary: "Salesforce announced hiring freeze in several departments as AI agents handle increasing amounts of customer service and routine operations.",
        affectedCount: 950,
        percentageOfWorkforce: 1.3,
        aiRelated: true,
        aiReason: "AI agents replacing human workers in customer service roles",
        eventDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const layoff of layoffs) {
      const companyId = getCompanyId(layoff.companyName);
      if (companyId) {
        await ctx.db.insert("layoffs", {
          ...layoff,
          companyId,
          createdAt: Date.now(),
        });
      }
    }
  },
});

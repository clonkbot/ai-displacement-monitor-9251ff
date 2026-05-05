import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "../utils/date";
import { Id } from "../../convex/_generated/dataModel";

interface Layoff {
  _id: Id<"layoffs">;
  companyName: string;
  headline: string;
  summary: string;
  affectedCount: number;
  percentageOfWorkforce?: number;
  aiRelated: boolean;
  aiReason?: string;
  sourceUrl?: string;
  eventDate: number;
}

export function LayoffFeed() {
  const layoffs = useQuery(api.layoffs.list, { limit: 20 });

  return (
    <div className="border border-gray-800 bg-black/50">
      {/* Section Header */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-warning-red animate-pulse" />
          <h3 className="font-display text-lg md:text-xl text-terminal-green">
            LIVE_INCIDENT_FEED
          </h3>
        </div>
        <span className="font-mono text-xs text-gray-500">
          {layoffs?.length ?? 0} RECORDS
        </span>
      </div>

      {/* Feed content */}
      <div className="divide-y divide-gray-800/50 max-h-[600px] overflow-y-auto">
        {layoffs === undefined ? (
          <div className="p-8 text-center">
            <div className="font-mono text-sm text-terminal-green animate-pulse">
              LOADING DATA STREAM...
            </div>
          </div>
        ) : layoffs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="font-mono text-sm text-gray-500">
              NO INCIDENTS RECORDED
            </div>
          </div>
        ) : (
          (layoffs as Layoff[]).map((layoff: Layoff, index: number) => (
            <article
              key={layoff._id}
              className={`news-card p-4 md:p-5 animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-display text-lg md:text-xl text-white">
                  {layoff.companyName}
                </span>
                {layoff.aiRelated && (
                  <span className="badge-ai">AI-DRIVEN</span>
                )}
                <span className="font-mono text-xs text-gray-600 ml-auto">
                  {formatDistanceToNow(layoff.eventDate)}
                </span>
              </div>

              {/* Headline */}
              <h4 className="font-mono text-sm md:text-base text-gray-300 mb-3 leading-relaxed">
                {layoff.headline}
              </h4>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-500">AFFECTED:</span>
                  <span className="font-display text-xl md:text-2xl text-warning-red">
                    {layoff.affectedCount.toLocaleString()}
                  </span>
                </div>
                {layoff.percentageOfWorkforce && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">WORKFORCE:</span>
                    <span className="font-mono text-sm text-amber">
                      {layoff.percentageOfWorkforce}%
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <p className="font-mono text-xs text-gray-500 leading-relaxed mb-2">
                {layoff.summary}
              </p>

              {/* AI Reason */}
              {layoff.aiReason && (
                <div className="mt-3 p-3 border border-warning-red/30 bg-warning-red/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning-red" />
                    <span className="font-mono text-xs text-warning-red">AI_FACTOR:</span>
                  </div>
                  <p className="font-mono text-xs text-gray-400 leading-relaxed">
                    {layoff.aiReason}
                  </p>
                </div>
              )}

              {/* Source link */}
              {layoff.sourceUrl && (
                <a
                  href={layoff.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 font-mono text-xs text-terminal-green hover:underline"
                >
                  [VIEW_SOURCE]
                </a>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

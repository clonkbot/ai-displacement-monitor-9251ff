import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Layoff {
  _id: Id<"layoffs">;
  companyName: string;
  affectedCount: number;
  percentageOfWorkforce?: number;
  aiReason?: string;
  summary: string;
}

export function AnalysisPanel() {
  const layoffs = useQuery(api.layoffs.listAiRelated, { limit: 10 });
  const latestAnalysis = useQuery(api.analysis.latest);
  const chat = useAction(api.ai.chat);
  const saveAnalysis = useMutation(api.analysis.save);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    if (!layoffs || layoffs.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const layoffSummary = (layoffs as Layoff[])
        .map(
          (l: Layoff) =>
            `- ${l.companyName}: ${l.affectedCount} employees (${l.percentageOfWorkforce || "?"}% of workforce). Reason: ${l.aiReason || l.summary}`
        )
        .join("\n");

      const response = await chat({
        systemPrompt: `You are a dystopian analyst tracking AI-driven job displacement. Your tone is matter-of-fact but ominous. You observe patterns in corporate layoffs and provide brief, stark analysis. Keep responses under 150 words. Use short paragraphs. Be direct and slightly unsettling.`,
        messages: [
          {
            role: "user",
            content: `Analyze these recent AI-related layoffs and identify patterns:\n\n${layoffSummary}\n\nProvide a brief analysis of trends, which sectors are most affected, and what this suggests about the near future.`,
          },
        ],
      });

      await saveAnalysis({
        content: response,
        layoffIds: (layoffs as Layoff[]).map((l: Layoff) => l._id),
      });
    } catch (err) {
      setError("ANALYSIS FAILED: AI system unresponsive");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="border border-gray-800 bg-black/50">
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terminal-green" />
          <h3 className="font-display text-lg text-terminal-green">
            AI_ANALYSIS
          </h3>
        </div>
        <span className="font-mono text-xs text-gray-600">
          GPT_MODULE
        </span>
      </div>

      <div className="p-4">
        {latestAnalysis ? (
          <div className="space-y-3">
            <div className="font-mono text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
              {latestAnalysis.content}
            </div>
            <div className="pt-2 border-t border-gray-800">
              <span className="font-mono text-xs text-gray-600">
                GENERATED: {new Date(latestAnalysis.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-mono text-xs text-gray-500 mb-3">
              NO ANALYSIS ON RECORD
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 border border-warning-red bg-warning-red/10 font-mono text-xs text-warning-red">
            {error}
          </div>
        )}

        <button
          onClick={generateAnalysis}
          disabled={isAnalyzing || !layoffs || layoffs.length === 0}
          className="btn-terminal w-full mt-4 text-sm"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-ping" />
              ANALYZING PATTERNS...
            </span>
          ) : (
            "GENERATE NEW ANALYSIS"
          )}
        </button>
      </div>
    </div>
  );
}

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StatsGrid } from "./StatsGrid";
import { LayoffFeed } from "./LayoffFeed";
import { AnalysisPanel } from "./AnalysisPanel";
import { SubmitTip } from "./SubmitTip";

export function Dashboard() {
  const stats = useQuery(api.layoffs.getStats);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
        {/* Layoff Feed - Takes 2 columns */}
        <div className="lg:col-span-2">
          <LayoffFeed />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnalysisPanel />
          <SubmitTip />
        </div>
      </div>
    </main>
  );
}

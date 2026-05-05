interface Stats {
  totalLayoffEvents: number;
  aiRelatedEvents: number;
  totalAffected: number;
  aiAffected: number;
  companiesAffected: number;
  recentAffected: number;
  recentEvents: number;
}

interface StatsGridProps {
  stats: Stats | undefined;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "TOTAL_EVENTS",
      value: stats?.totalLayoffEvents ?? 0,
      suffix: "",
      color: "text-terminal-green",
    },
    {
      label: "AI_RELATED",
      value: stats?.aiRelatedEvents ?? 0,
      suffix: "",
      color: "text-warning-red",
      highlight: true,
    },
    {
      label: "COMPANIES_AFFECTED",
      value: stats?.companiesAffected ?? 0,
      suffix: "",
      color: "text-amber",
    },
    {
      label: "30_DAY_CASUALTIES",
      value: stats?.recentAffected ?? 0,
      suffix: "",
      color: "text-warning-red",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className={`stat-card p-4 md:p-5 animate-slide-up stagger-${index + 1}`}
        >
          <div className="font-mono text-xs text-gray-500 mb-2 tracking-wider">
            {item.label}
          </div>
          <div className={`font-display text-2xl md:text-3xl lg:text-4xl ${item.color} tabular-nums`}>
            {item.value.toLocaleString()}
            {item.suffix}
          </div>
          {item.highlight && (
            <div className="mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-red animate-pulse" />
              <span className="font-mono text-xs text-warning-red">
                CRITICAL
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

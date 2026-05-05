import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

interface HeaderProps {
  onSignOut: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  const stats = useQuery(api.layoffs.getStats);
  const [displayCount, setDisplayCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animated counter effect
  useEffect(() => {
    if (stats?.aiAffected) {
      const duration = 2000;
      const steps = 60;
      const increment = stats.aiAffected / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stats.aiAffected) {
          setDisplayCount(stats.aiAffected);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [stats?.aiAffected]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        {/* Top bar with time and status */}
        <div className="flex items-center justify-between mb-3 md:mb-4 text-xs font-mono">
          <div className="flex items-center gap-2 md:gap-4 text-gray-500">
            <span className="hidden sm:inline">SYS_TIME:</span>
            <span className="text-terminal-green">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="text-gray-700">|</span>
            <span className="hidden sm:inline">STATUS:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-terminal-green">MONITORING</span>
            </span>
          </div>
          <button
            onClick={onSignOut}
            className="text-gray-500 hover:text-warning-red transition-colors"
          >
            [DISCONNECT]
          </button>
        </div>

        {/* Main header content */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-warning-red text-xs font-mono tracking-widest pulse-alert px-2 py-0.5 border border-warning-red">
                ALERT
              </span>
              <span className="text-amber text-xs font-mono">LIVE FEED</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-terminal-green tracking-tight leading-none glitch-text">
              AI DISPLACEMENT
            </h1>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 tracking-tight">
              MONITOR_v2.0
            </h2>
            <p className="text-gray-600 text-xs md:text-sm font-mono mt-2 max-w-md">
              TRACKING WORKFORCE REDUCTION EVENTS ATTRIBUTED TO ARTIFICIAL INTELLIGENCE SYSTEMS
            </p>
          </div>

          {/* Main counter */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-gray-500 text-xs font-mono mb-1">
              TOTAL_DISPLACED_BY_AI:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl text-warning-red tabular-nums flicker">
                {displayCount.toLocaleString()}
              </span>
              <span className="text-gray-600 text-sm font-mono">HUMANS</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-mono">
              <span className="text-gray-600">LAST_30_DAYS:</span>
              <span className="text-amber">
                +{stats?.recentAffected?.toLocaleString() ?? '---'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning ticker */}
      <div className="bg-warning-red/10 border-t border-b border-warning-red/30 py-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap font-mono text-xs text-warning-red/80">
          <span className="mx-4">/// WARNING: AI DISPLACEMENT EVENTS ACCELERATING ///</span>
          <span className="mx-4">/// FORTUNE 500 COMPANIES REDUCING HEADCOUNT ///</span>
          <span className="mx-4">/// AUTOMATION REPLACING KNOWLEDGE WORKERS ///</span>
          <span className="mx-4">/// PRODUCTIVITY GAINS = WORKFORCE REDUCTION ///</span>
          <span className="mx-4">/// WARNING: AI DISPLACEMENT EVENTS ACCELERATING ///</span>
          <span className="mx-4">/// FORTUNE 500 COMPANIES REDUCING HEADCOUNT ///</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </header>
  );
}

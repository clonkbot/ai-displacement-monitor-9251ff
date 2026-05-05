import { useConvexAuth, useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { Scanlines } from "./components/Scanlines";
import { Header } from "./components/Header";
import "./styles.css";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  // Seed data on mount
  const seedCompanies = useMutation(api.companies.seed);
  const seedLayoffs = useMutation(api.layoffs.seed);

  useEffect(() => {
    seedCompanies();
    seedLayoffs();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Scanlines />
        <div className="text-center z-10">
          <div className="text-terminal-green font-mono text-xl animate-pulse">
            INITIALIZING SYSTEM...
          </div>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-8 bg-terminal-green animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-x-hidden">
      <Scanlines />
      <div className="relative z-10">
        <Header onSignOut={signOut} />
        <Dashboard />
        <footer className="border-t border-gray-800 py-4 px-4 text-center">
          <p className="text-gray-600 text-xs font-mono tracking-wide">
            Requested by <span className="text-gray-500">@donethedirt</span> · Built by <span className="text-gray-500">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

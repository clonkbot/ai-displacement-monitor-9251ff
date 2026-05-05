import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Scanlines } from "./Scanlines";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn"
        ? "ACCESS DENIED: Invalid credentials"
        : "REGISTRATION FAILED: Try different credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("ANONYMOUS ACCESS FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Scanlines />

      <div className="w-full max-w-md relative z-10">
        {/* Terminal window frame */}
        <div className="border border-gray-800 bg-black/90">
          {/* Title bar */}
          <div className="border-b border-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning-red" />
              <div className="w-3 h-3 rounded-full bg-amber" />
              <div className="w-3 h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="font-mono text-xs text-gray-500">
              SECURE_TERMINAL_v1.0
            </span>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl md:text-4xl text-terminal-green mb-2 glitch-text">
                AI DISPLACEMENT
              </h1>
              <h2 className="font-display text-xl md:text-2xl text-gray-600">
                MONITOR
              </h2>
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-terminal-green to-transparent" />
            </div>

            <div className="font-mono text-xs text-gray-500 mb-6">
              <p className="mb-1">{`>`} ESTABLISHING SECURE CONNECTION...</p>
              <p className="mb-1">{`>`} AUTHENTICATION REQUIRED</p>
              <p className="text-terminal-green cursor-blink">
                {`>`} AWAITING CREDENTIALS
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1">
                  USER_EMAIL:
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-terminal"
                  placeholder="operator@system.net"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-500 mb-1">
                  ACCESS_KEY:
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-terminal"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="border border-warning-red bg-warning-red/10 p-3 font-mono text-xs text-warning-red">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-terminal w-full"
              >
                {isLoading ? (
                  <span className="animate-pulse">PROCESSING...</span>
                ) : flow === "signIn" ? (
                  "AUTHENTICATE"
                ) : (
                  "REGISTER NEW USER"
                )}
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="font-mono text-xs text-gray-500 hover:text-terminal-green transition-colors"
                disabled={isLoading}
              >
                [{flow === "signIn" ? "CREATE NEW ACCOUNT" : "EXISTING USER LOGIN"}]
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 font-mono text-xs text-gray-700">
                    OR
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnonymous}
                disabled={isLoading}
                className="btn-terminal btn-danger w-full text-sm"
              >
                ENTER AS GUEST
              </button>
              <p className="text-center font-mono text-xs text-gray-600">
                Anonymous access granted. Limited features.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 px-4 py-2">
            <p className="font-mono text-xs text-gray-700 text-center">
              SECURE CONNECTION ESTABLISHED · ALL DATA MONITORED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

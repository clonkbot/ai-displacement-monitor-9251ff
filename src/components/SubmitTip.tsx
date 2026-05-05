import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Submission {
  _id: Id<"submissions">;
  companyName: string;
  status: string;
}

export function SubmitTip() {
  const [companyName, setCompanyName] = useState("");
  const [headline, setHeadline] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubmission = useMutation(api.submissions.create);
  const mySubmissions = useQuery(api.submissions.mySubmissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !headline.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createSubmission({
        companyName: companyName.trim(),
        headline: headline.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
      });
      setCompanyName("");
      setHeadline("");
      setSourceUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("SUBMISSION FAILED: Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-800 bg-black/50">
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber" />
          <h3 className="font-display text-lg text-amber">SUBMIT_INTEL</h3>
        </div>
        <span className="font-mono text-xs text-gray-600">CROWDSOURCE</span>
      </div>

      <div className="p-4">
        <p className="font-mono text-xs text-gray-500 mb-4">
          Report AI-related layoffs. All submissions are reviewed before publication.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-mono text-xs text-gray-500 mb-1">
              COMPANY:
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-terminal text-sm"
              placeholder="Company name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-500 mb-1">
              HEADLINE:
            </label>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="input-terminal text-sm resize-none"
              rows={3}
              placeholder="Brief description of the layoff event"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-500 mb-1">
              SOURCE_URL: <span className="text-gray-700">(optional)</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="input-terminal text-sm"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="p-2 border border-warning-red bg-warning-red/10 font-mono text-xs text-warning-red">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2 border border-terminal-green bg-terminal-green/10 font-mono text-xs text-terminal-green">
              SUBMISSION RECEIVED. PENDING REVIEW.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !companyName.trim() || !headline.trim()}
            className="btn-terminal w-full text-sm"
          >
            {isSubmitting ? "TRANSMITTING..." : "SUBMIT REPORT"}
          </button>
        </form>

        {/* Recent submissions */}
        {mySubmissions && mySubmissions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <h4 className="font-mono text-xs text-gray-500 mb-2">
              YOUR_SUBMISSIONS:
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(mySubmissions as Submission[]).slice(0, 3).map((sub: Submission) => (
                <div
                  key={sub._id}
                  className="p-2 border border-gray-800 font-mono text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-300 truncate">
                      {sub.companyName}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] uppercase ${
                        sub.status === "approved"
                          ? "bg-terminal-green/20 text-terminal-green"
                          : sub.status === "rejected"
                            ? "bg-warning-red/20 text-warning-red"
                            : "bg-amber/20 text-amber"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

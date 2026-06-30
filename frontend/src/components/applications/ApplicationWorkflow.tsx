import { Check } from "lucide-react";
import type { ApplicationStatus } from "@/types/application";

// The 5 stages of the application journey (Offer is merged into Outcome)
const STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "wishlist", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "oa", label: "OA" },
  { key: "interview", label: "Interview" },
];

const TERMINAL_CONFIG: Partial<Record<ApplicationStatus, { label: string; colorClass: string; bgClass: string }>> = {
  offer:     { label: "Offer",     colorClass: "text-amber-400",   bgClass: "border-amber-500 bg-amber-500/80" },
  accepted:  { label: "Accepted",  colorClass: "text-emerald-400", bgClass: "border-emerald-500 bg-emerald-500" },
  rejected:  { label: "Rejected",  colorClass: "text-red-400",     bgClass: "border-red-500 bg-red-500" },
  withdrawn: { label: "Withdrawn", colorClass: "text-zinc-400",    bgClass: "border-zinc-600 bg-zinc-700" },
  ghosted:   { label: "Ghosted",   colorClass: "text-zinc-500",    bgClass: "border-zinc-700 bg-zinc-800" },
};

const STAGE_RANK: Record<ApplicationStatus, number> = {
  wishlist: 0, applied: 1, oa: 2, interview: 3,
  offer: 4, accepted: 4, rejected: 4, withdrawn: 4, ghosted: 4,
};

export default function ApplicationWorkflow({ status }: { status: ApplicationStatus }) {
  const currentRank = STAGE_RANK[status];
  const isTerminal = status in TERMINAL_CONFIG;
  const terminal = TERMINAL_CONFIG[status];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4">
      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const stageRank = STAGE_RANK[stage.key];
          const isDone = currentRank > stageRank;
          const isCurrent = !isTerminal && status === stage.key;

          return (
            <div key={stage.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isDone || (isTerminal && stageRank < 4)
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isCurrent
                        ? "border-white bg-white text-zinc-950"
                        : "border-zinc-700 bg-zinc-900 text-zinc-600",
                  ].join(" ")}
                >
                  {isDone || (isTerminal && stageRank < 4) ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={[
                    "whitespace-nowrap text-[10px] font-medium",
                    isDone || (isTerminal && stageRank < 4)
                      ? "text-emerald-400"
                      : isCurrent
                        ? "text-white"
                        : "text-zinc-600",
                  ].join(" ")}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector */}
              <div
                className={[
                  "mb-5 h-px flex-1",
                  isDone || isTerminal ? "bg-emerald-500/50" : "bg-zinc-800",
                ].join(" ")}
              />
            </div>
          );
        })}

        {/* Outcome node */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={[
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
              isTerminal
                ? (terminal?.bgClass ?? "border-zinc-600 bg-zinc-700") + " text-white"
                : "border-zinc-700 bg-zinc-900 text-zinc-600",
            ].join(" ")}
          >
            {isTerminal ? <Check size={13} strokeWidth={2.5} /> : "→"}
          </div>
          <span
            className={[
              "whitespace-nowrap text-[10px] font-medium",
              isTerminal ? (terminal?.colorClass ?? "text-zinc-400") : "text-zinc-600",
            ].join(" ")}
          >
            {isTerminal ? (terminal?.label ?? "Outcome") : "Outcome"}
          </span>
        </div>
      </div>
    </div>
  );
}

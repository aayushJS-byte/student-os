import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, Circle, ArrowRight, BookOpen, Flame,
} from "lucide-react";
import { useProgressStats } from "@/hooks/prep/usePrep";

// ─── SVG ring ─────────────────────────────────────────────────────────────────

function Ring({
  pct,
  size = 96,
}: {
  pct: number;
  size?: number;
}) {
  const strokeW = 9;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);

  return (
    <svg width={size} height={size} className="-rotate-90" style={{ overflow: "visible" }}>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#27272a" strokeWidth={strokeW}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#prep-ring-grad)"
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="prep-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────────

function Bar({
  pct, color, delay = 0,
}: { pct: number; color: string; delay?: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.75, ease: "easeOut", delay }}
      />
    </div>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

export default function PrepTrackerWidget() {
  const { data: stats, isLoading } = useProgressStats();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { solved, attempted, total } = stats;
  const remaining = Math.max(0, total - solved - attempted);
  const solvedPct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const attemptedPct = total > 0 ? Math.round((attempted / total) * 100) : 0;
  const isEmpty = solved === 0 && attempted === 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <BookOpen size={13} className="text-indigo-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">Prep Progress</h2>
        </div>
        <Link
          to="/prep"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
        >
          Practice <ArrowRight size={11} />
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Body */}
      <div className="px-6 py-5">
        {isEmpty ? (
          // ── Empty state ──────────────────────────────────────────────────────
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700">
              <Flame size={20} className="text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">No questions solved yet</p>
              <p className="mt-0.5 text-xs text-zinc-600">
                {total} questions from real IIT BHU drives waiting.
              </p>
            </div>
            <Link
              to="/prep"
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              Start Practicing <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          // ── Progress layout ──────────────────────────────────────────────────
          <div className="flex items-center gap-6">
            {/* Ring */}
            <div className="relative shrink-0">
              <Ring pct={solvedPct} size={96} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{solvedPct}%</span>
                <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-500">solved</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex-1 space-y-4">
              {/* Stat strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: CheckCircle2, label: "Solved", value: solved, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { icon: Clock,        label: "Tried",  value: attempted, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { icon: Circle,       label: "Left",   value: remaining, color: "text-zinc-500",  bg: "bg-zinc-800" },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className={`flex flex-col items-center rounded-lg ${bg} py-2.5 px-1`}>
                    <Icon size={13} className={color} />
                    <span className="mt-1 text-base font-bold text-white tabular-nums">{value}</span>
                    <span className="text-[10px] text-zinc-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Solved
                    </span>
                    <span>{solved}/{total}</span>
                  </div>
                  <Bar pct={solvedPct} color="bg-gradient-to-r from-emerald-600 to-emerald-400" delay={0} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                      Attempted
                    </span>
                    <span>{attempted}/{total}</span>
                  </div>
                  <Bar pct={attemptedPct} color="bg-gradient-to-r from-amber-600 to-amber-400" delay={0.1} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

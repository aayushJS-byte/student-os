import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Briefcase, GitCommitHorizontal, Trophy } from "lucide-react";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Full placement pipeline",
    desc: "Wishlist → Applied → OA → Interview → Offer. Every stage, one place.",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    desc: "Email alerts before apply-by dates, OA sessions, interviews, and offer deadlines.",
  },
  {
    icon: GitCommitHorizontal,
    title: "Follow-up cues",
    desc: "Ghost nudges when an application goes quiet so you know when to reach out.",
  },
  {
    icon: Trophy,
    title: "Offer tracking",
    desc: "Log stipend, CTC, and acceptance deadlines. Compare across every offer.",
  },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-950">

      {/* ── Left panel: branding + features (desktop only) ────────────────── */}
      <div className="relative hidden lg:flex lg:w-[44%] xl:w-[42%] shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900 p-12">

        {/* Dot-grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Fade-out gradient so dots don't reach the edges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-900/60 via-transparent to-zinc-900/80" />

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-between">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 select-none">
              <span className="text-lg font-bold tracking-tight text-white">Student</span>
              <span className="text-lg font-bold tracking-tight text-indigo-400">OS</span>
            </div>
          </div>

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-10"
          >
            <div>
              <h1 className="text-3xl font-bold leading-tight text-white">
                Track every application.<br />
                Never miss a deadline.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                The placement management tool built for IIT BHU students — from
                the first shortlist to the signed offer.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-5">
              {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                    <Icon size={13} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer note */}
          <p className="text-xs text-zinc-600">
            IIT BHU · Placement Tracker · Institute email required
          </p>
        </div>
      </div>

      {/* ── Right panel: auth forms ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile brand header */}
        <div className="flex h-14 shrink-0 items-center border-b border-zinc-800 px-5 lg:hidden">
          <span className="text-sm font-bold tracking-tight text-white">Student</span>
          <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
        </div>

        {/* Form content — vertically centered */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

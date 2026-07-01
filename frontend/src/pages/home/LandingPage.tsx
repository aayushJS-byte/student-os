import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase, CalendarDays, BarChart3, BookOpen,
  Bell, ArrowRight, ChevronRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Briefcase,
    title: "Full pipeline tracking",
    desc: "Every application from wishlist to signed offer. Forward-only stage transitions with live countdowns at each step.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    glow: "group-hover:shadow-indigo-500/10",
  },
  {
    icon: CalendarDays,
    title: "Placement calendar",
    desc: "OAs, interviews, and deadlines on a single month view. Click any day to see what's due — no more mental juggling.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    icon: BookOpen,
    title: "PYQ prep tracker",
    desc: "141 real company questions across 27 companies and 4 sections. Track todo, attempted, and solved — per company.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    desc: "Conversion funnel, offer rate, month-on-month trend, source breakdown. Know exactly how your season is going.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    desc: "Auto email alerts 7d, 3d, 1d before every deadline, OA, and interview. Ghost nudges when an app goes quiet.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    glow: "group-hover:shadow-blue-500/10",
  },
];

const PIPELINE = [
  { label: "Saved",     color: "bg-zinc-500",    ring: "ring-zinc-500/30" },
  { label: "Applied",   color: "bg-indigo-400",  ring: "ring-indigo-400/30" },
  { label: "OA",        color: "bg-violet-400",  ring: "ring-violet-400/30" },
  { label: "Interview", color: "bg-blue-400",    ring: "ring-blue-400/30" },
  { label: "Offer",     color: "bg-emerald-400", ring: "ring-emerald-400/30" },
];

const STATS = [
  { value: "141", label: "PYQs seeded" },
  { value: "27",  label: "Companies" },
  { value: "8",   label: "Pipeline stages" },
  { value: "5",   label: "Event types tracked" },
];

// ─── Mock Dashboard Preview ────────────────────────────────────────────────────

function DashboardPreview() {
  const apps = [
    { company: "Google",    role: "SDE Intern",    status: "Interview", dot: "bg-blue-400",    text: "text-blue-400" },
    { company: "Microsoft", role: "SWE Intern",    status: "OA",        dot: "bg-violet-400",  text: "text-violet-400" },
    { company: "Goldman",   role: "Tech Analyst",  status: "Applied",   dot: "bg-indigo-400",  text: "text-indigo-400" },
    { company: "Sprinklr",  role: "Product Intern",status: "Offer",     dot: "bg-emerald-400", text: "text-emerald-400" },
  ];

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/40 backdrop-blur overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/60">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-3 text-[10px] text-zinc-600">StudentOS · Dashboard</span>
      </div>

      <div className="p-4 space-y-3">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "24", l: "Total", c: "text-white" },
            { v: "8",  l: "Active", c: "text-indigo-400" },
            { v: "2",  l: "Offers", c: "text-emerald-400" },
          ].map(({ v, l, c }) => (
            <div key={l} className="rounded-lg bg-zinc-800/60 px-2.5 py-2 border border-zinc-800/40">
              <p className={`text-sm font-bold ${c}`}>{v}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* App list */}
        <div className="space-y-1.5">
          {apps.map(({ company, role, status, dot, text }) => (
            <div
              key={company}
              className="flex items-center gap-2.5 rounded-lg bg-zinc-800/40 px-2.5 py-2 border border-zinc-800/30"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-700/60">
                <span className="text-[10px] font-bold text-zinc-300">{company[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-zinc-200 truncate">{company}</p>
                <p className="text-[9px] text-zinc-500 truncate">{role}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-zinc-800/80 px-2 py-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                <span className={`text-[9px] font-medium ${text}`}>{status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mini calendar strip */}
        <div className="rounded-lg border border-zinc-800/40 bg-zinc-800/20 px-3 py-2">
          <p className="text-[9px] text-zinc-600 mb-1.5 font-medium uppercase tracking-wider">Upcoming</p>
          <div className="space-y-1">
            {[
              { label: "Google – Round 2",  date: "Today, 2:00 PM",  dot: "bg-blue-400" },
              { label: "Microsoft OA",      date: "Thu, 10:00 AM",  dot: "bg-violet-400" },
            ].map(({ label, date, dot }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                <span className="text-[9px] text-zinc-400 flex-1 truncate">{label}</span>
                <span className="text-[9px] text-zinc-600 shrink-0">{date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <span className="text-[11px] font-black text-indigo-400">S</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Student</span>
          <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
        </Link>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500"
          >
            Get started
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Backgrounds */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

            {/* Left: copy */}
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-indigo-300">
                    Built for IIT BHU · Placement Season
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight">
                  Placement season<br />
                  is chaos.<br />
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    StudentOS isn't.
                  </span>
                </h1>

                {/* Sub */}
                <p className="text-base leading-relaxed text-zinc-400">
                  Track every application, prep with real company PYQs, visualise your calendar, and never miss an OA or interview — one dashboard for your entire placement season.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
                  >
                    Get started free
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                  >
                    Log in
                    <ChevronRight size={13} className="text-zinc-500" />
                  </Link>
                </div>

                {/* Pipeline stages */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-2">
                  {PIPELINE.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${s.color} ring-2 ${s.ring}`} />
                      <span className="text-xs text-zinc-500">{s.label}</span>
                      {i < PIPELINE.length - 1 && (
                        <span className="text-zinc-700 text-xs ml-0.5">→</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fine print */}
                <p className="text-xs text-zinc-600">
                  CHE 2024 batch only · name.che24@itbhu.ac.in
                </p>
              </motion.div>
            </div>

            {/* Right: dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="w-full max-w-sm lg:max-w-none lg:w-[340px] xl:w-[380px] shrink-0"
            >
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="mt-1 text-xs text-zinc-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Everything you need</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            One platform. Every placement move.
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            All the tools a final-year student needs during placement season — no spreadsheets, no missed deadlines.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, glow }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl ${glow}`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${bg}`}>
                <Icon size={16} className={color} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: FEATURES.length * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-5 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-white mb-1.5">Ready for season?</p>
              <p className="text-xs leading-relaxed text-zinc-400">
                Sign up with your institute email and have your first application tracked in under a minute.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Get started
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-[9px] font-black text-indigo-400">S</span>
            </div>
            <span className="text-sm font-bold text-white">Student</span>
            <span className="text-sm font-bold text-indigo-400">OS</span>
          </div>
          <p className="text-xs text-zinc-600 text-center">
            IIT BHU · CHE 2024 batch · name.che24@itbhu.ac.in only
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Log in</Link>
            <Link to="/register" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

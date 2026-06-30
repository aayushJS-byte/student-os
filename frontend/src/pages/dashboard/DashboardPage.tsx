import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAnalytics } from "@/hooks/applications/useAnalytics";
import type { AnalyticsData } from "@/types/application";

const SOURCE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  naukri: "Naukri",
  company_site: "Company Site",
  campus: "Campus",
  referral: "Referral",
  internshala: "Internshala",
  wellfound: "Wellfound",
  other: "Other",
};

const JOB_TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
};

const FUNNEL_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
];

const FUNNEL_TEXT = [
  "text-indigo-400",
  "text-violet-400",
  "text-blue-400",
  "text-amber-400",
  "text-emerald-400",
];

const DONUT_COLORS = [
  "#818cf8",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#fb923c",
  "#38bdf8",
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: 8,
    fontSize: 12,
    color: "#e4e4e7",
  },
  labelStyle: { color: "#a1a1aa" },
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent ?? "text-white"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-600">{sub}</p>}
    </div>
  );
}

// ─── Conversion Funnel ────────────────────────────────────────────────────────

function FunnelSection({ funnel }: { funnel: AnalyticsData["funnel"] }) {
  const max = funnel[0]?.count ?? 1;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="mb-5 text-sm font-semibold text-zinc-300">Conversion Funnel</h2>
      <div className="space-y-3">
        {funnel.map((item, i) => {
          const pct = max > 0 ? Math.round((item.count / max) * 100) : 0;
          return (
            <div key={item.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${FUNNEL_TEXT[i]}`}>{item.stage}</span>
                <div className="flex items-center gap-3 text-zinc-500">
                  <span className="font-semibold text-white">{item.count}</span>
                  {item.conversion !== null && item.conversion !== 100 && (
                    <span className="w-12 text-right">{item.conversion}%</span>
                  )}
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className={`h-2 rounded-full ${FUNNEL_COLORS[i]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {funnel[0]?.count === 0 && (
        <p className="mt-4 text-xs text-zinc-600">No applications logged yet.</p>
      )}
    </div>
  );
}

// ─── Activity Over Time bar chart ─────────────────────────────────────────────

function ActivityChart({ byMonth }: { byMonth: AnalyticsData["byMonth"] }) {
  const formatted = byMonth.map(({ _id, count }, idx, arr) => {
    const [year, month] = _id.split("-");
    const label = new Date(Number(year), Number(month) - 1).toLocaleString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    return { label, count, fill: idx === arr.length - 1 ? "#818cf8" : "#3730a3" };
  });

  if (formatted.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="mb-5 text-sm font-semibold text-zinc-300">Activity Over Time</h2>
        <p className="text-xs text-zinc-600">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="mb-5 text-sm font-semibold text-zinc-300">
        Activity Over Time
        <span className="ml-2 text-xs font-normal text-zinc-600">
          (last {formatted.length} months)
        </span>
      </h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formatted} barSize={20} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "#52525b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#52525b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={TOOLTIP_STYLE.contentStyle}
            labelStyle={TOOLTIP_STYLE.labelStyle}
            itemStyle={{ color: "#818cf8" }}
          />
          <Bar dataKey="count" name="Applications" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({
  title,
  data,
  labelMap,
  emptyHint,
}: {
  title: string;
  data: { _id: string; count: number }[];
  labelMap: Record<string, string>;
  emptyHint?: string;
}) {
  const chartData = data.map((item, idx) => ({
    name: labelMap[item._id] ?? item._id,
    value: item.count,
    fill: DONUT_COLORS[idx % DONUT_COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="mb-5 text-sm font-semibold text-zinc-300">{title}</h2>
      {data.length === 0 ? (
        <div>
          <p className="text-xs text-zinc-600">No data yet.</p>
          {emptyHint && <p className="mt-1 text-xs text-zinc-700">{emptyHint}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={60}
                  paddingAngle={2}
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE.contentStyle}
                  itemStyle={{ color: "#e4e4e7" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{total}</span>
              <span className="text-[10px] text-zinc-500">total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="min-w-0 flex-1 space-y-2.5">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="truncate text-xs text-zinc-400">{item.name}</span>
                </div>
                <span className="shrink-0 text-xs font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Grid ────────────────────────────────────────────────────────────

function PipelineGrid({ pipeline }: { pipeline: AnalyticsData["pipeline"] }) {
  const stages = [
    { key: "wishlist",  label: "Saved",     color: "text-zinc-400"   },
    { key: "applied",   label: "Applied",   color: "text-blue-400"   },
    { key: "oa",        label: "OA",        color: "text-violet-400" },
    { key: "interview", label: "Interview", color: "text-amber-400"  },
    { key: "rejected",  label: "Rejected",  color: "text-red-400"    },
    { key: "withdrawn", label: "Withdrawn", color: "text-orange-400" },
    { key: "ghosted",   label: "Ghosted",   color: "text-zinc-500"   },
    { key: "accepted",  label: "Accepted",  color: "text-emerald-400"},
  ] as const;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="mb-5 text-sm font-semibold text-zinc-300">Pipeline Breakdown</h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {stages.map(({ key, label, color }) => {
          const count = pipeline[key as keyof typeof pipeline] ?? 0;
          return (
            <div key={key} className="text-center">
              <p className={`text-xl font-bold ${count > 0 ? color : "text-zinc-700"}`}>
                {count}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-600">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const { data: analytics, isLoading } = useAnalytics();

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Here's how your placement hunt is going.
            </p>
          </div>
          {user?.role === "ADMIN" && (
            <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              Admin
            </span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-800/60" />
            ))}
          </div>
        )}

        {analytics && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KPICard
                label="Total Applied"
                value={analytics.kpi.totalApplications}
                sub="applications logged"
              />
              <KPICard
                label="Active"
                value={analytics.kpi.active}
                sub="in pipeline"
                accent="text-blue-400"
              />
              <KPICard
                label="Offers"
                value={analytics.kpi.offers}
                sub="received"
                accent="text-amber-400"
              />
              <KPICard
                label="Acceptance Rate"
                value={
                  analytics.kpi.acceptanceRate !== null
                    ? `${analytics.kpi.acceptanceRate}%`
                    : "—"
                }
                sub={
                  analytics.kpi.ghostRate !== null
                    ? `${analytics.kpi.ghostRate}% ghosted`
                    : undefined
                }
                accent="text-emerald-400"
              />
            </div>

            {/* Funnel + Activity */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FunnelSection funnel={analytics.funnel} />
              <ActivityChart byMonth={analytics.byMonth} />
            </div>

            {/* Source + Job Type donut charts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DonutChart
                title="Where You're Applying"
                data={analytics.bySource}
                labelMap={SOURCE_LABELS}
                emptyHint="Set a source when logging applications to see this."
              />
              <DonutChart
                title="Role Type Breakdown"
                data={analytics.byJobType}
                labelMap={JOB_TYPE_LABELS}
              />
            </div>

            {/* Pipeline grid */}
            <PipelineGrid pipeline={analytics.pipeline} />
          </>
        )}

        {/* Empty state */}
        {!isLoading && analytics && analytics.pipeline.total === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <p className="text-sm text-zinc-500">
              No applications yet — head to{" "}
              <a href="/applications" className="text-indigo-400 underline underline-offset-2">
                Applications
              </a>{" "}
              to log your first one.
            </p>
          </div>
        )}
      </motion.div>
    </main>
  );
}

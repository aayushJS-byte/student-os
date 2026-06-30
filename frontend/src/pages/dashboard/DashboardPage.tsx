import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import { useApplicationStats } from "@/hooks/applications/useApplicationStats";
import { APPLICATION_STATUS_CONFIG } from "@/constants/application";
import Button from "@/components/ui/Button";
import type { ApplicationStatus } from "@/types/application";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white ring-1 ring-zinc-600">
      {initials}
    </span>
  );
}

const STAT_STATUSES: ApplicationStatus[] = [
  "applied",
  "oa",
  "interview",
  "offer",
  "accepted",
  "rejected",
];

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const logout = useLogout();
  const { data: stats } = useApplicationStats();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-zinc-400" />
            <span className="text-sm font-semibold text-white">StudentOS</span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <Avatar name={user.name} />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </>
            )}

            <Button
              variant="ghost"
              isLoading={logout.isPending}
              onClick={() => logout.mutate()}
              className="w-auto px-3"
              aria-label="Sign out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back, {user?.name.split(" ")[0]}
            </h1>
            {user?.role === "ADMIN" && (
              <span className="mt-2 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                Admin
              </span>
            )}
          </div>

          {/* Application Stats */}
          {stats && stats.total > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-300">
                  Application Pipeline
                </h2>
                <p className="text-xs text-zinc-500">{stats.total} total</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {STAT_STATUSES.map((status) => {
                  const count = stats[status] ?? 0;
                  const config = APPLICATION_STATUS_CONFIG[status];
                  return (
                    <div
                      key={status}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center"
                    >
                      <p className={`text-xl font-bold ${count > 0 ? config.className.split(" ")[0] : "text-zinc-600"}`}>
                        {count}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{config.label}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick links */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/applications"
              className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                  <Briefcase size={16} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Applications</p>
                  <p className="text-xs text-zinc-500">
                    {stats
                      ? `${stats.total} tracked`
                      : "Track your placements"}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-700 transition-colors group-hover:text-zinc-400"
              />
            </Link>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

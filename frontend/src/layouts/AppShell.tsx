import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Trophy, BookOpen, CalendarDays,
  Menu, X, LogOut, ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/offers",       label: "Offers",       icon: Trophy },
  { to: "/calendar",     label: "Calendar",     icon: CalendarDays },
  { to: "/prep",         label: "Prep",         icon: BookOpen },
];

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-1 ring-white/10 ${dim}`}
      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
    >
      {initials}
    </span>
  );
}

// ─── Sidebar content ───────────────────────────────────────────────────────────

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { pathname } = useLocation();
  const { user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2 px-5 border-b border-zinc-800/80">
        <Link
          to="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-1.5 select-none"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 border border-indigo-500/30">
            <span className="text-[10px] font-black text-indigo-400">S</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Student</span>
          <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Navigate
        </p>
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const active =
            pathname === to ||
            (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={onLinkClick}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-indigo-500/10 text-white"
                  : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <Icon
                size={15}
                className={`shrink-0 transition-colors ${active ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"}`}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="shrink-0 border-t border-zinc-800/80 p-3 space-y-1">
        {user && (
          <Link
            to="/profile"
            onClick={onLinkClick}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/70 transition-colors"
          >
            <Avatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[10px] text-zinc-500">{user.email}</p>
            </div>
            <ChevronRight size={12} className="shrink-0 text-zinc-700" />
          </Link>
        )}
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-800/60 hover:text-zinc-300 disabled:opacity-50"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/80">
        <SidebarContent />
      </aside>

      {/* Mobile slide-over */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="ms"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3.5 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Close"
              >
                <X size={15} />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-900/60 px-4 lg:hidden backdrop-blur-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-1.5 select-none">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-[9px] font-black text-indigo-400">S</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Student</span>
            <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

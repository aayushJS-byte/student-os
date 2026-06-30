import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Briefcase, Trophy, Menu, X, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";

// ─── Nav config (extend this as new sections are built) ───────────────────────

const NAV_LINKS = [
  { to: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/offers",       label: "Offers",       icon: Trophy },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-white ring-1 ring-zinc-600">
      {initials}
    </span>
  );
}

// ─── Sidebar innards (shared by desktop + mobile overlay) ────────────────────

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { pathname } = useLocation();
  const { user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center px-5 border-b border-zinc-800">
        <Link
          to="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-0.5 select-none"
        >
          <span className="text-sm font-bold tracking-tight text-white">Student</span>
          <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Menu
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <Icon size={15} className={active ? "text-indigo-400" : "text-zinc-500"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="shrink-0 border-t border-zinc-800 p-3 space-y-1">
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <Avatar name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200 disabled:opacity-50"
        >
          <LogOut size={15} />
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

      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
        <SidebarContent />
      </aside>

      {/* ── Mobile slide-over ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-zinc-950/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 lg:hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3.5 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>

              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center border-b border-zinc-800 bg-zinc-900/80 px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link to="/dashboard" className="ml-3 flex items-center gap-0.5 select-none">
            <span className="text-sm font-bold tracking-tight text-white">Student</span>
            <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

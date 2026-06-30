import { motion } from "framer-motion";
import { LogOut, LayoutDashboard } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import Button from "@/components/ui/Button";

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

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const logout = useLogout();

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
        >
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Placement dashboard coming soon.
          </p>

          {/* Role badge */}
          {user?.role === "ADMIN" && (
            <span className="mt-4 inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              Admin
            </span>
          )}
        </motion.div>
      </main>
    </div>
  );
}

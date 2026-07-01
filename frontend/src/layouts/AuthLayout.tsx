import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">

      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/60 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/20 border border-indigo-500/30">
            <span className="text-[9px] font-black text-indigo-400">S</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Student</span>
          <span className="text-sm font-bold tracking-tight text-indigo-400">OS</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={12} />
          Back to home
        </Link>
      </header>

      {/* Form — vertically centered */}
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <Outlet />
      </div>
    </div>
  );
}

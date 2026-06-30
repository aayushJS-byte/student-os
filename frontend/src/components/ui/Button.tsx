import type { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  isLoading = false,
  variant = "primary",
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-white text-zinc-950 hover:bg-zinc-100 focus-visible:ring-white",
    ghost:
      "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800 focus-visible:ring-zinc-600",
  };

  return (
    <button
      disabled={disabled ?? isLoading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  /**
   * "danger"  — red confirm button (default, for destructive actions like delete)
   * "primary" — white/neutral confirm button (for forward confirmations)
   * "info"    — neutral confirm button, no Cancel (for informational blocks)
   */
  variant?: "danger" | "primary" | "info";
}

const CONFIRM_CLASSES: Record<string, string> = {
  danger:
    "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  primary:
    "border-zinc-600 bg-white/10 text-white hover:bg-white/15",
  info:
    "border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
};

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
          >
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{message}</p>
            <div className="mt-6 flex gap-3">
              {variant !== "info" && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  variant === "info" ? "w-full" : "flex-1",
                  CONFIRM_CLASSES[variant],
                ].join(" ")}
              >
                {isLoading ? "…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

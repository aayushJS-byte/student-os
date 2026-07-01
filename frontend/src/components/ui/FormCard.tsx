import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export default function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

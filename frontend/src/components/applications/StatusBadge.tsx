import { APPLICATION_STATUS_CONFIG } from "@/constants/application";
import type { ApplicationStatus } from "@/types/application";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = APPLICATION_STATUS_CONFIG[status] ?? APPLICATION_STATUS_CONFIG.wishlist;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"}`}
    >
      {config.label}
    </span>
  );
}

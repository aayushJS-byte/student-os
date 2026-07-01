import { formatDate } from "@/utils/date";
import type { ActivityEntry } from "@/types/application";

const ACTION_CONFIG: Record<string, string> = {
  CREATED: "text-zinc-400",
  UPDATED: "text-zinc-400",
  STATUS_CHANGED: "text-blue-400",
  INTERVIEW_ADDED: "text-amber-400",
  INTERVIEW_UPDATED: "text-amber-400",
  INTERVIEW_REMOVED: "text-red-400",
};

interface ActivityLogProps {
  entries: ActivityEntry[];
}

export default function ActivityLog({ entries }: ActivityLogProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return <p className="text-xs text-zinc-600">No activity yet.</p>;
  }

  return (
    <div className="space-y-1">
      {sorted.map((entry) => {
        const color = ACTION_CONFIG[entry.action] ?? "text-zinc-400";
        return (
          <div key={entry._id} className="flex items-start gap-3 py-1.5">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-700" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${color}`}>{entry.details}</p>
              <p className="text-xs text-zinc-600">
                {formatDate(entry.createdAt, "medium")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

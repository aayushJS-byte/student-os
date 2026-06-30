import { useNavigate } from "react-router-dom";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { ApplicationListItem } from "@/types/application";
import { formatDate, isDeadlineSoon, isDeadlinePast, isToday } from "@/utils/date";
import StatusBadge from "./StatusBadge";

interface ApplicationTableProps {
  applications: ApplicationListItem[];
  onEdit: (application: ApplicationListItem) => void;
  onDelete: (application: ApplicationListItem) => void;
}

export default function ApplicationTable({
  applications,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 py-20 text-center">
        <p className="text-sm font-medium text-zinc-400">No applications found</p>
        <p className="mt-1 text-xs text-zinc-600">
          Click "New Application" to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider sm:table-cell">
                Type
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider md:table-cell">
                Applied
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider lg:table-cell">
                Deadline
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {applications.map((app) => {
              const deadlineSoon = isDeadlineSoon(app.deadline);
              const deadlinePast = isDeadlinePast(app.deadline);
              const deadlineToday = isToday(app.deadline);

              return (
                <tr
                  key={app._id}
                  onClick={() => navigate(`/applications/${app._id}`)}
                  className="cursor-pointer transition-colors hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-xs font-semibold text-zinc-300">
                        {app.company[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-white line-clamp-1">
                        {app.company}
                      </span>
                      {app.jobLink && (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-zinc-600 transition-colors hover:text-zinc-400"
                          aria-label="Open job link"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-zinc-300">
                    <span className="line-clamp-1">{app.role}</span>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs capitalize text-zinc-500">
                      {app.jobType}
                    </span>
                  </td>

                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-xs text-zinc-500">
                      {formatDate(app.appliedDate)}
                    </span>
                  </td>

                  <td className="hidden px-4 py-3 lg:table-cell">
                    {app.deadline ? (
                      <span
                        className={`text-xs ${
                          deadlinePast
                            ? "text-red-400"
                            : deadlineToday
                            ? "text-amber-400 font-medium"
                            : deadlineSoon
                            ? "text-amber-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {deadlineToday ? "Today" : formatDate(app.deadline)}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-700">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEdit(app)}
                        className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        aria-label="Edit application"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Delete application"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

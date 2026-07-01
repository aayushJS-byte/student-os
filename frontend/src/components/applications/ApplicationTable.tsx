import { useNavigate } from "react-router-dom";
import { ExternalLink, Pencil, Trash2, ChevronRight, Briefcase } from "lucide-react";
import type { ApplicationListItem } from "@/types/application";
import { formatDate, isDeadlineSoon, isDeadlinePast, isToday } from "@/utils/date";
import StatusBadge from "./StatusBadge";

interface ApplicationTableProps {
  applications: ApplicationListItem[];
  onEdit: (application: ApplicationListItem) => void;
  onDelete: (application: ApplicationListItem) => void;
}

// ─── Company letter avatar ────────────────────────────────────────────────────

function CompanyAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-700/50">
      {name[0].toUpperCase()}
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileCard({
  app, onEdit, onDelete,
}: {
  app: ApplicationListItem;
  onEdit: (a: ApplicationListItem) => void;
  onDelete: (a: ApplicationListItem) => void;
}) {
  const navigate = useNavigate();
  const deadlineSoon = isDeadlineSoon(app.deadline);
  const deadlinePast = isDeadlinePast(app.deadline);
  const deadlineToday = isToday(app.deadline);

  return (
    <div
      onClick={() => navigate(`/applications/${app._id}`)}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors active:bg-zinc-800/60"
    >
      <CompanyAvatar name={app.company} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{app.company}</p>
            <p className="truncate text-xs text-zinc-500">{app.role}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[11px] capitalize text-zinc-600">{app.jobType}</span>
          {app.appliedDate && (
            <span className="text-[11px] text-zinc-600">{formatDate(app.appliedDate)}</span>
          )}
          {app.deadline && (
            <span className={`text-[11px] font-medium ${
              deadlinePast ? "text-red-400" :
              deadlineToday ? "text-amber-400" :
              deadlineSoon ? "text-amber-400" :
              "text-zinc-600"
            }`}>
              {deadlineToday ? "Due today" : `Due ${formatDate(app.deadline)}`}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onEdit(app)}
          className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          aria-label="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(app)}
          className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
          aria-label="Delete"
        >
          <Trash2 size={13} />
        </button>
        <ChevronRight size={13} className="text-zinc-700 ml-0.5" />
      </div>
    </div>
  );
}

// ─── Desktop table ────────────────────────────────────────────────────────────

function DesktopTable({
  applications, onEdit, onDelete,
}: ApplicationTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/70">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Company
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Role
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 sm:table-cell">
                Type
              </th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">
                Applied
              </th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">
                Deadline
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {applications.map((app) => {
              const deadlineSoon = isDeadlineSoon(app.deadline);
              const deadlinePast = isDeadlinePast(app.deadline);
              const deadlineToday = isToday(app.deadline);

              return (
                <tr
                  key={app._id}
                  onClick={() => navigate(`/applications/${app._id}`)}
                  className="cursor-pointer transition-colors hover:bg-zinc-800/30 group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <CompanyAvatar name={app.company} />
                      <span className="font-medium text-white group-hover:text-zinc-100 line-clamp-1">
                        {app.company}
                      </span>
                      {app.jobLink && (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-zinc-700 transition-colors hover:text-zinc-400"
                          aria-label="Open job link"
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    <span className="line-clamp-1">{app.role}</span>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs capitalize text-zinc-500">{app.jobType}</span>
                  </td>

                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-xs text-zinc-500">{formatDate(app.appliedDate)}</span>
                  </td>

                  <td className="hidden px-4 py-3 lg:table-cell">
                    {app.deadline ? (
                      <span className={`text-xs font-medium ${
                        deadlinePast ? "text-red-400" :
                        deadlineToday ? "text-amber-400" :
                        deadlineSoon ? "text-amber-400" :
                        "text-zinc-500"
                      }`}>
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
                        className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        aria-label="Edit application"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 border-dashed py-20 text-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/60 border border-zinc-700 mb-3">
        <Briefcase size={20} className="text-zinc-600" />
      </div>
      <p className="text-sm font-medium text-zinc-400">No applications found</p>
      <p className="mt-1 text-xs text-zinc-600">Click "New Application" to start tracking</p>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ApplicationTable({
  applications, onEdit, onDelete,
}: ApplicationTableProps) {
  if (applications.length === 0) return <EmptyState />;

  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {applications.map((app) => (
          <MobileCard key={app._id} app={app} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <DesktopTable applications={applications} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </>
  );
}

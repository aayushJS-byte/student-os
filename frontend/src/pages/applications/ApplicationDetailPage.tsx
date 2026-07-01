import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Pencil, Trash2,
  MapPin, Briefcase, Calendar, Link2, FileText, Users, Search,
} from "lucide-react";
import { useApplication } from "@/hooks/applications/useApplication";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useDeleteApplication } from "@/hooks/applications/useDeleteApplication";
import { useUpdateStatus } from "@/hooks/applications/useUpdateStatus";
import {
  useAddInterview, useUpdateInterview, useDeleteInterview,
} from "@/hooks/applications/useInterviewMutations";
import {
  APPLICATION_STATUS_CONFIG, ALLOWED_NEXT_STATUSES, SOURCE_OPTIONS,
} from "@/constants/application";
import { formatDate } from "@/utils/date";
import ApplicationForm from "@/components/applications/ApplicationForm";
import ApplicationWorkflow from "@/components/applications/ApplicationWorkflow";
import CountdownTimer from "@/components/applications/CountdownTimer";
import InterviewTimeline from "@/components/applications/InterviewTimeline";
import ActivityLog from "@/components/applications/ActivityLog";
import StatusBadge from "@/components/applications/StatusBadge";
import StageTransitionDrawer from "@/components/applications/StageTransitionDrawer";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import type { ApplicationFormData, InterviewFormData } from "@/schemas/application.schemas";
import type { Application, ApplicationStatus } from "@/types/application";

// ─── Small helpers ────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-zinc-600">{icon}</div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <div className="text-sm text-zinc-200">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}

// ─── Job details (shared by all checkpoints) ─────────────────────────────────

function JobDetails({ application }: { application: Application }) {
  return (
    <SectionCard title="Job Details">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow icon={<MapPin size={14} />} label="Location" value={application.location || null} />
        <InfoRow
          icon={<Briefcase size={14} />}
          label="Job Type"
          value={<span className="capitalize">{application.jobType}</span>}
        />
        {application.jobLink && (
          <InfoRow
            icon={<Link2 size={14} />}
            label="Job Link"
            value={
              <a href={application.jobLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                View posting <ExternalLink size={11} />
              </a>
            }
          />
        )}
        {application.salaryRange && (
          <InfoRow icon={<FileText size={14} />} label="Pay (from JD)" value={application.salaryRange} />
        )}
        {application.source && (
          <InfoRow
            icon={<Search size={14} />}
            label="Found via"
            value={SOURCE_OPTIONS.find((o) => o.value === application.source)?.label ?? application.source}
          />
        )}
      </div>
    </SectionCard>
  );
}

// ─── Checkpoint-specific panels ───────────────────────────────────────────────

function SavedPanel({ application }: { application: Application }) {
  return (
    <>
      {application.deadline && (
        <SectionCard title="Apply-by Deadline">
          <CountdownTimer
            date={application.deadline}
            label="Time to Apply"
            urgentLabel="Deadline Very Soon!"
            doneLabel="Deadline has passed"
            urgentThresholdHours={24}
          />
          <p className="text-xs text-zinc-500">
            {new Date(application.deadline).toLocaleString("en-IN", {
              dateStyle: "long", timeStyle: "short",
            })}
          </p>
        </SectionCard>
      )}
      <JobDetails application={application} />
      {application.notes && (
        <SectionCard title="Notes">
          <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.notes}</p>
        </SectionCard>
      )}
    </>
  );
}

function AppliedPanel({ application }: { application: Application }) {
  return (
    <>
      <JobDetails application={application} />
      <SectionCard title="Application Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={<Calendar size={14} />} label="Applied Date" value={formatDate(application.appliedDate, "medium")} />
          <InfoRow icon={<FileText size={14} />} label="Resume Version" value={application.resumeVersion || null} />
          {application.referral && (
            <InfoRow icon={<Users size={14} />} label="Referral" value={application.referralName || "Yes"} />
          )}
        </div>
      </SectionCard>
      {application.notes && (
        <SectionCard title="Notes">
          <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.notes}</p>
        </SectionCard>
      )}
    </>
  );
}

function OAPanel({ application }: { application: Application }) {
  return (
    <>
      {application.oa.scheduledAt && (
        <SectionCard title="OA Countdown">
          <CountdownTimer
            date={application.oa.scheduledAt}
            label="OA Starts In"
            urgentLabel="OA Starting Soon!"
            doneLabel="OA time has passed"
            completedLabel="OA completed"
            completed={application.oa.completed}
            urgentThresholdHours={2}
          />
          <p className="text-xs text-zinc-500">
            {new Date(application.oa.scheduledAt).toLocaleString("en-IN", {
              dateStyle: "medium", timeStyle: "short",
            })}
          </p>
        </SectionCard>
      )}
      <SectionCard title="OA Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {application.oa.platform && (
            <InfoRow icon={<Briefcase size={14} />} label="Platform" value={application.oa.platform} />
          )}
          {application.oa.duration && (
            <InfoRow icon={<FileText size={14} />} label="Duration" value={`${application.oa.duration} minutes`} />
          )}
          <InfoRow icon={<FileText size={14} />} label="Status" value={application.oa.completed ? "Completed" : "Pending"} />
        </div>
        {application.oa.notes && (
          <div>
            <p className="mb-1 text-xs text-zinc-500">Notes</p>
            <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.oa.notes}</p>
          </div>
        )}
      </SectionCard>
      <JobDetails application={application} />
    </>
  );
}

function InterviewPanel({
  application,
  onAdd, onUpdate, onDelete,
  isAddPending, isUpdatePending, isDeletePending,
  addError, updateError,
}: {
  application: Application;
  onAdd: (d: InterviewFormData) => Promise<void>;
  onUpdate: (id: string, d: InterviewFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isAddPending: boolean; isUpdatePending: boolean; isDeletePending: boolean;
  addError: unknown; updateError: unknown;
}) {
  // Find the next upcoming interview for countdown
  const now = Date.now();
  const nextInterview = application.interviews
    .filter((i) => i.scheduledAt && new Date(i.scheduledAt).getTime() > now && i.result === "pending")
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())[0];

  return (
    <>
      {nextInterview?.scheduledAt && (
        <SectionCard title="Next Interview">
          <CountdownTimer
            date={nextInterview.scheduledAt}
            label={`Round ${nextInterview.round} (${nextInterview.type})`}
            urgentLabel="Interview Starting Soon!"
            doneLabel="Time has passed"
            urgentThresholdHours={2}
          />
          <p className="text-xs text-zinc-500">
            {new Date(nextInterview.scheduledAt).toLocaleString("en-IN", {
              dateStyle: "medium", timeStyle: "short",
            })}
          </p>
        </SectionCard>
      )}
      <SectionCard title="Interview Rounds">
        <InterviewTimeline
          interviews={application.interviews}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isAddPending={isAddPending}
          isUpdatePending={isUpdatePending}
          isDeletePending={isDeletePending}
          addError={addError}
          updateError={updateError}
        />
      </SectionCard>
      <JobDetails application={application} />
      {application.notes && (
        <SectionCard title="Notes">
          <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.notes}</p>
        </SectionCard>
      )}
    </>
  );
}

function OutcomePanel({ application }: { application: Application }) {
  const cfg = APPLICATION_STATUS_CONFIG[application.status];
  return (
    <>
      <SectionCard title="Outcome">
        <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium ${cfg.className}`}>
          {cfg.label}
        </div>
        {application.offer?.documentLink && (
          <div className="mt-4">
            <a
              href={application.offer.documentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              <ExternalLink size={12} />
              View Offer Letter
            </a>
          </div>
        )}
        {application.outcomeReason && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-zinc-500">
              {application.status === "accepted" ? "Offer Notes" : "Reason"}
            </p>
            <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.outcomeReason}</p>
          </div>
        )}
        {application.notes && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-zinc-500">Notes</p>
            <p className="whitespace-pre-wrap text-sm text-zinc-300">{application.notes}</p>
          </div>
        )}
      </SectionCard>
      <JobDetails application={application} />
    </>
  );
}

// ─── Next-step action buttons ─────────────────────────────────────────────────

const TERMINAL_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "ghosted", label: "Ghosted (no response)" },
];

const FORWARD_LABELS: Partial<Record<ApplicationStatus, string>> = {
  oa: "OA Scheduled",
  interview: "Interview Scheduled",
};

function NextStepActions({
  currentStatus,
  isPending,
  onTransition,
}: {
  currentStatus: ApplicationStatus;
  isPending: boolean;
  onTransition: (next: ApplicationStatus) => void;
}) {
  const allowed = ALLOWED_NEXT_STATUSES[currentStatus] ?? [];
  const [outcomeOpen, setOutcomeOpen] = useState(false);

  if (allowed.length === 0) return null;

  const stageOptions = allowed.filter((s) => !["accepted", "rejected", "withdrawn", "ghosted"].includes(s));
  const canRecordOutcome = allowed.some((s) => ["accepted", "rejected", "withdrawn", "ghosted"].includes(s));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Next Step</p>
      <div className="flex flex-wrap gap-2">
        {stageOptions.map((next) => (
          <button
            key={next}
            disabled={isPending}
            onClick={() => onTransition(next)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
          >
            {FORWARD_LABELS[next] ?? next} →
          </button>
        ))}
        {canRecordOutcome && (
          <div className="relative">
            <button
              disabled={isPending}
              onClick={() => setOutcomeOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              Record Outcome ↓
            </button>
            {outcomeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOutcomeOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
                  {TERMINAL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setOutcomeOpen(false); onTransition(opt.value); }}
                      className="w-full px-4 py-2 text-left text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transitionStatus, setTransitionStatus] = useState<ApplicationStatus | null>(null);
  // Confirmation before forward transition
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  // Blocked transition popup (from saved, can't skip apply)
  const [blockedStatus, setBlockedStatus] = useState<ApplicationStatus | null>(null);

  const { data: application, isLoading, isError } = useApplication(id!);
  const updateMutation = useUpdateApplication(id!);
  const deleteMutation = useDeleteApplication();
  const statusMutation = useUpdateStatus(id!);
  const addInterviewMutation = useAddInterview(id!);
  const updateInterviewMutation = useUpdateInterview(id!);
  const deleteInterviewMutation = useDeleteInterview(id!);

  const handleUpdate = async (data: ApplicationFormData) => {
    await updateMutation.mutateAsync(data);
    setEditDrawerOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id!);
    setDeleteDialogOpen(false);
    navigate("/applications");
  };

  // Called when user clicks a next-step button
  const requestTransition = (next: ApplicationStatus) => {
    if (!application) return;
    const current = application.status;
    // Saved → anything except Applied is blocked
    if (current === "wishlist" && next !== "applied") {
      setBlockedStatus(next);
      return;
    }
    setPendingStatus(next);
  };

  // Called after user confirms the transition
  const confirmTransition = async () => {
    if (!pendingStatus) return;
    const next = pendingStatus;
    try {
      await statusMutation.mutateAsync(next);
      setPendingStatus(null);
      // Open the capture drawer for every transition except ghosted
      if (["oa", "interview", "accepted", "rejected", "withdrawn"].includes(next)) {
        setTransitionStatus(next);
      }
    } catch {
      // Leave pendingStatus set so the dialog stays open; mutation.error shows the message
    }
  };

  const handleAddInterview = async (data: InterviewFormData) => {
    await addInterviewMutation.mutateAsync(data);
  };
  const handleUpdateInterview = async (interviewId: string, data: InterviewFormData) => {
    await updateInterviewMutation.mutateAsync({ interviewId, data });
  };
  const handleDeleteInterview = async (interviewId: string) => {
    await deleteInterviewMutation.mutateAsync(interviewId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-32">
        <p className="text-sm text-zinc-400">Application not found.</p>
        <button onClick={() => navigate("/applications")} className="mt-4 text-xs text-zinc-500 underline">
          Back to Applications
        </button>
      </div>
    );
  }

  const isTerminal = ["accepted", "rejected", "withdrawn", "ghosted"].includes(application.status);
  const pendingStatusLabel = pendingStatus
    ? APPLICATION_STATUS_CONFIG[pendingStatus]?.label ?? pendingStatus
    : "";
  const currentStatusLabel = APPLICATION_STATUS_CONFIG[application.status]?.label ?? application.status;
  const blockedLabel = blockedStatus
    ? APPLICATION_STATUS_CONFIG[blockedStatus]?.label ?? blockedStatus
    : "";

  return (
    <>
    <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Back */}
          <button
            onClick={() => navigate("/applications")}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft size={14} /> Applications
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-lg font-bold text-zinc-200">
                {application.company[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{application.company}</h1>
                <p className="mt-0.5 text-sm text-zinc-400">{application.role}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={application.status} size="md" />
                  {application.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!isTerminal && (
                <button
                  onClick={() => setEditDrawerOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>

          {/* Workflow stepper */}
          <ApplicationWorkflow status={application.status} />

          {/* Next-step actions */}
          {!isTerminal && (
            <NextStepActions
              currentStatus={application.status}
              isPending={statusMutation.isPending}
              onTransition={requestTransition}
            />
          )}

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {application.status === "wishlist" && <SavedPanel application={application} />}
              {application.status === "applied" && <AppliedPanel application={application} />}
              {application.status === "oa" && <OAPanel application={application} />}
              {application.status === "interview" && (
                <InterviewPanel
                  application={application}
                  onAdd={handleAddInterview}
                  onUpdate={handleUpdateInterview}
                  onDelete={handleDeleteInterview}
                  isAddPending={addInterviewMutation.isPending}
                  isUpdatePending={updateInterviewMutation.isPending}
                  isDeletePending={deleteInterviewMutation.isPending}
                  addError={addInterviewMutation.error}
                  updateError={updateInterviewMutation.error}
                />
              )}
              {(isTerminal || application.status === "offer") && <OutcomePanel application={application} />}
            </div>

            <div>
              <SectionCard title="Activity">
                <ActivityLog entries={application.activityLog} />
              </SectionCard>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Drawer */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => { setEditDrawerOpen(false); updateMutation.reset(); }}
        title="Edit Application"
        width="md"
      >
        <ApplicationForm
          defaultValues={application}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
          error={updateMutation.error}
          submitLabel="Save Changes"
        />
      </Drawer>

      {/* Stage data collection after transition */}
      {transitionStatus && (
        <StageTransitionDrawer
          status={transitionStatus}
          application={application}
          onClose={() => setTransitionStatus(null)}
        />
      )}

      {/* Forward transition confirmation */}
      <ConfirmDialog
        isOpen={!!pendingStatus}
        title={`Move to ${pendingStatusLabel}?`}
        message={`You're moving this application from ${currentStatusLabel} to ${pendingStatusLabel}. This is a one-way move — you won't be able to go back to ${currentStatusLabel} afterwards.`}
        confirmLabel={`Move to ${pendingStatusLabel}`}
        variant="primary"
        isLoading={statusMutation.isPending}
        onConfirm={confirmTransition}
        onCancel={() => setPendingStatus(null)}
      />

      {/* Blocked transition popup */}
      <ConfirmDialog
        isOpen={!!blockedStatus}
        title="You haven't applied yet"
        message={`You can't jump from Saved directly to ${blockedLabel}. First mark this as Applied once you've submitted — then you can progress through OA, Interview, and record an outcome.`}
        confirmLabel="Got it"
        variant="info"
        isLoading={false}
        onConfirm={() => setBlockedStatus(null)}
        onCancel={() => setBlockedStatus(null)}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Application"
        message={`Delete your application to ${application.company} for ${application.role}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Link2,
  FileText,
  Users,
  DollarSign,
} from "lucide-react";
import { useApplication } from "@/hooks/applications/useApplication";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useDeleteApplication } from "@/hooks/applications/useDeleteApplication";
import { useUpdateStatus } from "@/hooks/applications/useUpdateStatus";
import {
  useAddInterview,
  useUpdateInterview,
  useDeleteInterview,
} from "@/hooks/applications/useInterviewMutations";
import { APPLICATION_STATUS_CONFIG, STATUS_OPTIONS, CURRENCY_OPTIONS } from "@/constants/application";
import { formatDate } from "@/utils/date";
import ApplicationForm from "@/components/applications/ApplicationForm";
import InterviewTimeline from "@/components/applications/InterviewTimeline";
import ActivityLog from "@/components/applications/ActivityLog";
import StatusBadge from "@/components/applications/StatusBadge";
import Drawer from "@/components/ui/Drawer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/ui/Select";
import type { ApplicationFormData, InterviewFormData } from "@/schemas/application.schemas";
import type { ApplicationStatus } from "@/types/application";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
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

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleStatusChange = (newStatus: string) => {
    statusMutation.mutate(newStatus as ApplicationStatus);
  };

  const handleAddInterview = async (data: InterviewFormData) => {
    await addInterviewMutation.mutateAsync(data);
  };

  const handleUpdateInterview = async (
    interviewId: string,
    data: InterviewFormData
  ) => {
    await updateInterviewMutation.mutateAsync({ interviewId, data });
  };

  const handleDeleteInterview = async (interviewId: string) => {
    await deleteInterviewMutation.mutateAsync(interviewId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
        <p className="text-sm text-zinc-400">Application not found.</p>
        <button
          onClick={() => navigate("/applications")}
          className="mt-4 text-xs text-zinc-500 underline"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const currencyLabel =
    CURRENCY_OPTIONS.find((c) => c.value === application.offer.currency)?.label ??
    application.offer.currency;

  const compensationValue = () => {
    const { ctc, stipend, currency } = application.offer;
    if (application.jobType === "internship" && stipend) {
      return `${currency} ${stipend.toLocaleString()} / month`;
    }
    if (ctc) {
      return `${currency} ${ctc.toLocaleString()} / year`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Back navigation */}
          <button
            onClick={() => navigate("/applications")}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft size={14} />
            Applications
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-lg font-bold text-zinc-200">
                {application.company[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {application.company}
                </h1>
                <p className="mt-0.5 text-sm text-zinc-400">{application.role}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={application.status} size="md" />
                  {application.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setEditDrawerOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
              >
                <Pencil size={13} />
                Edit
              </button>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>

          {/* Status change */}
          <div className="flex items-center gap-3">
            <p className="text-xs text-zinc-500">Change status:</p>
            <select
              value={application.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusMutation.isPending}
              className="cursor-pointer appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 py-1.5 pl-3 pr-8 text-xs text-white outline-none focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-zinc-900">
                  {opt.label}
                </option>
              ))}
            </select>
            {statusMutation.isPending && <Spinner size="sm" />}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left column — details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Info */}
              <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoRow
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={application.location || null}
                  />
                  <InfoRow
                    icon={<Briefcase size={14} />}
                    label="Job Type"
                    value={<span className="capitalize">{application.jobType}</span>}
                  />
                  <InfoRow
                    icon={<Calendar size={14} />}
                    label="Applied Date"
                    value={formatDate(application.appliedDate, "medium")}
                  />
                  <InfoRow
                    icon={<Clock size={14} />}
                    label="Deadline"
                    value={formatDate(application.deadline, "medium")}
                  />
                  {application.jobLink && (
                    <InfoRow
                      icon={<Link2 size={14} />}
                      label="Job Link"
                      value={
                        <a
                          href={application.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          View posting
                          <ExternalLink size={11} />
                        </a>
                      }
                    />
                  )}
                  <InfoRow
                    icon={<FileText size={14} />}
                    label="Resume Version"
                    value={application.resumeVersion || null}
                  />
                  {application.referral && (
                    <InfoRow
                      icon={<Users size={14} />}
                      label="Referral"
                      value={application.referralName || "Yes (referral used)"}
                    />
                  )}
                  {compensationValue() && (
                    <InfoRow
                      icon={<DollarSign size={14} />}
                      label={
                        application.jobType === "internship"
                          ? "Stipend"
                          : "CTC"
                      }
                      value={compensationValue()}
                    />
                  )}
                </div>
              </section>

              {/* OA Section */}
              {(application.oa.scheduledAt ||
                application.oa.platform ||
                application.oa.notes) && (
                <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Online Assessment
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {application.oa.scheduledAt && (
                      <InfoRow
                        icon={<Calendar size={14} />}
                        label="Date"
                        value={formatDate(application.oa.scheduledAt, "medium")}
                      />
                    )}
                    {application.oa.platform && (
                      <InfoRow
                        icon={<Briefcase size={14} />}
                        label="Platform"
                        value={application.oa.platform}
                      />
                    )}
                    {application.oa.duration && (
                      <InfoRow
                        icon={<Clock size={14} />}
                        label="Duration"
                        value={`${application.oa.duration} minutes`}
                      />
                    )}
                    <InfoRow
                      icon={<FileText size={14} />}
                      label="Completed"
                      value={application.oa.completed ? "Yes" : "No"}
                    />
                  </div>
                  {application.oa.notes && (
                    <div>
                      <p className="mb-1 text-xs text-zinc-500">Notes</p>
                      <p className="whitespace-pre-wrap text-sm text-zinc-300">
                        {application.oa.notes}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Interview Timeline */}
              <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                <InterviewTimeline
                  interviews={application.interviews}
                  onAdd={handleAddInterview}
                  onUpdate={handleUpdateInterview}
                  onDelete={handleDeleteInterview}
                  isAddPending={addInterviewMutation.isPending}
                  isUpdatePending={updateInterviewMutation.isPending}
                  isDeletePending={deleteInterviewMutation.isPending}
                  addError={addInterviewMutation.error}
                  updateError={updateInterviewMutation.error}
                />
              </section>

              {/* Notes */}
              {application.notes && (
                <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Notes
                  </h2>
                  <p className="whitespace-pre-wrap text-sm text-zinc-300">
                    {application.notes}
                  </p>
                </section>
              )}
            </div>

            {/* Right column — activity log */}
            <div>
              <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Activity
                </h2>
                <ActivityLog entries={application.activityLog} />
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Drawer */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          updateMutation.reset();
        }}
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

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Application"
        message={`Delete your application to ${application.company} for ${application.role}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}

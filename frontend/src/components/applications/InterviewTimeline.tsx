import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { interviewSchema, type InterviewFormData } from "@/schemas/application.schemas";
import { INTERVIEW_TYPE_OPTIONS, INTERVIEW_RESULT_OPTIONS } from "@/constants/application";
import { formatDateTime, toInputDateTime } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/error";
import type { Interview } from "@/types/application";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const RESULT_CONFIG = {
  pending: { label: "Pending", className: "text-zinc-400" },
  passed: { label: "Passed", className: "text-emerald-400" },
  failed: { label: "Failed", className: "text-red-400" },
};

interface InterviewFormBlockProps {
  defaultValues?: Interview;
  onSubmit: (data: InterviewFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: unknown;
}

function InterviewFormBlock({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: InterviewFormBlockProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: defaultValues
      ? {
          round: defaultValues.round,
          type: defaultValues.type,
          scheduledAt: toInputDateTime(defaultValues.scheduledAt),
          duration: defaultValues.duration ?? undefined,
          notes: defaultValues.notes,
          result: defaultValues.result,
        }
      : { result: "pending", notes: "" },
  });

  const apiError = error ? getApiErrorMessage(error) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4"
    >
      {apiError && (
        <p className="text-xs text-red-400">{apiError}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Round"
          type="number"
          min={1}
          placeholder="1"
          error={errors.round?.message}
          {...register("round")}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              options={INTERVIEW_TYPE_OPTIONS}
              placeholder="Select type"
              error={errors.type?.message}
              {...field}
            />
          )}
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          {...register("scheduledAt")}
        />

        <Input
          label="Duration (mins)"
          type="number"
          min={1}
          placeholder="60"
          {...register("duration")}
        />

        <div className="col-span-2">
          <Controller
            name="result"
            control={control}
            render={({ field }) => (
              <Select
                label="Result"
                options={INTERVIEW_RESULT_OPTIONS}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <Textarea
        label="Notes"
        placeholder="Topics covered, feedback, anything to remember…"
        rows={2}
        {...register("notes")}
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Save
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface InterviewTimelineProps {
  interviews: Interview[];
  onAdd: (data: InterviewFormData) => Promise<void>;
  onUpdate: (interviewId: string, data: InterviewFormData) => Promise<void>;
  onDelete: (interviewId: string) => Promise<void>;
  isAddPending: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  addError: unknown;
  updateError: unknown;
}

export default function InterviewTimeline({
  interviews,
  onAdd,
  onUpdate,
  onDelete,
  isAddPending,
  isUpdatePending,
  isDeletePending,
  addError,
  updateError,
}: InterviewTimelineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...interviews].sort((a, b) => a.round - b.round);

  const handleAdd = async (data: InterviewFormData) => {
    await onAdd(data);
    setIsAdding(false);
  };

  const handleUpdate = async (interviewId: string, data: InterviewFormData) => {
    await onUpdate(interviewId, data);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await onDelete(deletingId);
    setDeletingId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Interview Rounds
          {interviews.length > 0 && (
            <span className="ml-2 text-xs text-zinc-500">
              ({interviews.length})
            </span>
          )}
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
          >
            <Plus size={12} />
            Add Round
          </button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <InterviewFormBlock
          onSubmit={handleAdd}
          onCancel={() => setIsAdding(false)}
          isLoading={isAddPending}
          error={addError}
        />
      )}

      {/* Interview list */}
      {sorted.length === 0 && !isAdding && (
        <p className="text-xs text-zinc-600">
          No interview rounds yet. Add one above.
        </p>
      )}

      <div className="space-y-2">
        {sorted.map((interview) => {
          const resultConfig = RESULT_CONFIG[interview.result];
          const isExpanded = expandedId === interview._id;
          const isEditing = editingId === interview._id;

          if (isEditing) {
            return (
              <InterviewFormBlock
                key={interview._id}
                defaultValues={interview}
                onSubmit={(data) => handleUpdate(interview._id, data)}
                onCancel={() => setEditingId(null)}
                isLoading={isUpdatePending}
                error={updateError}
              />
            );
          }

          return (
            <div
              key={interview._id}
              className="rounded-xl border border-zinc-800 bg-zinc-800/30"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-300">
                  {interview.round}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white capitalize">
                      {interview.type.replace("_", " ")}
                    </span>
                    <span className={`text-xs ${resultConfig.className}`}>
                      · {resultConfig.label}
                    </span>
                  </div>
                  {interview.scheduledAt && (
                    <p className="text-xs text-zinc-500">
                      {formatDateTime(interview.scheduledAt)}
                      {interview.duration && ` · ${interview.duration} min`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : interview._id)}
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingId(interview._id)}
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                    aria-label="Edit interview"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeletingId(interview._id)}
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Delete interview"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {isExpanded && interview.notes && (
                <div className="border-t border-zinc-800 px-4 py-3">
                  <p className="whitespace-pre-wrap text-xs text-zinc-400">
                    {interview.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Remove Interview"
        message="This interview round will be permanently removed from the activity log."
        confirmLabel="Remove"
        isLoading={isDeletePending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

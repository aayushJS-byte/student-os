import { useForm, Controller } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useAddInterview } from "@/hooks/applications/useInterviewMutations";
import { INTERVIEW_TYPE_OPTIONS, CURRENCY_OPTIONS } from "@/constants/application";
import { getApiErrorMessage } from "@/utils/error";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Drawer from "@/components/ui/Drawer";
import type { Application } from "@/types/application";

interface StageTransitionDrawerProps {
  status: string;
  application: Application;
  onClose: () => void;
}

const STAGE_META: Record<string, { title: string; subtitle: string }> = {
  oa: {
    title: "OA Scheduled",
    subtitle: "Add the OA details so we can send you timely reminders.",
  },
  interview: {
    title: "Interview Round Added",
    subtitle: "Log this round's details so we can count down to it.",
  },
  accepted: {
    title: "You got an offer!",
    subtitle: "Log the compensation details so you can compare and remember.",
  },
  rejected: {
    title: "Application ended.",
    subtitle: "Jot down what you'd improve — it'll help with the next one.",
  },
  withdrawn: {
    title: "Marked as withdrawn.",
    subtitle: "What made you decide to pass on this one?",
  },
};

// ─── OA form ─────────────────────────────────────────────────────────────────

function OAForm({ appId, onClose }: { appId: string; onClose: () => void }) {
  const mutation = useUpdateApplication(appId);
  const { register, handleSubmit } = useForm({
    defaultValues: { scheduledAt: "", platform: "", duration: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync({
      oa: {
        scheduledAt: data.scheduledAt || undefined,
        platform: data.platform || undefined,
        duration: data.duration ? Number(data.duration) : undefined,
      },
    } as any);
    onClose();
  });

  const err = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {err && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{err}</div>
      )}
      <Input label="Date & Time" type="datetime-local" {...register("scheduledAt")} />
      <Input label="Platform" placeholder="HackerRank, Codeforces…" {...register("platform")} />
      <Input label="Duration (mins)" type="number" min={1} placeholder="90" {...register("duration")} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={mutation.isPending}>Save OA Details</Button>
        <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-300">
          Skip for now
        </button>
      </div>
    </form>
  );
}

// ─── Interview form ───────────────────────────────────────────────────────────

function InterviewForm({ appId, onClose }: { appId: string; onClose: () => void }) {
  const mutation = useAddInterview(appId);
  const { register, handleSubmit, control } = useForm({
    defaultValues: { round: "1", type: "technical", scheduledAt: "", duration: "", notes: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync({
      round: Number(data.round),
      type: data.type as any,
      scheduledAt: data.scheduledAt || undefined,
      duration: data.duration ? Number(data.duration) : undefined,
      notes: data.notes,
    });
    onClose();
  });

  const err = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {err && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{err}</div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Round #" type="number" min={1} {...register("round")} />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select label="Type" options={INTERVIEW_TYPE_OPTIONS} {...field} />
          )}
        />
        <div className="col-span-2">
          <Input label="Date & Time" type="datetime-local" {...register("scheduledAt")} />
        </div>
        <Input label="Duration (mins)" type="number" min={1} placeholder="60" {...register("duration")} />
      </div>
      <Textarea label="Notes" placeholder="What to prepare, interviewer focus area…" rows={3} {...register("notes")} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={mutation.isPending}>Add Interview Round</Button>
        <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-300">
          Skip for now
        </button>
      </div>
    </form>
  );
}

// ─── Accepted / offer form ────────────────────────────────────────────────────

function AcceptedForm({
  appId,
  jobType,
  onClose,
}: {
  appId: string;
  jobType: string;
  onClose: () => void;
}) {
  const mutation = useUpdateApplication(appId);
  const isInternship = jobType === "internship" || jobType === "part-time";

  const { register, handleSubmit, control } = useForm({
    defaultValues: { amount: "", currency: "INR", joiningDate: "", documentLink: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    const offerData: Record<string, unknown> = {
      currency: data.currency,
      joiningDate: data.joiningDate || undefined,
      documentLink: data.documentLink || undefined,
      accepted: true,
    };
    if (data.amount) {
      offerData[isInternship ? "stipend" : "ctc"] = Number(data.amount);
    }
    await mutation.mutateAsync({ offer: offerData } as any);
    onClose();
  });

  const err = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {err && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{err}</div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={isInternship ? "Stipend / Month" : "CTC / Year"}
          type="number"
          min={0}
          placeholder={isInternship ? "60000" : "2000000"}
          {...register("amount")}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select label="Currency" options={CURRENCY_OPTIONS} {...field} />
          )}
        />
        <div className="col-span-2">
          <Input label="Joining Date" type="date" {...register("joiningDate")} />
        </div>
        <div className="col-span-2">
          <Input
            label="Offer Letter Link (optional)"
            type="url"
            placeholder="Paste Google Drive or company portal link…"
            {...register("documentLink")}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={mutation.isPending}>Save Offer Details</Button>
        <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-300">
          Skip for now
        </button>
      </div>
    </form>
  );
}

// ─── Outcome note form (rejected / withdrawn) ─────────────────────────────────

function OutcomeNoteForm({
  appId,
  status,
  onClose,
}: {
  appId: string;
  status: string;
  onClose: () => void;
}) {
  const mutation = useUpdateApplication(appId);
  const { register, handleSubmit } = useForm({ defaultValues: { outcomeReason: "" } });

  const onSubmit = handleSubmit(async (data) => {
    if (data.outcomeReason.trim()) {
      await mutation.mutateAsync({ outcomeReason: data.outcomeReason } as any);
    }
    onClose();
  });

  const err = mutation.error ? getApiErrorMessage(mutation.error) : null;
  const placeholder =
    status === "rejected"
      ? "What do you think went wrong? What to improve for next time?"
      : "Why did you decide to pass on this one?";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {err && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{err}</div>
      )}
      <Textarea label="" placeholder={placeholder} rows={4} {...register("outcomeReason")} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={mutation.isPending}>Save Note</Button>
        <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-300">
          Skip
        </button>
      </div>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StageTransitionDrawer({
  status,
  application,
  onClose,
}: StageTransitionDrawerProps) {
  const meta = STAGE_META[status];
  if (!meta) return null;

  return (
    <Drawer isOpen title={meta.title} onClose={onClose} width="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-zinc-400" />
          <div>
            <p className="text-sm font-medium text-zinc-200">{meta.title}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{meta.subtitle}</p>
          </div>
        </div>

        {status === "oa" && <OAForm appId={application._id} onClose={onClose} />}
        {status === "interview" && <InterviewForm appId={application._id} onClose={onClose} />}
        {status === "accepted" && (
          <AcceptedForm appId={application._id} jobType={application.jobType} onClose={onClose} />
        )}
        {(status === "rejected" || status === "withdrawn") && (
          <OutcomeNoteForm appId={application._id} status={status} onClose={onClose} />
        )}
      </div>
    </Drawer>
  );
}

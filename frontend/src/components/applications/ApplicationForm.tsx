import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/schemas/application.schemas";
import { APPLICATION_TAGS, JOB_TYPE_OPTIONS, CURRENCY_OPTIONS, SOURCE_OPTIONS } from "@/constants/application";
import { toInputDate, toInputDateTime } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/error";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import TagSelect from "@/components/ui/TagSelect";
import Button from "@/components/ui/Button";
import type { Application, ApplicationListItem } from "@/types/application";

interface ApplicationFormProps {
  defaultValues: Application | ApplicationListItem;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  error: unknown;
  submitLabel?: string;
}

function toFormDefaults(app: Application | ApplicationListItem): Partial<ApplicationFormData> {
  const full = app as Application;
  return {
    company: app.company,
    role: app.role,
    location: app.location,
    jobType: app.jobType,
    status: app.status,
    jobLink: app.jobLink,
    salaryRange: (app as Application).salaryRange ?? "",
    source: (app as Application).source ?? null,
    appliedDate: toInputDate(app.appliedDate),
    // Saved checkpoint uses datetime-local for deadline; others use date-only
    deadline: app.status === "wishlist"
      ? toInputDateTime(app.deadline)
      : toInputDate(app.deadline),
    resumeVersion: app.resumeVersion,
    referral: app.referral,
    referralName: app.referralName,
    notes: full.notes ?? "",
    outcomeReason: full.outcomeReason ?? "",
    tags: app.tags,
    oa: app.oa
      ? {
          scheduledAt: toInputDateTime(app.oa.scheduledAt),
          platform: app.oa.platform,
          duration: app.oa.duration ?? undefined,
          notes: app.oa.notes ?? "",
          completed: app.oa.completed,
        }
      : undefined,
    offer: full.offer
      ? {
          ctc: full.offer.ctc ?? undefined,
          stipend: full.offer.stipend ?? undefined,
          currency: full.offer.currency,
          joiningDate: toInputDate(full.offer.joiningDate),
          deadline: toInputDate(full.offer.deadline),
          accepted: full.offer.accepted,
          documentLink: full.offer.documentLink ?? "",
        }
      : undefined,
  };
}

// ─── Shared sub-sections ─────────────────────────────────────────────────────

function CoreFields({
  register,
  control,
  errors,
}: {
  register: any;
  control: any;
  errors: any;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Core</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Company" placeholder="Google, Meta, Stripe…" error={errors.company?.message} {...register("company")} />
        </div>
        <div className="col-span-2">
          <Input label="Role" placeholder="Software Engineering Intern" error={errors.role?.message} {...register("role")} />
        </div>
        <Controller
          name="jobType"
          control={control}
          render={({ field }) => (
            <Select label="Job Type" options={JOB_TYPE_OPTIONS} {...field} />
          )}
        />
        <Input label="Location" placeholder="Bengaluru, Remote…" {...register("location")} />
        <div className="col-span-2">
          <Input label="Job Link" placeholder="https://careers.company.com/..." {...register("jobLink")} />
        </div>
        <div className="col-span-2">
          <Input label="Pay mentioned in JD" placeholder="e.g. ₹18 LPA or ₹60k/month" {...register("salaryRange")} />
        </div>
        <div className="col-span-2">
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <Select
                label="Where did you find this job? (optional)"
                options={[{ value: "", label: "Not specified" }, ...SOURCE_OPTIONS]}
                value={field.value ?? ""}
                onChange={(e) => field.onChange((e as any).target.value || null)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}

function TagsAndNotes({ register, control }: { register: any; control: any }) {
  return (
    <>
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Tags</h3>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelect options={APPLICATION_TAGS} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </section>
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes</h3>
        <Textarea label="" placeholder="Anything you want to remember…" rows={4} {...register("notes")} />
      </section>
    </>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ApplicationForm({
  defaultValues,
  onSubmit,
  isLoading,
  error,
  submitLabel = "Save Changes",
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: toFormDefaults(defaultValues),
  });

  useEffect(() => {
    reset(toFormDefaults(defaultValues));
  }, [defaultValues._id, reset]);

  const status = defaultValues.status;
  const watchedReferral = watch("referral");
  const watchedJobType = watch("jobType");
  const apiError = error ? getApiErrorMessage(error) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <CoreFields register={register} control={control} errors={errors} />

      {/* ── Saved: show apply-by deadline ───────────────────────────── */}
      {status === "wishlist" && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Apply-by Deadline</h3>
          <Input label="Deadline (date & time)" type="datetime-local" error={errors.deadline?.message} {...register("deadline")} />
        </section>
      )}

      {/* ── Applied: show applied date + resume + referral ───────────── */}
      {status === "applied" && (
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Application Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Applied Date" type="date" error={errors.appliedDate?.message} {...register("appliedDate")} />
            <Input label="Resume Version" placeholder="v3-sde-intern…" {...register("resumeVersion")} />
          </div>
          <Controller
            name="referral"
            control={control}
            render={({ field }) => (
              <Toggle label="I had a referral" checked={field.value ?? false} onChange={field.onChange} />
            )}
          />
          {watchedReferral && (
            <Input label="Referred by" placeholder="Name of referrer" {...register("referralName")} />
          )}
        </section>
      )}

      {/* ── OA: show OA details ──────────────────────────────────────── */}
      {status === "oa" && (
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Online Assessment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Date & Time" type="datetime-local" {...register("oa.scheduledAt")} />
            </div>
            <Input label="Platform" placeholder="HackerRank, Codeforces…" {...register("oa.platform")} />
            <Input label="Duration (mins)" type="number" min={1} placeholder="90" {...register("oa.duration")} />
            <div className="col-span-2">
              <Controller
                name="oa.completed"
                control={control}
                render={({ field }) => (
                  <Toggle label="OA Completed" checked={field.value ?? false} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
          <Textarea label="OA Notes" placeholder="Topics, difficulty, what to review next time…" {...register("oa.notes")} />
        </section>
      )}

      {/* ── Terminal: capture outcome reason ───────────────────────────── */}
      {["rejected", "withdrawn", "ghosted", "accepted"].includes(status) && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {status === "accepted" ? "Offer Notes" : "Outcome Reason"}
          </h3>
          <Textarea
            label=""
            placeholder={
              status === "accepted"
                ? "Any notes about this offer, comparison points…"
                : status === "rejected"
                ? "What do you think went wrong? What to improve next time?"
                : status === "withdrawn"
                ? "Why did you decide to pass on this one?"
                : "No response after…"
            }
            rows={3}
            {...register("outcomeReason")}
          />
        </section>
      )}

      {/* ── Interview: rounds are managed via InterviewTimeline on detail page ── */}
      {status === "interview" && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3">
          <p className="text-xs text-zinc-500">
            Interview rounds are managed from the application detail page — add, update, and mark results there.
          </p>
        </div>
      )}

      {/* ── Offer: show offer details ────────────────────────────────── */}
      {(status === "offer" || status === "accepted") && (
        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Offer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {watchedJobType === "internship" || watchedJobType === "part-time" ? (
              <Input label="Stipend / Month" type="number" min={0} placeholder="50000" {...register("offer.stipend")} />
            ) : (
              <Input label="CTC / Year" type="number" min={0} placeholder="2000000" {...register("offer.ctc")} />
            )}
            <Controller
              name="offer.currency"
              control={control}
              render={({ field }) => (
                <Select label="Currency" options={CURRENCY_OPTIONS} {...field} />
              )}
            />
            <Input label="Joining Date" type="date" {...register("offer.joiningDate")} />
            <Input label="Decision Deadline" type="date" {...register("offer.deadline")} />
            <div className="col-span-2">
              <Input
                label="Offer Letter Link (optional)"
                type="url"
                placeholder="Paste Google Drive or company portal link…"
                {...register("offer.documentLink")}
              />
            </div>
          </div>
          <Controller
            name="offer.accepted"
            control={control}
            render={({ field }) => (
              <Toggle label="Offer Accepted" checked={field.value ?? false} onChange={field.onChange} />
            )}
          />
        </section>
      )}

      <TagsAndNotes register={register} control={control} />

      <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-900 pt-4">
        <Button type="submit" isLoading={isLoading}>{submitLabel}</Button>
      </div>
    </form>
  );
}

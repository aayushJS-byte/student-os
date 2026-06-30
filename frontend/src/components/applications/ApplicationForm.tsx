import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/schemas/application.schemas";
import { APPLICATION_TAGS, STATUS_OPTIONS, JOB_TYPE_OPTIONS, CURRENCY_OPTIONS } from "@/constants/application";
import { toInputDate } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/error";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import TagSelect from "@/components/ui/TagSelect";
import Button from "@/components/ui/Button";
import type { Application, ApplicationListItem } from "@/types/application";

interface ApplicationFormProps {
  defaultValues?: Application | ApplicationListItem;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  error: unknown;
  submitLabel?: string;
}

function toFormDefaults(
  app?: Application | ApplicationListItem
): Partial<ApplicationFormData> {
  if (!app) return { jobType: "internship", status: "wishlist", referral: false, tags: [] };

  const full = app as Application;

  return {
    company: app.company,
    role: app.role,
    location: app.location,
    jobType: app.jobType,
    status: app.status,
    jobLink: app.jobLink,
    appliedDate: toInputDate(app.appliedDate),
    deadline: toInputDate(app.deadline),
    resumeVersion: app.resumeVersion,
    referral: app.referral,
    referralName: app.referralName,
    notes: full.notes ?? "",
    tags: app.tags,
    oa: app.oa
      ? {
          scheduledAt: toInputDate(app.oa.scheduledAt),
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
        }
      : undefined,
  };
}

export default function ApplicationForm({
  defaultValues,
  onSubmit,
  isLoading,
  error,
  submitLabel = "Save",
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toFormDefaults(defaultValues),
  });

  // Re-populate when defaultValues change (switching between edit targets)
  useEffect(() => {
    reset(toFormDefaults(defaultValues));
  }, [defaultValues?._id, reset]);

  const watchedReferral = watch("referral");
  const watchedJobType = watch("jobType");
  const apiError = error ? getApiErrorMessage(error) : null;

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {apiError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      {/* ── Core ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Core
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Company"
              placeholder="Google, Meta, Stripe…"
              error={errors.company?.message}
              {...register("company")}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Role"
              placeholder="Software Engineering Intern"
              error={errors.role?.message}
              {...register("role")}
            />
          </div>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                options={STATUS_OPTIONS}
                error={errors.status?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select
                label="Job Type"
                options={JOB_TYPE_OPTIONS}
                error={errors.jobType?.message}
                {...field}
              />
            )}
          />

          <div className="col-span-2">
            <Input
              label="Location"
              placeholder="Bengaluru, Remote, New York…"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Job Link"
              placeholder="https://careers.company.com/..."
              error={errors.jobLink?.message}
              {...register("jobLink")}
            />
          </div>
        </div>
      </section>

      {/* ── Dates ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Dates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Applied Date"
            type="date"
            error={errors.appliedDate?.message}
            {...register("appliedDate")}
          />
          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register("deadline")}
          />
        </div>
      </section>

      {/* ── Tags ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Tags
        </h3>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelect
              options={APPLICATION_TAGS}
              value={field.value ?? []}
              onChange={field.onChange}
              error={errors.tags?.message}
            />
          )}
        />
      </section>

      {/* ── Referral ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Referral
        </h3>
        <Controller
          name="referral"
          control={control}
          render={({ field }) => (
            <Toggle
              label="I have a referral"
              checked={field.value ?? false}
              onChange={field.onChange}
            />
          )}
        />
        {watchedReferral && (
          <Input
            label="Referred by"
            placeholder="Name of referrer"
            error={errors.referralName?.message}
            {...register("referralName")}
          />
        )}
      </section>

      {/* ── OA ───────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Online Assessment
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="OA Date"
            type="date"
            {...register("oa.scheduledAt")}
          />
          <Input
            label="Platform"
            placeholder="HackerRank, Codeforces…"
            {...register("oa.platform")}
          />
          <Input
            label="Duration (mins)"
            type="number"
            min={1}
            placeholder="90"
            {...register("oa.duration")}
          />
          <div className="flex items-end pb-2.5">
            <Controller
              name="oa.completed"
              control={control}
              render={({ field }) => (
                <Toggle
                  label="Completed"
                  checked={field.value ?? false}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <Textarea
          label="OA Notes"
          placeholder="Topics covered, difficulty, any notes…"
          {...register("oa.notes")}
        />
      </section>

      {/* ── Offer ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Offer Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {watchedJobType === "internship" || watchedJobType === "part-time" ? (
            <Input
              label="Stipend / Month"
              type="number"
              min={0}
              placeholder="50000"
              {...register("offer.stipend")}
            />
          ) : (
            <Input
              label="CTC / Year"
              type="number"
              min={0}
              placeholder="2000000"
              {...register("offer.ctc")}
            />
          )}

          <Controller
            name="offer.currency"
            control={control}
            render={({ field }) => (
              <Select
                label="Currency"
                options={CURRENCY_OPTIONS}
                {...field}
              />
            )}
          />

          <Input
            label="Joining Date"
            type="date"
            {...register("offer.joiningDate")}
          />
          <Input
            label="Offer Deadline"
            type="date"
            {...register("offer.deadline")}
          />
        </div>

        <Controller
          name="offer.accepted"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Offer Accepted"
              checked={field.value ?? false}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      {/* ── Meta ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Notes & Meta
        </h3>
        <Input
          label="Resume Version"
          placeholder="v3-sde-intern, master-cv…"
          {...register("resumeVersion")}
        />
        <Textarea
          label="Notes"
          placeholder="Anything you want to remember about this application…"
          rows={4}
          {...register("notes")}
        />
      </section>

      <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-900 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

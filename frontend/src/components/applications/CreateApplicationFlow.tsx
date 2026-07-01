import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Send, ArrowLeft } from "lucide-react";
import { applicationSchema, type ApplicationFormData } from "@/schemas/application.schemas";
import { APPLICATION_TAGS, JOB_TYPE_OPTIONS, SOURCE_OPTIONS } from "@/constants/application";
import { getApiErrorMessage } from "@/utils/error";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import TagSelect from "@/components/ui/TagSelect";
import Button from "@/components/ui/Button";

type Intent = "pick" | "saved" | "applied";

interface CreateApplicationFlowProps {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  error: unknown;
}

const CORE_DEFAULTS = {
  jobType: "internship" as const,
  referral: false,
  tags: [] as ApplicationFormData["tags"],
};

function IntentPicker({ onPick }: { onPick: (i: "saved" | "applied") => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-zinc-200">What are you tracking?</h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Choose based on where you are right now.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => onPick("saved")}
          className="group flex items-start gap-4 rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-500 hover:bg-zinc-800/50"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-400 group-hover:border-zinc-600 group-hover:text-zinc-300">
            <Bookmark size={17} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">Save a job opening</p>
            <p className="mt-1 text-xs text-zinc-500">
              I found a role I want to apply to, but haven't submitted yet. Save it so I don't miss the deadline.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPick("applied")}
          className="group flex items-start gap-4 rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-500 hover:bg-zinc-800/50"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-400 group-hover:border-zinc-600 group-hover:text-zinc-300">
            <Send size={17} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">Log an application I submitted</p>
            <p className="mt-1 text-xs text-zinc-500">
              I already sent my application. Track it so I know where I stand.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function SavedForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (d: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  error: unknown;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: { ...CORE_DEFAULTS, status: "wishlist" },
  });

  const apiError = error ? getApiErrorMessage(error) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Company" placeholder="Google, Meta, Stripe…" required error={errors.company?.message} {...register("company")} />
        </div>
        <div className="col-span-2">
          <Input label="Role" placeholder="Software Engineering Intern" required error={errors.role?.message} {...register("role")} />
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
          <Input
            label="Apply-by Deadline (date & time)"
            type="datetime-local"
            error={errors.deadline?.message}
            {...register("deadline")}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Pay mentioned in JD (optional)"
            placeholder="e.g. ₹18 LPA or ₹60k/month"
            {...register("salaryRange")}
          />
        </div>
        <div className="col-span-2">
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <Select
                label="Where did you find this? (optional)"
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

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagSelect options={APPLICATION_TAGS} value={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <Textarea label="Notes" placeholder="Anything worth remembering about this role…" rows={3} {...register("notes")} />

      <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-900 pt-4">
        <Button type="submit" isLoading={isLoading}>Save Job Opening</Button>
      </div>
    </form>
  );
}

function AppliedForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (d: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  error: unknown;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: { ...CORE_DEFAULTS, status: "applied" },
  });

  const watchedReferral = watch("referral");
  const apiError = error ? getApiErrorMessage(error) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Company" placeholder="Google, Meta, Stripe…" required error={errors.company?.message} {...register("company")} />
        </div>
        <div className="col-span-2">
          <Input label="Role" placeholder="Software Engineering Intern" required error={errors.role?.message} {...register("role")} />
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

      <Controller
        name="source"
        control={control}
        render={({ field }) => (
          <Select
            label="Where did you find this? (optional)"
            options={[{ value: "", label: "Not specified" }, ...SOURCE_OPTIONS]}
            value={field.value ?? ""}
            onChange={(e) => field.onChange((e as any).target.value || null)}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagSelect options={APPLICATION_TAGS} value={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <Textarea label="Notes" placeholder="Anything worth remembering about this application…" rows={3} {...register("notes")} />

      <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-900 pt-4">
        <Button type="submit" isLoading={isLoading}>Log Application</Button>
      </div>
    </form>
  );
}

export default function CreateApplicationFlow({
  onSubmit,
  isLoading,
  error,
}: CreateApplicationFlowProps) {
  const [intent, setIntent] = useState<Intent>("pick");

  return (
    <div className="space-y-5">
      {intent !== "pick" && (
        <button
          type="button"
          onClick={() => setIntent("pick")}
          className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={13} />
          Change
        </button>
      )}

      {intent === "pick" && <IntentPicker onPick={setIntent} />}
      {intent === "saved" && (
        <SavedForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
      )}
      {intent === "applied" && (
        <AppliedForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
      )}
    </div>
  );
}

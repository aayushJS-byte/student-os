import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, CheckCircle2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import { getApiErrorMessage } from "@/utils/error";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Icon size={15} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Profile form ─────────────────────────────────────────────────────────────

function ProfileForm() {
  const { user } = useCurrentUser();
  const mutation = useUpdateProfile();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: { name: user?.name ?? "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user?.name, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await mutation.mutateAsync(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const apiError = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Display name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          Email address
        </label>
        <p className="rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2.5 text-sm text-zinc-500 select-all">
          {user?.email}
        </p>
        <p className="mt-1 text-[11px] text-zinc-600">
          Institutional email — cannot be changed
        </p>
      </div>
      {apiError && (
        <p className="text-xs text-red-400">{apiError}</p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          isLoading={mutation.isPending}
          disabled={!isDirty || mutation.isPending}
        >
          Save changes
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 size={13} />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Password form ────────────────────────────────────────────────────────────

function PasswordForm() {
  const mutation = useChangePassword();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema) as any,
  });

  const onSubmit = async (data: PasswordFormData) => {
    await mutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const apiError = mutation.error ? getApiErrorMessage(mutation.error) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Current password"
        type="password"
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <Input
        label="New password"
        type="password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        label="Confirm new password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {apiError && (
        <p className="text-xs text-red-400">{apiError}</p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" isLoading={mutation.isPending} disabled={mutation.isPending}>
          Change password
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 size={13} />
            Password updated
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Profile</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Manage your account details</p>
      </div>

      <Section
        icon={User}
        title="Personal information"
        description="Update your display name"
      >
        <ProfileForm />
      </Section>

      <Section
        icon={Lock}
        title="Change password"
        description="Must be at least 8 characters with uppercase, number, and special character"
      >
        <PasswordForm />
      </Section>
    </div>
  );
}

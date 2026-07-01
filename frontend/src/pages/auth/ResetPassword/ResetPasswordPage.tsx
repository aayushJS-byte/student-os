import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import { useResetPassword } from "@/hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/auth.schemas";
import { getApiErrorMessage } from "@/utils/error";

import FormCard from "@/components/ui/FormCard";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const resetPassword = useResetPassword(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(data);
  };

  if (!token) {
    return (
      <FormCard>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            StudentOS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Invalid link
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            This password reset link is missing a token.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Request a new link
          </Link>
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard>
        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            StudentOS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Choose a strong password for your account
          </p>
        </div>

        {/* API error */}
        <AnimatePresence>
          {resetPassword.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <ErrorMessage message={getApiErrorMessage(resetPassword.error)} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <PasswordInput
            label="New password"
            placeholder="Min 8 chars, upper, lower, number, special"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm new password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            isLoading={resetPassword.isPending}
            className="mt-2"
          >
            Reset password
          </Button>
        </form>
    </FormCard>
  );
}

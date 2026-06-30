import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

import { useForgotPassword } from "@/hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/auth.schemas";
import { getApiErrorMessage } from "@/utils/error";

import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <FormCard>
        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            StudentOS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        {/* Success state */}
        <AnimatePresence mode="wait">
          {forgotPassword.isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <Mail size={20} className="text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-white">Check your email</p>
              <p className="mt-1 text-sm text-zinc-400">
                If that address is registered you&apos;ll receive a link
                shortly.
              </p>
              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* API error */}
              <AnimatePresence>
                {forgotPassword.isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <ErrorMessage
                      message={getApiErrorMessage(forgotPassword.error)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
              >
                <Input
                  label="Institute email"
                  type="email"
                  placeholder="you@itbhu.ac.in"
                  autoComplete="email"
                  leftIcon={<Mail size={15} />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  isLoading={forgotPassword.isPending}
                  className="mt-2"
                >
                  Send reset link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-500">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </FormCard>
    </div>
  );
}

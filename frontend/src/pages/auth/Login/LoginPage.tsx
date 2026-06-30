import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "@/hooks/useLogin";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schemas";
import { getApiErrorMessage } from "@/utils/error";

import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const login = useLogin();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)
    ?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sign in to your IIT BHU account
          </p>
        </div>

        {/* Success message from register redirect */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5">
                <p className="text-sm text-emerald-400">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API error */}
        <AnimatePresence>
          {login.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <ErrorMessage message={getApiErrorMessage(login.error)} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@itbhu.ac.in"
            autoComplete="email"
            leftIcon={<Mail size={15} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" isLoading={login.isPending} className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Create one
          </Link>
        </p>
      </FormCard>
    </div>
  );
}

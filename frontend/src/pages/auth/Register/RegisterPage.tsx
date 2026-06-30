import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, User } from "lucide-react";

import { useRegister } from "@/hooks/useRegister";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schemas";
import { getApiErrorMessage } from "@/utils/error";

import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function RegisterPage() {
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = (data: RegisterFormData) => {
    register_.mutate(data);
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            IIT BHU institute email required
          </p>
        </div>

        {/* API error */}
        <AnimatePresence>
          {register_.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <ErrorMessage message={getApiErrorMessage(register_.error)} />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            leftIcon={<User size={15} />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Institute email"
            type="email"
            placeholder="you@itbhu.ac.in"
            autoComplete="email"
            leftIcon={<Mail size={15} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Min 8 chars, upper, lower, number, special"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            isLoading={register_.isPending}
            className="mt-2"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Sign in
          </Link>
        </p>
      </FormCard>
    </div>
  );
}

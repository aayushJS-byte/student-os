import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import FormCard from "@/components/ui/FormCard";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { isLoading, isSuccess, isError } = useVerifyEmail(token);

  return (
    <FormCard>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            StudentOS
          </p>

          {/* Loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <Loader
                size={36}
                className="mx-auto animate-spin text-zinc-400"
              />
              <p className="mt-4 text-sm text-zinc-400">
                Verifying your email…
              </p>
            </motion.div>
          )}

          {/* Success */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-8"
            >
              <CheckCircle
                size={40}
                className="mx-auto text-emerald-400"
                strokeWidth={1.5}
              />
              <h1 className="mt-4 text-xl font-semibold text-white">
                Email verified
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Your StudentOS account is now active.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Continue to sign in
              </Link>
            </motion.div>
          )}

          {/* Error / missing token */}
          {(isError || !token) && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-8"
            >
              <XCircle
                size={40}
                className="mx-auto text-red-400"
                strokeWidth={1.5}
              />
              <h1 className="mt-4 text-xl font-semibold text-white">
                Verification failed
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                This link is invalid or has expired. Register again to get a
                new one.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Back to register
              </Link>
            </motion.div>
          )}
        </div>
    </FormCard>
  );
}

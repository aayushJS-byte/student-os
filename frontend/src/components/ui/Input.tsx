import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-zinc-800/50 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${leftIcon ? "pl-10" : ""} ${error ? "border-red-500/50 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/20" : "border-zinc-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"} ${className}`}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

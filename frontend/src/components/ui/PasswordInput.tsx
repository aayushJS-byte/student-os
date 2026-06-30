import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? "password";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            className={`w-full rounded-lg border bg-zinc-800/50 px-3 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500/50 focus:border-red-500" : "border-zinc-700 focus:border-zinc-500"} ${className}`}
            {...props}
          />

          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

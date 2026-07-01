import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-zinc-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={3}
          className={`w-full resize-y rounded-lg border bg-zinc-800/50 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500/50 focus:border-red-500" : "border-zinc-700 focus:border-zinc-500"} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

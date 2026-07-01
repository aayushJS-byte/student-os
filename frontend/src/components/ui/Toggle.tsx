interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        {description && (
          <p className="text-xs text-zinc-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-white" : "bg-zinc-700"}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-zinc-950 transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

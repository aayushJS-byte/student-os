interface TagSelectProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function TagSelect({
  label,
  options,
  value,
  onChange,
  error,
}: TagSelectProps) {
  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <p className="text-sm font-medium text-zinc-300">{label}</p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((tag) => {
          const selected = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                selected
                  ? "bg-white text-zinc-950"
                  : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

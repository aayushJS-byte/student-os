import { useRef, useEffect, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { STATUS_OPTIONS, JOB_TYPE_OPTIONS } from "@/constants/application";

interface ApplicationFiltersProps {
  search: string;
  status: string;
  jobType: string;
  hasActiveFilters: boolean;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onJobType: (value: string) => void;
  onClear: () => void;
}

export default function ApplicationFilters({
  search,
  status,
  jobType,
  hasActiveFilters,
  onSearch,
  onStatus,
  onJobType,
  onClear,
}: ApplicationFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when external search changes (e.g., clear filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 350);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Search company or role..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
        />
        {localSearch && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1">
        <SlidersHorizontal size={13} className="shrink-0 text-zinc-500" />
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="cursor-pointer appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 py-2 pl-3 pr-8 text-sm text-white outline-none focus:border-zinc-500"
        >
          <option value="" className="bg-zinc-900">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job type filter */}
      <select
        value={jobType}
        onChange={(e) => onJobType(e.target.value)}
        className="cursor-pointer appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 py-2 pl-3 pr-8 text-sm text-white outline-none focus:border-zinc-500"
      >
        <option value="" className="bg-zinc-900">All Types</option>
        {JOB_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}

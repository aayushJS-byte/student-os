export function formatDate(
  date: string | Date | null | undefined,
  format: "short" | "medium" | "long" = "short"
): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: "2-digit", month: "short" },
    medium: { day: "2-digit", month: "short", year: "numeric" },
    long: { day: "2-digit", month: "long", year: "numeric" },
  };

  return new Intl.DateTimeFormat("en-IN", formats[format]).format(d);
}

export function toInputDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

/** Format for <input type="datetime-local"> — "YYYY-MM-DDTHH:MM" in LOCAL timezone */
export function toInputDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  // Subtract timezone offset so the displayed time matches the user's local clock
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function isDeadlineSoon(
  date: string | Date | null | undefined,
  days = 3
): boolean {
  if (!date) return false;
  const d = new Date(date);
  const diff = d.getTime() - Date.now();
  return diff > 0 && diff < days * 24 * 60 * 60 * 1000;
}

export function isDeadlinePast(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

export function isToday(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

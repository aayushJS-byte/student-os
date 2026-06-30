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

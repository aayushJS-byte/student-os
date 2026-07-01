import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, ArrowUpRight, X } from "lucide-react";
import { useCalendar } from "@/hooks/applications/useCalendar";
import type { CalendarEvent, CalendarEventType } from "@/types/application";

// ─── Config ───────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<CalendarEventType, { label: string; dot: string; badge: string; text: string }> = {
  apply_deadline: {
    label: "Apply Deadline",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    text: "text-amber-300",
  },
  oa: {
    label: "Online Assessment",
    dot: "bg-violet-400",
    badge: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    text: "text-violet-300",
  },
  interview: {
    label: "Interview",
    dot: "bg-blue-400",
    badge: "bg-blue-500/15 border-blue-500/30 text-blue-300",
    text: "text-blue-300",
  },
  offer_deadline: {
    label: "Offer Deadline",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    text: "text-emerald-300",
  },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {(Object.entries(EVENT_CONFIG) as [CalendarEventType, typeof EVENT_CONFIG[CalendarEventType]][]).map(
        ([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-zinc-500">{cfg.label}</span>
          </div>
        )
      )}
    </div>
  );
}

// ─── Event chip ───────────────────────────────────────────────────────────────

function EventChip({ event }: { event: CalendarEvent }) {
  const cfg = EVENT_CONFIG[event.type];
  return (
    <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 border text-[10px] font-medium leading-none truncate ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
      <span className="truncate">{event.company}</span>
    </div>
  );
}

// ─── Day detail panel ─────────────────────────────────────────────────────────

function DayPanel({
  date,
  events,
  onClose,
}: {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
}) {
  return (
    <motion.div
      key="day-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className="flex flex-col w-full lg:w-80 shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{events.length} event{events.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
        {events.map((ev, i) => {
          const cfg = EVENT_CONFIG[ev.type];
          return (
            <div key={i} className="px-4 py-3 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className={`flex items-center gap-1.5 mb-1`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{ev.company}</p>
                  <p className="text-xs text-zinc-400 truncate">{ev.role}</p>
                  <p className="text-xs text-zinc-500 mt-1">{ev.label}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{formatTime(ev.date)}</p>
                </div>
                <Link
                  to={`/applications/${ev.applicationId}`}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-700/50 hover:text-zinc-300 transition-colors"
                >
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Calendar grid ────────────────────────────────────────────────────────────

function CalendarGrid({
  year,
  month,
  eventsByDay,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  eventsByDay: Map<string, CalendarEvent[]>;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
}) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex-1 min-w-0">
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800/40 rounded-xl overflow-hidden border border-zinc-800/60">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="bg-zinc-950 min-h-[80px] sm:min-h-[96px]" />;
          }

          const key = `${year}-${month}-${day}`;
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected =
            selectedDate?.getFullYear() === year &&
            selectedDate?.getMonth() === month &&
            selectedDate?.getDate() === day;
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={`relative flex flex-col bg-zinc-950 p-1.5 sm:p-2 min-h-[80px] sm:min-h-[96px] text-left transition-colors ${
                isSelected
                  ? "ring-1 ring-inset ring-indigo-500/50 bg-indigo-500/5"
                  : "hover:bg-zinc-900/60"
              } ${isPast && !isToday ? "opacity-50" : ""}`}
            >
              <span
                className={`self-start flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium mb-1 ${
                  isToday
                    ? "bg-indigo-500 text-white font-bold"
                    : isSelected
                    ? "text-indigo-300"
                    : "text-zinc-400"
                }`}
              >
                {day}
              </span>

              <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                {dayEvents.slice(0, 2).map((ev, i) => (
                  <EventChip key={i} event={ev} />
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-zinc-600 px-1">+{dayEvents.length - 2} more</span>
                )}
              </div>

              {/* Dot strip for mobile */}
              {dayEvents.length > 0 && (
                <div className="mt-auto flex gap-0.5 flex-wrap sm:hidden">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${EVENT_CONFIG[ev.type].dot}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Upcoming list ─────────────────────────────────────────────────────────────

function UpcomingList({ events }: { events: CalendarEvent[] }) {
  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  if (!upcoming.length) return null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Upcoming</p>
      </div>
      <div className="divide-y divide-zinc-800/60">
        {upcoming.slice(0, 5).map((ev, i) => {
          const cfg = EVENT_CONFIG[ev.type];
          return (
            <Link
              key={i}
              to={`/applications/${ev.applicationId}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors group"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200 truncate">{ev.company}</p>
                <p className="text-xs text-zinc-500 truncate">{ev.label}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-zinc-400">{new Date(ev.date).toLocaleDateString([], { month: "short", day: "numeric" })}</p>
                <p className="text-[10px] text-zinc-600">{formatTime(ev.date)}</p>
              </div>
              <ArrowUpRight size={12} className="shrink-0 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { data: events = [], isLoading } = useCalendar();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = toLocalDateKey(ev.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return eventsByDay.get(key) ?? [];
  }, [selectedDate, eventsByDay]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(null);
  }

  return (
    <div className="min-h-full bg-zinc-950 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/25">
              <CalendarDays size={16} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Placement Calendar</h1>
              <p className="text-xs text-zinc-500">All your deadlines, OAs, and interviews in one place</p>
            </div>
          </div>
          <Legend />
        </div>

        {/* Month nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-base font-semibold text-white w-44 text-center">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={goToday}
            className="ml-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            Today
          </button>
          {isLoading && (
            <span className="ml-auto text-xs text-zinc-600 animate-pulse">Loading…</span>
          )}
        </div>

        {/* Main layout: calendar + panel */}
        <div className="flex gap-4 items-start">
          <CalendarGrid
            year={year}
            month={month}
            eventsByDay={eventsByDay}
            selectedDate={selectedDate}
            onSelectDate={(d) =>
              setSelectedDate((prev) =>
                prev?.toDateString() === d.toDateString() ? null : d
              )
            }
          />

          <AnimatePresence>
            {selectedDate && selectedEvents.length > 0 && (
              <DayPanel
                date={selectedDate}
                events={selectedEvents}
                onClose={() => setSelectedDate(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Upcoming strip */}
        {!isLoading && events.length > 0 && <UpcomingList events={events} />}

        {/* Empty state */}
        {!isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
              <CalendarDays size={22} className="text-zinc-600" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">No events yet</p>
            <p className="text-xs text-zinc-600 mt-1 max-w-xs">
              Events appear here when you have active applications with OA dates, interview rounds, deadlines, or offer expiry dates.
            </p>
            <Link
              to="/applications"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Go to Applications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

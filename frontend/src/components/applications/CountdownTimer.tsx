import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
  date: string | Date | null | undefined;
  label?: string;
  urgentLabel?: string;
  doneLabel?: string;
  completedLabel?: string;
  completed?: boolean;
  /** Hours threshold below which the timer turns red. Default 2. */
  urgentThresholdHours?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  const days = Math.floor(total / 1000 / 60 / 60 / 24);
  return { days, hours, minutes, seconds, total };
}

export default function CountdownTimer({
  date,
  label = "Countdown",
  urgentLabel = "Happening Soon!",
  doneLabel = "Time has passed",
  completedLabel = "Completed",
  completed,
  urgentThresholdHours = 2,
}: CountdownTimerProps) {
  const target = date ? new Date(date) : null;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    target ? getTimeLeft(target) : null
  );

  useEffect(() => {
    if (!target || isNaN(target.getTime())) return;
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [String(date)]);

  if (!target || isNaN(target.getTime())) return null;

  if (completed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
        <Timer size={15} className="text-emerald-400" />
        <span className="text-sm text-emerald-400">{completedLabel}</span>
      </div>
    );
  }

  const isOver = timeLeft ? timeLeft.total <= 0 : false;
  const isUrgent = timeLeft
    ? timeLeft.total > 0 && timeLeft.total < urgentThresholdHours * 60 * 60 * 1000
    : false;

  if (isOver) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3">
        <Timer size={15} className="text-zinc-500" />
        <span className="text-sm text-zinc-500">{doneLabel}</span>
      </div>
    );
  }

  const border = isUrgent ? "border-red-500/30" : "border-violet-500/20";
  const bg = isUrgent ? "bg-red-500/10" : "bg-violet-500/10";
  const accent = isUrgent ? "text-red-400" : "text-violet-400";
  const value = isUrgent ? "text-red-300" : "text-violet-300";

  return (
    <div className={`rounded-lg border ${border} ${bg} px-4 py-3`}>
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${accent}`}>
        <Timer size={13} />
        {isUrgent ? urgentLabel : label}
      </div>
      {timeLeft && (
        <div className="flex items-baseline gap-3">
          {timeLeft.days > 0 && (
            <span className={`text-2xl font-bold tabular-nums ${value}`}>
              {timeLeft.days}
              <span className={`ml-1 text-xs font-normal ${accent}`}>d</span>
            </span>
          )}
          <span className={`text-2xl font-bold tabular-nums ${value}`}>
            {String(timeLeft.hours).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${accent}`}>h</span>
          </span>
          <span className={`text-2xl font-bold tabular-nums ${value}`}>
            {String(timeLeft.minutes).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${accent}`}>m</span>
          </span>
          <span className={`text-2xl font-bold tabular-nums ${value}`}>
            {String(timeLeft.seconds).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${accent}`}>s</span>
          </span>
        </div>
      )}
    </div>
  );
}

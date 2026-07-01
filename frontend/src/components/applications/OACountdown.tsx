import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface OACountdownProps {
  scheduledAt: string | Date | null | undefined;
  completed?: boolean;
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

export default function OACountdown({ scheduledAt, completed }: OACountdownProps) {
  const target = scheduledAt ? new Date(scheduledAt) : null;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    target ? getTimeLeft(target) : null
  );

  useEffect(() => {
    if (!target || isNaN(target.getTime())) return;

    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [scheduledAt]);

  if (!target || isNaN(target.getTime())) return null;

  const isOver = timeLeft ? timeLeft.total <= 0 : false;
  const isSoon = timeLeft ? timeLeft.total > 0 && timeLeft.total < 2 * 60 * 60 * 1000 : false;

  if (completed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
        <Timer size={16} className="text-emerald-400" />
        <span className="text-sm text-emerald-400">OA completed</span>
      </div>
    );
  }

  if (isOver) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3">
        <Timer size={16} className="text-zinc-500" />
        <span className="text-sm text-zinc-500">OA time has passed</span>
      </div>
    );
  }

  const borderColor = isSoon ? "border-red-500/30" : "border-violet-500/20";
  const bgColor = isSoon ? "bg-red-500/10" : "bg-violet-500/10";
  const textColor = isSoon ? "text-red-400" : "text-violet-400";
  const labelColor = isSoon ? "text-red-300" : "text-violet-300";

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} px-4 py-3`}>
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${textColor}`}>
        <Timer size={13} />
        {isSoon ? "OA Starting Soon!" : "OA Countdown"}
      </div>
      {timeLeft && (
        <div className="flex items-baseline gap-3">
          {timeLeft.days > 0 && (
            <span className={`text-2xl font-bold tabular-nums ${labelColor}`}>
              {timeLeft.days}
              <span className={`ml-1 text-xs font-normal ${textColor}`}>d</span>
            </span>
          )}
          <span className={`text-2xl font-bold tabular-nums ${labelColor}`}>
            {String(timeLeft.hours).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${textColor}`}>h</span>
          </span>
          <span className={`text-2xl font-bold tabular-nums ${labelColor}`}>
            {String(timeLeft.minutes).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${textColor}`}>m</span>
          </span>
          <span className={`text-2xl font-bold tabular-nums ${labelColor}`}>
            {String(timeLeft.seconds).padStart(2, "0")}
            <span className={`ml-1 text-xs font-normal ${textColor}`}>s</span>
          </span>
        </div>
      )}
    </div>
  );
}

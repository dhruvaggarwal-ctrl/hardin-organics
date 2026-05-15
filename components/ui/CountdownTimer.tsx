"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime?: Date;
  hoursFromNow?: number;
  className?: string;
}

export function CountdownTimer({ hoursFromNow = 6, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = new Date();
    end.setHours(end.getHours() + hoursFromNow);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hoursFromNow]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`inline-flex items-center gap-1 font-mono font-bold ${className}`}>
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.hours)}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.minutes)}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{pad(timeLeft.seconds)}</span>
    </div>
  );
}

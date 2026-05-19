"use client";

import { useEffect, useState, useRef } from "react";

const SS_KEY = "hardin_bogo_expiry"; // shared with BOGO page — stays in sync

export function CountdownTimer({ className = "" }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const endRef = useRef<number>(0);

  useEffect(() => {
    // Use same sessionStorage key so homepage timer stays in sync with BOGO page
    const stored = sessionStorage.getItem(SS_KEY);
    if (stored) {
      const end = parseInt(stored, 10);
      if (end > Date.now()) {
        endRef.current = end;
      } else {
        // Expired — start fresh 24hr window
        endRef.current = Date.now() + 24 * 3600 * 1000;
        sessionStorage.setItem(SS_KEY, String(endRef.current));
      }
    } else {
      endRef.current = Date.now() + 24 * 3600 * 1000;
      sessionStorage.setItem(SS_KEY, String(endRef.current));
    }

    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

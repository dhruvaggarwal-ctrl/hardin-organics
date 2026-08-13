"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const KNOB_SIZE = 48;
const INSET = 4;
const COMPLETE_THRESHOLD = 0.7;

export function SwipeToBuy({
  label,
  doneLabel,
  trackColor,
  onComplete,
}: {
  label: string;
  doneLabel: string;
  trackColor: string;
  onComplete: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);

  const max = Math.max(1, trackWidth - KNOB_SIZE - INSET * 2);
  const textOpacity = useTransform(x, [0, max * 0.6], [1, 0]);
  const fillWidth = useTransform(x, (v) => v + KNOB_SIZE + INSET * 2);

  useEffect(() => {
    function measure() {
      if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function handleDragEnd() {
    const progress = x.get() / max;
    if (progress >= COMPLETE_THRESHOLD) {
      setDone(true);
      animate(x, max, { type: "spring", stiffness: 420, damping: 40 });
      setTimeout(onComplete, 420);
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    }
  }

  return (
    <div
      ref={trackRef}
      className="relative w-full h-[48px] rounded-full overflow-hidden select-none"
      style={{ backgroundColor: `${trackColor}33` }}
    >
      {/* Trailing fill behind the knob */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: fillWidth, backgroundColor: trackColor }}
      />

      {/* Shimmer hint, loops until the user starts dragging */}
      {!done && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-swipe-shimmer" />
        </div>
      )}

      {/* Label */}
      <motion.p
        style={{ opacity: done ? 1 : textOpacity }}
        className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[13px] tracking-wide pointer-events-none px-14"
      >
        {done ? doneLabel : label}
      </motion.p>

      {/* Draggable knob */}
      <motion.div
        drag={done || trackWidth === 0 ? false : "x"}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.04}
        dragMomentum={false}
        style={{ x, width: KNOB_SIZE, height: KNOB_SIZE }}
        onDragEnd={handleDragEnd}
        className="absolute top-1/2 -translate-y-1/2 left-1 bg-white rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      >
        {done ? (
          <svg className="w-5 h-5" stroke="#2D5016" fill="none" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke={trackColor} strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}

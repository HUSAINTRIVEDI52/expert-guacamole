"use client";

import { useCallback, useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  ariaLabelMin: string;
  ariaLabelMax: string;
}

export const RangeSlider = ({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onMinChange,
  onMaxChange,
  ariaLabelMin,
  ariaLabelMax,
}: RangeSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  const valueToPercent = useCallback(
    (v: number) => (Math.max(min, Math.min(max, v)) - min) / (max - min),
    [min, max],
  );
  const percentToValue = useCallback(
    (p: number) => Math.round((min + p * (max - min)) / step) * step,
    [min, max, step],
  );

  const getPercentFromEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      return Math.max(0, Math.min(1, x / rect.width));
    },
    [],
  );

  const handleTrackPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!trackRef.current) return;
      const percent = getPercentFromEvent(e);
      const value = percentToValue(percent);
      const distMin = Math.abs(value - valueMin);
      const distMax = Math.abs(value - valueMax);
      if (distMin <= distMax) {
        draggingRef.current = "min";
        onMinChange(Math.min(value, valueMax - step));
      } else {
        draggingRef.current = "max";
        onMaxChange(Math.max(value, valueMin + step));
      }
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [
      valueMin,
      valueMax,
      step,
      percentToValue,
      getPercentFromEvent,
      onMinChange,
      onMaxChange,
    ],
  );

  const handleThumbPointerDown = useCallback(
    (which: "min" | "max") => (e: React.PointerEvent) => {
      e.stopPropagation();
      draggingRef.current = which;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current === null) return;
      const percent = getPercentFromEvent(e);
      const value = percentToValue(percent);
      if (draggingRef.current === "min") {
        onMinChange(Math.min(value, valueMax - step));
      } else {
        onMaxChange(Math.max(value, valueMin + step));
      }
    },
    [
      valueMin,
      valueMax,
      step,
      percentToValue,
      getPercentFromEvent,
      onMinChange,
      onMaxChange,
    ],
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const pctMin = valueToPercent(valueMin);
  const pctMax = valueToPercent(valueMax);

  return (
    <div
      ref={trackRef}
      className="relative py-4"
      role="group"
      aria-label={`${ariaLabelMin} and ${ariaLabelMax}`}
    >
      <div
        className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-700"
        aria-hidden
      />
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-lg bg-zinc-400 dark:bg-zinc-600"
        style={{
          left: `${pctMin * 100}%`,
          width: `${(pctMax - pctMin) * 100}%`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 cursor-pointer"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={valueMin}
        aria-label={`Range from ${valueMin} to ${valueMax}`}
      />
      <div
        className="absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 cursor-grab rounded-full bg-zinc-900 dark:bg-zinc-100 touch-none"
        style={{ left: `calc(${pctMin * 100}% - 8px)` }}
        role="slider"
        aria-label={ariaLabelMin}
        aria-valuemin={min}
        aria-valuemax={valueMax - step}
        aria-valuenow={valueMin}
        tabIndex={0}
        onPointerDown={handleThumbPointerDown("min")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            onMinChange(Math.max(min, valueMin - step));
          } else if (e.key === "ArrowRight") {
            onMinChange(Math.min(valueMax - step, valueMin + step));
          }
        }}
      />
      <div
        className="absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 cursor-grab rounded-full bg-zinc-900 dark:bg-zinc-100 touch-none"
        style={{ left: `calc(${pctMax * 100}% - 8px)` }}
        role="slider"
        aria-label={ariaLabelMax}
        aria-valuemin={valueMin + step}
        aria-valuemax={max}
        aria-valuenow={valueMax}
        tabIndex={0}
        onPointerDown={handleThumbPointerDown("max")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            onMaxChange(Math.max(valueMin + step, valueMax - step));
          } else if (e.key === "ArrowRight") {
            onMaxChange(Math.min(max, valueMax + step));
          }
        }}
      />
    </div>
  );
};

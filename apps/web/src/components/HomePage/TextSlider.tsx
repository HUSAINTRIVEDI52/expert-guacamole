"use client";

import { useEffect, useState } from "react";

interface TextSliderProps {
  items: string[];
  /** milliseconds each name is shown (default 2000) */
  interval?: number;
  className?: string;
}

export function TextSlider({
  items,
  interval = 2000,
  className,
}: TextSliderProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState<"enter" | "exit" | "idle">("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      // start exit animation
      setAnimating("exit");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setAnimating("enter");
        // after enter animation ends, go idle
        setTimeout(() => setAnimating("idle"), 350);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  const translateY =
    animating === "exit"
      ? "-translate-y-full opacity-0"
      : animating === "enter"
        ? "translate-y-full opacity-0"
        : "translate-y-0 opacity-100";

  return (
    <div
      className={`relative overflow-hidden h-[1.4em] px-3 inline-flex items-center ${className ?? ""}`}
      aria-live="polite"
      aria-label={items[current]}
    >
      <span
        className={`block font-noto-sans font-semibold text-[#0D6363] whitespace-nowrap transition-all duration-300 ease-in-out ${translateY}`}
      >
        {items[current]}
      </span>
    </div>
  );
}

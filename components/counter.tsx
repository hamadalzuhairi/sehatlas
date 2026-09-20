"use client";

import { useEffect, useRef } from "react";

/**
 * Counts up to `value` when scrolled into view. The final value is what gets
 * rendered, so the real figure is present without JavaScript and for crawlers;
 * the animation only rewrites the text node while it runs.
 */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  durationMs = 1400,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.textContent = format(value);
      return;
    }

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = format(value * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        node.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, durationMs, decimals, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

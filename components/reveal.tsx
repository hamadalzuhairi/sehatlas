"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      node.style.transitionDelay = `${delay}ms`;
      node.classList.add("is-visible");
    };

    // No observer support, or the reader prefers less motion: show at once.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      // threshold 0 with a bottom inset: a block taller than the viewport can
      // never reach a fractional threshold, which used to leave it invisible.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    // Belt and braces — no content on this site may stay hidden.
    const failsafe = window.setTimeout(show, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div ref={ref} className={clsx("reveal", className)}>
      {children}
    </div>
  );
}

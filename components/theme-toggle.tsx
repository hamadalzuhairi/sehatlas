"use client";

import { useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "sehhatlas-theme";

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    document.documentElement.setAttribute("data-js", "1");
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

type Theme = "light" | "dark";

const LIGHT_QUERY = "(prefers-color-scheme: light)";

/**
 * The theme lives in localStorage and on the documentElement, not in React
 * state — both are external systems, so the toggle subscribes to them.
 */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = window.matchMedia(LIGHT_QUERY);
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* private mode, blocked storage — fall through to the OS preference */
  }
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

/** Dark is the default register, so that is what the server renders. */
function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle({
  labelLight,
  labelDark,
}: {
  labelLight: string;
  labelDark: string;
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  function toggle() {
    const next: Theme = isLight ? "dark" : "light";
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* not fatal — the attribute below still applies for this session */
    }
    document.documentElement.setAttribute("data-theme", next);
    emit();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-bg-sunken hover:text-fg"
    >
      <span aria-hidden className="text-sm leading-none">
        {isLight ? "☀" : "☽"}
      </span>
      {isLight ? labelLight : labelDark}
    </button>
  );
}

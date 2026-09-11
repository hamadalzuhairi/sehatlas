"use client";

import type { VulnerabilityComponentKey } from "@/lib/mvp/types";

const KEYS: VulnerabilityComponentKey[] = ["socio", "env", "disease"];

export function ComponentToggles({
  label,
  hint,
  enabled,
  onChange,
  optionLabels,
}: {
  label: string;
  hint: string;
  enabled: VulnerabilityComponentKey[];
  onChange: (next: VulnerabilityComponentKey[]) => void;
  optionLabels: Record<VulnerabilityComponentKey, string>;
}) {
  function toggle(key: VulnerabilityComponentKey) {
    const isEnabled = enabled.includes(key);
    if (isEnabled && enabled.length === 1) return;
    onChange(isEnabled ? enabled.filter((k) => k !== key) : [...enabled, key]);
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">{label}</p>
      <div className="flex flex-wrap gap-3">
        {KEYS.map((key) => (
          <label
            key={key}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-bg-sunken px-3 py-1.5 text-xs font-medium text-fg"
          >
            <input
              type="checkbox"
              checked={enabled.includes(key)}
              onChange={() => toggle(key)}
              className="h-3.5 w-3.5 accent-[var(--accent)]"
            />
            {optionLabels[key]}
          </label>
        ))}
      </div>
      <p className="mt-1.5 max-w-md text-xs text-fg-muted">{hint}</p>
    </div>
  );
}

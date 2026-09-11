"use client";

import { useState } from "react";
import { StatusBadge, type FeatureStatus } from "@/components/status-badge";
import pipelineStatus from "@/content/pipeline-status.json";

export function MvpPipelineStatus({
  heading,
  toggleLabel,
  moduleLabels,
  statusLabels,
}: {
  heading: string;
  toggleLabel: string;
  moduleLabels: Record<string, string>;
  statusLabels: Record<FeatureStatus, string>;
}) {
  const [open, setOpen] = useState(false);
  const modules = Object.entries(pipelineStatus) as [string, FeatureStatus][];

  return (
    <div className="rounded-xl border border-border bg-bg-raised">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-4 text-start"
      >
        <span className="text-sm font-bold text-fg">{heading}</span>
        <span className="flex items-center gap-2 text-xs text-fg-muted">
          {toggleLabel}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
            style={{ transform: open ? "rotate(180deg)" : "none" }}
            className="transition-transform"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="grid grid-cols-1 gap-2 border-t border-border p-4 sm:grid-cols-2">
          {modules.map(([key, status]) => (
            <li
              key={key}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg-sunken px-3 py-2"
            >
              <span className="text-sm text-fg">{moduleLabels[key] ?? key}</span>
              <StatusBadge status={status} label={statusLabels[status]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import type { ComputedRegion } from "@/lib/mvp/types";
import { QUADRANT_COLOR_VAR } from "@/lib/mvp/quadrant-style";

export function MvpDetailsPanel({
  region,
  locale,
  labels,
}: {
  region: ComputedRegion | null;
  locale: string;
  labels: {
    heading: string;
    empty: string;
    quadrantLabel: string;
    accessLabel: string;
    vulnerabilityLabel: string;
    componentsHeading: string;
    coverageLabel: string;
    coverageHint: string;
    plannerHeading: string;
    plannerText: string;
    quadrantNames: Record<string, string>;
  };
}) {
  if (!region) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-sm text-fg-muted">
        {labels.empty}
      </div>
    );
  }

  const name = locale === "ar" ? region.name_ar : region.name_en;
  const otherName = locale === "ar" ? region.name_en : region.name_ar;
  const color = QUADRANT_COLOR_VAR[region.quadrant];
  const plannerText = labels.plannerText;

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-fg">{name}</h3>
          <p className="text-sm text-fg-muted" dir={locale === "ar" ? "ltr" : "rtl"}>
            {otherName}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
        >
          {labels.quadrantNames[region.quadrant]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-fg-muted">{labels.accessLabel}</p>
          <p className="text-xl font-bold text-fg">{region.access.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-fg-muted">{labels.vulnerabilityLabel}</p>
          <p className="text-xl font-bold text-fg">{region.vulnerability.toFixed(0)}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {labels.componentsHeading}
        </p>
        <div className="mt-2 h-[120px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={region.componentContributions}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" radius={4} barSize={14}>
                {region.componentContributions.map((c) => (
                  <Cell key={c.key} fill="var(--accent)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-fg-muted">{labels.coverageLabel}</p>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-sunken">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.round(region.coverage_ratio * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-sm font-semibold text-fg">
          {Math.round(region.coverage_ratio * 100)}%
        </p>
        <p className="mt-1 text-xs text-fg-muted">{labels.coverageHint}</p>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-bg-sunken p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {labels.plannerHeading}
        </p>
        <p className="mt-1 text-sm text-fg">{plannerText}</p>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { ComputedRegion } from "@/lib/mvp/types";
import { QUADRANT_COLOR_VAR, QUADRANT_ORDER } from "@/lib/mvp/quadrant-style";
import { downloadCsv, regionsToCsv } from "@/lib/mvp/csv";

type SortKey = "region" | "access30" | "access60" | "vulnerability" | "quadrant" | "coverage";

export function MvpRankedTable({
  regions,
  locale,
  selectedId,
  onSelect,
  columns,
  quadrantLabels,
  exportLabel,
}: {
  regions: ComputedRegion[];
  locale: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  columns: Record<SortKey | "rank", string>;
  quadrantLabels: Record<string, string>;
  exportLabel: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("quadrant");
  const [sortAsc, setSortAsc] = useState(true);
  const nameKey = locale === "ar" ? "name_ar" : "name_en";

  const sorted = useMemo(() => {
    const withRank = [...regions].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "region":
          cmp = a[nameKey].localeCompare(b[nameKey]);
          break;
        case "access30":
          cmp = a.access_30 - b.access_30;
          break;
        case "access60":
          cmp = a.access_60 - b.access_60;
          break;
        case "vulnerability":
          cmp = a.vulnerability - b.vulnerability;
          break;
        case "coverage":
          cmp = a.coverage_ratio - b.coverage_ratio;
          break;
        case "quadrant":
          cmp =
            QUADRANT_ORDER.indexOf(a.quadrant) - QUADRANT_ORDER.indexOf(b.quadrant) ||
            b.vulnerability - a.vulnerability;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return withRank;
  }, [regions, sortKey, sortAsc, nameKey]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleExport() {
    const csv = regionsToCsv(
      sorted,
      locale,
      {
        rank: columns.rank,
        region: columns.region,
        access30: columns.access30,
        access60: columns.access60,
        vulnerability: columns.vulnerability,
        quadrant: columns.quadrant,
        coverage: columns.coverage,
      },
      quadrantLabels,
    );
    downloadCsv("sehatlas-demo-regions.csv", csv);
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: "region", label: columns.region },
    { key: "access30", label: columns.access30 },
    { key: "access60", label: columns.access60 },
    { key: "vulnerability", label: columns.vulnerability },
    { key: "quadrant", label: columns.quadrant },
    { key: "coverage", label: columns.coverage },
  ];

  return (
    <div className="rounded-xl border border-border bg-bg-raised">
      <div className="flex items-center justify-end border-b border-border p-3">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-accent hover:text-fg"
        >
          {exportLabel}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-start text-xs uppercase tracking-wide text-fg-muted">
              <th className="px-4 py-3 text-start font-semibold">{columns.rank}</th>
              {headers.map((h) => (
                <th key={h.key} className="px-4 py-3 text-start font-semibold">
                  <button
                    type="button"
                    onClick={() => toggleSort(h.key)}
                    className="inline-flex items-center gap-1 hover:text-fg"
                  >
                    {h.label}
                    {sortKey === h.key && <span aria-hidden>{sortAsc ? "▲" : "▼"}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((region, i) => (
              <tr
                key={region.region_id}
                onClick={() => onSelect(region.region_id)}
                className={clsx(
                  "cursor-pointer border-b border-border/60 last:border-0 hover:bg-bg-sunken",
                  selectedId === region.region_id && "bg-bg-sunken",
                )}
              >
                <td className="px-4 py-3 text-fg-muted">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-fg">{region[nameKey]}</td>
                <td className="px-4 py-3 text-fg-muted tabular-nums">{region.access_30.toFixed(0)}</td>
                <td className="px-4 py-3 text-fg-muted tabular-nums">{region.access_60.toFixed(0)}</td>
                <td className="px-4 py-3 text-fg-muted tabular-nums">{region.vulnerability.toFixed(0)}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: `color-mix(in srgb, ${QUADRANT_COLOR_VAR[region.quadrant]} 18%, transparent)`,
                      color: QUADRANT_COLOR_VAR[region.quadrant],
                    }}
                  >
                    {quadrantLabels[region.quadrant]}
                  </span>
                </td>
                <td className="px-4 py-3 text-fg-muted tabular-nums">
                  {Math.round(region.coverage_ratio * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

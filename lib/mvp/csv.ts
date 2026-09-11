import type { ComputedRegion } from "./types";

export function regionsToCsv(
  regions: ComputedRegion[],
  locale: string,
  columns: { access30: string; access60: string; vulnerability: string; quadrant: string; coverage: string; region: string; rank: string },
  quadrantLabels: Record<string, string>,
): string {
  const nameKey = locale === "ar" ? "name_ar" : "name_en";
  const header = [columns.rank, columns.region, columns.access30, columns.access60, columns.vulnerability, columns.quadrant, columns.coverage];
  const rows = regions.map((r, i) => [
    String(i + 1),
    r[nameKey as "name_en" | "name_ar"],
    r.access_30.toString(),
    r.access_60.toString(),
    r.vulnerability.toString(),
    quadrantLabels[r.quadrant] ?? r.quadrant,
    r.coverage_ratio.toString(),
  ]);

  const escape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

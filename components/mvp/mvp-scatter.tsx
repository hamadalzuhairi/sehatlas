"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ComputedRegion } from "@/lib/mvp/types";
import { QUADRANT_COLOR_VAR } from "@/lib/mvp/quadrant-style";

export function MvpScatter({
  regions,
  cutLines,
  selectedId,
  onSelect,
  labels,
  locale,
}: {
  regions: ComputedRegion[];
  cutLines: { accessCut: number; vulnerabilityCut: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
  labels: { xAxis: string; yAxis: string; accessLabel: string; vulnerabilityLabel: string; quadrant: Record<string, string> };
  locale: string;
}) {
  const data = regions.map((r) => ({
    ...r,
    x: r.access,
    y: r.vulnerability,
    name: locale === "ar" ? r.name_ar : r.name_en,
  }));

  const maxX = 100;
  const maxY = 100;

  return (
    <div className="h-[420px] w-full sm:h-[480px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 24, left: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />

          <ReferenceArea
            x1={0}
            x2={cutLines.accessCut}
            y1={cutLines.vulnerabilityCut}
            y2={maxY}
            fill={"var(--quad-priority)"}
            fillOpacity={0.12}
          />
          <ReferenceArea
            x1={cutLines.accessCut}
            x2={maxX}
            y1={cutLines.vulnerabilityCut}
            y2={maxY}
            fill={"var(--quad-served)"}
            fillOpacity={0.08}
          />
          <ReferenceArea
            x1={0}
            x2={cutLines.accessCut}
            y1={0}
            y2={cutLines.vulnerabilityCut}
            fill={"var(--quad-remote)"}
            fillOpacity={0.08}
          />
          <ReferenceArea
            x1={cutLines.accessCut}
            x2={maxX}
            y1={0}
            y2={cutLines.vulnerabilityCut}
            fill={"var(--quad-none)"}
            fillOpacity={0.06}
          />

          <ReferenceLine x={cutLines.accessCut} stroke="var(--fg-muted)" strokeDasharray="4 4" />
          <ReferenceLine y={cutLines.vulnerabilityCut} stroke="var(--fg-muted)" strokeDasharray="4 4" />

          <XAxis
            type="number"
            dataKey="x"
            domain={[0, maxX]}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            stroke="var(--border)"
            label={{ value: labels.xAxis, position: "insideBottom", offset: -14, fill: "var(--fg-muted)", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, maxY]}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            stroke="var(--border)"
            label={{ value: labels.yAxis, angle: -90, position: "insideLeft", fill: "var(--fg-muted)", fontSize: 12 }}
          />
          <ZAxis range={[80, 80]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof data)[number];
              return (
                <div className="rounded-md border border-border bg-bg-raised px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-fg">{d.name}</p>
                  <p className="text-fg-muted">{labels.accessLabel}: {d.access.toFixed(0)}</p>
                  <p className="text-fg-muted">{labels.vulnerabilityLabel}: {d.vulnerability.toFixed(0)}</p>
                  <p className="text-fg-muted">{labels.quadrant[d.quadrant]}</p>
                </div>
              );
            }}
          />
          <Scatter
            data={data}
            onClick={(point) => onSelect((point as unknown as { region_id: string }).region_id)}
            cursor="pointer"
            shape={(props: unknown) => {
              const p = props as { cx: number; cy: number; payload: (typeof data)[number] };
              const isSelected = p.payload.region_id === selectedId;
              return (
                <g style={{ cursor: "pointer" }}>
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={isSelected ? 9 : 6.5}
                    fill={QUADRANT_COLOR_VAR[p.payload.quadrant]}
                    stroke={isSelected ? "#ffffff" : "var(--bg)"}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={p.cx}
                    y={p.cy - 12}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--fg-muted)"
                  >
                    {p.payload.name.length > 14 ? `${p.payload.name.slice(0, 13)}…` : p.payload.name}
                  </text>
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

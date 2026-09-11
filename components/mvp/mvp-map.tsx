"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChoroplethMode, ComputedRegion } from "@/lib/mvp/types";
import { QUADRANT_COLOR_VAR } from "@/lib/mvp/quadrant-style";

type GeoFeature = {
  type: "Feature";
  properties: { region_id: string; name_en: string; name_ar: string };
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] };
};

type GeoData = { type: "FeatureCollection"; features: GeoFeature[] };

const VIEW_W = 900;
const VIEW_H = 700;
const PADDING = 24;

function colorScale(value: number, min: number, max: number, lowColor: string, highColor: string): string {
  const t = max === min ? 0.5 : (value - min) / (max - min);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const parseHex = (hex: string) => {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parseHex(lowColor);
  const [r2, g2, b2] = parseHex(highColor);
  return `rgb(${lerp(r1, r2)}, ${lerp(g1, g2)}, ${lerp(b1, b2)})`;
}

export function MvpMap({
  regions,
  mode,
  selectedId,
  onHover,
  onSelect,
  labels,
  locale,
}: {
  regions: ComputedRegion[];
  mode: ChoroplethMode;
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  labels: {
    quadrant: Record<string, string>;
    accessLabel: string;
    vulnerabilityLabel: string;
    quadrantLabel: string;
  };
  locale: string;
}) {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; regionId: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/data/sau_regions.geojson")
      .then((res) => res.json())
      .then(setGeo)
      .catch(() => setGeo(null));
  }, []);

  const paths = useMemo(() => {
    if (!geo) return [];

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    for (const f of geo.features) {
      const polys = f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates];
      for (const poly of polys) {
        for (const ring of poly) {
          for (const [lon, lat] of ring) {
            if (lon < minLon) minLon = lon;
            if (lon > maxLon) maxLon = lon;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
        }
      }
    }

    const innerW = VIEW_W - PADDING * 2;
    const innerH = VIEW_H - PADDING * 2;
    const scale = Math.min(innerW / (maxLon - minLon), innerH / (maxLat - minLat));
    const offsetX = PADDING + (innerW - (maxLon - minLon) * scale) / 2;
    const offsetY = PADDING + (innerH - (maxLat - minLat) * scale) / 2;

    const project = ([lon, lat]: number[]): [number, number] => [
      offsetX + (lon - minLon) * scale,
      offsetY + (maxLat - lat) * scale,
    ];

    return geo.features.map((f) => {
      const polys = f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates];
      let d = "";
      for (const poly of polys) {
        for (const ring of poly) {
          const projected = ring.map(project);
          d += `M${projected.map((p) => p.map((n) => n.toFixed(1)).join(",")).join("L")}Z `;
        }
      }
      return { regionId: f.properties.region_id, d: d.trim() };
    });
  }, [geo]);

  function fillFor(regionId: string): string {
    const region = regions.find((r) => r.region_id === regionId);
    if (!region) return "#3a3d47";

    if (mode === "quadrant") {
      return QUADRANT_COLOR_VAR[region.quadrant];
    }

    const values = regions.map((r) => (mode === "access" ? r.access : r.vulnerability));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const value = mode === "access" ? region.access : region.vulnerability;
    const lowColor = mode === "access" ? "#4a2b2b" : "#1f3a2e";
    const highColor = mode === "access" ? "#35c4a8" : "#e2716c";
    return colorScale(value, min, max, lowColor, highColor);
  }

  const hoveredRegion = tooltip ? regions.find((r) => r.region_id === tooltip.regionId) : null;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-border bg-bg-sunken sm:h-[480px]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="img"
        aria-label="Choropleth map of Saudi Arabia's 13 administrative regions"
      >
        {paths.map((p) => (
          <path
            key={p.regionId}
            d={p.d}
            fill={fillFor(p.regionId)}
            fillOpacity={0.9}
            stroke={selectedId === p.regionId ? "#ffffff" : "var(--bg-sunken)"}
            strokeWidth={selectedId === p.regionId ? 2.5 : 1}
            className="cursor-pointer transition-[fill-opacity] duration-150 hover:fill-opacity-100"
            onMouseEnter={(e) => {
              onHover(p.regionId);
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, regionId: p.regionId });
              }
            }}
            onMouseMove={(e) => {
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) {
                setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, regionId: p.regionId });
              }
            }}
            onMouseLeave={() => {
              onHover(null);
              setTooltip(null);
            }}
            onClick={() => onSelect(p.regionId)}
          />
        ))}
      </svg>

      {tooltip && hoveredRegion && (
        <div
          className="pointer-events-none absolute z-10 min-w-[160px] rounded-md border border-border bg-bg-raised px-3 py-2 text-xs shadow-lg"
          style={{
            left: Math.min(tooltip.x + 12, VIEW_W - 180),
            top: Math.max(tooltip.y - 12, 0),
          }}
        >
          <p className="font-semibold text-fg">
            {locale === "ar" ? hoveredRegion.name_ar : hoveredRegion.name_en}
          </p>
          <p className="mt-1 text-fg-muted">
            {labels.accessLabel}: {hoveredRegion.access.toFixed(0)}
          </p>
          <p className="text-fg-muted">
            {labels.vulnerabilityLabel}: {hoveredRegion.vulnerability.toFixed(0)}
          </p>
          <p className="text-fg-muted">
            {labels.quadrantLabel}: {labels.quadrant[hoveredRegion.quadrant] ?? hoveredRegion.quadrant}
          </p>
        </div>
      )}

      {!geo && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-fg-muted">
          …
        </div>
      )}
    </div>
  );
}

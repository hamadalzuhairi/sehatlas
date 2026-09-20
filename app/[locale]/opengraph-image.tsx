import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";

export const alt = `${SITE_NAME} — healthcare access and vulnerability mapping for Saudi Arabia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0d0f14";
const ACCENT = "#35c4a8";
const MUTED = "#a1a5b3";
const PRIORITY = "#e2716c";

function Cell({ color, opacity }: { color: string; opacity: number }) {
  return <div style={{ width: 62, height: 62, borderRadius: 12, background: color, opacity }} />;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: 136,
              height: 136,
              gap: 12,
              padding: 12,
              borderRadius: 30,
              background: "#123a34",
            }}
          >
            <Cell color={ACCENT} opacity={1} />
            <Cell color={ACCENT} opacity={0.34} />
            <Cell color={ACCENT} opacity={0.34} />
            <Cell color={ACCENT} opacity={0.18} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 68, color: "#ffffff", fontWeight: 700, letterSpacing: -1.5 }}>
              {SITE_NAME}
            </div>
            <div style={{ fontSize: 26, color: ACCENT }}>sehhatlas.health</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 52, color: "#ffffff", lineHeight: 1.2, maxWidth: 940 }}>
            Where care is far — and who can least afford the distance.
          </div>
          <div style={{ fontSize: 28, color: MUTED, maxWidth: 900, lineHeight: 1.4 }}>
            An open, reproducible map of healthcare access against population vulnerability across
            all 13 regions of Saudi Arabia.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: MUTED }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: PRIORITY }} />
          <div>Prototype · built on open data · Phase 1 in development</div>
        </div>
      </div>
    ),
    size,
  );
}

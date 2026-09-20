import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          padding: 34,
          background: "#0a6e5f",
        }}
      >
        <div style={{ width: 51, height: 51, borderRadius: 10, background: "#ffffff" }} />
        <div style={{ width: 51, height: 51, borderRadius: 10, background: "rgba(255,255,255,0.32)" }} />
        <div style={{ width: 51, height: 51, borderRadius: 10, background: "rgba(255,255,255,0.32)" }} />
        <div style={{ width: 51, height: 51, borderRadius: 10, background: "rgba(255,255,255,0.18)" }} />
      </div>
    ),
    size,
  );
}

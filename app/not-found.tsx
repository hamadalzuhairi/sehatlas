import Link from "next/link";
import { routing } from "@/i18n/routing";

/**
 * Root-level fallback for requests that never reach a locale segment.
 * It has no parent layout, so it renders its own document shell.
 */
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#0b0d12",
          color: "#edeef2",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>404 — page not found</h1>
        <p style={{ color: "#a1a5b3", margin: 0 }}>
          The page you asked for does not exist.
        </p>
        <Link href={`/${routing.defaultLocale}`} style={{ color: "#35c4a8" }}>
          Go to the homepage
        </Link>
      </body>
    </html>
  );
}

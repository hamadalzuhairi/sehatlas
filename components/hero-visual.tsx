import { KSA_SILHOUETTE_PATH, KSA_VIEW_H, KSA_VIEW_W } from "@/lib/hero-path";

const HIGHLIGHTS = [
  { x: 260, y: 260, color: "var(--quad-priority)", delay: "0s" },
  { x: 442, y: 390, color: "var(--quad-served)", delay: "0.6s" },
  { x: 600, y: 300, color: "var(--quad-remote)", delay: "1.2s" },
  { x: 338, y: 520, color: "var(--quad-none)", delay: "1.8s" },
  { x: 494, y: 210, color: "var(--accent)", delay: "0.3s" },
];

const CELL = 26;

export function HeroVisual() {
  return (
    <svg
      viewBox={`0 0 ${KSA_VIEW_W} ${KSA_VIEW_H}`}
      role="img"
      aria-label=""
      aria-hidden="true"
      className="h-auto w-full max-w-2xl"
    >
      <defs>
        <clipPath id="ksa-clip">
          <path d={KSA_SILHOUETTE_PATH} />
        </clipPath>
        <pattern
          id="ksa-grid"
          width={CELL}
          height={CELL}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${CELL} 0H0V${CELL}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="ksa-glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        width={KSA_VIEW_W}
        height={KSA_VIEW_H}
        fill="url(#ksa-glow)"
        clipPath="url(#ksa-clip)"
      />

      <g clipPath="url(#ksa-clip)">
        <rect width={KSA_VIEW_W} height={KSA_VIEW_H} fill="var(--bg-sunken)" />
        <rect
          width={KSA_VIEW_W}
          height={KSA_VIEW_H}
          fill="url(#ksa-grid)"
          opacity="0.7"
        />
        {HIGHLIGHTS.map((h, i) => (
          <rect
            key={i}
            x={h.x}
            y={h.y}
            width={CELL}
            height={CELL}
            fill={h.color}
            opacity="0.55"
            style={{
              animation: "hero-pulse 3.6s ease-in-out infinite",
              animationDelay: h.delay,
              transformOrigin: `${h.x + CELL / 2}px ${h.y + CELL / 2}px`,
            }}
          />
        ))}
      </g>

      <path
        d={KSA_SILHOUETTE_PATH}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        opacity="0.85"
      />

      <style>{`
        @keyframes hero-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.25); }
        }
      `}</style>
    </svg>
  );
}

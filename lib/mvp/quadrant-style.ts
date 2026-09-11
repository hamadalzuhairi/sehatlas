import type { QuadrantKey } from "./types";

export const QUADRANT_COLOR_VAR: Record<QuadrantKey, string> = {
  priority: "var(--quad-priority)",
  served: "var(--quad-served)",
  remote: "var(--quad-remote)",
  none: "var(--quad-none)",
};

export const QUADRANT_ORDER: QuadrantKey[] = ["priority", "served", "remote", "none"];

import type {
  CatchmentKey,
  ComputedRegion,
  CutMode,
  QuadrantKey,
  RegionRecord,
  VulnerabilityComponentKey,
} from "./types";

const COMPONENT_INDEX_KEY: Record<VulnerabilityComponentKey, keyof RegionRecord> = {
  socio: "socio_index",
  env: "env_index",
  disease: "disease_index",
};

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentile(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return percentile(sorted, 0.5);
}

/**
 * Classifies a value as "low" or "high" relative to the full distribution.
 * Tercile mode compares against the top/bottom third — the extreme group of
 * interest for each axis — rather than a plain top-half/bottom-half split.
 */
function classifyLevel(
  value: number,
  allValues: number[],
  axis: "access" | "vulnerability",
  cutMode: CutMode,
): "low" | "high" {
  if (cutMode === "median") {
    const m = median(allValues);
    return value >= m ? "high" : "low";
  }

  const sorted = [...allValues].sort((a, b) => a - b);
  if (axis === "vulnerability") {
    const highCut = percentile(sorted, 2 / 3);
    return value >= highCut ? "high" : "low";
  }
  const lowCut = percentile(sorted, 1 / 3);
  return value <= lowCut ? "low" : "high";
}

function quadrantFromLevels(
  accessLevel: "low" | "high",
  vulnerabilityLevel: "low" | "high",
): QuadrantKey {
  if (accessLevel === "low" && vulnerabilityLevel === "high") return "priority";
  if (accessLevel === "high" && vulnerabilityLevel === "high") return "served";
  if (accessLevel === "low" && vulnerabilityLevel === "low") return "remote";
  return "none";
}

const COMPONENT_LABELS: Record<VulnerabilityComponentKey, string> = {
  socio: "Socioeconomic",
  env: "Environmental",
  disease: "Chronic disease",
};

export function computeRegions(
  records: RegionRecord[],
  options: {
    catchment: CatchmentKey;
    enabledComponents: VulnerabilityComponentKey[];
    cutMode: CutMode;
    componentLabels?: Partial<Record<VulnerabilityComponentKey, string>>;
  },
): ComputedRegion[] {
  const { catchment, enabledComponents, cutMode, componentLabels } = options;
  const accessKey = catchment === "30" ? "access_30" : "access_60";
  const active = enabledComponents.length > 0 ? enabledComponents : (["socio", "env", "disease"] as VulnerabilityComponentKey[]);

  const withScores = records.map((record) => {
    const vulnerability = mean(active.map((key) => record[COMPONENT_INDEX_KEY[key]] as number));
    return {
      record,
      access: record[accessKey],
      vulnerability,
    };
  });

  const allAccess = withScores.map((r) => r.access);
  const allVulnerability = withScores.map((r) => r.vulnerability);

  return withScores.map(({ record, access, vulnerability }) => {
    const accessLevel = classifyLevel(access, allAccess, "access", cutMode);
    const vulnerabilityLevel = classifyLevel(vulnerability, allVulnerability, "vulnerability", cutMode);
    const quadrant = quadrantFromLevels(accessLevel, vulnerabilityLevel);

    const componentContributions = (Object.keys(COMPONENT_INDEX_KEY) as VulnerabilityComponentKey[]).map(
      (key) => ({
        key,
        label: componentLabels?.[key] ?? COMPONENT_LABELS[key],
        value: record[COMPONENT_INDEX_KEY[key]] as number,
      }),
    );

    return {
      ...record,
      access: Math.round(access * 10) / 10,
      vulnerability: Math.round(vulnerability * 10) / 10,
      quadrant,
      componentContributions,
    };
  });
}

export function getCutLines(
  records: RegionRecord[],
  options: { catchment: CatchmentKey; enabledComponents: VulnerabilityComponentKey[]; cutMode: CutMode },
): { accessCut: number; vulnerabilityCut: number } {
  const { catchment, enabledComponents, cutMode } = options;
  const accessKey = catchment === "30" ? "access_30" : "access_60";
  const active = enabledComponents.length > 0 ? enabledComponents : (["socio", "env", "disease"] as VulnerabilityComponentKey[]);

  const allAccess = records.map((r) => r[accessKey] as number);
  const allVulnerability = records.map((r) => mean(active.map((key) => r[COMPONENT_INDEX_KEY[key]] as number)));

  if (cutMode === "median") {
    return { accessCut: median(allAccess), vulnerabilityCut: median(allVulnerability) };
  }

  const sortedAccess = [...allAccess].sort((a, b) => a - b);
  const sortedVulnerability = [...allVulnerability].sort((a, b) => a - b);
  return {
    accessCut: percentile(sortedAccess, 1 / 3),
    vulnerabilityCut: percentile(sortedVulnerability, 2 / 3),
  };
}

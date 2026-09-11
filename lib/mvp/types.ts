export type RegionRecord = {
  region_id: string;
  name_en: string;
  name_ar: string;
  access_30: number;
  access_60: number;
  socio_index: number;
  env_index: number;
  disease_index: number;
  coverage_ratio: number;
};

export type VulnerabilityComponentKey = "socio" | "env" | "disease";

export type CatchmentKey = "30" | "60";

export type CutMode = "tercile" | "median";

export type QuadrantKey = "priority" | "served" | "remote" | "none";

export type ChoroplethMode = "access" | "vulnerability" | "quadrant";

export type ComputedRegion = RegionRecord & {
  access: number;
  vulnerability: number;
  quadrant: QuadrantKey;
  componentContributions: { key: VulnerabilityComponentKey; label: string; value: number }[];
};

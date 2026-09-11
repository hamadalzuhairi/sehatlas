"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { computeRegions, getCutLines } from "@/lib/mvp/compute";
import type {
  CatchmentKey,
  ChoroplethMode,
  CutMode,
  RegionRecord,
  VulnerabilityComponentKey,
} from "@/lib/mvp/types";
import { MvpMap } from "./mvp-map";
import { MvpScatter } from "./mvp-scatter";
import { MvpDetailsPanel } from "./mvp-details-panel";
import { MvpRankedTable } from "./mvp-ranked-table";
import { MvpPipelineStatus } from "./mvp-pipeline-status";
import { SegmentedControl } from "./segmented-control";
import { ComponentToggles } from "./component-toggles";
import type { FeatureStatus } from "@/components/status-badge";

export function MvpApp() {
  const t = useTranslations("mvp");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [records, setRecords] = useState<RegionRecord[] | null>(null);
  const [mode, setMode] = useState<ChoroplethMode>("quadrant");
  const [catchment, setCatchment] = useState<CatchmentKey>("30");
  const [cutMode, setCutMode] = useState<CutMode>("tercile");
  const [enabledComponents, setEnabledComponents] = useState<VulnerabilityComponentKey[]>([
    "socio",
    "env",
    "disease",
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/demo_regions.json")
      .then((res) => res.json())
      .then((data: RegionRecord[]) => {
        setRecords(data);
      })
      .catch(() => setRecords([]));
  }, []);

  const componentLabels = {
    socio: t("map.components.socio"),
    env: t("map.components.env"),
    disease: t("map.components.disease"),
  };

  const computed = useMemo(() => {
    if (!records) return [];
    return computeRegions(records, { catchment, enabledComponents, cutMode, componentLabels });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, catchment, enabledComponents, cutMode, locale]);

  const cutLines = useMemo(() => {
    if (!records) return { accessCut: 50, vulnerabilityCut: 50 };
    return getCutLines(records, { catchment, enabledComponents, cutMode });
  }, [records, catchment, enabledComponents, cutMode]);

  const selectedRegion = computed.find((r) => r.region_id === selectedId) ?? null;

  const quadrantLabels = {
    priority: t("scatter.quadrantLabels.priority"),
    served: t("scatter.quadrantLabels.served"),
    remote: t("scatter.quadrantLabels.remote"),
    none: t("scatter.quadrantLabels.none"),
  };

  if (!records) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-fg-muted">
        …
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-fg">{t("map.heading")}</h2>
        </div>
        <div className="mb-4 flex flex-wrap gap-6">
          <SegmentedControl
            label={t("map.modeLabel")}
            value={mode}
            onChange={setMode}
            options={[
              { value: "access", label: t("map.modes.access") },
              { value: "vulnerability", label: t("map.modes.vulnerability") },
              { value: "quadrant", label: t("map.modes.quadrant") },
            ]}
          />
          <SegmentedControl
            label={t("map.catchmentLabel")}
            value={catchment}
            onChange={setCatchment}
            options={[
              { value: "30", label: t("map.catchment30") },
              { value: "60", label: t("map.catchment60") },
            ]}
          />
        </div>
        <ComponentToggles
          label={t("map.componentsLabel")}
          hint={t("map.componentsHint")}
          enabled={enabledComponents}
          onChange={setEnabledComponents}
          optionLabels={componentLabels}
        />

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-fg-muted">{t("map.hoverHint")}</p>
            <MvpMap
              regions={computed}
              mode={mode}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={setSelectedId}
              locale={locale}
              labels={{
                quadrant: quadrantLabels,
                accessLabel: t("details.accessLabel"),
                vulnerabilityLabel: t("details.vulnerabilityLabel"),
                quadrantLabel: t("details.quadrantLabel"),
              }}
            />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-fg">{t("scatter.heading")}</h3>
              <SegmentedControl
                label={t("scatter.cutLabel")}
                value={cutMode}
                onChange={setCutMode}
                options={[
                  { value: "tercile", label: t("scatter.cutTercile") },
                  { value: "median", label: t("scatter.cutMedian") },
                ]}
              />
            </div>
            <MvpScatter
              regions={computed}
              cutLines={cutLines}
              selectedId={selectedId}
              onSelect={setSelectedId}
              locale={locale}
              labels={{
                xAxis: t("scatter.xAxis"),
                yAxis: t("scatter.yAxis"),
                accessLabel: t("details.accessLabel"),
                vulnerabilityLabel: t("details.vulnerabilityLabel"),
                quadrant: quadrantLabels,
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-xl font-bold text-fg">{t("table.heading")}</h2>
          <MvpRankedTable
            regions={computed}
            locale={locale}
            selectedId={selectedId}
            onSelect={setSelectedId}
            quadrantLabels={quadrantLabels}
            exportLabel={t("table.exportCsv")}
            columns={{
              rank: t("table.columns.rank"),
              region: t("table.columns.region"),
              access30: t("table.columns.access30"),
              access60: t("table.columns.access60"),
              vulnerability: t("table.columns.vulnerability"),
              quadrant: t("table.columns.quadrant"),
              coverage: t("table.columns.coverage"),
            }}
          />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-bold text-fg">{t("details.heading")}</h2>
          <MvpDetailsPanel
            region={selectedRegion}
            locale={locale}
            labels={{
              heading: t("details.heading"),
              empty: t("details.empty"),
              quadrantLabel: t("details.quadrantLabel"),
              accessLabel: t("details.accessLabel"),
              vulnerabilityLabel: t("details.vulnerabilityLabel"),
              componentsHeading: t("details.componentsHeading"),
              coverageLabel: t("details.coverageLabel"),
              coverageHint: t("details.coverageHint"),
              plannerHeading: t("details.plannerHeading"),
              plannerText: selectedRegion
                ? t(`details.plannerTemplates.${selectedRegion.quadrant}`, {
                    region: locale === "ar" ? selectedRegion.name_ar : selectedRegion.name_en,
                  })
                : "",
              quadrantNames: quadrantLabels,
            }}
          />
        </div>
      </section>

      <section>
        <MvpPipelineStatus
          heading={t("pipeline.heading")}
          toggleLabel={t("pipeline.toggle")}
          moduleLabels={{
            ingestion: t("pipeline.modules.ingestion"),
            facilityValidation: t("pipeline.modules.facilityValidation"),
            accessEngine: t("pipeline.modules.accessEngine"),
            vulnerabilityEngine: t("pipeline.modules.vulnerabilityEngine"),
            environmentalLayer: t("pipeline.modules.environmentalLayer"),
            diseaseLayer: t("pipeline.modules.diseaseLayer"),
            quadrantClassifier: t("pipeline.modules.quadrantClassifier"),
            validation: t("pipeline.modules.validation"),
            visualisation: t("pipeline.modules.visualisation"),
          }}
          statusLabels={{
            live: tCommon("status.live"),
            "in-development": tCommon("status.in-development"),
            planned: tCommon("status.planned"),
            "permission-dependent": tCommon("status.permission-dependent"),
          } as Record<FeatureStatus, string>}
        />
      </section>
    </div>
  );
}

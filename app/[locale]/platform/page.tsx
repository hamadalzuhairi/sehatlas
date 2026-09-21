import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";

type Component = { title: string; body: string };
type ValidationItem = { title: string; body: string };
type DataRow = { source: string; provides: string; resolution: string; licence: string };


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "platform" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/platform`,
      languages: { en: "/en/platform", ar: "/ar/platform" },
    },
    openGraph: { title, description, url: `/${locale}/platform` },
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("platform");
  const tCommon = await getTranslations("common");

  const components = t.raw("axes.vulnerability.components") as Component[];
  const inputs = t.raw("axes.access.inputs") as string[];
  const validationItems = t.raw("validation.items") as ValidationItem[];
  const dataRows = t.raw("dataSources.rows") as DataRow[];
  const limitations = t.raw("limitations.items") as string[];
  const safety = t.raw("tiers.tier2.safety") as string[];
  const quadrantKeys = ["priority", "served", "remote", "none"] as const;

  return (
    <div className="page-shell py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="measure mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      {/* Axes */}
      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("axes.heading")}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="surface p-6">
            <h3 className="text-lg font-semibold text-accent">{t("axes.access.title")}</h3>
            <p className="mt-2 text-sm text-fg-muted">{t("axes.access.body")}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("axes.access.inputsLabel")}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-fg-muted">
              {inputs.map((item) => (
                <li key={item} className="ps-3 relative">
                  <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-fg-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6">
            <h3 className="text-lg font-semibold text-accent">{t("axes.vulnerability.title")}</h3>
            <p className="mt-2 text-sm text-fg-muted">{t("axes.vulnerability.body")}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("axes.vulnerability.componentsLabel")}
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {components.map((c) => (
                <li key={c.title}>
                  <span className="font-semibold text-fg">{c.title}: </span>
                  <span className="text-fg-muted">{c.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Quadrant */}
      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("quadrant.heading")}</h2>
        <p className="measure text-fg-muted">{t("quadrant.body")}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {quadrantKeys.map((key) => (
            <div key={key} className="surface p-4">
              <h3 className="font-semibold text-fg">{t(`quadrant.cells.${key}.title`)}</h3>
              <p className="text-xs text-fg-muted">{t(`quadrant.cells.${key}.subtitle`)}</p>
              <p className="mt-2 text-sm text-fg-muted">{t(`quadrant.cells.${key}.body`)}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="doc-section mt-14">
        <h2 className="text-xl font-bold text-fg">{t("whyTwoAxes.heading")}</h2>
        <p className="measure text-fg-muted">{t("whyTwoAxes.body")}</p>
      </Reveal>

      <Reveal className="doc-section mt-14">
        <h2 className="text-xl font-bold text-fg">{t("validation.heading")}</h2>
        <p className="measure text-fg-muted">{t("validation.body")}</p>
        <ol className="mt-4 space-y-3">
          {validationItems.map((item, i) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-fg">{item.title}</p>
                <p className="text-sm text-fg-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Tiers */}
      <Reveal className="doc-section mt-14">
        <h2 className="text-xl font-bold text-fg">{t("tiers.heading")}</h2>
        <div className="surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-fg">{t("tiers.tier1.title")}</h3>
            <StatusBadge status="in-development" label={tCommon("status.in-development")} />
          </div>
          <p className="mt-2 text-sm text-fg-muted">{t("tiers.tier1.body")}</p>
        </div>
        <div className="mt-4 surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-fg">{t("tiers.tier2.title")}</h3>
            <StatusBadge status="permission-dependent" label={tCommon("status.permission-dependent")} />
          </div>
          <p className="mt-2 text-sm text-fg-muted">{t("tiers.tier2.body")}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-quad-priority">
            {t("tiers.tier2.safetyHeading")}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-fg-muted">
            {safety.map((item) => (
              <li key={item} className="ps-3 relative">
                <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-quad-priority" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Data sources */}
      <Reveal className="mt-14">
        <h2 className="text-xl font-bold text-fg">{t("dataSources.heading")}</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-fg-muted">
                <th className="px-4 py-3 text-start font-semibold">{t("dataSources.columns.source")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("dataSources.columns.provides")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("dataSources.columns.resolution")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("dataSources.columns.licence")}</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row) => (
                <tr key={row.source} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-fg">{row.source}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.provides}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.resolution}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.licence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Limitations */}
      <Reveal className="mt-14 rounded-2xl border border-quad-served/40 bg-quad-served/10 p-6">
        <h2 className="text-xl font-bold text-fg">{t("limitations.heading")}</h2>
        <ul className="mt-3 space-y-2 text-sm text-fg-muted">
          {limitations.map((item) => (
            <li key={item} className="ps-3 relative">
              <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-quad-served" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

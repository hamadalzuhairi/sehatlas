import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { proseFill } from "@/lib/prose";
import { StatusBadge, type FeatureStatus } from "@/components/status-badge";
import currentSprint from "@/content/roadmap.json";

type Phase = {
  id: string;
  title: string;
  status: FeatureStatus;
  summary: string;
  deliverables: string[];
  dependencies: string[];
};


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "roadmap" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/roadmap`,
      languages: { en: "/en/roadmap", ar: "/ar/roadmap" },
    },
    openGraph: { title, description, url: `/${locale}/roadmap` },
  };
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roadmap");
  const tCommon = await getTranslations("common");
  const phases = t.raw("phases") as Phase[];
  const sprintNote =
    currentSprint.currentSprint[locale as "en" | "ar"] ?? currentSprint.currentSprint.en;

  return (
    <div className="page-shell py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="measure mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <Reveal className="measure mt-10 rounded-xl border border-accent/40 bg-accent-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {t("currentSprintHeading")}
        </p>
        <p className="mt-1 text-sm text-fg">{sprintNote}</p>
      </Reveal>

      <div className="mt-12 space-y-10 border-s-2 border-border ps-6">
        {phases.map((phase) => (
          <Reveal key={phase.id} className="relative">
            <span className="absolute -start-[1.95rem] top-1 h-3 w-3 rounded-full bg-accent" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-fg">{phase.title}</h2>
              <StatusBadge status={phase.status} label={tCommon(`status.${phase.status}`)} />
            </div>
            <p className={`${proseFill(phase.summary)} mt-2 text-fg-muted`}>{phase.summary}</p>

            <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  {t("deliverablesLabel")}
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-fg-muted">
                  {phase.deliverables.map((d) => (
                    <li key={d} className="ps-3 relative">
                      <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-fg-muted" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {phase.dependencies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-quad-served">
                    {t("dependenciesLabel")}
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm text-fg-muted">
                    {phase.dependencies.map((d) => (
                      <li key={d} className="ps-3 relative">
                        <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-quad-served" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

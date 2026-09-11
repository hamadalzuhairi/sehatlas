import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { HeroVisual } from "@/components/hero-visual";
import { DataSourceStrip } from "@/components/data-source-strip";
import { StatusBadge, type FeatureStatus } from "@/components/status-badge";
import { KEY_FIGURES } from "@/lib/site-config";

type ValueCard = { title: string; body: string };
type TierCard = { title: string; phase: string; status: FeatureStatus; body: string };
type JourneyStep = { title: string; body: string };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const valueCards = t.raw("values.cards") as ValueCard[];
  const tierCards = t.raw("tiers.cards") as TierCard[];
  const journeySteps = t.raw("journey.steps") as JourneyStep[];
  const builtItems = t.raw("status.built.items") as string[];
  const runningItems = t.raw("status.running.items") as string[];
  const pendingItems = t.raw("status.pending.items") as string[];

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-fg sm:text-5xl">
              {t("hero.headline")}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-fg-muted">
              {t("hero.subhead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/mvp"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                href="/platform"
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 2. Built on open data */}
      <section>
        <div className="mx-auto max-w-7xl px-4 pt-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            {t("dataStrip.eyebrow")}
          </p>
        </div>
        <DataSourceStrip />
        <p className="mx-auto mt-4 max-w-7xl px-4 text-center text-xs text-fg-muted sm:px-6 lg:px-8">
          {t("dataStrip.caption")}
        </p>
      </section>

      {/* 3. What sets this apart */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-fg">{t("values.heading")}</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">{t("values.subheading")}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-bg-raised p-6">
                <div
                  aria-hidden
                  className="mb-4 h-10 w-10 rounded-lg"
                  style={{
                    background: [
                      "var(--quad-priority)",
                      "var(--quad-served)",
                      "var(--quad-remote)",
                      "var(--quad-none)",
                    ][i % 4],
                    opacity: 0.85,
                  }}
                />
                <h3 className="text-lg font-semibold text-fg">{card.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. By the numbers */}
      <section className="border-y border-border bg-bg-sunken">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-fg">{t("byNumbers.heading")}</h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{t("byNumbers.subheading")}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { value: KEY_FIGURES.regions, label: t("byNumbers.regions") },
              { value: KEY_FIGURES.hospitals, label: t("byNumbers.hospitals") },
              { value: KEY_FIGURES.phcCentres, label: t("byNumbers.phc") },
              { value: KEY_FIGURES.populationMillions, label: t("byNumbers.population"), decimals: 1 },
              { value: KEY_FIGURES.axes, label: t("byNumbers.axes") },
              { value: KEY_FIGURES.quadrants, label: t("byNumbers.quadrants") },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-extrabold text-accent sm:text-4xl">
                  <Counter value={item.value} decimals={item.decimals ?? 0} />
                </div>
                <p className="mt-1 text-xs text-fg-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The platform tiers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-fg">{t("tiers.heading")}</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">{t("tiers.subheading")}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tierCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <Link
                href="/platform"
                className="flex h-full flex-col rounded-2xl border border-border bg-bg-raised p-6 transition-colors hover:border-accent"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    {card.phase}
                  </span>
                  <StatusBadge status={card.status} label={tCommon(`status.${card.status}`)} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-fg">{card.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{card.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/platform" className="text-sm font-semibold text-accent hover:underline">
            {t("tiers.cta")} →
          </Link>
        </div>
      </section>

      {/* 6. The journey */}
      <section className="border-y border-border bg-bg-sunken">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-fg">{t("journey.heading")}</h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{t("journey.subheading")}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {journeySteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-bg-raised p-6">
                  <span className="text-xs font-bold text-accent">{`0${i + 1}`}</span>
                  <h3 className="mt-2 text-lg font-semibold text-fg">{step.title}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Where we are */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-fg">{t("status.heading")}</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">{t("status.subheading")}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: t("status.built.label"), items: builtItems, color: "var(--quad-none)" },
            { label: t("status.running.label"), items: runningItems, color: "var(--quad-served)" },
            { label: t("status.pending.label"), items: pendingItems, color: "var(--quad-remote)" },
          ].map((group) => (
            <Reveal key={group.label}>
              <div className="h-full rounded-2xl border border-border bg-bg-raised p-6">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: group.color }}
                  />
                  <h3 className="text-sm font-bold uppercase tracking-wide text-fg">
                    {group.label}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-fg-muted">
                  {group.items.map((item) => (
                    <li key={item} className="ps-4 relative">
                      <span className="absolute start-0 top-2 h-1 w-1 rounded-full bg-fg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Positioning */}
      <section className="border-y border-border">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-fg-muted">{t("positioning.body")}</p>
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {t("closingCta.heading")}
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
          >
            {t("closingCta.cta")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

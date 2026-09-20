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
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden className="accent-bloom pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.07] text-fg sm:text-5xl lg:text-[3.5rem]">
              {t("hero.headline")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              {t("hero.subhead")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/mvp"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-[var(--elev-2)] transition-all duration-200 hover:bg-accent-strong hover:shadow-[var(--elev-3)]"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                href="/platform"
                className="rounded-full border border-border bg-bg-raised/60 px-6 py-3 text-sm font-semibold text-fg backdrop-blur transition-colors hover:border-border-strong hover:bg-bg-raised"
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
          <p className="eyebrow">{t("dataStrip.eyebrow")}</p>
        </div>
        <DataSourceStrip />
        <p className="mx-auto mt-4 max-w-7xl px-4 text-center text-xs text-fg-muted sm:px-6 lg:px-8">
          {t("dataStrip.caption")}
        </p>
      </section>

      {/* 3. What sets this apart */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-fg sm:text-[2rem]">{t("values.heading")}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{t("values.subheading")}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <div className="surface surface-interactive h-full p-6">
                <div
                  aria-hidden
                  className="mb-5 h-9 w-9 rounded-[0.6rem]"
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
            <h2 className="text-3xl font-bold text-fg sm:text-[2rem]">{t("byNumbers.heading")}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{t("byNumbers.subheading")}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { value: KEY_FIGURES.regions, label: t("byNumbers.regions") },
              { value: KEY_FIGURES.hospitals, label: t("byNumbers.hospitals") },
              { value: KEY_FIGURES.phcCentres, label: t("byNumbers.phc") },
              { value: KEY_FIGURES.populationMillions, label: t("byNumbers.population"), decimals: 1 },
              { value: KEY_FIGURES.axes, label: t("byNumbers.axes") },
              { value: KEY_FIGURES.quadrants, label: t("byNumbers.quadrants") },
            ].map((item) => (
              <div key={item.label}>
                <div className="tnum text-3xl font-extrabold text-accent sm:text-4xl">
                  <Counter value={item.value} decimals={item.decimals ?? 0} />
                </div>
                <p className="mt-1.5 text-xs leading-snug text-fg-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The platform tiers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-fg sm:text-[2rem]">{t("tiers.heading")}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{t("tiers.subheading")}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tierCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <Link
                href="/platform"
                className="surface surface-interactive flex h-full flex-col p-6"
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
            {t("tiers.cta")}{" "}
            <span aria-hidden className="flip-rtl inline-block">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* 6. The journey */}
      <section className="border-y border-border bg-bg-sunken">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold text-fg sm:text-[2rem]">{t("journey.heading")}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{t("journey.subheading")}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {journeySteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="surface h-full p-6">
                  <span className="tnum block text-2xl font-extrabold text-accent/40">{`0${i + 1}`}</span>
                  <h3 className="mt-3 text-lg font-semibold text-fg">{step.title}</h3>
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
          <h2 className="text-3xl font-bold text-fg sm:text-[2rem]">{t("status.heading")}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{t("status.subheading")}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: t("status.built.label"), items: builtItems, color: "var(--quad-none)" },
            { label: t("status.running.label"), items: runningItems, color: "var(--quad-served)" },
            { label: t("status.pending.label"), items: pendingItems, color: "var(--quad-remote)" },
          ].map((group) => (
            <Reveal key={group.label}>
              <div className="surface h-full p-6">
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
      <section className="border-y border-border bg-bg-sunken">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-base leading-relaxed text-fg-muted">
            {t("positioning.body")}
          </p>
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="relative isolate overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="accent-bloom pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[360px] rotate-180"
        />
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-fg sm:text-4xl">
            {t("closingCta.heading")}
          </h2>
          <Link
            href="/contact"
            className="mt-9 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-[var(--elev-2)] transition-all duration-200 hover:bg-accent-strong hover:shadow-[var(--elev-3)]"
          >
            {t("closingCta.cta")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

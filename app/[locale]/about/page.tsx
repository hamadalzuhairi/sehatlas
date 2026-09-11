import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { FOUNDER_INSTITUTION } from "@/lib/site-config";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const paragraphs = t.raw("problem.paragraphs") as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <Reveal className="mt-14">
        <h2 className="text-xl font-bold text-fg">{t("mission.heading")}</h2>
        <p className="mt-3 text-fg-muted">{t("mission.body")}</p>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-xl font-bold text-fg">{t("problem.heading")}</h2>
        <div className="mt-3 space-y-4 text-fg-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14 rounded-2xl border border-border bg-bg-raised p-6">
        <h2 className="text-xl font-bold text-fg">{t("founder.heading")}</h2>
        <p className="mt-3 text-lg font-semibold text-fg">{t("founder.name")}</p>
        <p className="text-sm text-fg-muted">{t("founder.role")}</p>
        <p className="mt-3 rounded-lg border border-dashed border-border bg-bg-sunken p-3 text-sm italic text-fg-muted">
          {t("founder.bioPlaceholder")}
        </p>
      </Reveal>

      <Reveal className="mt-14 border-t border-border pt-10">
        <h2 className="text-xl font-bold text-fg">{t("institutional.heading")}</h2>
        <p className="mt-3 text-fg-muted">{t("institutional.body")}</p>
        <p className="mt-2 text-xs text-fg-muted">{FOUNDER_INSTITUTION}</p>
      </Reveal>
    </div>
  );
}

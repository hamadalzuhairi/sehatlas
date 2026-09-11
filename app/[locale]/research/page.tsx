import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";

type Section = { title: string; body: string };

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("research");
  const sections = t.raw("sections") as Section[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <Reveal key={s.title}>
            <h2 className="text-lg font-bold text-fg">{s.title}</h2>
            <p className="mt-2 text-fg-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 rounded-2xl border border-dashed border-border bg-bg-raised p-6">
        <h2 className="text-lg font-bold text-fg">{t("publications.heading")}</h2>
        <p className="mt-2 text-sm italic text-fg-muted">{t("publications.placeholder")}</p>
      </Reveal>
    </div>
  );
}

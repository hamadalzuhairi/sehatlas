import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { proseFill } from "@/lib/prose";

type Section = { title: string; body: string };


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/research`,
      languages: { en: "/en/research", ar: "/ar/research" },
    },
    openGraph: { title, description, url: `/${locale}/research` },
  };
}

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
    <div className="page-shell py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="measure mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <div className="mt-12 space-y-12">
        {sections.map((s) => (
          <Reveal key={s.title} className="doc-section">
            <h2 className="text-lg font-bold text-fg">{s.title}</h2>
            <p className={`${proseFill(s.body)} text-fg-muted`}>{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="doc-section mt-14">
        <h2 className="text-lg font-bold text-fg">{t("publications.heading")}</h2>
        <div className="rounded-2xl border border-dashed border-border bg-bg-raised p-6">
          <p className="text-sm italic text-fg-muted">{t("publications.placeholder")}</p>
        </div>
      </Reveal>
    </div>
  );
}

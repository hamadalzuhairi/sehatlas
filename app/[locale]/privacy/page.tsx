import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const title = t("hero.title");
  const description = t("hero.title");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: "/en/privacy", ar: "/ar/privacy" },
    },
    openGraph: { title, description, url: `/${locale}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <div className="page-shell py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>

      <div className="measure mt-10 rounded-2xl border border-dashed border-border bg-bg-raised p-6">
        <h2 className="text-lg font-bold text-fg">{t("placeholder.heading")}</h2>
        <p className="mt-2 text-sm text-fg-muted">{t("placeholder.body")}</p>
      </div>

      <div className="doc-section mt-12">
        <h2 className="text-lg font-bold text-fg">{t("placeholder.contactFormHeading")}</h2>
        <p className="prose-fill text-sm text-fg-muted">{t("placeholder.contactFormBody")}</p>
      </div>
    </div>
  );
}

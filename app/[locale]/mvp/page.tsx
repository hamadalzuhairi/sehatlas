import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoBanner } from "@/components/mvp/demo-banner";
import { MvpApp } from "@/components/mvp/mvp-app";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mvp" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/mvp`,
      languages: { en: "/en/mvp", ar: "/ar/mvp" },
    },
    openGraph: { title, description, url: `/${locale}/mvp` },
  };
}

export default async function MvpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mvp");

  return (
    <>
      <DemoBanner text={t("banner")} />
      <section className="page-shell py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">{t("hero.subtitle")}</p>
      </section>
      <section className="page-shell pb-20">
        <MvpApp />
      </section>
    </>
  );
}

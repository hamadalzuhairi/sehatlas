import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoBanner } from "@/components/mvp/demo-banner";
import { MvpApp } from "@/components/mvp/mvp-app";

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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">{t("hero.subtitle")}</p>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <MvpApp />
      </section>
    </>
  );
}

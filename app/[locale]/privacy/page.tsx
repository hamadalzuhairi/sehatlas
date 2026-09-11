import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-bg-raised p-6">
        <h2 className="text-lg font-bold text-fg">{t("placeholder.heading")}</h2>
        <p className="mt-2 text-sm text-fg-muted">{t("placeholder.body")}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-fg">{t("placeholder.contactFormHeading")}</h2>
        <p className="mt-2 text-sm text-fg-muted">{t("placeholder.contactFormBody")}</p>
      </div>
    </div>
  );
}

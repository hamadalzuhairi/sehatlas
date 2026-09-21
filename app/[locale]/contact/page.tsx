import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", ar: "/ar/contact" },
    },
    openGraph: { title, description, url: `/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="page-shell grid gap-10 py-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="measure mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <div className="w-full max-w-2xl lg:mt-0">
        <ContactForm
          labels={{
            name: t("form.name"),
            organisation: t("form.organisation"),
            email: t("form.email"),
            enquiryType: t("form.enquiryType"),
            enquiryOptions: {
              general: t("form.enquiryOptions.general"),
              research: t("form.enquiryOptions.research"),
              partnership: t("form.enquiryOptions.partnership"),
              press: t("form.enquiryOptions.press"),
            },
            message: t("form.message"),
            submit: t("form.submit"),
            submitting: t("form.submitting"),
            successTitle: t("form.successTitle"),
            successBody: t("form.successBody"),
            errorBody: t("form.errorBody"),
            emailFallback: t("form.emailFallback"),
          }}
        />
      </div>
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t("hero.eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t("hero.title")}</h1>
      <p className="mt-4 text-lg text-fg-muted">{t("hero.subtitle")}</p>

      <div className="mt-10">
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

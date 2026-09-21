import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "./logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("meta");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-bg-sunken">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="page-shell py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo
              size={30}
              name={tMeta("siteName")}
              textClassName="text-base font-bold tracking-tight text-fg"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5">
            <div>
              <h3 className="col-heading">
                {t("overview.title")}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/about" className="text-fg-muted transition-colors hover:text-accent">{t("overview.about")}</Link></li>
                <li><Link href="/platform" className="text-fg-muted transition-colors hover:text-accent">{t("overview.platform")}</Link></li>
                <li><Link href="/mvp" className="text-fg-muted transition-colors hover:text-accent">{t("overview.mvp")}</Link></li>
                <li><Link href="/roadmap" className="text-fg-muted transition-colors hover:text-accent">{t("overview.roadmap")}</Link></li>
                <li><Link href="/research" className="text-fg-muted transition-colors hover:text-accent">{t("overview.research")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="col-heading">
                {t("reach.title")}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/contact" className="text-fg-muted transition-colors hover:text-accent">{t("reach.general")}</Link></li>
                <li><Link href="/contact" className="text-fg-muted transition-colors hover:text-accent">{t("reach.research")}</Link></li>
                <li><Link href="/contact" className="text-fg-muted transition-colors hover:text-accent">{t("reach.partnership")}</Link></li>
                <li><Link href="/contact" className="text-fg-muted transition-colors hover:text-accent">{t("reach.press")}</Link></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="col-heading">
              {t("newsletter.title")}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {t("newsletter.description")}
            </p>
            <NewsletterForm
              placeholder={t("newsletter.placeholder")}
              cta={t("newsletter.cta")}
              successText={t("newsletter.success")}
              errorText={t("newsletter.error")}
              invalidText={t("newsletter.invalid")}
            />
          </div>
        </div>

        <hr className="rule-fade mt-14" />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-fg-muted">
            {t("studentProject")}
          </p>
          <p className="shrink-0 text-xs text-fg-muted">
            © {year} {tMeta("siteName")}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site-config";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-sunken">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("overview.title")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-fg-muted hover:text-accent">{t("overview.about")}</Link></li>
              <li><Link href="/platform" className="text-fg-muted hover:text-accent">{t("overview.platform")}</Link></li>
              <li><Link href="/mvp" className="text-fg-muted hover:text-accent">{t("overview.mvp")}</Link></li>
              <li><Link href="/roadmap" className="text-fg-muted hover:text-accent">{t("overview.roadmap")}</Link></li>
              <li><Link href="/research" className="text-fg-muted hover:text-accent">{t("overview.research")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("reach.title")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/contact" className="text-fg-muted hover:text-accent">{t("reach.general")}</Link></li>
              <li><Link href="/contact" className="text-fg-muted hover:text-accent">{t("reach.research")}</Link></li>
              <li><Link href="/contact" className="text-fg-muted hover:text-accent">{t("reach.partnership")}</Link></li>
              <li><Link href="/contact" className="text-fg-muted hover:text-accent">{t("reach.press")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("legal.title")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-fg-muted hover:text-accent">{t("legal.privacy")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {t("newsletter.title")}
            </h3>
            <p className="mt-4 text-sm text-fg-muted">{t("newsletter.description")}</p>
            <NewsletterForm placeholder={t("newsletter.placeholder")} cta={t("newsletter.cta")} />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-fg">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded bg-accent text-xs font-black text-accent-fg"
            >
              {SITE_NAME.slice(0, 1)}
            </span>
            {SITE_NAME}
          </div>
          <p className="max-w-xl text-xs text-fg-muted">{t("studentProject")}</p>
        </div>
        <p className="mt-4 text-xs text-fg-muted">
          © {year} {SITE_NAME}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

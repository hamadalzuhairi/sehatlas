"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ROUTES = [
  { href: "/about", key: "about" },
  { href: "/platform", key: "platform" },
  { href: "/mvp", key: "mvp" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/research", key: "research" },
  { href: "/contact", key: "contact" },
] as const;

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const tNav = useTranslations("nav");

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-3 text-4xl font-extrabold text-fg sm:text-5xl">{t("title")}</h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-muted">{t("body")}</p>

      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="surface surface-interactive block px-4 py-3 text-sm font-medium text-fg"
            >
              {tNav(route.key)}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--elev-1)] transition-all hover:bg-accent-strong hover:shadow-[var(--elev-2)]"
      >
        {t("home")}
      </Link>
    </div>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { SITE_NAME } from "@/lib/site-config";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/platform", key: "platform" },
  { href: "/mvp", key: "mvp" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/research", key: "research" },
] as const;

export function SiteNav() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-fg"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-accent-fg"
          >
            {SITE_NAME.slice(0, 1)}
          </span>
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {ROUTES.map((route) => {
            const active =
              pathname === route.href ||
              (route.href !== "/" && pathname.startsWith(route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-accent",
                  active ? "text-accent" : "text-fg-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                {t(route.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle labelLight={tTheme("light")} labelDark={tTheme("dark")} />
          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
          >
            {t("languageToggle")}
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
          >
            {t("getInTouch")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-fg lg:hidden"
          aria-expanded={open}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            {open ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-fg-muted hover:bg-bg-sunken hover:text-fg"
              >
                {t(route.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
            <ThemeToggle labelLight={tTheme("light")} labelDark={tTheme("dark")} />
            <Link
              href={pathname}
              locale={otherLocale}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted"
            >
              {t("languageToggle")}
            </Link>
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-fg"
          >
            {t("getInTouch")}
          </Link>
        </div>
      )}
    </header>
  );
}

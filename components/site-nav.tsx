"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

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
  const tMeta = useTranslations("meta");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const otherLocale = locale === "en" ? "ar" : "en";

  // The header sits flush with the hero until the page moves, then earns its
  // border and shadow. Keeps the top of the page feeling uninterrupted.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        "border-b bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/65",
        scrolled || open
          ? "border-border shadow-[0_1px_0_0_var(--sheen),var(--elev-1)]"
          : "border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg"
          onClick={() => setOpen(false)}
        >
          <Logo
            size={30}
            name={tMeta("siteName")}
            className="transition-transform duration-300 group-hover:scale-105"
            textClassName="text-[1.0625rem] font-bold tracking-tight text-fg"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {ROUTES.map((route) => {
            const active =
              pathname === route.href ||
              (route.href !== "/" && pathname.startsWith(route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={clsx(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                )}
                aria-current={active ? "page" : undefined}
              >
                {t(route.key)}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle labelLight={tTheme("light")} labelDark={tTheme("dark")} />
          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-bg-sunken hover:text-fg"
          >
            {t("languageToggle")}
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-[var(--elev-1)] transition-all duration-200 hover:bg-accent-strong hover:shadow-[var(--elev-2)]"
          >
            {t("getInTouch")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-fg transition-colors hover:bg-bg-sunken lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
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
        <div
          id="mobile-nav"
          className="border-t border-border bg-bg/95 px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-0.5" aria-label="Primary mobile">
            {ROUTES.map((route) => {
              const active =
                pathname === route.href ||
                (route.href !== "/" && pathname.startsWith(route.href));
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-soft text-fg"
                      : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                  )}
                >
                  {t(route.key)}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
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
            className="mt-3 block rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-fg"
          >
            {t("getInTouch")}
          </Link>
        </div>
      )}
    </header>
  );
}

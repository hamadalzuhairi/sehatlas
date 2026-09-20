import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site-config";
import "../globals.css";

const fontLatin = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-body-ar",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    applicationName: t("siteName"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontLatin.variable} ${fontArabic.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={
          locale === "ar"
            ? "font-arabic min-h-full flex flex-col bg-bg text-fg antialiased"
            : "font-sans min-h-full flex flex-col bg-bg text-fg antialiased"
        }
      >
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
          >
            {tCommon("skipToContent")}
          </a>
          <SiteNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

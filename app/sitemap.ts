import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

const ROUTES = ["", "/about", "/platform", "/mvp", "/roadmap", "/research", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : route === "/mvp" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${route}`]),
        ),
      },
    })),
  );
}

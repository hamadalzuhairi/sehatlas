import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Metadata routes (opengraph-image, apple-icon, …) live at the app root and
  // must not be redirected into a locale prefix, or link previews 404.
  matcher: [
    "/((?!api|_next|_vercel|opengraph-image|twitter-image|apple-icon|icon|sitemap|robots|manifest|.*\\..*).*)",
  ],
};

import { notFound } from "next/navigation";

/**
 * Unmatched paths under a locale would otherwise fall through to the bare
 * root not-found. This hands them to the locale not-found instead, so a 404
 * keeps the site chrome and the reader's language.
 */
export default function CatchAllPage() {
  notFound();
}

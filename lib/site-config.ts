/**
 * Working name for the venture. Swap this single constant to rename the
 * platform everywhere on the site (nav, footer, metadata, copy tokens).
 */
export const SITE_NAME = "Sehatlas";

export const FOUNDER_NAME = "Hamad";
export const FOUNDER_INSTITUTION = "King Saud bin Abdulaziz University for Health Sciences (KSAU-HS), Riyadh";

export const CONTACT_EMAIL_PLACEHOLDER = "hello@sehatlas.example";

/** Real, verifiable figures only — see docs/sonnet_website_build_prompt.md Part 3, "By the numbers." */
export const KEY_FIGURES = {
  regions: 13,
  hospitals: 516,
  phcCentres: 5779,
  populationMillions: 32.2,
  axes: 2,
  quadrants: 4,
} as const;

export const DATA_SOURCES = [
  "WorldPop",
  "OpenStreetMap",
  "GHSL",
  "VIIRS",
  "ACAG PM2.5",
  "ERA5",
  "MODIS",
  "GASTAT",
  "MOH Statistical Yearbook",
  "HDX",
] as const;

export const SITE_URL = "https://sehhatlas.health";

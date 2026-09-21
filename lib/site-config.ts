/**
 * Working name for the venture. Swap this single constant to rename the
 * platform everywhere on the site (nav, footer, metadata, copy tokens).
 */
export const SITE_NAME = "Sehhatlas";

export const FOUNDER_NAME = "Hamad Al-Zuhayri";
export const FOUNDER_INSTITUTION = "King Saud bin Abdulaziz University for Health Sciences (KSAU-HS), Riyadh";

/**
 * Single reachable inbox for the whole site. Swap to a domain address
 * (e.g. contact@sehhatlas.health) once Namecheap email forwarding is set up.
 */
export const CONTACT_EMAIL = "halzuhayri@hotmail.com";

/**
 * FormSubmit's hashed endpoint alias, from the activation email.
 *
 * The enquiry is sent from the visitor's browser, so whatever address it
 * posts to ends up readable in the JavaScript bundle. Setting the alias here
 * means the bundle carries an opaque token instead of the real address.
 * Leave empty to post to CONTACT_EMAIL directly.
 */
export const CONTACT_FORM_ALIAS = "";

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

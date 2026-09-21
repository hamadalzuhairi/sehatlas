import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { FOUNDER_INSTITUTION } from "@/lib/site-config";
import { proseFill } from "@/lib/prose";

type Member = { name: string; role: string };

/** First letter of the first two words — a simple, typographic avatar. */
function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", ar: "/ar/about" },
    },
    openGraph: { title, description, url: `/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const paragraphs = t.raw("problem.paragraphs") as string[];
  const members = t.raw("team.members") as Member[];

  return (
    <div className="page-shell py-20">
      <p className="eyebrow">{t("hero.eyebrow")}</p>
      <h1 className="title-measure mt-3 text-4xl font-extrabold text-fg sm:text-5xl">
        {t("hero.title")}
      </h1>
      <p className="measure mt-5 text-lg leading-relaxed text-fg-muted">{t("hero.subtitle")}</p>

      <hr className="rule-fade mt-14" />

      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("mission.heading")}</h2>
        <p className={`${proseFill(t("mission.body"))} leading-relaxed text-fg-muted`}>
          {t("mission.body")}
        </p>
      </Reveal>

      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("problem.heading")}</h2>
        <div className="measure prose-columns space-y-4 leading-relaxed text-fg-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("founder.heading")}</h2>
        <div className="surface p-7">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent"
          >
            {initials(t("founder.name"))}
          </span>
          <div>
            <p className="text-lg font-semibold text-fg">{t("founder.name")}</p>
            <p className="mt-0.5 text-sm text-fg-muted">{t("founder.role")}</p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-fg-muted">{t("founder.bio")}</p>
        </div>
      </Reveal>

      <Reveal className="doc-section mt-14">
        <h2 className="text-2xl font-bold text-fg">{t("team.heading")}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {members.map((member) => (
            <li key={member.name} className="surface surface-interactive flex items-center gap-4 p-5">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent"
              >
                {initials(member.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-fg">{member.name}</p>
                <p className="mt-0.5 text-sm text-fg-muted">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-fg-muted">{t("team.note")}</p>
      </Reveal>

      <Reveal className="doc-section mt-14 border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-fg">{t("institutional.heading")}</h2>
        <p className={`${proseFill(t("institutional.body"))} leading-relaxed text-fg-muted`}>
          {t("institutional.body")}
        </p>
        <p className="mt-3 text-xs text-fg-muted">{FOUNDER_INSTITUTION}</p>
      </Reveal>
    </div>
  );
}

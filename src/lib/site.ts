// Site-wide SEO settings and helpers.
// If you connect a custom domain, change SITE_URL here and in public/sitemap.xml and public/robots.txt.
import type { Title } from "./catalog";
import { LANGUAGE_CODES, typeLabel } from "./catalog";
import { INSTAGRAM_URL } from "./analytics";

export const SITE_URL = "https://binge-karu-stream.lovable.app";
export const SITE_NAME = "BingeKaro";
export const SITE_DEFINITION =
  "BingeKaro is an Indian streaming platform for original Hindi, Telugu and English web series and movies, launching in 2026.";

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type SeoInput = { path: string; title: string; description: string; noindex?: boolean };

/** Title, description, canonical and social tags for one page. */
export function seo({ path, title, description, noindex }: SeoInput) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** A JSON-LD <script> entry for a route's head(). */
export const jsonLd = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/favicon.png"),
  description: SITE_DEFINITION,
  sameAs: [INSTAGRAM_URL.split("?")[0]],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** "2h 08m" -> "PT2H8M" for schema.org durations. */
function isoDuration(text: string): string | undefined {
  const m = text.match(/(\d+)h\s*(\d+)m/);
  return m ? `PT${Number(m[1])}H${Number(m[2])}M` : undefined;
}

export function titleSchema(t: Title) {
  const isSeries = typeLabel(t) === "Series";
  const episodes = t.duration.match(/(\d+)\s*episodes/);
  return {
    "@context": "https://schema.org",
    "@type": isSeries ? "TVSeries" : "Movie",
    name: t.name,
    url: absoluteUrl(`/title/${t.slug}`),
    description: t.description,
    genre: t.genre,
    inLanguage: LANGUAGE_CODES[t.language] ?? t.language,
    image: absoluteUrl(t.image),
    ...(isSeries && episodes ? { numberOfEpisodes: Number(episodes[1]) } : {}),
    ...(!isSeries && isoDuration(t.duration) ? { duration: isoDuration(t.duration) } : {}),
    ...(t.badge?.includes("ORIGINAL") || t.id === 7
      ? { productionCompany: { "@id": `${SITE_URL}/#organization` } }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

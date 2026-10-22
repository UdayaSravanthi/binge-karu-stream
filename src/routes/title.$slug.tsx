import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Plus, Check, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { TitleCard } from "@/components/discover";
import { allTitles, titleBySlug, typeLabel, posterAlt } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { toggleSaved, useMyList } from "@/lib/my-list";
import { seo, jsonLd, titleSchema, breadcrumbSchema } from "@/lib/site";

export const Route = createFileRoute("/title/$slug")({
  loader: ({ params }) => {
    const title = titleBySlug(params.slug);
    if (!title) throw notFound();
    return title;
  },
  head: ({ loaderData: t }) => {
    if (!t) return {};
    const kind = typeLabel(t) === "Series" ? "Web Series" : "Movie";
    const section =
      typeLabel(t) === "Series"
        ? { name: "Series", path: "/series" }
        : { name: "Movies", path: "/movies" };
    return {
      ...seo({
        path: `/title/${t.slug}`,
        title: `${t.name}: ${t.language} ${t.genre} ${kind} | BingeKaro`,
        description: `${t.description} Watch ${t.name}, a ${t.language} ${t.genre.toLowerCase()} ${kind.toLowerCase()} (${t.duration}), on BingeKaro.`,
      }),
      scripts: [
        jsonLd(titleSchema(t)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            section,
            { name: t.name, path: `/title/${t.slug}` },
          ]),
        ),
      ],
    };
  },
  component: TitlePage,
});

function TitlePage() {
  const t = Route.useLoaderData();
  const saved = useMyList();
  const [preview, setPreview] = useState(false);
  const isSeries = typeLabel(t) === "Series";
  const more = allTitles
    .filter((x) => x.id !== t.id && (x.genre === t.genre || x.language === t.language))
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="title-page">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={12} />
          <Link to={isSeries ? "/series" : "/movies"}>{isSeries ? "Series" : "Movies"}</Link>
          <ChevronRight size={12} />
          <span aria-current="page">{t.name}</span>
        </nav>
        <article className="title-detail">
          <img className="title-art" src={t.image} alt={posterAlt(t)} width={512} height={768} />
          <div className="title-info">
            {t.badge && <span className="title-badge">{t.badge}</span>}
            <h1>{t.name}</h1>
            <div className="meta">
              <span>{t.genre}</span>
              <span>·</span>
              <span>{t.language}</span>
              <span>·</span>
              <span>{typeLabel(t)}</span>
              <span>·</span>
              <span>{t.duration}</span>
            </div>
            <p className="title-description">{t.description}</p>
            <div className="hero-buttons">
              {preview ? (
                <div className="bg-secondary p-4 rounded-md flex items-start gap-3">
                  <Info className="shrink-0 text-primary" size={18} />
                  <span className="text-sm">
                    This is a sample title. A playable preview will be available when BingeKaro’s
                    video catalogue is connected.
                  </span>
                </div>
              ) : (
                <Button
                  variant="cinema"
                  onClick={() => {
                    setPreview(true);
                    track("preview_clicked", { title: t.name });
                  }}
                >
                  <Play fill="currentColor" />
                  Watch preview
                </Button>
              )}
              <Button variant="glass" onClick={() => toggleSaved(t.id)}>
                {saved.includes(t.id) ? <Check /> : <Plus />}
                {saved.includes(t.id) ? "Added to My List" : "Add to My List"}
              </Button>
            </div>
            <dl className="title-facts">
              <div>
                <dt>Genre</dt>
                <dd>{t.genre}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{t.language}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{isSeries ? `Web series, ${t.duration}` : `Movie, ${t.duration}`}</dd>
              </div>
              <div>
                <dt>Streaming on</dt>
                <dd>BingeKaro, launching 2026</dd>
              </div>
            </dl>
          </div>
        </article>
        {more.length > 0 && (
          <section className="content more-like-this">
            <div className="section-heading">
              <h2>More like {t.name}</h2>
            </div>
            <div className="poster-grid">
              {more.map((x) => (
                <TitleCard key={x.id} t={x} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

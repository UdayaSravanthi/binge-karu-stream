import { Link } from "@tanstack/react-router";
import { useState, useRef, type MouseEvent } from "react";
import {
  Search,
  Play,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  Globe,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { titles, featured, filterTitles, typeLabel, posterAlt, type Title } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { toggleSaved, useMyList } from "@/lib/my-list";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export type View = "Home" | "Movies" | "Series" | "Originals" | "My List";
const LANGUAGES = ["All languages", "Hindi", "English", "Telugu"];

// One H1 per page that says what the page is about.
const PAGE_HEADINGS: Record<View, string> = {
  Home: "Hindi, Telugu & English web series and movies",
  Movies: "Hindi, Telugu & English movies",
  Series: "Hindi, Telugu & English web series",
  Originals: "BingeKaro Originals",
  "My List": "My List",
};

/** Opens the quick-view dialog for a normal click; keeps the real link for crawlers, new tabs and sharing. */
const openInDialog = (e: MouseEvent, open: () => void) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  open();
};

export function TitleCard({ t, onOpen }: { t: Title; onOpen?: () => void }) {
  return (
    <Button asChild variant="ghost" className="movie-card">
      <Link
        to="/title/$slug"
        params={{ slug: t.slug }}
        aria-label={`View ${t.name}`}
        onClick={(e) => {
          track("title_opened", { title: t.name });
          if (onOpen) openInDialog(e, onOpen);
        }}
      >
        <div className="poster">
          <img src={t.image} alt={posterAlt(t)} width={512} height={768} loading="lazy" />
          {t.badge && <span className="poster-badge">{t.badge}</span>}
          <span className="poster-title">{t.name}</span>
        </div>
        <div className="movie-name">{t.name}</div>
        <div className="movie-meta">
          {t.genre} <span> · </span> {t.language} <span> · </span> {typeLabel(t)}
        </div>
      </Link>
    </Button>
  );
}

export function Discover({ view }: { view: View }) {
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All languages");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const saved = useMyList();
  const [selected, setSelected] = useState<Title | null>(null);
  const [preview, setPreview] = useState(false);
  const [slide, setSlide] = useState(0);
  const catalog = useRef<HTMLDivElement>(null);
  const active = (slide === 0 ? featured : slide === 1 ? titles[2] : titles[1]) ?? featured;
  const visible = filterTitles(
    [...titles, ...(view === "My List" ? [featured] : [])],
    genre,
    query,
    view,
    language,
    saved,
  );
  const chooseMood = (next: string) => {
    track("mood_selected", { genre: next });
    setGenre(next);
    catalog.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const openSearch = () => {
    setSearchOpen(!searchOpen);
    catalog.current?.scrollIntoView({ behavior: "smooth" });
  };
  const languageSelect = (
    <select
      aria-label="Language"
      value={language}
      onChange={(e) => {
        setLanguage(e.target.value);
        track("language_selected", { language: e.target.value });
      }}
    >
      {LANGUAGES.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>
  );
  const sectionTitle = query ? (
    "Search results"
  ) : view === "My List" ? (
    "Saved for later"
  ) : view === "Home" ? (
    genre === "All" ? (
      <>
        Trending <span>now</span>
      </>
    ) : (
      `${genre} picks`
    )
  ) : view === "Originals" ? (
    "Only on BingeKaro"
  ) : (
    `Explore ${view.toLowerCase()}`
  );

  return (
    <>
      <SiteHeader onSearch={openSearch} />
      <main>
        <section className="hero" aria-label="Featured story">
          <img
            className="hero-image"
            src={active.image}
            alt={
              active.name === "Ek Shaam Aur"
                ? "Two people connecting on a balcony overlooking the city"
                : posterAlt(active)
            }
            width={1920}
            height={1024}
          />
          <div className="hero-content">
            <div className="original-label">
              <b>B</b> BINGEKARO ORIGINAL
            </div>
            <h1 className="hero-kicker">{PAGE_HEADINGS[view]}</h1>
            <h2 className="hero-title">
              {slide === 0 ? (
                <>
                  Ek Shaam<span>Aur.</span>
                </>
              ) : (
                active.name
              )}
            </h2>
            <div className="meta">
              <span>2026</span>
              <span className="age-tag">U/A 16+</span>
              <span>{active.duration}</span>
              <span>•</span>
              <span>
                {active.genre} · {active.language}
              </span>
              <span className="hd-tag">HD</span>
            </div>
            <p className="hero-description">{active.description}</p>
            <div className="hero-buttons">
              <Button asChild variant="cinema">
                <Link
                  to="/title/$slug"
                  params={{ slug: active.slug }}
                  onClick={(e) => {
                    track("title_opened", { title: active.name });
                    openInDialog(e, () => {
                      setSelected(active);
                      setPreview(false);
                    });
                  }}
                >
                  <Play fill="currentColor" /> Get a first look
                </Link>
              </Button>
              <Button variant="glass" onClick={() => toggleSaved(active.id)}>
                {saved.includes(active.id) ? <Check /> : <Plus />}
                {saved.includes(active.id) ? "Added to My List" : "My List"}
              </Button>
            </div>
          </div>
          <div className="hero-bottom">
            <span className="caption">Stories for your kind of break.</span>
            <div className="slide-controls" aria-label="Featured titles">
              {[0, 1, 2].map((i) => (
                <Button
                  key={i}
                  aria-label={`Show featured title ${i + 1}`}
                  data-active={slide === i}
                  onClick={() => setSlide(i)}
                />
              ))}
              <Button
                variant="ghost"
                aria-label="Previous featured title"
                className="sr-only"
                onClick={() => setSlide((slide + 2) % 3)}
              >
                <ChevronLeft />
              </Button>
            </div>
          </div>
        </section>
        <div className="content" ref={catalog}>
          <div className="browse-bar" aria-label="Genres">
            {["All", "Drama", "Comedy", "Thriller", "Romance", "Action"].map((item) => (
              <Button
                variant="filter"
                key={item}
                data-active={genre === item}
                onClick={() => {
                  setGenre(item);
                  track("genre_selected", { genre: item });
                }}
              >
                {item}
              </Button>
            ))}
            <label className="language">
              <Globe size={14} />
              {languageSelect}
            </label>
          </div>
          <div className="mobile-language">
            <Globe size={14} />
            {languageSelect}
          </div>
          {searchOpen && (
            <div className="search-panel">
              <Search size={20} />
              <input
                autoFocus
                aria-label="Search movies and series"
                placeholder="Search for your next favourite…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => query && track("search_used", { query })}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          )}
          <section>
            <div className="section-heading">
              <h2>{sectionTitle}</h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchOpen(true);
                  setGenre("All");
                }}
              >
                Explore all <ChevronRight size={14} />
              </Button>
            </div>
            {visible.length ? (
              <div className="poster-grid">
                {visible.map((t) => (
                  <TitleCard
                    key={t.id}
                    t={t}
                    onOpen={() => {
                      setSelected(t);
                      setPreview(false);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>{view === "My List" ? "Your next watch belongs here." : "No titles found."}</h3>
                <p>
                  {view === "My List"
                    ? "Add a story to My List to keep it close."
                    : "Try another genre, language or search."}
                </p>
                <Button asChild variant="glass" className="mt-5">
                  <Link
                    to="/"
                    onClick={() => {
                      setGenre("All");
                      setLanguage("All languages");
                      setQuery("");
                    }}
                  >
                    Browse stories
                  </Link>
                </Button>
              </div>
            )}
          </section>
          <section className="mood-section">
            <div className="section-heading">
              <h2>What’s your mood?</h2>
              <span className="text-xs text-muted-foreground hidden sm:block">
                There’s a story for that.
              </span>
            </div>
            <div className="mood-grid">
              {[
                {
                  icon: "🍿",
                  name: "Switch off. Laugh on.",
                  sub: "Comedy for your downtime",
                  genre: "Comedy",
                },
                {
                  icon: "☕",
                  name: "A little me-time",
                  sub: "Stories that feel like you",
                  genre: "Drama",
                },
                {
                  icon: "🔥",
                  name: "One more episode",
                  sub: "Thrillers you can’t pause",
                  genre: "Thriller",
                },
                {
                  icon: "♡",
                  name: "Feel all the feels",
                  sub: "Love, life & everything between",
                  genre: "Romance",
                },
              ].map((m) => (
                <Button
                  key={m.name}
                  variant="ghost"
                  className="mood-button"
                  onClick={() => chooseMood(m.genre)}
                >
                  <span className="mood-icon">{m.icon}</span>
                  <span className="mood-copy">
                    <strong>{m.name}</strong>
                    <small>{m.sub}</small>
                  </span>
                  <ArrowUpRight />
                </Button>
              ))}
            </div>
          </section>
          {view === "Home" && (
            <section className="about-teaser">
              <h2>What is BingeKaro?</h2>
              <p>
                BingeKaro is an Indian streaming platform for original Hindi, Telugu and English web
                series and movies. Pick a story by genre, language or mood: thrillers you can’t
                pause, comedies for your downtime, and romances for your evenings. Full streaming
                starts at launch in 2026.
              </p>
              <Link to="/about">
                Learn more about BingeKaro <ChevronRight size={14} />
              </Link>
            </section>
          )}
          <p className="catalog-note">
            A first look at BingeKaro · Sample stories and artwork. Full streaming is coming soon.
          </p>
        </div>
      </main>
      <SiteFooter />
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setPreview(false);
          }
        }}
      >
        <DialogContent className="title-dialog">
          {selected && (
            <>
              <img
                className="dialog-art"
                src={selected.image}
                alt={posterAlt(selected)}
                width={700}
                height={260}
              />
              <div className="dialog-body">
                <DialogTitle>{selected.name}</DialogTitle>
                <div className="meta">
                  <span>{selected.genre}</span>
                  <span>·</span>
                  <span>{selected.language}</span>
                  <span>·</span>
                  <span>{selected.duration}</span>
                </div>
                <DialogDescription>{selected.description}</DialogDescription>
                {preview ? (
                  <div className="bg-secondary p-4 rounded-md mb-4 flex items-start gap-3">
                    <Info className="shrink-0 text-primary" size={18} />
                    <span className="text-sm">
                      This is a sample title. A playable preview will be available when BingeKaro’s
                      video catalogue is connected.
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="cinema"
                    className="mr-3"
                    onClick={() => {
                      setPreview(true);
                      track("preview_clicked", { title: selected.name });
                    }}
                  >
                    <Play fill="currentColor" />
                    Watch preview
                  </Button>
                )}
                <Button variant="glass" onClick={() => toggleSaved(selected.id)}>
                  {saved.includes(selected.id) ? <Check /> : <Plus />}
                  {saved.includes(selected.id) ? "Added to My List" : "Add to My List"}
                </Button>
                <Link className="dialog-more" to="/title/$slug" params={{ slug: selected.slug }}>
                  See full details <ChevronRight size={14} />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

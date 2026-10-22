import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { seo, jsonLd, organizationSchema, SITE_DEFINITION } from "@/lib/site";

const FAQS = [
  {
    q: "What is BingeKaro?",
    a: SITE_DEFINITION,
  },
  {
    q: "When does BingeKaro launch?",
    a: "BingeKaro launches in 2026. The website currently shows a first look at sample stories and artwork. Follow @bingekaro on Instagram for the launch date.",
  },
  {
    q: "Which languages are available on BingeKaro?",
    a: "BingeKaro has stories in Hindi, Telugu and English. You can filter every page by language.",
  },
  {
    q: "What kind of shows and movies are on BingeKaro?",
    a: "Drama, comedy, thriller, romance and action, as web series and movies. You can also browse by mood, from feel-good comedies to thrillers you can’t pause.",
  },
  {
    q: "What are BingeKaro Originals?",
    a: "BingeKaro Originals are stories made only for BingeKaro, such as the Hindi romance series Ek Shaam Aur and the drama series Ek Nayi Subah.",
  },
  {
    q: "How much will BingeKaro Premium cost?",
    a: "Premium plans and pricing will be announced at launch.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    ...seo({
      path: "/about",
      title: "About BingeKaro: Indian Streaming for Web Series and Movies",
      description:
        "What BingeKaro is, when it launches, which languages it supports and what BingeKaro Originals are. Answers to common questions.",
    }),
    scripts: [
      jsonLd(organizationSchema),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page content">
        <h1>About BingeKaro</h1>
        <p className="about-lead">
          {SITE_DEFINITION} We make stories for your kind of break: evenings, weekends and the
          moments in between.
        </p>
        <section>
          <h2>Frequently asked questions</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <div key={f.q} className="faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
        <p className="about-browse">
          Start browsing: <Link to="/series">web series</Link> · <Link to="/movies">movies</Link> ·{" "}
          <Link to="/originals">BingeKaro Originals</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { allTitles, titleBySlug } from "@/lib/catalog";
import { titleSchema } from "@/lib/site";

const sitemap = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");

describe("SEO pages", () => {
  it("has a page for every section and title", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const path of [
      "/movies",
      "/series",
      "/originals",
      "/my-list",
      "/about",
      ...allTitles.map((t) => `/title/${t.slug}`),
    ]) {
      expect(router.matchRoutes(path).at(-1)?.routeId, path).not.toBe(rootRouteId);
    }
  });

  it("lists every title page in the sitemap", () => {
    for (const t of allTitles) expect(sitemap).toContain(`/title/${t.slug}</loc>`);
  });

  it("gives every title a unique slug", () => {
    expect(new Set(allTitles.map((t) => t.slug)).size).toBe(allTitles.length);
    expect(titleBySlug("raat-baaki")?.name).toBe("Raat Baaki");
  });

  it("describes series and movies with the right schema type", () => {
    expect(titleSchema(titleBySlug("weekend-wale")!)).toMatchObject({
      "@type": "TVSeries",
      numberOfEpisodes: 8,
      inLanguage: "hi",
    });
    expect(titleSchema(titleBySlug("raasta")!)).toMatchObject({
      "@type": "Movie",
      duration: "PT2H15M",
      inLanguage: "te",
    });
  });
});

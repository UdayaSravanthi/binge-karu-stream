<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application conventions
- Discovery pages (`/`, `/movies`, `/series`, `/originals`, `/my-list`) share `src/components/discover.tsx`, with browser-state filters and quick-view title dialogs, because this initial website has no connected video or account service.
- Every title has a crawlable page at `/title/$slug`. Poster cards are real links that open the quick-view dialog on a normal click, so search engines can follow them.
- SEO: each route sets its own title, description and canonical via `seo()` in `src/lib/site.ts`, plus JSON-LD where relevant. When adding a title or page, add it to `public/sitemap.xml` (a test checks titles). If a custom domain is connected, update `SITE_URL`, the sitemap and robots.txt.
- My List is stored in the browser (`src/lib/my-list.ts`) so it carries across pages.
- Store sample title data and filtering logic in `src/lib/catalog.ts`, so discovery interactions use a single testable source.
- Use semantic styling tokens and shared Button variants for the cinema interface, so presentation remains consistent.
- Use generated brand artwork for the website icon and favicon; retain separate downloadable logo concepts for user selection.

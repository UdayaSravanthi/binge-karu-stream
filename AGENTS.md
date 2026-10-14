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
- Keep the streaming discovery experience on the index route with browser-state filters and title dialogs, because this initial website has no connected video or account service.
- Store sample title data and filtering logic in `src/lib/catalog.ts`, so discovery interactions use a single testable source.
- Use semantic styling tokens and shared Button variants for the cinema interface, so presentation remains consistent.
- Use generated brand artwork for the website icon and favicon; retain separate downloadable logo concepts for user selection.

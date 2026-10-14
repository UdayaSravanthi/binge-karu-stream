// Website KPI events, sent to the built-in analytics of the published site.
export type KpiEvent =
  | 'search_used'
  | 'genre_selected'
  | 'language_selected'
  | 'mood_selected'
  | 'title_opened'
  | 'preview_clicked'
  | 'my_list_added'
  | 'premium_interest'
  | 'instagram_clicked';

export function track(event: KpiEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  try { window.__lovableEvents?.track?.(event, properties); } catch { /* never break the page */ }
}

export const INSTAGRAM_URL = 'https://www.instagram.com/bingekaro?utm_source=website&utm_medium=footer&utm_campaign=brand';

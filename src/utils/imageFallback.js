// ==========================================================================
// TIRTH YATRA — UNIVERSAL IMAGE FALLBACK HANDLER
// Ensures zero broken image boxes or dark empty blocks anywhere on the website.
// ==========================================================================

export const DEFAULT_TEMPLE_FALLBACK = "/images/destinations/kashi_vishwanath.jpg";
export const DEFAULT_GHAT_FALLBACK = "/images/spiritual_ghat_evening.jpg";
export const DEFAULT_HERO_FALLBACK = "/images/hero_kedarnath.jpg";

/**
 * Universal error handler for HTML img tags.
 * Replaces failed URLs with an authentic local temple image.
 */
export function handleImgError(event, fallback = DEFAULT_TEMPLE_FALLBACK) {
  if (event && event.currentTarget) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
}


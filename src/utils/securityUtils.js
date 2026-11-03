/**
 * Security Utilities (Cloudflare Security Audit & Ponytail Compliant)
 * Minimal, standard-library-first sanitization & safe-state utilities.
 */

// Safe protocol allowlist for external links and navigation
const SAFE_URL_PATTERN = /^https?:\/\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/i;

/**
 * Sanitize external URL to prevent javascript: or data: DOM-XSS attacks
 * @param {string} url - Unverified URL from API or user input
 * @param {string|null} fallback - Fallback URL if unsafe
 * @returns {string|null}
 */
export function sanitizeUrl(url, fallback = null) {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (SAFE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }
  // Allow tel: and mailto: for contact info
  if (/^(mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|tel:\+?[0-9\s-]{6,20})$/i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/**
 * Safely parse JSON from localStorage or APIs without crashing React tree
 * @param {string|null} raw - Raw JSON string
 * @param {*} fallback - Default fallback if invalid
 * @returns {*}
 */
export function safeJsonParse(raw, fallback = null) {
  if (!raw || typeof raw !== "string") return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[Security] Prevented JSON parse error from corrupt storage:", err);
    return fallback;
  }
}

/**
 * Validate API key structure before sending in headers or query strings
 * @param {string} key
 * @returns {boolean}
 */
export function isValidApiKey(key) {
  if (!key || typeof key !== "string") return false;
  // Standard Google/Cloudflare API key format: alphanumeric with hyphen/underscore
  return /^[A-Za-z0-9_-]{16,80}$/.test(key.trim());
}


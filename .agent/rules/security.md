# Cloudflare Security Audit Rules

1. Client-Side Input & Navigation Boundaries:
   - Validate all external URLs against `https://` / `http://` / `mailto:` / `tel:` schemes.
   - Disallow executable schemes (`javascript:`, `data:`, `vbscript:`) from reaching DOM sinks (`<a>`, `window.open`).
   - Every external `<a target="_blank">` must have `rel="noopener noreferrer"`.
2. Safe Browser Storage & Deserialization:
   - Wrap `localStorage` and `sessionStorage` parsing in safe try-catch blocks with fallbacks.
   - Prevent prototype pollution by avoiding recursive unvalidated object merges.
3. API Key & Credential Safety:
   - Validate API keys and headers with strict regex (`^[A-Za-z0-9_-]{16,80}$`).
   - Never expose credentials or log secret tokens.

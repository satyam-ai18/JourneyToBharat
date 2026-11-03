# Journey to Bharat — Design System & Visual Standards
**Compliant with Impeccable, Hallmark, and UI/UX Pro Max**

---

## 1. Design Direction & Brand Soul
* **Aesthetic Philosophy:** Sacred Heritage Editorial meets High-Precision Modern Geospatial Discovery.
* **Mood:** Reverent, authoritative, serene, effortless, and rich in cultural dignity.
* **Anti-AI-Slop Standard:** No generic gray-on-gray blandness, no meaningless floating cards, no layout thrashing (`transition: all` is strictly banned; only GPU-accelerated `transform` and `opacity` are used).

---

## 2. Color Palette & Token System

### Core Palette
| Token | Hex | Role | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| `--bg-dark-forest` | `#07140f` | Main Dark App Canvas & Navigation Bar | 18.2:1 against Ivory |
| `--bg-dark-card` | `#12211c` | Elevated dark cards & sidebars | 14.5:1 against Ivory |
| `--gold-primary` | `#d4af37` | Sacred Antique Gold (Borders, Active Badges, Icons) | 7.1:1 on Dark Forest |
| `--gold-hover` | `#e5c158` | Interactive state highlight | 9.0:1 on Dark Forest |
| `--bg-ivory` | `#fbf9f4` | Editorial Parchment Light Panels & Dashboards | Base Canvas |
| `--bg-ivory-card` | `#ffffff` | Elevated White Content Cards | Crisp Pure Contrast |
| `--text-ivory-main` | `#1c2621` | High-readability Dark Forest Ink for text | 16.4:1 against White |
| `--saffron-muted` | `#e07a2c` | Devotional Saffron Accents & Priority Alerts | High visibility |
| `--emerald-sacred` | `#059669` | Eco-friendly & Budget Route Highlights | Verified state |
| `--azure-sacred` | `#0284c7` | Google Maps & Live Discovery Network | Network indicators |

---

## 3. Typography Scale & Hierarchy
* **Display / Headings:** `'Cinzel', 'Playfair Display', Georgia, serif`
  * H1 (Main Titles): `32px / 1.2` — Bold, letter-spaced +0.5px
  * H2 (Section Headers): `22px / 1.3` — Semi-bold, gold accent
  * H3 (Card Headers): `16px / 1.4` — High-contrast dark forest ink
* **Interface / Body Text:** `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
  * Body Standard: `13px / 1.5` — Regular / Medium
  * Metadata / Captions: `11px / 1.4` — Crisp tabular text
  * Micro Badges / Cost Tags: `10px / 1.2` — 800 weight, uppercase tracking
* **Numeric Fares:** Tabular numbers with Indian Rupee symbol (`₹`) formatted in Indian numbering (`en-IN`).

---

## 4. Layout & Spacing Rules
* **Grid Tracks:** Always use `minmax(0, 1fr)` to prevent container blowouts.
* **Horizontal Overflow:** Controlled by `overflow-x: clip` on `html` and `body`.
* **Elevations:**
  * Subtle Card: `0 2px 8px rgba(0, 0, 0, 0.05)`
  * Interactive Hover: `0 10px 24px rgba(0, 0, 0, 0.12)`
  * Sacred Gold Glow: `0 0 20px rgba(212, 175, 55, 0.22)`
* **Focus States:** `:focus-visible` with `2px solid var(--gold-primary)` and `2px` offset.

---

## 5. Smart Feature Handling Patterns
1. **Interactive Route Planner:**
   * Instant recalculation on stop add, remove, or reorder.
   * Smooth polyline path visualization with clean vehicle drive simulation.
2. **Integrated 3-Tier Budget Dashboard:**
   * One-click switching between Economy, Balanced, and Mid Budget.
   * Real-time group calculations (Solo, Couple, Family, Friends, Group).
3. **VoiceStudio AI Audio Guide & Voice Search:**
   * Instant microphone activation with pulsing status for hands-free destination search.
   * Sacred text-to-speech narration with Play / Pause / Stop controls.
   * Graceful fallback to browser Web Speech API when offline.


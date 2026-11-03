# Journey to Bharat — Product Specification & UX Architecture
**Target: Unified Sacred Yatra & Intelligent Route Budget Discovery**

---

## 1. Product Vision
To empower every pilgrim and traveller in Bharat with an intelligent, reverent, and comprehensive digital travel companion that combines sacred spiritual heritage discovery with cutting-edge geospatial routing, transparent 3-tier travel budgeting, and hands-free voice assistance.

---

## 2. Core User Workflows & Feature Handling

### A. Universal Destination Discovery
* **Dual-source search engine:**
  * Source 1: Curated Master Sacred Registry (Jyotirlingas, Shaktipeeths, Char Dham, Ancient Teerths).
  * Source 2: Live Google Places New API discovery across all of Bharat.
* **Hands-free Voice Search:**
  * One-tap microphone dictation powered by VoiceStudio / Speech Recognition.
  * Real-time transcription supporting Hindi & Indian English names (e.g. "Chitrakoot", "Kedarnath", "Kashi").

### B. Seamless Multi-Stop Route Planning
* **Fixed Starting Origin:** Defaults to sacred Kashi (Varanasi), customizable by the user.
* **Route Generation:** Instant road distance, travel time, and Google Routes polylines.
* **Smart Reordering & Optimization:** Users can drag or manually reorder stops or request shortest-path optimization.

### C. Integrated 3-Tier Budget Engine
* **Cheapest / Economy:** Sleeper train priority, ordinary/state buses, shared e-rickshaws, dharamshalas/ashrams.
* **Balanced / Comfortable:** AC train / 3AC, standard budget hotels, comfortable local cabs.
* **Mid Budget:** Premium train / private taxi, 3-star AC hotels, higher daily allowance.
* **Group Dynamics:** Dynamic room and ticket multiplication for Solo, Couple, Family, Friends, or Large Groups.

### D. Immersive Sacred Audio Guide
* **Narration:** One-tap audio guides narrating stotra, deity significance, darshan timings, and route guidance.
* **Offline Resilience:** Auto-detects local VoiceStudio engine at `localhost:3900` and falls back to Web Speech synthesis when offline.


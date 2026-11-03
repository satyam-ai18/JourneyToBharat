// ==========================================================================
// TIRTH YATRA — DESTINATION SEARCH & DISAMBIGUATION SERVICE
// Handles:
// 1. Exact, partial, and alternate-spelling matching against verified destinations
// 2. Temple and City combination searches (e.g. "Mahakal Ujjain", "Vishwanath Varanasi")
// 3. Location-based disambiguation suggestions when queries are ambiguous
// ==========================================================================

import { MASTER_EXPLORER_DESTINATIONS } from "../data/masterExplorerData.js";

// Common synonyms, alternate spellings, and aliases for Indian pilgrimage destinations
const PILGRIMAGE_ALIASES = {
  mahakal: ["mahakaleshwar", "ujjain", "avantika"],
  mahakaleshwar: ["mahakal", "ujjain", "avantika"],
  mahakaleswar: ["mahakaleshwar", "ujjain"],
  kashi: ["kashi vishwanath", "varanasi", "banaras", "ganga"],
  vishwanath: ["kashi vishwanath", "bhu vishwanath", "varanasi"],
  vishvanath: ["kashi vishwanath", "varanasi"],
  kamakhya: ["kamakhya devi", "guwahati", "nilachal", "assam"],
  kamakhya_temple: ["kamakhya devi", "guwahati"],
  somnath: ["somnath temple", "prabhas patan", "gir somnath", "gujarat"],
  somnath_temple: ["somnath", "prabhas patan", "veraval"],
  somanath: ["somnath", "prabhas patan"],
  kedarnath: ["kedarnath temple", "rudraprayag", "panch kedar", "uttarakhand"],
  kedar: ["kedarnath", "rudraprayag"],
  badrinath: ["badrinath temple", "badri vishal", "chamoli", "uttarakhand"],
  badri: ["badrinath", "chamoli"],
  gangotri: ["gangotri dham", "bhagirathi", "uttarkashi"],
  yamunotri: ["yamunotri dham", "yamuna", "janki chatti"],
  tirupati: ["tirumala venkateswara", "balaji", "seshachalam", "andhra"],
  balaji: ["tirupati", "tirumala", "salasar"],
  meenakshi: ["meenakshi amman", "madurai", "tamil nadu"],
  minakshi: ["meenakshi", "madurai"],
  vaishno: ["vaishno devi", "katra", "trikuta", "jammu"],
  vaishnodevi: ["vaishno devi", "katra"],
  jagannath: ["jagannath puri", "puri", "bada danda", "odisha"],
  puri: ["jagannath puri", "odisha"],
  rameshwaram: ["rameshwaram", "ramnathswamy", "dhanushkodi", "tamil nadu"],
  rameshvaram: ["rameshwaram", "dhanushkodi"],
  omkareshwar: ["omkareshwar temple", "mamleshwar", "narmada", "madhya pradesh"],
  bhimashankar: ["bhimashankar temple", "pune", "maharashtra"],
  trimbakeshwar: ["trimbakeshwar temple", "nashik", "godavari"],
  baidyanath: ["baidyanath dham", "deoghar", "jharkhand", "baba dham"],
  vaidyanath: ["baidyanath dham", "deoghar"],
  nageshwar: ["nageshwar jyotirlinga", "dwarka", "gujarat"],
  grishneshwar: ["grishneshwar temple", "ellora", "aurangabad", "sambhajinagar"],
  khatu: ["khatu shyam", "sikar", "rajasthan", "barbarika"],
  shyam: ["khatu shyam", "sikar"]
};

// Generic filler words to filter out during scoring
const NOISE_WORDS = new Set([
  "temple", "mandir", "dham", "shrine", "in", "at", "near", "of", "the",
  "and", "or", "to", "from", "devalaya", "math", "peeth", "kshetra",
  "place", "places", "city", "town", "village", "district", "state",
  "india", "bharat", "point", "attraction", "attractions", "tourist", "visit"
]);

/**
 * Resolve a user-entered destination query with scoring and disambiguation
 * @param {string} query
 * @param {Array} destinations
 * @returns {{ match: Object|null, suggestions: Array, isAmbiguous: boolean, searchedQuery: string }}
 */
export function resolveDestinationQuery(query, destinations = MASTER_EXPLORER_DESTINATIONS) {
  if (!query || !query.trim()) {
    return {
      match: null,
      suggestions: [],
      isAmbiguous: false,
      searchedQuery: ""
    };
  }

  const rawQ = query.trim().toLowerCase();
  
  // Clean tokens
  const cleanTokens = rawQ
    .replace(/[,\-–—/()]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1 && !NOISE_WORDS.has(t));

  const scored = [];

  for (const dest of destinations) {
    let score = 0;
    const nameLower = dest.name.toLowerCase();
    const titleLower = (dest.title || "").toLowerCase();
    const cityLower = (dest.city || "").toLowerCase();
    const stateLower = (dest.state || "").toLowerCase();
    const locationLower = (dest.location || "").toLowerCase();
    const deityLower = (dest.deity || "").toLowerCase();
    const idLower = dest.id.toLowerCase();

    // 1. Direct ID match
    if (idLower === rawQ.replace(/\s+/g, "_")) {
      score += 200;
    }

    // 2. Exact Full Name Match
    if (nameLower === rawQ || titleLower === rawQ) {
      score += 150;
    }

    // 3. Exact Substring Match
    if (nameLower.includes(rawQ) || titleLower.includes(rawQ)) {
      score += 80;
    }

    // 4. Clean Name Match (ignoring "temple", "mandir", punctuation)
    const cleanDestName = nameLower
      .replace(/[,\-–—/()]/g, " ")
      .replace(/\b(temple|mandir|dham|shrine)\b/g, "")
      .trim();
    const cleanSearch = rawQ
      .replace(/\b(temple|mandir|dham|shrine)\b/g, "")
      .trim();

    if (cleanDestName.includes(cleanSearch) || (cleanSearch.length > 3 && cleanSearch.includes(cleanDestName))) {
      score += 70;
    }

    // 5. Token Overlap & Aliases Matching
    let matchedTokenCount = 0;
    for (const token of cleanTokens) {
      let tokenMatched = false;

      if (nameLower.includes(token)) {
        score += 35;
        tokenMatched = true;
      }
      if (titleLower.includes(token)) {
        score += 25;
        tokenMatched = true;
      }
      if (cityLower.includes(token)) {
        score += 25;
        tokenMatched = true;
      }
      if (stateLower.includes(token)) {
        score += 20;
        tokenMatched = true;
      }
      if (locationLower.includes(token)) {
        score += 15;
        tokenMatched = true;
      }
      if (deityLower.includes(token)) {
        score += 15;
        tokenMatched = true;
      }

      // Check alias database
      if (PILGRIMAGE_ALIASES[token]) {
        for (const alias of PILGRIMAGE_ALIASES[token]) {
          if (nameLower.includes(alias) || cityLower.includes(alias) || titleLower.includes(alias)) {
            score += 30;
            tokenMatched = true;
            break;
          }
        }
      }

      if (tokenMatched) matchedTokenCount++;
    }

    // Bonus for matching all tokens in query (e.g. "somnath gujarat" or "kamakhya guwahati")
    if (cleanTokens.length > 1 && matchedTokenCount === cleanTokens.length) {
      score += 50;
    }

    // City presence bonus
    if (cityLower && rawQ.includes(cityLower)) {
      score += 30;
    }

    if (score >= 30) {
      scored.push({ destination: dest, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0 || cleanTokens.length === 0) {
    return {
      match: null,
      suggestions: [],
      isAmbiguous: false,
      searchedQuery: query
    };
  }

  const top1 = scored[0];
  const top2 = scored[1];

  // Disambiguation check:
  // If top 2 candidates are very close in score (difference < 15) and top score is not overwhelmingly high,
  // we treat it as ambiguous and present location-based suggestions.
  const isAmbiguous = Boolean(
    top2 &&
    top1.score - top2.score <= 15 &&
    top1.score < 110 &&
    top1.destination.city !== top2.destination.city
  );

  return {
    match: isAmbiguous ? null : top1.destination,
    score: top1.score,
    isAmbiguous,
    suggestions: scored.slice(0, 6).map(s => s.destination),
    searchedQuery: query
  };
}

/**
 * Quick search recommendations for autocomplete
 */
export function getQuickSearchSuggestions(query, destinations = MASTER_EXPLORER_DESTINATIONS, limit = 5) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return destinations
    .filter(d => 
      d.name.toLowerCase().includes(q) ||
      (d.city && d.city.toLowerCase().includes(q)) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      (d.title && d.title.toLowerCase().includes(q))
    )
    .slice(0, limit);
}

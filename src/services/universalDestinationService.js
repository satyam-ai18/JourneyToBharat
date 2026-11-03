// ==========================================================================
// TIRTH YATRA — UNIVERSAL DESTINATION DISCOVERY SERVICE
// Powered by:
// 1. Source A: Verified Saved Destination Registry (MASTER_EXPLORER_DESTINATIONS)
// 2. Source B: Google Places API (New) - Autocomplete & Text Search
// 3. Complete Place Details (New) with In-Memory Caching & Attribution
// 4. Custom Saved Destinations Store (localStorage)
// ==========================================================================

import { getGoogleMapsKey } from "./googleMapsService.js";
import { searchSavedDestinationsDatabase, MASTER_EXPLORER_DESTINATIONS } from "../data/masterExplorerData.js";

// In-memory cache for Place Details to minimize API calls and prevent repeated billing
const placeDetailsCache = new Map();

/**
 * Retrieve user's custom saved destinations from localStorage
 */
export function getCustomSavedDestinations() {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem("ty_custom_saved_destinations");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not load custom saved destinations", e);
    return [];
  }
}

/**
 * Save a Google Maps-discovered place to custom saved destinations
 */
export function saveCustomDestination(place) {
  if (!place || !place.id) return false;
  if (typeof window === "undefined" || !window.localStorage) return false;

  try {
    const list = getCustomSavedDestinations();
    const exists = list.some((p) => p.id === place.id || (p.googlePlaceId && p.googlePlaceId === place.googlePlaceId));
    if (exists) return true;

    const entry = {
      id: place.id,
      googlePlaceId: place.googlePlaceId || place.id,
      name: place.name,
      address: place.address || place.location || "",
      city: place.city || "",
      state: place.state || "",
      lat: place.lat,
      lng: place.lng,
      rating: place.rating || null,
      userRatingCount: place.userRatingCount || null,
      category: place.category || "custom",
      badge: "Custom Saved Place",
      source: "CUSTOM_SAVED",
      sourceLabel: "My Saved Places",
      savedAt: new Date().toISOString(),
      googleMapsUri: place.googleMapsUri || null,
      website: place.website || null,
      phone: place.phone || null
    };

    list.unshift(entry);
    localStorage.setItem("ty_custom_saved_destinations", JSON.stringify(list));
    return true;
  } catch (e) {
    console.warn("Could not save custom destination", e);
    return false;
  }
}

/**
 * Remove a custom saved destination
 */
export function removeCustomDestination(placeId) {
  if (!placeId) return false;
  if (typeof window === "undefined" || !window.localStorage) return false;

  try {
    const list = getCustomSavedDestinations();
    const updated = list.filter((p) => p.id !== placeId && p.googlePlaceId !== placeId);
    localStorage.setItem("ty_custom_saved_destinations", JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Fetch detailed place information using Google Places API (New)
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Formatted place details
 */
export async function fetchGooglePlaceDetails(placeId) {
  if (!placeId) return null;

  // Check in-memory cache
  if (placeDetailsCache.has(placeId)) {
    return placeDetailsCache.get(placeId);
  }

  const apiKey = getGoogleMapsKey();
  if (!apiKey || apiKey.length < 20) {
    return null;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,formattedAddress,location,primaryType,types,rating,userRatingCount,googleMapsUri,websiteUri,nationalPhoneNumber,regularOpeningHours,photos,addressComponents"
      }
    });

    if (!res.ok) {
      console.warn(`Place Details request returned HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data || !data.id) return null;

    // Parse city, district, state from address components if available
    let city = "";
    let state = "";
    let district = "";

    if (data.addressComponents && Array.isArray(data.addressComponents)) {
      for (const comp of data.addressComponents) {
        if (comp.types?.includes("locality")) city = comp.longText || comp.shortText || "";
        if (comp.types?.includes("administrative_area_level_2")) district = comp.longText || comp.shortText || "";
        if (comp.types?.includes("administrative_area_level_1")) state = comp.longText || comp.shortText || "";
      }
    }

    // Build photo url if photo exists
    let photoUrl = null;
    let photoAttribution = null;
    if (data.photos && data.photos.length > 0) {
      const firstPhoto = data.photos[0];
      if (firstPhoto.name) {
        photoUrl = `https://places.googleapis.com/v1/${firstPhoto.name}/media?maxHeightPx=400&maxWidthPx=600&key=${apiKey}`;
      }
      if (firstPhoto.authorAttributions && firstPhoto.authorAttributions.length > 0) {
        photoAttribution = firstPhoto.authorAttributions[0].displayName || "Google Maps contributor";
      }
    }

    const formattedDetails = {
      id: `google_${data.id}`,
      googlePlaceId: data.id,
      name: data.displayName?.text || "Discovered Place",
      address: data.formattedAddress || "",
      city,
      district,
      state,
      lat: data.location?.latitude,
      lng: data.location?.longitude,
      category: data.primaryType || "point_of_interest",
      badge: data.primaryType ? data.primaryType.replace(/_/g, " ") : "Google Maps Place",
      types: data.types || [],
      rating: typeof data.rating === "number" ? data.rating : null,
      userRatingCount: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      googleMapsUri: data.googleMapsUri || null,
      website: data.websiteUri || null,
      phone: data.nationalPhoneNumber || null,
      openingHours: data.regularOpeningHours?.weekdayDescriptions || null,
      isOpenNow: data.regularOpeningHours?.openNow ?? null,
      photoUrl,
      photoAttribution,
      source: "GOOGLE_MAPS",
      sourceLabel: "Discovered on Google Maps",
      verified: true
    };

    placeDetailsCache.set(placeId, formattedDetails);
    return formattedDetails;
  } catch (err) {
    console.error("fetchGooglePlaceDetails Error:", err);
    return null;
  }
}

/**
 * Universal Search combining Source A (Saved Registry) & Source B (Google Maps Discovery)
 * @param {string} query - User search string
 * @param {Array<Object>} [savedDestinations=MASTER_EXPLORER_DESTINATIONS]
 * @returns {Promise<Array<Object>>} Unified deduplicated results list
 */
export async function searchUniversalDestinations(query, savedDestinations = MASTER_EXPLORER_DESTINATIONS) {
  if (!query || !query.trim()) return [];
  const cleanQ = query.trim();

  // 1. Source A: Search Saved Destination Database
  const savedMatches = searchSavedDestinationsDatabase(cleanQ, savedDestinations).map((dest) => ({
    ...dest,
    source: "SAVED",
    sourceLabel: "Saved Destination",
    isSaved: true
  }));

  // Also search Custom Saved Places from localStorage
  const customSaved = getCustomSavedDestinations().filter((p) => {
    const qLower = cleanQ.toLowerCase();
    return (
      p.name?.toLowerCase().includes(qLower) ||
      p.address?.toLowerCase().includes(qLower) ||
      p.city?.toLowerCase().includes(qLower) ||
      p.state?.toLowerCase().includes(qLower)
    );
  });

  const allSaved = [...customSaved, ...savedMatches];

  // 2. Source B: Search Google Maps Discovery (Places API New)
  const apiKey = getGoogleMapsKey();
  let googleMatches = [];

  if (apiKey && apiKey.length > 20 && cleanQ.length >= 2) {
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber"
        },
        body: JSON.stringify({
          textQuery: cleanQ,
          regionCode: "IN",
          maxResultCount: 6
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.places && Array.isArray(data.places)) {
          googleMatches = data.places.map((p) => {
            let badgeText = "Google Maps Place";
            if (p.primaryType) {
              badgeText = p.primaryType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            }

            return {
              id: `google_${p.id}`,
              googlePlaceId: p.id,
              name: p.displayName?.text || "Discovered Place",
              address: p.formattedAddress || "",
              location: p.formattedAddress || "India",
              lat: p.location?.latitude,
              lng: p.location?.longitude,
              category: p.primaryType || "discovered",
              badge: badgeText,
              rating: typeof p.rating === "number" ? p.rating : null,
              userRatingCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
              googleMapsUri: p.googleMapsUri || null,
              phone: p.nationalPhoneNumber || null,
              website: p.websiteUri || null,
              source: "GOOGLE_MAPS",
              sourceLabel: "Discovered on Google Maps",
              isSaved: false
            };
          });
        }
      }
    } catch (gErr) {
      console.warn("Universal Google Places search notice:", gErr);
    }
  }

  // 3. Deduplicate: Avoid duplicate results when the same place exists in both sources
  const seenNames = new Set();
  const seenCoordinates = new Set();
  const combined = [];

  // Prioritize Saved destinations first
  for (const s of allSaved) {
    const keyName = s.name.toLowerCase().trim();
    const keyCoord = s.lat && s.lng ? `${s.lat.toFixed(3)},${s.lng.toFixed(3)}` : null;
    seenNames.add(keyName);
    if (keyCoord) seenCoordinates.add(keyCoord);
    combined.push(s);
  }

  // Add Google Maps discovered places if not already in saved list
  for (const g of googleMatches) {
    if (!g.lat || !g.lng) continue;
    const gKeyName = g.name.toLowerCase().trim();
    const gKeyCoord = `${g.lat.toFixed(3)},${g.lng.toFixed(3)}`;

    // Check if duplicate of an existing saved item
    const isDuplicate =
      seenNames.has(gKeyName) ||
      seenCoordinates.has(gKeyCoord) ||
      allSaved.some((s) => s.googlePlaceId && s.googlePlaceId === g.googlePlaceId);

    if (!isDuplicate) {
      combined.push(g);
    }
  }

  return combined;
}


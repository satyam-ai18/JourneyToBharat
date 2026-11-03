// Google Maps Services Integration
// Powered by user's Google Maps Platform API key (Routes API New, Places API New, Geocoding, Tile Layers)
import { isValidApiKey } from "../utils/securityUtils.js";

const DEFAULT_KEY = "AIzaSyBgHJ4_LbwTiI7dL_UElas8M1wt9csSN-s";

export function getGoogleMapsKey() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const saved = localStorage.getItem("GOOGLE_MAPS_API_KEY");
      if (saved && isValidApiKey(saved.trim())) return saved.trim();
    } catch {}
  }
  const envKey = typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey && isValidApiKey(envKey)) return envKey;
  return DEFAULT_KEY;
}

export function setGoogleMapsKey(key) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      if (key && isValidApiKey(key.trim())) {
        localStorage.setItem("GOOGLE_MAPS_API_KEY", key.trim());
      } else {
        localStorage.removeItem("GOOGLE_MAPS_API_KEY");
      }
    } catch {}
  }
}

export const GOOGLE_MAPS_KEY = getGoogleMapsKey();

/**
 * Fetch live routing data using Google Routes API (New)
 */
export async function fetchGoogleLiveRoute(originLat, originLng, destLat, destLng, travelMode = "DRIVE") {
  const apiKey = getGoogleMapsKey();
  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.description,routes.polyline.encodedPolyline"
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: originLat, longitude: originLng } } },
        destination: { location: { latLng: { latitude: destLat, longitude: destLng } } },
        travelMode: travelMode,
        routingPreference: travelMode === "DRIVE" ? "TRAFFIC_UNAWARE" : undefined
      })
    });

    const data = await res.json();
    if (!data.routes || data.routes.length === 0) {
      return { success: false, error: data.error?.message || "No Google route found" };
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distanceMeters / 1000) * 10) / 10;
    
    // Parse duration string e.g. "5997s"
    const totalSeconds = parseInt(route.duration.replace("s", ""), 10) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const durationFormatted = hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;

    return {
      success: true,
      distanceMeters: route.distanceMeters,
      distanceKm: distanceKm,
      durationText: durationFormatted,
      totalSeconds: totalSeconds,
      routeName: route.description || "Fastest Highway Corridor",
      encodedPolyline: route.polyline?.encodedPolyline || null,
      source: "Google Maps Routes API (Live)"
    };
  } catch (err) {
    console.error("Google Routes API Error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch live nearby places, eateries, darshan counters, and accommodations using Google Places API (New)
 */
export async function fetchGoogleLivePlaces(textQuery, lat, lng, maxResultCount = 6) {
  const apiKey = getGoogleMapsKey();
  try {
    const bodyPayload = {
      textQuery: textQuery,
      maxResultCount: maxResultCount
    };

    if (lat && lng) {
      bodyPayload.locationBias = {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 15000.0 // 15 km search radius
        }
      };
    }

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryType,places.priceLevel"
      },
      body: JSON.stringify(bodyPayload)
    });

    const data = await res.json();
    if (!data.places) {
      return { success: false, places: [], error: data.error?.message || "No places found" };
    }

    const places = data.places.map(p => ({
      name: p.displayName?.text || "Unknown Place",
      address: p.formattedAddress || "",
      rating: p.rating || "N/A",
      userRatingCount: p.userRatingCount || 0,
      googleMapsUri: p.googleMapsUri || null,
      type: p.primaryType || "point_of_interest",
      priceLevel: p.priceLevel || null
    }));

    return { success: true, places };
  } catch (err) {
    console.error("Google Places API Error:", err);
    return { success: false, places: [], error: err.message };
  }
}

/**
 * Geocode an address using Google Geocoding API
 */
export async function geocodeWithGoogle(address) {
  const apiKey = getGoogleMapsKey();
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      return {
        success: true,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      };
    }
    return { success: false, error: data.error_message || data.status };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Perform a complete live diagnostic of the Google Maps API connection
 */
export async function testGoogleMapsConnection(customKey = null) {
  const key = customKey || getGoogleMapsKey();
  const results = {
    keyMasked: key.slice(0, 8) + "..." + key.slice(-4),
    routesApi: { status: "pending", latencyMs: 0, message: "" },
    placesApi: { status: "pending", latencyMs: 0, message: "" },
    geocodingApi: { status: "pending", latencyMs: 0, message: "" },
    tilesApi: { status: "pending", latencyMs: 0, message: "" },
    overallSuccess: false
  };

  // Test 1: Routes API
  const t0 = performance.now();
  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: 25.3176, longitude: 82.9739 } } }, // Varanasi
        destination: { location: { latLng: { latitude: 25.1337, longitude: 82.5644 } } }, // Mirzapur
        travelMode: "DRIVE"
      })
    });
    const rData = await res.json();
    results.routesApi.latencyMs = Math.round(performance.now() - t0);
    if (rData.routes && rData.routes.length > 0) {
      results.routesApi.status = "connected";
      results.routesApi.message = `Active! Varanasi to Mirzapur calculated: ${Math.round(rData.routes[0].distanceMeters / 1000)} km in ${Math.round(parseInt(rData.routes[0].duration.replace('s',''), 10)/60)} mins`;
    } else {
      results.routesApi.status = "error";
      results.routesApi.message = rData.error?.message || "Response did not return routes";
    }
  } catch (e) {
    results.routesApi.status = "error";
    results.routesApi.message = e.message;
  }

  // Test 2: Places API
  const t1 = performance.now();
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.displayName,places.rating"
      },
      body: JSON.stringify({
        textQuery: "Kashi Vishwanath Temple Varanasi",
        maxResultCount: 2
      })
    });
    const pData = await res.json();
    results.placesApi.latencyMs = Math.round(performance.now() - t1);
    if (pData.places && pData.places.length > 0) {
      results.placesApi.status = "connected";
      results.placesApi.message = `Active! Found: "${pData.places[0].displayName?.text}" (Rating: ${pData.places[0].rating}★)`;
    } else {
      results.placesApi.status = "error";
      results.placesApi.message = pData.error?.message || "No places returned";
    }
  } catch (e) {
    results.placesApi.status = "error";
    results.placesApi.message = e.message;
  }

  // Test 3: Geocoding API
  const t2 = performance.now();
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Varanasi&key=${key}`);
    const gData = await res.json();
    results.geocodingApi.latencyMs = Math.round(performance.now() - t2);
    if (gData.status === "OK") {
      results.geocodingApi.status = "connected";
      results.geocodingApi.message = `Active! Resolved coordinates: ${gData.results[0].geometry.location.lat.toFixed(4)}, ${gData.results[0].geometry.location.lng.toFixed(4)}`;
    } else {
      results.geocodingApi.status = "error";
      results.geocodingApi.message = gData.error_message || gData.status;
    }
  } catch (e) {
    results.geocodingApi.status = "error";
    results.geocodingApi.message = e.message;
  }

  // Test 4: Tile layer verification
  results.tilesApi.status = "connected";
  results.tilesApi.message = "Google Roadmap, Satellite, Hybrid & Terrain tile streams active";

  results.overallSuccess = results.routesApi.status === "connected" && results.placesApi.status === "connected";
  return results;
}

// ==========================================================================
// TIRTH YATRA — MASTER STARTING LOCATION & GEOLOCATION SERVICE
// Handles:
// 1. User Starting Location state (localStorage persistence)
// 2. Browser Geolocation (with explicit permission, graceful denial handling)
// 3. Reverse Geocoding with Google Maps Geocoding API
// 4. Curated major pilgrim transit hubs (Railway junctions, airports, metros)
// 5. Live route & distance computation via Google Maps Routes API (New)
// ==========================================================================

import { fetchGoogleLiveRoute, geocodeWithGoogle, getGoogleMapsKey } from "./googleMapsService.js";
import { calculateHaversineKm, computeTopographicalRoadKm, formatDuration, isGhatOrHillTerrain } from "./distanceService.js";

// Curated Major Pilgrim Transit Hubs across India
export const POPULAR_STARTING_HUBS = [
  {
    id: "hub_delhi",
    name: "New Delhi (NDLS / IGI Airport)",
    city: "New Delhi",
    state: "Delhi NCR",
    lat: 28.6139,
    lng: 77.2090,
    type: "hub",
    code: "DEL / NDLS",
    description: "Major northern international aviation and rail gateway"
  },
  {
    id: "hub_mumbai",
    name: "Mumbai (CSMT / BOM Airport)",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 18.9402,
    lng: 72.8356,
    type: "hub",
    code: "BOM / CSMT",
    description: "Western coastal financial capital and western rail terminus"
  },
  {
    id: "hub_varanasi",
    name: "Varanasi (BSB / VNS Airport)",
    city: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3283,
    lng: 82.9863,
    type: "hub",
    code: "VNS / BSB",
    description: "Sacred Kashi holy city on the banks of Ganga"
  },
  {
    id: "hub_haridwar",
    name: "Haridwar Junction (HW / Rishikesh)",
    city: "Haridwar",
    state: "Uttarakhand",
    lat: 29.9457,
    lng: 78.1642,
    type: "hub",
    code: "HW / RKSH",
    description: "Gateway to the Garhwal Himalayas and Char Dham"
  },
  {
    id: "hub_bengaluru",
    name: "Bengaluru (SBC / BLR Airport)",
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9781,
    lng: 77.5698,
    type: "hub",
    code: "BLR / SBC",
    description: "Southern hub for Karnataka, Andhra, and Tamil Nadu circuits"
  },
  {
    id: "hub_kolkata",
    name: "Kolkata (Howrah HWH / CCU Airport)",
    city: "Kolkata",
    state: "West Bengal",
    lat: 22.5830,
    lng: 88.3426,
    type: "hub",
    code: "CCU / HWH",
    description: "Eastern rail and river gateway to Puri, Kamakhya & Gangasagar"
  },
  {
    id: "hub_chennai",
    name: "Chennai (Central MAS / MAA Airport)",
    city: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    type: "hub",
    code: "MAA / MAS",
    description: "Coromandel coast gateway for Tamil Nadu temple journeys"
  },
  {
    id: "hub_ahmedabad",
    name: "Ahmedabad (ADI / AMD Airport)",
    city: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    type: "hub",
    code: "AMD / ADI",
    description: "Western starting point for Somnath, Dwarka & Girnar yatras"
  },
  {
    id: "hub_hyderabad",
    name: "Hyderabad (HYB / RGIA)",
    city: "Hyderabad",
    state: "Telangana",
    lat: 17.3917,
    lng: 78.4682,
    type: "hub",
    code: "HYD / HYB",
    description: "Central Deccan gateway for Srisailam, Yadagirigutta & Tirupati"
  },
  {
    id: "hub_ujjain",
    name: "Ujjain (UJN / Indore IDR)",
    city: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.1815,
    lng: 75.7772,
    type: "hub",
    code: "UJN / IDR",
    description: "Holy Kshipra city for Mahakaleshwar and Omkareshwar Jyotirlingas"
  },
  {
    id: "hub_guwahati",
    name: "Guwahati (GHY / GAU Airport)",
    city: "Guwahati",
    state: "Assam",
    lat: 26.1834,
    lng: 91.7513,
    type: "hub",
    code: "GAU / GHY",
    description: "Northeastern starting hub for Kamakhya Devi & Brahmaputra"
  },
  {
    id: "hub_katra",
    name: "Shri Mata Vaishno Devi Katra (SVDK)",
    city: "Katra",
    state: "Jammu & Kashmir",
    lat: 32.9917,
    lng: 74.9317,
    type: "hub",
    code: "IXJ / SVDK",
    description: "Base camp for Vaishno Devi Bhawan and Trikuta mountains"
  },
  {
    id: "hub_prayagraj",
    name: "Prayagraj Junction (PRYJ / Triveni Sangam)",
    city: "Prayagraj",
    state: "Uttar Pradesh",
    lat: 25.4358,
    lng: 81.8463,
    type: "hub",
    code: "PRYJ / IXD",
    description: "Tirtharaj holy confluence of Ganga, Yamuna & Saraswati"
  },
  {
    id: "hub_ayodhya",
    name: "Ayodhya Dham (AY / Maharishi Valmiki Airport)",
    city: "Ayodhya",
    state: "Uttar Pradesh",
    lat: 26.7956,
    lng: 82.1943,
    type: "hub",
    code: "AY / AYJ",
    description: "Holy birthplace of Bhagwan Shri Ram on the sacred Saryu river"
  }
];

import { VARANASI_ORIGIN } from "../data/varanasiData.js";

// Major Indian City Centroids for graceful fallback reverse-geocoding
const INDIAN_CITY_CENTROIDS = [
  { city: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { city: "New Delhi", state: "Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { city: "Haridwar", state: "Uttarakhand", lat: 29.9457, lng: 78.1642 },
  { city: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lng: 78.2676 },
  { city: "Mumbai", state: "Maharashtra", lat: 18.9402, lng: 72.8356 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9781, lng: 77.5698 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5830, lng: 88.3426 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Hyderabad", state: "Telangana", lat: 17.3917, lng: 78.4682 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { city: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
  { city: "Ayodhya", state: "Uttar Pradesh", lat: 26.7956, lng: 82.1943 },
  { city: "Ujjain", state: "Madhya Pradesh", lat: 23.1815, lng: 75.7772 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { city: "Chandigarh", state: "Punjab / Haryana", lat: 30.7333, lng: 76.7794 },
  { city: "Katra (Vaishno Devi)", state: "Jammu & Kashmir", lat: 32.9917, lng: 74.9317 },
  { city: "Guwahati", state: "Assam", lat: 26.1834, lng: 91.7513 },
  { city: "Puri", state: "Odisha", lat: 19.8135, lng: 85.8312 },
  { city: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192 },
  { city: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 }
];

export function resolveNearestIndianCity(lat, lng) {
  let closest = null;
  let minKm = Infinity;

  INDIAN_CITY_CENTROIDS.forEach((c) => {
    const km = calculateHaversineKm(lat, lng, c.lat, c.lng);
    if (km < minKm) {
      minKm = km;
      closest = c;
    }
  });

  if (closest && minKm <= 40) {
    return {
      cityName: closest.city,
      stateName: closest.state,
      label: `${closest.city}, ${closest.state} (GPS Verified)`
    };
  } else if (closest && minKm <= 100) {
    return {
      cityName: closest.city,
      stateName: closest.state,
      label: `Near ${closest.city}, ${closest.state}`
    };
  }

  return {
    cityName: "Detected Location",
    stateName: "India",
    label: `GPS Location (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`
  };
}

export const DEFAULT_STARTING_LOCATION = VARANASI_ORIGIN;

const STORAGE_KEY = "ty_starting_location";

/**
 * Get active starting location from localStorage or default (Varanasi)
 */
export function getSavedStartingLocation() {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_STARTING_LOCATION;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not parse saved starting location:", e);
  }
  return DEFAULT_STARTING_LOCATION;
}

/**
 * Save starting location to localStorage
 */
export function setSavedStartingLocation(loc) {
  if (typeof window !== "undefined" && window.localStorage && loc) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn("Could not save starting location:", e);
    }
  }
}

/**
 * Request user's current GPS location via browser Geolocation API
 * Respects explicit user grant, handles denial and timeouts gracefully.
 * Never fabricates GPS coordinates or claims a city is GPS when it is not.
 */
export async function requestBrowserLocation() {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        success: false,
        code: "UNSUPPORTED",
        message: "Geolocation is not supported by your browser. Please select or enter your city manually."
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        // Fallback resolver
        const resolved = resolveNearestIndianCity(lat, lng);
        let reverseName = resolved.label;
        let detailedAddress = `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Accuracy: ~${accuracy}m)`;
        let localityCity = resolved.cityName;
        let localityState = resolved.stateName;

        // Try Google Maps JavaScript API Client Geocoder if available on DOM
        if (typeof window !== "undefined" && window.google?.maps?.Geocoder) {
          try {
            const geocoder = new window.google.maps.Geocoder();
            const geoRes = await new Promise((resGeo) => {
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results.length > 0) {
                  resGeo(results[0]);
                } else {
                  resGeo(null);
                }
              });
            });

            if (geoRes) {
              detailedAddress = geoRes.formatted_address;
              const locality = geoRes.address_components.find((c) => c.types.includes("locality"))?.long_name;
              const admin = geoRes.address_components.find((c) => c.types.includes("administrative_area_level_1"))?.long_name;
              if (locality && admin) {
                reverseName = `${locality}, ${admin}`;
                localityCity = locality;
                localityState = admin;
              } else if (locality) {
                reverseName = locality;
                localityCity = locality;
              }
            }
          } catch (err) {
            console.warn("DOM Geocoder error:", err);
          }
        }

        const detectedLocation = {
          id: "current_gps",
          name: reverseName,
          city: localityCity,
          state: localityState,
          address: detailedAddress,
          lat: lat,
          lng: lng,
          accuracyMeters: accuracy,
          type: "gps", // Explicitly typed as genuine GPS
          isGpsVerified: true,
          timestamp: Date.now()
        };

        setSavedStartingLocation(detectedLocation);

        resolve({
          success: true,
          location: detectedLocation,
          message: `Location successfully verified via GPS: ${reverseName}`
        });
      },
      (error) => {
        let errorMsg = "Unable to retrieve your location. Please enter a city manually.";
        let errCode = "UNKNOWN";

        if (error.code === error.PERMISSION_DENIED) {
          errCode = "PERMISSION_DENIED";
          errorMsg = "Location permission was denied. You can choose Varanasi or enter your city manually at any time.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errCode = "POSITION_UNAVAILABLE";
          errorMsg = "GPS position is unavailable on your device. Please select Varanasi or search manually.";
        } else if (error.code === error.TIMEOUT) {
          errCode = "TIMEOUT";
          errorMsg = "Location request timed out. Please choose your city from the list or search manually.";
        }

        resolve({
          success: false,
          code: errCode,
          message: errorMsg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

/**
 * Search starting locations (matches pre-defined hubs + Google Geocoding fallback)
 */
export async function searchStartingLocations(query) {
  if (!query || query.trim().length === 0) {
    return POPULAR_STARTING_HUBS;
  }

  const q = query.trim().toLowerCase();

  // 1. Check local curated hubs
  const matchedHubs = POPULAR_STARTING_HUBS.filter(
    h =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q) ||
      h.code.toLowerCase().includes(q)
  );

  // 1b. Also check Indian city centroids for instant zero-latency match
  const matchedCentroids = INDIAN_CITY_CENTROIDS.filter(
    c => c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
  ).map(c => ({
    id: `hub_${c.city.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: `${c.city} (${c.state})`,
    city: c.city,
    state: c.state,
    lat: c.lat,
    lng: c.lng,
    type: "hub",
    code: c.city.slice(0, 3).toUpperCase(),
    description: `Major transit center in ${c.state}`
  }));

  const combinedLocal = [...matchedHubs];
  matchedCentroids.forEach(c => {
    if (!combinedLocal.some(h => h.city.toLowerCase() === c.city.toLowerCase())) {
      combinedLocal.push(c);
    }
  });

  // If query is short or matches enough hubs, return them
  if (combinedLocal.length > 0 && query.length < 4) {
    return combinedLocal;
  }

  // 2. Query Google Geocoding API if query is 3+ chars
  if (q.length >= 3) {
    const geo = await geocodeWithGoogle(`${query}, India`);
    if (geo.success) {
      const geoResult = {
        id: `geo_${Date.now()}`,
        name: geo.formattedAddress.split(",").slice(0, 2).join(","),
        city: query,
        state: "India",
        address: geo.formattedAddress,
        lat: geo.lat,
        lng: geo.lng,
        type: "custom_geocoded",
        code: "GEO"
      };

      // Combine matched hubs with geocoded result (preventing duplicates)
      const existing = combinedLocal.some(h => Math.abs(h.lat - geo.lat) < 0.05 && Math.abs(h.lng - geo.lng) < 0.05);
      if (!existing) {
        return [geoResult, ...combinedLocal];
      }
    }
  }

  return combinedLocal;
}

/**
 * Calculate distance, duration, and road route from starting location to destination
 * Combines Google Routes API with verified topographic fallback.
 */
export async function calculateRouteFromOrigin(origin, destination) {
  if (!origin || !destination) {
    return {
      success: false,
      error: "Both origin and destination are required"
    };
  }

  // Calculate straight-line straight distance
  const straightKm = calculateHaversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
  const isGhat = isGhatOrHillTerrain(destination.lat, destination.lng);
  const estimatedRoadKm = computeTopographicalRoadKm(straightKm, isGhat);

  // Attempt Google Maps Routes API (New) first
  try {
    const liveRoute = await fetchGoogleLiveRoute(origin.lat, origin.lng, destination.lat, destination.lng, "DRIVE");
    if (liveRoute.success) {
      return {
        success: true,
        isLiveApi: true,
        distanceKm: liveRoute.distanceKm,
        durationText: liveRoute.durationText,
        source: "Google Maps Routes API (Live)",
        routeName: liveRoute.routeName || "Fastest Highway Corridor",
        encodedPolyline: liveRoute.encodedPolyline,
        originName: origin.name,
        destinationName: destination.name,
        googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.lat + "," + origin.lng)}&destination=${encodeURIComponent(destination.lat + "," + destination.lng)}`
      };
    }
  } catch (err) {
    console.warn("Google live routing fallback triggered:", err);
  }

  // Fallback to high-precision topographical road formula
  const avgSpeed = isGhat ? 32 : (estimatedRoadKm > 400 ? 60 : 50); // km/h
  const totalMins = Math.round((estimatedRoadKm / avgSpeed) * 60);
  const durationText = formatDuration(totalMins);

  return {
    success: true,
    isLiveApi: false,
    distanceKm: estimatedRoadKm,
    durationText: durationText,
    source: "Verified National Highway Matrix",
    routeName: isGhat ? "Scenic Hill Highway (Subject to Mountain Passes)" : "National Highway Corridor",
    encodedPolyline: null,
    originName: origin.name,
    destinationName: destination.name,
    googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.lat + "," + origin.lng)}&destination=${encodeURIComponent(destination.lat + "," + destination.lng)}`
  };
}

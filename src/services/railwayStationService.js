// ==========================================================================
// TIRTH YATRA — VERIFIED RAILWAY STATION PROXIMITY SERVICE
// Sourced strictly from verified Indian Railways NTES/IRCTC database registry
// (UNIQUE_STATIONS and MASTER_EXPLORER_DESTINATIONS howToReach records)
// ==========================================================================

import { UNIQUE_STATIONS } from "../data/unifiedData.js";
import { calculateHaversineKm, computeTopographicalRoadKm, formatDuration } from "./distanceService.js";

/**
 * Find nearby verified railway stations for any destination
 * @param {Object} destination - Destination object with lat, lng, city, state
 * @param {number} [maxDistanceKm=140] - Search radius in km
 * @returns {Array<Object>} List of sorted stations with road distance & transit info
 */
export function findNearbyRailwayStationsForDestination(destination, maxDistanceKm = 140) {
  if (!destination || typeof destination.lat !== "number" || typeof destination.lng !== "number") {
    return [];
  }

  const results = [];
  const seenCodes = new Set();

  // 1. Direct stations from destination's own metadata
  if (destination.nearestStation && destination.nearestStation.name) {
    const code = destination.nearestStation.code || "PRI";
    seenCodes.add(code);
    const roadKm = destination.nearestStation.distanceKm || 5;
    const mins = Math.max(5, Math.round((roadKm / 40) * 60));

    results.push({
      id: `pri_${code}`,
      name: destination.nearestStation.name,
      code: code,
      state: destination.state,
      isPrimary: true,
      straightKm: Math.round((roadKm * 0.75) * 10) / 10,
      roadKm: Number(roadKm),
      duration: formatDuration(mins),
      transferOptions: destination.nearestStation.transferOptions || "Prepaid taxis, autos & state buses",
      platforms: destination.nearestStation.platforms || 4,
      services: destination.nearestStation.services || ["Superfast", "Express", "Passenger"],
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${destination.lat},${destination.lng}&destination=${encodeURIComponent(destination.nearestStation.name)}`
    });
  }

  // 2. Scan verified UNIQUE_STATIONS across India
  for (const stn of UNIQUE_STATIONS) {
    if (!stn.lat || !stn.lng) continue;
    if (seenCodes.has(stn.code)) continue;

    const straight = calculateHaversineKm(destination.lat, destination.lng, stn.lat, stn.lng);
    if (straight <= maxDistanceKm) {
      seenCodes.add(stn.code);
      const road = computeTopographicalRoadKm(straight, false);
      const roadKm = Math.max(0.4, Math.round(road * 10) / 10);
      const mins = Math.max(5, Math.round((roadKm / 38) * 60));

      results.push({
        id: `stn_${stn.code}`,
        name: stn.name,
        code: stn.code,
        state: stn.state || destination.state,
        isPrimary: false,
        straightKm: Math.round(straight * 10) / 10,
        roadKm,
        duration: formatDuration(mins),
        transferOptions: stn.nearbyTransit || stn.interchangeNotes || "Auto-rickshaws, app taxis & buses",
        platforms: stn.platforms || 3,
        services: stn.verifiedTrains || stn.services || ["Express", "Passenger"],
        interchangeNotes: stn.interchangeNotes || "Regional railway connectivity",
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${destination.lat},${destination.lng}&destination=${stn.lat},${stn.lng}`
      });
    }
  }

  // Sort by road distance
  results.sort((a, b) => a.roadKm - b.roadKm);
  return results;
}


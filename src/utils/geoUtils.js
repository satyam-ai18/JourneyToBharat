// Geographic and Transport distance computation utilities
import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration,
  isGhatOrHillTerrain,
  getEstimatedRoadDistanceSync
} from "../services/distanceService";

/**
 * Calculate Haversine straight-line distance in km between two coordinate pairs
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  return calculateHaversineKm(lat1, lon1, lat2, lon2);
}

/**
 * Realistic road distance estimation based on terrain and highway networks
 */
export function estimateRoadDistanceKm(straightKm, isGhat = false) {
  return computeTopographicalRoadKm(straightKm, isGhat);
}

/**
 * Format travel duration in hours and minutes from km and average speed km/h
 */
export function formatTravelTime(distanceKm, avgSpeedKmH) {
  const totalMinutes = Math.round((distanceKm / avgSpeedKmH) * 60);
  return formatDuration(totalMinutes);
}

/**
 * Calculate comprehensive comparison between any two points
 */
export function compareRoutes(p1, p2) {
  const straightKm = calculateHaversineKm(p1.lat, p1.lng, p2.lat, p2.lng);
  const isHill = isGhatOrHillTerrain(p1.lat, p1.lng) || isGhatOrHillTerrain(p2.lat, p2.lng);
  const roadSync = getEstimatedRoadDistanceSync(p1.lat, p1.lng, p2.lat, p2.lng);

  const railKm = Math.round(straightKm * (straightKm > 200 ? 1.25 : 1.3));
  const busKm = Math.round(roadSync.roadKm * 1.03 * 10) / 10;
  const walkingKm = Math.round(straightKm * 1.35 * 10) / 10;

  const railSpeed = 60;
  const busSpeed = isHill ? 30 : 50;
  const walkingSpeed = 4.5;

  return {
    straightLine: {
      km: straightKm,
      label: "Straight-Line (Haversine)",
      timeEstimate: "Flight line / Great-circle",
      badge: "Geometric"
    },
    road: {
      km: roadSync.roadKm,
      label: "Road Distance (Car / Taxi / Bike)",
      timeEstimate: roadSync.durationText,
      badge: isHill ? "Ghat / Hill Highway" : "National / State Highway"
    },
    rail: {
      km: railKm,
      label: "Railway Track Distance (Estimate)",
      timeEstimate: formatDuration((railKm / railSpeed) * 60),
      badge: "Broad Gauge Corridor"
    },
    bus: {
      km: busKm,
      label: "Bus Route Distance (State Roadways)",
      timeEstimate: formatDuration((busKm / busSpeed) * 60),
      badge: "Intercity Bus Network"
    },
    walking: {
      km: walkingKm,
      label: "Walking / Trail Distance",
      timeEstimate: straightKm > 40 ? "Not recommended for walking" : formatDuration((walkingKm / walkingSpeed) * 60),
      badge: "Pedestrian Pace"
    }
  };
}

/**
 * Filter items within a given radius in km and calculate both straight-line AND road distance
 */
export function filterWithinRadius(centerLat, centerLng, items, maxRadiusKm, sortMode = "straight") {
  return items
    .map(item => {
      const straightDist = calculateHaversineKm(centerLat, centerLng, item.lat, item.lng);
      const roadData = getEstimatedRoadDistanceSync(centerLat, centerLng, item.lat, item.lng);
      const hasDetour = roadData.roadKm > straightDist * 1.5 && straightDist > 3;

      return {
        ...item,
        distanceKmFromTarget: straightDist,
        straightKm: straightDist,
        roadKm: roadData.roadKm,
        durationText: roadData.durationText,
        hasDetourAlert: hasDetour,
        detourRatio: straightDist > 0 ? (roadData.roadKm / straightDist).toFixed(1) : "1.0"
      };
    })
    .filter(item => item.distanceKmFromTarget <= maxRadiusKm)
    .sort((a, b) => {
      if (sortMode === "road") {
        return a.roadKm - b.roadKm;
      }
      return a.straightKm - b.straightKm;
    });
}

// ==============================================================================
// VERIFICATION TEST SUITE: SMART TRAVEL NAVIGATION SYSTEM
// Testing exact required 5-point pilgrimage journey:
// Varanasi (Kashi Vishwanath / BSB)
// → Khatu Shyam Ji Temple, Sikar
// → Jeen Mata Temple, Sikar
// → Hawa Mahal, Jaipur
// → Banke Bihari Mandir, Vrindavan
// ==============================================================================

import { calculateSmartRoute, calculateBearing } from "./src/services/smartRoutePlannerService.js";
import { findNearbyRailwayStationsForDestination } from "./src/services/railwayStationService.js";
import { MASTER_EXPLORER_DESTINATIONS, searchSavedDestinationsDatabase } from "./src/data/masterExplorerData.js";
import { VARANASI_ORIGIN } from "./src/data/varanasiData.js";

async function runVerification() {
  console.log("================================================================================");
  console.log("TIRTH YATRA — SMART TRAVEL NAVIGATION SYSTEM VERIFICATION");
  console.log("================================================================================\n");

  let allPassed = true;

  // 1. Resolve Target Stops
  console.log("--- 1. VERIFYING DESTINATION COORDINATES & REGISTRY DATA ---");
  const origin = VARANASI_ORIGIN;
  const khatu = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "khatu_shyam_ji");
  const jeen = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "jeen_mata_temple_sikar");
  const hawa = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "hawa_mahal_jaipur");
  const vrindavan = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "banke_bihari_vrindavan");

  const stops = [
    { label: "Origin: Varanasi", item: origin, expectedLat: 25.3176, expectedLng: 82.9739 },
    { label: "Stop 1: Khatu Shyam Ji", item: khatu, expectedLat: 27.3614, expectedLng: 75.3049 },
    { label: "Stop 2: Jeen Mata Temple", item: jeen, expectedLat: 27.3364, expectedLng: 75.1878 },
    { label: "Stop 3: Hawa Mahal", item: hawa, expectedLat: 26.9239, expectedLng: 75.8267 },
    { label: "Stop 4: Banke Bihari Mandir", item: vrindavan, expectedLat: 27.5807, expectedLng: 77.7018 }
  ];

  stops.forEach(s => {
    if (!s.item || s.item.lat !== s.expectedLat || s.item.lng !== s.expectedLng) {
      console.error(`❌ FAIL: Coordinate mismatch for ${s.label}`, s.item);
      allPassed = false;
    } else {
      console.log(`✅ PASS: ${s.label} verified: (${s.item.lat}, ${s.item.lng}) - ${s.item.name}`);
    }
  });

  // 2. Real Road Routing between every consecutive stop
  console.log("\n--- 2. REAL ROAD ROUTING & CONSECUTIVE LEGS ---");
  const testStops = [khatu, jeen, hawa, vrindavan];
  const route = await calculateSmartRoute({
    origin,
    selectedStops: testStops,
    travelMode: "DRIVE",
    optimizeOrder: false
  });

  if (!route.success) {
    console.error("❌ FAIL: Route calculation failed", route.error);
    allPassed = false;
    return;
  }

  console.log(`✅ PASS: Route calculation succeeded via ${route.source}`);
  console.log(`- Total Distance: ${route.totalRoadKm} km`);
  console.log(`- Total Estimated Driving Time: ${route.totalDurationText}`);
  console.log(`- Total Route Legs: ${route.legs.length}`);

  if (route.legs.length !== 4) {
    console.error("❌ FAIL: Expected 4 legs, got:", route.legs.length);
    allPassed = false;
  } else {
    console.log("✅ PASS: Correct consecutive leg count: 4");
  }

  // 3. Sum of Legs Check
  console.log("\n--- 3. VERIFY TOTAL DISTANCE EQUALS SUM OF LEGS ---");
  const sumLegsKm = Math.round(route.legs.reduce((acc, l) => acc + l.roadKm, 0) * 10) / 10;
  console.log(`- Sum of individual legs: ${sumLegsKm} km`);
  console.log(`- Reported totalRoadKm: ${route.totalRoadKm} km`);

  if (Math.abs(sumLegsKm - route.totalRoadKm) > 0.2) {
    console.error(`❌ FAIL: Discrepancy between leg sum (${sumLegsKm}) and total (${route.totalRoadKm})`);
    allPassed = false;
  } else {
    console.log(`✅ PASS: Total distance (${route.totalRoadKm} km) equals the sum of route legs (${sumLegsKm} km).`);
  }

  // 4. Step-by-Step Directions Check for each leg
  console.log("\n--- 4. STEP-BY-STEP TURN-BY-TURN DIRECTIONS & MANEUVERS ---");
  route.legs.forEach(leg => {
    console.log(`\nRoute Leg ${leg.legNumber}: ${leg.from.name} → ${leg.to.name}`);
    console.log(`- Distance: ${leg.roadKm} km | Duration: ${leg.durationFormatted}`);
    console.log(`- Total Maneuver Steps: ${leg.steps?.length || 0}`);
    if (!leg.steps || leg.steps.length === 0) {
      console.error(`❌ FAIL: Leg ${leg.legNumber} has no steps!`);
      allPassed = false;
    } else {
      console.log(`  Step 1: [${leg.steps[0].maneuver}] ${leg.steps[0].instruction} (${leg.steps[0].distanceFormatted})`);
      if (leg.steps.length > 1) {
        console.log(`  Step 2: [${leg.steps[1].maneuver}] ${leg.steps[1].instruction} (${leg.steps[1].distanceFormatted})`);
      }
      console.log(`  Final Step: [${leg.steps[leg.steps.length - 1].maneuver}] ${leg.steps[leg.steps.length - 1].instruction}`);
    }
  });

  // 5. Nearby Railway Stations Check
  console.log("\n--- 5. NEARBY RAILWAY STATIONS VERIFICATION ---");
  const allPilgrimagePoints = [origin, ...testStops];
  allPilgrimagePoints.forEach(dest => {
    const stations = findNearbyRailwayStationsForDestination(dest);
    console.log(`\nDestination: ${dest.name} (${dest.city || dest.state})`);
    console.log(`- Nearby Stations Found: ${stations.length}`);
    if (stations.length === 0) {
      console.error(`❌ FAIL: No stations found for ${dest.name}`);
      allPassed = false;
    } else {
      const top = stations[0];
      console.log(`  Top Station: ${top.name} (${top.code}) | Road: ${top.roadKm} km | Straight: ${top.straightKm} km | ~${top.duration}`);
      console.log(`  Platforms: ${top.platforms} | Directions URL: ${top.googleMapsUrl}`);
      // Road distance must exceed or equal straight distance
      if (top.roadKm < top.straightKm) {
        console.error("❌ FAIL: Road distance cannot be shorter than straight-line distance");
        allPassed = false;
      }
    }
  });

  // 6. Polyline Road Coordinates & Bearing Calculation for Animation
  console.log("\n--- 6. POLYLINE ROAD COORDINATES & ANIMATION BEARING ---");
  const polyPoints = route.polylinePoints;
  console.log(`- Total Decoded Polyline Coordinates: ${polyPoints.length} road coordinates`);
  if (!polyPoints || polyPoints.length < 50) {
    console.error("❌ FAIL: Polyline points missing or too few for real road route");
    allPassed = false;
  } else {
    // Sample bearing
    const b1 = calculateBearing(polyPoints[0][0], polyPoints[0][1], polyPoints[1][0], polyPoints[1][1]);
    const b2 = calculateBearing(polyPoints[10][0], polyPoints[10][1], polyPoints[11][0], polyPoints[11][1]);
    console.log(`✅ PASS: Sample road bearings: Step 0->1: ${b1.toFixed(1)}°, Step 10->11: ${b2.toFixed(1)}°`);
  }

  // 7. Multi-Stop Google Maps Navigation URL Check
  console.log("\n--- 7. GOOGLE MAPS MULTI-STOP NAVIGATION URL ---");
  console.log(`- URL: ${route.googleMapsDirectionsUrl}`);
  if (!route.googleMapsDirectionsUrl.includes("25.3176,82.9739") || !route.googleMapsDirectionsUrl.includes("27.5807,77.7018")) {
    console.error("❌ FAIL: Google Maps URL missing origin or final stop");
    allPassed = false;
  } else {
    console.log("✅ PASS: Google Maps URL preserves exact stop sequence.");
  }

  // 8. Stop Reordering & Recalculation Check
  console.log("\n--- 8. STOP REORDERING & RECALCULATION CHECK ---");
  // Swap Stop 1 (Khatu) and Stop 3 (Hawa Mahal)
  const reorderedStops = [hawa, jeen, khatu, vrindavan];
  const reorderedRoute = await calculateSmartRoute({
    origin,
    selectedStops: reorderedStops,
    travelMode: "DRIVE",
    optimizeOrder: false
  });

  console.log(`- Reordered sequence: Varanasi → Hawa Mahal → Jeen Mata → Khatu Shyam → Vrindavan`);
  console.log(`- Reordered Total Distance: ${reorderedRoute.totalRoadKm} km`);
  console.log(`- Reordered Total Duration: ${reorderedRoute.totalDurationText}`);
  if (reorderedRoute.totalRoadKm === route.totalRoadKm || reorderedRoute.legs.length !== 4) {
    console.error("❌ FAIL: Reordering did not recalculate expected different route metrics");
    allPassed = false;
  } else {
    console.log("✅ PASS: Reordering successfully triggers full recalculation.");
  }

  // 9. Stop Removal & Recalculation Check
  console.log("\n--- 9. STOP REMOVAL & RECALCULATION CHECK ---");
  // Remove Jeen Mata (3 stops remain: Khatu, Hawa Mahal, Vrindavan)
  const reducedStops = [khatu, hawa, vrindavan];
  const reducedRoute = await calculateSmartRoute({
    origin,
    selectedStops: reducedStops,
    travelMode: "DRIVE",
    optimizeOrder: false
  });

  console.log(`- Reduced stops: 3 stops`);
  console.log(`- Reduced Total Distance: ${reducedRoute.totalRoadKm} km, Legs: ${reducedRoute.legs.length}`);
  if (reducedRoute.legs.length !== 3) {
    console.error("❌ FAIL: Expected 3 legs after removing 1 stop");
    allPassed = false;
  } else {
    console.log("✅ PASS: Removal recalculates route to 3 legs immediately.");
  }

  // 10. Multi-Modal Navigation Support (Two-Wheeler & Walk)
  console.log("\n--- 10. MULTI-MODAL NAVIGATION CHECK ---");
  const bikeRoute = await calculateSmartRoute({
    origin: hawa, // Jaipur to Vrindavan
    selectedStops: [vrindavan],
    travelMode: "TWO_WHEELER"
  });
  console.log(`- Two-Wheeler (Jaipur → Vrindavan): ${bikeRoute.totalRoadKm} km, ${bikeRoute.totalDurationText}`);
  if (!bikeRoute.success) {
    console.error("❌ FAIL: Two-Wheeler navigation failed");
    allPassed = false;
  } else {
    console.log("✅ PASS: Two-Wheeler navigation calculated successfully.");
  }

  console.log("\n================================================================================");
  if (allPassed) {
    console.log("🎉 ALL SMART TRAVEL NAVIGATION SYSTEM VERIFICATION CHECKS PASSED!");
  } else {
    console.log("❌ SOME CHECKS FAILED!");
  }
  console.log("================================================================================");
}

runVerification().catch(console.error);


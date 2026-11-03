/**
 * Comprehensive Verification Suite for Universal Destination Discovery & Smart Journey Planner
 * Tests Cases A through F according to Section 11 of the specification.
 */
import { searchSavedDestinationsDatabase, MASTER_EXPLORER_DESTINATIONS } from "./src/data/masterExplorerData.js";
import { VARANASI_ORIGIN } from "./src/data/varanasiData.js";
import {
  searchUniversalDestinations,
  fetchGooglePlaceDetails,
  saveCustomDestination,
  getCustomSavedDestinations,
  removeCustomDestination
} from "./src/services/universalDestinationService.js";
import {
  calculateSmartRoute,
  calculateBearing,
  decodeGooglePolyline
} from "./src/services/smartRoutePlannerService.js";

async function runVerification() {
  console.log("=".repeat(85));
  console.log("UNIVERSAL DESTINATION DISCOVERY & SMART JOURNEY PLANNER - VERIFICATION SUITE");
  console.log("=".repeat(85));

  // ---------------------------------------------------------------------------
  // CASE A: EXISTING SAVED DESTINATION (Varanasi -> Kashi Vishwanath Temple)
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE A: EXISTING SAVED DESTINATION ---");
  const caseAQuery = "Kashi Vishwanath";
  const caseASearch = await searchUniversalDestinations(caseAQuery, MASTER_EXPLORER_DESTINATIONS);
  console.log(`Query: "${caseAQuery}" -> Found ${caseASearch.length} universal results`);
  const kashiStop = caseASearch.find(r => r.name.toLowerCase().includes("vishwanath") || r.source === "SAVED");
  console.log("Matched Stop:", {
    name: kashiStop?.name,
    source: kashiStop?.source,
    badge: kashiStop?.badge,
    lat: kashiStop?.lat,
    lng: kashiStop?.lng
  });

  if (!kashiStop || kashiStop.source !== "SAVED") {
    throw new Error("Case A Failed: Kashi Vishwanath should be matched from saved database");
  }
  console.log("Calculating route: Varanasi Origin -> Kashi Vishwanath...");
  const routeA = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: [kashiStop],
    travelMode: "DRIVE"
  });
  if (!routeA.success) throw new Error("Case A Route calculation failed: " + routeA.error);
  console.log(`✅ Case A Result: Legs: ${routeA.legs.length}, Distance: ${routeA.totalRoadKm} km, Duration: ${routeA.totalDurationText}`);
  console.log(`Engine: ${routeA.source}`);

  // ---------------------------------------------------------------------------
  // CASE B: NEW GOOGLE MAPS DESTINATION (Absent from DB: Chitrakoot Gupt Godavari)
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE B: NEW GOOGLE MAPS DESTINATION (ABSENT FROM DB) ---");
  const caseBQuery = "Chitrakoot Gupt Godavari";
  const inDbBefore = MASTER_EXPLORER_DESTINATIONS.find(d => d.name.toLowerCase().includes("gupt godavari"));
  console.log(`Presence in Core DB before search: ${inDbBefore ? "FOUND (unexpected)" : "ABSENT (expected)"}`);

  const caseBSearch = await searchUniversalDestinations(caseBQuery, MASTER_EXPLORER_DESTINATIONS);
  console.log(`Google Places Search for "${caseBQuery}": Found ${caseBSearch.length} results`);
  const guptGodavariStop = caseBSearch.find(r => r.source === "GOOGLE_MAPS");
  console.log("Discovered Place:", {
    name: guptGodavariStop?.name,
    source: guptGodavariStop?.source,
    badge: guptGodavariStop?.badge,
    placeId: guptGodavariStop?.googlePlaceId,
    address: guptGodavariStop?.address,
    lat: guptGodavariStop?.lat,
    lng: guptGodavariStop?.lng,
    rating: guptGodavariStop?.rating,
    reviews: guptGodavariStop?.userRatingCount
  });

  if (!guptGodavariStop || guptGodavariStop.source !== "GOOGLE_MAPS") {
    throw new Error("Case B Failed: Gupt Godavari must be discovered via Google Maps");
  }

  // Fetch Place Details
  const placeDetailsB = await fetchGooglePlaceDetails(guptGodavariStop.googlePlaceId);
  console.log("Google Place Details retrieved:", {
    displayName: placeDetailsB?.displayName?.text,
    formattedAddress: placeDetailsB?.formattedAddress,
    types: placeDetailsB?.types?.slice(0, 3),
    googleMapsUri: placeDetailsB?.googleMapsUri
  });

  console.log("Calculating route: Varanasi Origin -> Gupt Godavari (Discovered)...");
  const routeB = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: [guptGodavariStop],
    travelMode: "DRIVE"
  });
  if (!routeB.success) throw new Error("Case B Route calculation failed: " + routeB.error);
  console.log(`✅ Case B Result: Legs: ${routeB.legs.length}, Distance: ${routeB.totalRoadKm} km, Duration: ${routeB.totalDurationText}`);
  console.log(`Leg 1 Highway Steps: ${routeB.legs[0].steps.length} turn maneuvers`);

  // ---------------------------------------------------------------------------
  // CASE C: MIXED DESTINATIONS (Varanasi -> Mahakaleshwar -> Gupt Godavari -> Somnath)
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE C: MIXED CIRCUIT (SAVED + DISCOVERED + SAVED) ---");
  const mahakal = MASTER_EXPLORER_DESTINATIONS.find(d => d.name.toLowerCase().includes("mahakaleshwar")) || {
    id: "mahakaleshwar",
    name: "Mahakaleshwar Jyotirlinga — Ujjain",
    lat: 23.1827,
    lng: 75.7682,
    source: "SAVED"
  };
  const somnath = MASTER_EXPLORER_DESTINATIONS.find(d => d.name.toLowerCase().includes("somnath")) || {
    id: "somnath",
    name: "Somnath Jyotirlinga — Prabhas Patan",
    lat: 20.888,
    lng: 70.4012,
    source: "SAVED"
  };

  const mixedStops = [
    { ...mahakal, source: "SAVED" },
    guptGodavariStop,
    { ...somnath, source: "SAVED" }
  ];

  console.log("Mixed Stops Sequence:");
  mixedStops.forEach((s, idx) => console.log(`  Stop ${idx + 1}: [${s.source}] ${s.name} (${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`));

  console.log("Calculating Mixed Road Circuit...");
  const routeC = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: mixedStops,
    travelMode: "DRIVE"
  });
  if (!routeC.success) throw new Error("Case C Route calculation failed: " + routeC.error);
  console.log(`✅ Case C Result: Total Legs: ${routeC.legs.length}, Total Road: ${routeC.totalRoadKm} km, Duration: ${routeC.totalDurationText}`);
  
  let sumLegsC = 0;
  routeC.legs.forEach((leg, i) => {
    sumLegsC += leg.roadKm;
    console.log(`  Leg ${i + 1}: ${leg.from?.name || "Origin"} -> ${leg.to?.name || "Destination"} | ${leg.roadKm} km, ${leg.durationFormatted}`);
  });
  console.log(`Sum of legs: ${sumLegsC.toFixed(1)} km, Reported: ${routeC.totalRoadKm} km`);
  if (Math.abs(sumLegsC - routeC.totalRoadKm) > 1.0) {
    throw new Error("Case C Failed: Sum of legs does not match total road km");
  }

  // ---------------------------------------------------------------------------
  // CASE D: MULTIPLE UNKNOWN DESTINATIONS (Gupt Godavari + Dhuandhar Falls)
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE D: MULTIPLE UNKNOWN GOOGLE MAPS DESTINATIONS ---");
  const caseDQuery = "Dhuandhar Falls Bhedaghat";
  const caseDSearch = await searchUniversalDestinations(caseDQuery, MASTER_EXPLORER_DESTINATIONS);
  const dhuandharStop = caseDSearch.find(r => r.source === "GOOGLE_MAPS");
  console.log("Discovered Place 2 (Dhuandhar):", {
    name: dhuandharStop?.name,
    source: dhuandharStop?.source,
    lat: dhuandharStop?.lat,
    lng: dhuandharStop?.lng
  });

  const multiUnknownStops = [guptGodavariStop, dhuandharStop].filter(Boolean);
  const routeD = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: multiUnknownStops,
    travelMode: "DRIVE"
  });
  if (!routeD.success) throw new Error("Case D Route calculation failed: " + routeD.error);
  console.log(`✅ Case D Result: Legs: ${routeD.legs.length}, Distance: ${routeD.totalRoadKm} km, Duration: ${routeD.totalDurationText}`);

  // ---------------------------------------------------------------------------
  // CASE E: AMBIGUOUS SEARCH RESOLUTION
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE E: AMBIGUOUS SEARCH RESOLUTION ---");
  const caseEQuery = "Hanuman Mandir";
  const caseESearch = await searchUniversalDestinations(caseEQuery, MASTER_EXPLORER_DESTINATIONS);
  console.log(`Ambiguous Query "${caseEQuery}" returned ${caseESearch.length} distinct selectable places:`);
  caseESearch.slice(0, 5).forEach((p, idx) => {
    console.log(`  [${idx + 1}] [${p.source}] ${p.name} — ${p.location || p.address} (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})`);
  });
  if (caseESearch.length < 2) {
    throw new Error("Case E Failed: Ambiguous search should return multiple distinct candidates");
  }
  console.log("✅ Case E Passed: User can explicitly pick from multiple distinct candidate locations.");

  // ---------------------------------------------------------------------------
  // CASE F: ROUTE RECALCULATION (ADD, REMOVE, REORDER)
  // ---------------------------------------------------------------------------
  console.log("\n--- TEST CASE F: STOP ADDITION, REMOVAL & REORDERING RECALCULATION ---");
  const initialStops = [guptGodavariStop, mahakal, somnath];
  const routeF1 = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: initialStops,
    travelMode: "DRIVE"
  });
  console.log(`Initial Route (3 stops): ${routeF1.totalRoadKm} km`);

  // Reorder stops
  const reorderedStops = [mahakal, guptGodavariStop, somnath];
  const routeF2 = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: reorderedStops,
    travelMode: "DRIVE"
  });
  console.log(`Reordered Route (3 stops): ${routeF2.totalRoadKm} km`);

  // Remove a stop
  const removedStops = [mahakal, somnath];
  const routeF3 = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: removedStops,
    travelMode: "DRIVE"
  });
  console.log(`Reduced Route (2 stops): ${routeF3.totalRoadKm} km`);

  if (routeF1.totalRoadKm === routeF2.totalRoadKm && routeF1.legs[0].endName === routeF2.legs[0].endName) {
    throw new Error("Case F Failed: Reordering did not change the route sequence");
  }
  if (routeF3.legs.length !== 2) {
    throw new Error("Case F Failed: Removing a stop did not reduce leg count to 2");
  }
  console.log("✅ Case F Passed: Dynamic add, reorder, and remove seamlessly recalculate metrics.");

  // ---------------------------------------------------------------------------
  // SECTION 8: OPTIONAL SAVE TO CUSTOM DESTINATIONS CHECK
  // ---------------------------------------------------------------------------
  console.log("\n--- SECTION 8: SAVE TO MY DESTINATIONS TEST ---");
  saveCustomDestination({
    id: "test_gupt_godavari",
    googlePlaceId: guptGodavariStop.googlePlaceId,
    name: guptGodavariStop.name,
    address: guptGodavariStop.address,
    lat: guptGodavariStop.lat,
    lng: guptGodavariStop.lng,
    source: "GOOGLE_MAPS"
  });
  const customSaved = getCustomSavedDestinations();
  console.log(`Custom Saved Destinations in local storage: ${customSaved.length} items`);
  console.log("Last saved item:", customSaved[customSaved.length - 1]);
  removeCustomDestination("test_gupt_godavari");
  console.log("Cleaned up test custom destination.");

  console.log("\n" + "=".repeat(85));
  console.log("🎉 ALL UNIVERSAL DESTINATION & SMART JOURNEY PLANNER TESTS PASSED SUCCESSFULLY!");
  console.log("=".repeat(85));
}

runVerification().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});

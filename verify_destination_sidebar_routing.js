// ==========================================================================
// TIRTH YATRA — DESTINATION SELECTION SIDEBAR & ROUTE PLANNING VERIFICATION
// ==========================================================================

import {
  MASTER_EXPLORER_DESTINATIONS,
  searchSavedDestinationsDatabase
} from "./src/data/masterExplorerData.js";
import { VARANASI_ORIGIN } from "./src/data/varanasiData.js";
import {
  calculateSmartRoute,
  optimizeStopsSequence
} from "./src/services/smartRoutePlannerService.js";
import { DEFAULT_STARTING_LOCATION } from "./src/services/locationService.js";

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

async function runTestSuite() {
  console.log("================================================================");
  console.log("VERIFYING DESTINATION SELECTION SIDEBAR & ROUTE PLANNING SUITE");
  console.log("================================================================\n");

  // 1. Initial State & Clean Map Verification
  console.log("--- 1. INITIAL MAP EXPERIENCE & ORIGIN VERIFICATION ---");
  assert(DEFAULT_STARTING_LOCATION !== null, "Default starting location must be defined");
  assert(DEFAULT_STARTING_LOCATION.city === "Varanasi", "Default starting location city must be 'Varanasi'");
  assert(DEFAULT_STARTING_LOCATION.lat === 25.3176, "Default starting location latitude must match Varanasi (25.3176)");
  assert(DEFAULT_STARTING_LOCATION.lng === 82.9739, "Default starting location longitude must match Varanasi (82.9739)");
  assert(VARANASI_ORIGIN.city === "Varanasi", "VARANASI_ORIGIN city must be 'Varanasi'");

  // 2. Search & Suggestion Behaviour: Sourced ONLY from saved database
  console.log("\n--- 2. DESTINATION SEARCH SUGGESTIONS (SAVED DATABASE ONLY) ---");

  // Test 2a: Ujjain Search
  const ujjainResults = searchSavedDestinationsDatabase("Ujjain", MASTER_EXPLORER_DESTINATIONS);
  assert(ujjainResults.length >= 4, `Search for 'Ujjain' must return at least 4 saved places (Got: ${ujjainResults.length})`);
  const ujjainNames = ujjainResults.map(p => p.name);
  assert(ujjainNames.some(n => n.includes("Mahakaleshwar")), "Ujjain suggestions must include 'Mahakaleshwar Jyotirlinga'");
  assert(ujjainNames.some(n => n.includes("Harsiddhi")), "Ujjain suggestions must include 'Harsiddhi Mata'");
  assert(ujjainNames.some(n => n.includes("Kal Bhairav")), "Ujjain suggestions must include 'Kal Bhairav'");
  assert(ujjainNames.some(n => n.includes("Chintaman Ganesh")), "Ujjain suggestions must include 'Chintaman Ganesh'");
  
  // Verify all results belong to MASTER_EXPLORER_DESTINATIONS
  const allMasterIds = new Set(MASTER_EXPLORER_DESTINATIONS.map(d => d.id));
  const allUjjainFromDatabase = ujjainResults.every(p => allMasterIds.has(p.id));
  assert(allUjjainFromDatabase, "All Ujjain search results must strictly exist in saved database");

  // Verify fields in suggestions
  const firstUjjain = ujjainResults[0];
  assert(typeof firstUjjain.name === "string" && firstUjjain.name.length > 0, "Suggestion must have valid destination name");
  assert(typeof firstUjjain.state === "string" && firstUjjain.state.length > 0, "Suggestion must have valid state");
  assert(typeof firstUjjain.category === "string" || typeof firstUjjain.categoryLabel === "string", "Suggestion must have valid category");

  // Test 2b: Varanasi Search
  const varanasiResults = searchSavedDestinationsDatabase("Varanasi", MASTER_EXPLORER_DESTINATIONS);
  assert(varanasiResults.length >= 5, `Search for 'Varanasi' must return at least 5 saved places (Got: ${varanasiResults.length})`);
  const varanasiNames = varanasiResults.map(p => p.name);
  assert(varanasiNames.some(n => n.includes("Kashi Vishwanath")), "Varanasi suggestions must include 'Kashi Vishwanath'");
  assert(varanasiNames.some(n => n.includes("Sankat Mochan")), "Varanasi suggestions must include 'Sankat Mochan'");
  assert(varanasiNames.some(n => n.includes("Durga Kund")), "Varanasi suggestions must include 'Durga Kund'");
  assert(varanasiNames.some(n => n.includes("Assi Ghat")), "Varanasi suggestions must include 'Assi Ghat'");
  assert(varanasiNames.some(n => n.includes("Dashashwamedh Ghat")), "Varanasi suggestions must include 'Dashashwamedh Ghat'");

  // Test 2c: Alternate Spellings & Aliases
  const kashiResults = searchSavedDestinationsDatabase("Kashi", MASTER_EXPLORER_DESTINATIONS);
  assert(kashiResults.some(p => p.id === "kashi_vishwanath"), "Search for alias 'Kashi' must resolve Kashi Vishwanath");

  const avantiResults = searchSavedDestinationsDatabase("Avanti", MASTER_EXPLORER_DESTINATIONS);
  assert(avantiResults.some(p => p.id.includes("ujjain") || p.name.includes("Avanti") || p.city === "Ujjain"), "Search for alias 'Avanti' must resolve Ujjain destinations");

  // 3. Multi-Destination Selection
  console.log("\n--- 3. MULTI-DESTINATION SELECTION WORKFLOW ---");
  const mahakaleshwar = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "mahakaleshwar_ujjain");
  const kalBhairav = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "kal_bhairav_ujjain");
  const ramMandir = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === "ram_mandir_ayodhya");

  assert(Boolean(mahakaleshwar), "Mahakaleshwar Jyotirlinga exists in database");
  assert(Boolean(kalBhairav), "Kal Bhairav exists in database");
  assert(Boolean(ramMandir), "Ram Mandir exists in database");

  let selectedStops = [mahakaleshwar, kalBhairav, ramMandir];
  assert(selectedStops.length === 3, "User can select multiple destinations across different cities (Ujjain + Ayodhya)");

  // 4. Route Planning from Varanasi
  console.log("\n--- 4. ROUTE PLANNING FROM VARANASI (GOOGLE ROUTES ENGINE) ---");
  const routePlan = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: selectedStops,
    travelMode: "DRIVE",
    optimizeOrder: false
  });

  assert(routePlan.success === true, "Route calculation from Varanasi must succeed");
  assert(routePlan.origin.city === "Varanasi", "Route origin must be Varanasi");
  assert(routePlan.totalRoadKm > 1000, `Total road distance must reflect real road distance (> 1000 km, got: ${routePlan.totalRoadKm} km)`);
  assert(typeof routePlan.totalDurationText === "string", `Total travel time must be formatted (got: ${routePlan.totalDurationText})`);
  assert(routePlan.legs.length === 3, `Consecutive leg count must equal number of stops (got: ${routePlan.legs.length})`);
  
  // Leg 1: Varanasi -> Stop 1
  assert(routePlan.legs[0].from.city === "Varanasi", "Leg 1 must depart from Varanasi");
  assert(routePlan.legs[0].to.id === "mahakaleshwar_ujjain", "Leg 1 must arrive at Stop 1 (Mahakaleshwar)");
  assert(routePlan.legs[0].roadKm > 800, `Varanasi to Ujjain road distance must be realistic (> 800 km, got: ${routePlan.legs[0].roadKm} km)`);

  // Leg 2: Stop 1 -> Stop 2
  assert(routePlan.legs[1].from.id === "mahakaleshwar_ujjain", "Leg 2 must depart from Stop 1 (Mahakaleshwar)");
  assert(routePlan.legs[1].to.id === "kal_bhairav_ujjain", "Leg 2 must arrive at Stop 2 (Kal Bhairav)");
  assert(routePlan.legs[1].roadKm > 0, `Intra-city Ujjain road distance must be positive (got: ${routePlan.legs[1].roadKm} km)`);

  // Leg 3: Stop 2 -> Stop 3
  assert(routePlan.legs[2].from.id === "kal_bhairav_ujjain", "Leg 3 must depart from Stop 2 (Kal Bhairav)");
  assert(routePlan.legs[2].to.id === "ram_mandir_ayodhya", "Leg 3 must arrive at Stop 3 (Ram Mandir, Ayodhya)");
  assert(routePlan.legs[2].roadKm > 600, `Ujjain to Ayodhya road distance must be realistic (> 600 km, got: ${routePlan.legs[2].roadKm} km)`);

  // Verify polyline
  assert(Array.isArray(routePlan.polylinePoints) && routePlan.polylinePoints.length > 10, `Polyline points must be decoded road coordinates (got: ${routePlan.polylinePoints.length} points)`);

  // 5. Reorder & Removal Workflow
  console.log("\n--- 5. STOP REORDERING & REMOVAL WORKFLOW ---");
  // Swap stops 1 and 2
  const reordered = [selectedStops[1], selectedStops[0], selectedStops[2]];
  const reorderedPlan = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: reordered,
    travelMode: "DRIVE",
    optimizeOrder: false
  });
  assert(reorderedPlan.success === true, "Recalculation with reordered stops must succeed");
  assert(reorderedPlan.legs[0].to.id === "kal_bhairav_ujjain", "Leg 1 must arrive at new Stop 1 (Kal Bhairav)");

  // Remove a stop
  const removedStops = selectedStops.filter(s => s.id !== "kal_bhairav_ujjain");
  assert(removedStops.length === 2, "Removed stop from itinerary (stops left: 2)");
  const removedPlan = await calculateSmartRoute({
    origin: VARANASI_ORIGIN,
    selectedStops: removedStops,
    travelMode: "DRIVE",
    optimizeOrder: false
  });
  assert(removedPlan.success === true, "Recalculation after removing a stop must succeed");
  assert(removedPlan.legs.length === 2, "Remaining legs must equal 2");

  // Optimize sequence
  const optimized = optimizeStopsSequence(VARANASI_ORIGIN, selectedStops);
  assert(optimized.length === 3, "Optimized stops sequence must contain all stops");

  console.log("\n================================================================");
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log("================================================================");
  
  if (totalTests === passedTests) {
    console.log("🎉 ALL DESTINATION SIDEBAR & ROUTE PLANNING TESTS PASSED PERFECTLY!");
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

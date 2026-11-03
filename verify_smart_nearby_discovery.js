import { resolveDestinationQuery } from "./src/services/destinationSearchService.js";
import { discoverNearbyForDestination } from "./src/services/smartNearbyDiscoveryService.js";
import { calculateSmartRoute } from "./src/services/smartRoutePlannerService.js";
import { MASTER_EXPLORER_DESTINATIONS } from "./src/data/masterExplorerData.js";

const TARGET_DESTINATIONS = [
  {
    query: "Mahakaleshwar Temple, Ujjain",
    expectedId: "mahakaleshwar_ujjain",
    expectedCity: "Ujjain",
    expectedState: "Madhya Pradesh",
    expectedMinNearby: 4,
    expectedStationCode: "UJN"
  },
  {
    query: "Kashi Vishwanath Temple, Varanasi",
    expectedId: "kashi_vishwanath",
    expectedCity: "Varanasi",
    expectedState: "Uttar Pradesh",
    expectedMinNearby: 10,
    expectedStationCode: "BSB"
  },
  {
    query: "Kamakhya Temple, Guwahati",
    expectedId: "kamakhya_devi_guwahati",
    expectedCity: "Guwahati",
    expectedState: "Assam",
    expectedMinNearby: 3,
    expectedStationCode: "KYQ"
  },
  {
    query: "Somnath Temple, Gujarat",
    expectedId: "somnath_temple",
    expectedCity: "Prabhas Patan",
    expectedState: "Gujarat",
    expectedMinNearby: 1,
    expectedStationCode: "VRL"
  },
  {
    query: "Kedarnath Temple, Uttarakhand",
    expectedId: "kedarnath_temple",
    expectedCity: "Kedarnath",
    expectedState: "Uttarakhand",
    expectedMinNearby: 1,
    expectedStationCode: "RKSH"
  }
];

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

async function runComprehensiveVerification() {
  console.log("================================================================");
  console.log("TIRTH YATRA — SMART NEARBY PLACES & ROUTING VERIFICATION SUITE");
  console.log("================================================================\n");

  for (const target of TARGET_DESTINATIONS) {
    console.log(`--- VERIFYING TARGET: "${target.query}" ---`);

    // 1. Correct destination identification
    const searchRes = resolveDestinationQuery(target.query);
    assert(searchRes.match !== null, `Must resolve destination for "${target.query}"`);
    assert(searchRes.match?.id === target.expectedId, `Must identify ID "${target.expectedId}" (Got: ${searchRes.match?.id})`);
    assert(searchRes.match?.state === target.expectedState, `Must match state "${target.expectedState}" (Got: ${searchRes.match?.state})`);

    const center = searchRes.match;

    // 2. Nearby place discovery
    const nearbyRes = await discoverNearbyForDestination({
      center,
      radiusKm: 50,
      includeLiveGooglePlaces: false
    });

    assert(nearbyRes.success === true, `Nearby discovery must succeed for ${center.name}`);
    const totalDiscovered = nearbyRes.mySelectedPlaces.length + nearbyRes.otherNearbyPlaces.length;
    assert(totalDiscovered >= target.expectedMinNearby, `Must discover at least ${target.expectedMinNearby} nearby places (Found: ${totalDiscovered})`);

    // 3. Strict segregation of "My Selected Places"
    assert(Array.isArray(nearbyRes.mySelectedPlaces), `Must have 'mySelectedPlaces' array`);
    assert(Array.isArray(nearbyRes.otherNearbyPlaces), `Must have 'otherNearbyPlaces' array`);
    if (nearbyRes.mySelectedPlaces.length > 0) {
      assert(nearbyRes.mySelectedPlaces.every(p => p.isMySelected === true), `All items in mySelectedPlaces must be tagged isMySelected=true`);
    }

    // 4. Road distance & Travel time calculation
    const allPlaces = [...nearbyRes.mySelectedPlaces, ...nearbyRes.otherNearbyPlaces];
    if (allPlaces.length > 0) {
      const sample = allPlaces[0];
      assert(typeof sample.roadKm === "number" && sample.roadKm >= 0, `Road distance must be a valid number (Got: ${sample.roadKm} km)`);
      assert(typeof sample.straightKm === "number" && sample.straightKm >= 0, `Straight distance must be a valid number (Got: ${sample.straightKm} km)`);
      assert(Boolean(sample.durationDrive), `Travel duration must be calculated (Got: ${sample.durationDrive})`);
      assert(Boolean(sample.googleMapsDirectionsUrl), `Google Maps navigation link must be present`);
    }

    // 5. Railway station discovery
    assert(nearbyRes.railwayStations.length > 0, `Must discover nearest railway station for ${center.name}`);
    const primaryStation = nearbyRes.railwayStations[0];
    assert(primaryStation.code.includes(target.expectedStationCode) || primaryStation.name.includes(target.expectedStationCode), `Primary station must match code "${target.expectedStationCode}" (Got: ${primaryStation.code} - ${primaryStation.name})`);
    assert(typeof primaryStation.roadKm === "number", `Station road distance must be present (${primaryStation.roadKm} km)`);
    assert(Boolean(primaryStation.googleMapsDirectionsUrl), `Station navigation URL must be present`);

    // 6. Mountain road access notice for high-altitude shrines
    if (center.id === "kedarnath_temple") {
      assert(nearbyRes.mountainAccessNotice !== null, `Kedarnath must have mountain trek notice`);
      assert(nearbyRes.mountainAccessNotice.trekKm === 16, `Kedarnath trek must be noted as 16 km`);
    }

    // 7. Multi-stop route generation
    const stopsToRoute = allPlaces.slice(0, 2);
    if (stopsToRoute.length > 0) {
      const routeRes = await calculateSmartRoute({
        origin: center,
        selectedStops: stopsToRoute,
        travelMode: "DRIVE",
        optimizeOrder: true
      });

      assert(routeRes.success === true, `Route generation must succeed for ${center.name}`);
      assert(routeRes.orderedStops.length === stopsToRoute.length + 1, `Route stops count must be ${stopsToRoute.length + 1} (Got: ${routeRes.orderedStops.length})`);
      assert(routeRes.orderedStops[0].isOrigin === true, `First stop must be marked as origin`);
      assert(routeRes.totalRoadKm > 0, `Total road distance must be positive (Got: ${routeRes.totalRoadKm} km)`);
      assert(Boolean(routeRes.totalDurationText), `Total duration must be formatted (Got: ${routeRes.totalDurationText})`);
      assert(routeRes.legs.length === stopsToRoute.length, `Must have ${stopsToRoute.length} consecutive legs (Got: ${routeRes.legs.length})`);
      assert(routeRes.polylinePoints.length >= 2, `Polyline must contain coordinates (Got: ${routeRes.polylinePoints.length} points)`);
      assert(Boolean(routeRes.googleMapsDirectionsUrl), `Multi-stop Google Maps URL must be generated`);
    }

    console.log("");
  }

  // 8. Error handling & Edge cases
  console.log("--- ERROR HANDLING & EDGE CASES ---");
  const nullQueryRes = resolveDestinationQuery("");
  assert(nullQueryRes.match === null, `Empty query must return match=null`);

  const invalidQueryRes = resolveDestinationQuery("XYZ Nonexistent Place 12345");
  assert(invalidQueryRes.match === null, `Non-existent place must return match=null`);

  const ambiguousRes = resolveDestinationQuery("Vishwanath");
  assert(ambiguousRes.suggestions.length > 1, `Ambiguous query 'Vishwanath' must return multiple location suggestions`);

  const invalidRouteRes = await calculateSmartRoute({ origin: null, selectedStops: [] });
  assert(invalidRouteRes.success === false, `Route calculation with null origin must return success=false`);

  console.log("\n================================================================");
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log("================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 ALL SMART NEARBY & ROUTING TESTS PASSED PERFECTLY!");
    process.exit(0);
  } else {
    console.error("❌ SOME TESTS FAILED!");
    process.exit(1);
  }
}

runComprehensiveVerification();


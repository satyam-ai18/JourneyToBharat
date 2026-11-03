import { ALL_36_STATES_AND_UTS, ALL_28_STATES, ALL_8_UNION_TERRITORIES } from './src/data/allStatesData.js';
import { ALL_STATES_DATA } from './src/data/tirthData.js';
import {
  MASTER_EXPLORER_DESTINATIONS,
  getDestinationsByState,
  getDestinationsByCategory,
  interpretNaturalSearchQuery
} from './src/data/masterExplorerData.js';
import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration
} from './src/services/distanceService.js';

console.log('================================================================');
console.log('TIRTH YATRA — SMART INDIA EXPLORER & ROUTING VERIFICATION SUITE');
console.log('================================================================');

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
  }
}

// 1. All 28 States and 8 Union Territories Count
assert(ALL_28_STATES.length === 28, `ALL_28_STATES has exactly 28 states (Found: ${ALL_28_STATES.length})`);
assert(ALL_8_UNION_TERRITORIES.length === 8, `ALL_8_UNION_TERRITORIES has exactly 8 UTs (Found: ${ALL_8_UNION_TERRITORIES.length})`);
assert(ALL_36_STATES_AND_UTS.length === 36, `ALL_36_STATES_AND_UTS has exactly 36 administrative units (Found: ${ALL_36_STATES_AND_UTS.length})`);
assert(ALL_STATES_DATA.length === 36, `ALL_STATES_DATA re-exported in tirthData has 36 units (Found: ${ALL_STATES_DATA.length})`);

// 2. Destination Registry Coverage
assert(MASTER_EXPLORER_DESTINATIONS.length >= 100, `MASTER_EXPLORER_DESTINATIONS has at least 100 curated destinations (Found: ${MASTER_EXPLORER_DESTINATIONS.length})`);

// 3. State-wise Coverage: Verify all 36 States & UTs have at least one verified destination in registry
const coveredStateIds = new Set(MASTER_EXPLORER_DESTINATIONS.map(d => d.stateId));
const missingStates = ALL_36_STATES_AND_UTS.filter(st => !coveredStateIds.has(st.id));
assert(missingStates.length === 0, `All 36 States and UTs have destinations registered in explorer (Missing: ${missingStates.map(s => s.name).join(', ') || 'None'})`);

// 4. Coordinates, Altitudes, and Nearest Stations Integrity
let invalidCoords = 0;
let invalidStations = 0;
MASTER_EXPLORER_DESTINATIONS.forEach(d => {
  if (typeof d.lat !== 'number' || typeof d.lng !== 'number' || isNaN(d.lat) || isNaN(d.lng)) {
    invalidCoords++;
  }
  if (!d.nearestStation || !d.nearestStation.code || !d.nearestStation.name) {
    invalidStations++;
  }
});
assert(invalidCoords === 0, `All destinations have valid numeric lat/lng coordinates (Invalid: ${invalidCoords})`);
assert(invalidStations === 0, `All destinations have verified nearest station records with name and code (Invalid: ${invalidStations})`);

// 5. Trek Distinctions where applicable
const kedarnath = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === 'kedarnath_temple');
assert(kedarnath && kedarnath.trekNote && kedarnath.trekNote.includes('16 km'), `Kedarnath has explicit 16 km trek distinction from Gaurikund`);
const vaishnodevi = MASTER_EXPLORER_DESTINATIONS.find(d => d.id === 'vaishno_devi');
assert(vaishnodevi && vaishnodevi.trekNote && vaishnodevi.trekNote.includes('13 km'), `Vaishno Devi has explicit 13 km trek distinction from Katra`);

// 6. Natural Language Search Queries
// Query 1: "Show me the best places to visit in Uttarakhand."
const q1 = interpretNaturalSearchQuery("Show me the best places to visit in Uttarakhand.");
assert(q1 && q1.type === 'filter' && q1.stateId === 'uttarakhand', `NL Query 1 correctly detects state Uttarakhand`);

// Query 2: "Show temples, mountains, lakes and waterfalls in Himachal Pradesh."
const q2 = interpretNaturalSearchQuery("Show temples, mountains, lakes and waterfalls in Himachal Pradesh.");
assert(q2 && q2.type === 'filter' && q2.stateId === 'himachal_pradesh' && q2.categories.includes('mountains'), `NL Query 2 correctly detects Himachal Pradesh and category mountains`);

// Query 3: "Plan a trip from Varanasi to Ayodhya, Prayagraj and Lucknow."
const q3 = interpretNaturalSearchQuery("Plan a trip from Varanasi to Ayodhya, Prayagraj and Lucknow.");
assert(q3 && q3.type === 'trip_plan' && q3.originQuery === 'varanasi' && q3.matchedStops.length >= 2, `NL Query 3 correctly detects multi-stop trip plan with origin Varanasi`);

// Query 4: "Find Jyotirlingas and nearby railway stations."
const q4 = interpretNaturalSearchQuery("Find Jyotirlingas and nearby railway stations.");
assert(q4 && q4.type === 'filter' && q4.categories.includes('jyotirlingas') && q4.showStations === true, `NL Query 4 correctly activates Jyotirlingas and railway stations`);

// Query 5: "Show heritage sites and historical monuments in Rajasthan."
const q5 = interpretNaturalSearchQuery("Show heritage sites and historical monuments in Rajasthan.");
assert(q5 && q5.type === 'filter' && q5.stateId === 'rajasthan' && q5.categories.includes('heritage_history'), `NL Query 5 correctly detects Rajasthan and heritage category`);

// 7. Distance Calculation Standards
// Distance from Varanasi (25.3176, 82.9739) to Ayodhya (26.7922, 82.1998)
const straightKm = calculateHaversineKm(25.3176, 82.9739, 26.7922, 82.1998);
const roadKm = computeTopographicalRoadKm(straightKm, false);
assert(straightKm > 170 && straightKm < 210, `Straight-line distance calculation from Varanasi to Ayodhya is realistic (~180-195 km) (Got: ${Math.round(straightKm)} km)`);
assert(roadKm > straightKm, `Road distance (~${roadKm} km) correctly accounts for road curvature over straight-line (~${Math.round(straightKm)} km)`);

console.log('================================================================');
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log('================================================================');
if (passed === total) {
  console.log('🎉 ALL SMART EXPLORER & ROUTING VERIFICATION TESTS PASSED!');
} else {
  process.exit(1);
}


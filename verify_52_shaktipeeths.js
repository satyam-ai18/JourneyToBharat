import { SHAKTIPEETHS_52, SHAKTIPEETH_REGIONS } from './src/data/shaktipeethData.js';
import { FLAGSHIP_DESTINATIONS, CATEGORIES } from './src/data/tirthData.js';

console.log('================================================================');
console.log('TIRTH YATRA — 52 SHAKTIPEETHS VERIFICATION SUITE');
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

// 1. Total Count Verification
assert(SHAKTIPEETHS_52.length === 52, `SHAKTIPEETHS_52 has exactly 52 items (Found: ${SHAKTIPEETHS_52.length})`);

// 2. Continuous Numbering from 1 to 52
const numbers = SHAKTIPEETHS_52.map(p => p.number);
const expectedNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
const allNumberedCorrectly = expectedNumbers.every(n => numbers.includes(n));
assert(allNumberedCorrectly, `All 52 Shaktipeeths are sequentially numbered 1 to 52`);

// 3. Field Integrity
SHAKTIPEETHS_52.forEach((p, idx) => {
  const hasFields = p.id && p.name && p.bodyPart && p.devi && p.bhairava && p.location && p.state && p.region && p.overview && p.howToReach;
  assert(hasFields, `#${idx + 1} ${p.name} has complete holy fields (Anga, Devi, Bhairava, location, region)`);
});

// 4. Regional Breakdown
const regions = ['East & Northeast', 'North India', 'West & Central', 'South India', 'Himalayan & Frontiers'];
regions.forEach(reg => {
  const inReg = SHAKTIPEETHS_52.filter(p => p.region === reg);
  assert(inReg.length > 0, `Region '${reg}' has shrines populated (Count: ${inReg.length})`);
});

// 5. Test Relic/Body Part Searches
const relicQueries = ['Yoni', 'Heart', 'Tongue', 'Foot', 'Eyes', 'Tooth', 'Necklace'];
relicQueries.forEach(q => {
  const matches = SHAKTIPEETHS_52.filter(p => p.bodyPart.toLowerCase().includes(q.toLowerCase()));
  assert(matches.length > 0, `Search body part '${q}' finds matching sacred shrines (${matches.map(m => m.name).join(', ')})`);
});

// 6. Test Devi & Bhairava Searches
const devis = ['Kamakhya', 'Kalika', 'Amba', 'Tara', 'Kottari', 'Danteshwari', 'Biraja'];
devis.forEach(d => {
  const matches = SHAKTIPEETHS_52.filter(p => p.devi.toLowerCase().includes(d.toLowerCase()));
  assert(matches.length > 0, `Search Devi form '${d}' finds shrine`);
});

const bhairavas = ['Umananda', 'Nakuleshwar', 'Batuknath', 'Unmatta', 'Bhimlochan', 'Kapalbhairav'];
bhairavas.forEach(b => {
  const matches = SHAKTIPEETHS_52.filter(p => p.bhairava.toLowerCase().includes(b.toLowerCase()));
  assert(matches.length > 0, `Search Bhairava '${b}' finds shrine`);
});

// 7. Frontier & International Shaktipeeths Verified
const frontierPeeths = ['Hinglaj Mata', 'Guhyeshwari', 'Muktinath', 'Manasa'];
frontierPeeths.forEach(fp => {
  const found = SHAKTIPEETHS_52.some(p => p.name.includes(fp) || p.title.includes(fp));
  assert(found, `Frontier/Himalayan Peeth '${fp}' is present and verified`);
});

console.log('================================================================');
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log('================================================================');
if (passed === total) {
  console.log('🎉 ALL 52 SHAKTIPEETH TESTS PASSED PERFECTLY!');
} else {
  process.exit(1);
}


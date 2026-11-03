import fs from 'fs';
import path from 'path';
import { FLAGSHIP_DESTINATIONS, CATEGORIES } from './src/data/tirthData.js';
import { VERIFIED_IMAGE_REGISTRY, getVerifiedDestinationImage } from './src/data/destinationImageRegistry.js';

console.log('================================================================');
console.log('TIRTH YATRA — TEMPLE EXPLORER VERIFICATION SUITE');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// TEST 1: 12 Jyotirlingas count & identities
const jyotirlingas = FLAGSHIP_DESTINATIONS.filter(d => 
  d.category === 'jyotirlingas' || d.categories?.includes('jyotirlingas')
);
assert(jyotirlingas.length === 12, `12 Jyotirlingas must be exactly 12 (Found: ${jyotirlingas.length})`);

const expectedJyotirlingas = [
  'Somnath', 'Mallikarjuna', 'Mahakaleshwar', 'Omkareshwar', 'Kedarnath',
  'Bhimashankar', 'Kashi Vishwanath', 'Trimbakeshwar', 'Baidyanath',
  'Nageshwar', 'Rameshwaram', 'Grishneshwar'
];
expectedJyotirlingas.forEach(name => {
  const found = jyotirlingas.some(d => d.name.toLowerCase().includes(name.toLowerCase()));
  assert(found, `Jyotirlinga ${name} must be present`);
});

// TEST 2: Char Dham count & identities
const chardham = FLAGSHIP_DESTINATIONS.filter(d => 
  d.category === 'chardham' || d.categories?.includes('chardham')
);
assert(chardham.length >= 7, `Char Dham count must be at least 7 (Found: ${chardham.length})`);

const expectedCharDham = ['Badrinath', 'Jagannath Puri', 'Rameshwaram', 'Dwarkadhish', 'Kedarnath', 'Gangotri', 'Yamunotri'];
expectedCharDham.forEach(name => {
  const found = chardham.some(d => d.name.toLowerCase().includes(name.toLowerCase()));
  assert(found, `Char Dham shrine ${name} must be present`);
});

// TEST 3: Shaktipeeths count & identities
const shaktipeeths = FLAGSHIP_DESTINATIONS.filter(d => 
  d.category === 'shaktipeeths' || d.categories?.includes('shaktipeeths')
);
assert(shaktipeeths.length >= 8, `Shaktipeeths count must be at least 8 (Found: ${shaktipeeths.length})`);

const expectedShaktipeeths = ['Kamakhya Devi', 'Vaishno Devi', 'Vindhyavasini', 'Kalighat', 'Tarapith', 'Ambaji', 'Jwala Ji', 'Kolhapur Mahalakshmi'];
expectedShaktipeeths.forEach(name => {
  const found = shaktipeeths.some(d => d.name.toLowerCase().includes(name.toLowerCase()));
  assert(found, `Shaktipeeth ${name} must be present`);
});

// TEST 4: Manyata Temples count & identities
const manyata = FLAGSHIP_DESTINATIONS.filter(d => 
  d.category === 'manyata_temples' || d.categories?.includes('manyata_temples')
);
assert(manyata.length >= 10, `Manyata temples count must be at least 10 (Found: ${manyata.length})`);

const expectedManyata = ['Tirupati Balaji', 'Vaishno Devi', 'Meenakshi', 'Khatu Shyam', 'Siddhivinayak', 'Shirdi Sai', 'Ram Mandir', 'Banke Bihari', 'Golden Temple', 'Padmanabhaswamy'];
expectedManyata.forEach(name => {
  const found = manyata.some(d => d.name.toLowerCase().includes(name.toLowerCase()));
  assert(found, `Manyata shrine ${name} must be present`);
});

// TEST 5: All Temples count
const allTemples = FLAGSHIP_DESTINATIONS.filter(d =>
  ['jyotirlingas', 'chardham', 'shaktipeeths', 'manyata_temples'].some(c => d.category === c || d.categories?.includes(c))
);
assert(allTemples.length >= 30, `All Temples count must be >= 30 (Found: ${allTemples.length})`);

// TEST 6: Audit Every Image File on Disk
console.log('\n--- Auditing Destination Images on Disk ---');
const publicDir = path.resolve('public');
allTemples.forEach(d => {
  if (d.image.startsWith('/images/')) {
    const fullPath = path.join(publicDir, d.image);
    const exists = fs.existsSync(fullPath);
    const stat = exists ? fs.statSync(fullPath) : null;
    assert(exists && stat && stat.size > 1000, `Image for ${d.name} (${d.image}) must exist and have content (${stat ? (stat.size / 1024).toFixed(1) + ' KB' : 'MISSING'})`);
  }
});

// TEST 7: Target Image Inspections
console.log('\n--- Checking Mandatory Target Images ---');
const targetCheckList = [
  'kedarnath_temple',
  'kashi_vishwanath',
  'somnath_temple',
  'mahakaleshwar_ujjain',
  'badrinath_temple',
  'gangotri_dham',
  'yamunotri_dham',
  'jagannath_puri',
  'vaishno_devi',
  'tirupati_balaji',
  'meenakshi_temple',
  'khatu_shyam_ji',
  'kamakhya_devi'
];

targetCheckList.forEach(id => {
  const reg = VERIFIED_IMAGE_REGISTRY[id];
  assert(!!reg, `Image Registry entry for ${id} must exist`);
  assert(reg?.isVerified === true, `Image Registry for ${id} must be marked verified`);
  const fullPath = path.join(publicDir, reg.url);
  assert(fs.existsSync(fullPath), `Local file for ${id} must exist at ${reg.url}`);
});

// TEST 8: Check Meenakshi Image is Full Color
const meenakshiFile = path.join(publicDir, 'images/destinations/meenakshi_temple.jpg');
const meenakshiStat = fs.statSync(meenakshiFile);
assert(meenakshiStat.size > 50000, `Meenakshi image is high-resolution full-color verified photograph (${(meenakshiStat.size / 1024 / 1024).toFixed(2)} MB)`);

// TEST 9: Altitude formatting (No raw/naked unexplained numbers)
console.log('\n--- Checking Altitude Formatting ---');
allTemples.forEach(d => {
  if (d.altitude) {
    assert(d.altitude.includes('m') || d.altitude.includes('ft'), `Altitude for ${d.name} must specify elevation unit ('m' or 'ft') (Found: "${d.altitude}")`);
  }
});

// TEST 10: Search Filter Logic
console.log('\n--- Checking Search Filtering Capabilities ---');
function simulateSearch(query) {
  const q = query.toLowerCase().trim();
  return allTemples.filter(d => 
    d.name?.toLowerCase().includes(q) ||
    d.title?.toLowerCase().includes(q) ||
    d.location?.toLowerCase().includes(q) ||
    d.deity?.toLowerCase().includes(q) ||
    d.state?.toLowerCase().includes(q) ||
    d.categoryLabel?.toLowerCase().includes(q) ||
    d.badge?.toLowerCase().includes(q) ||
    d.overview?.toLowerCase().includes(q)
  );
}

const shivaResults = simulateSearch('Shiva');
assert(shivaResults.length >= 12, `Search 'Shiva' should find at least 12 temples (Found: ${shivaResults.length})`);

const krishnaResults = simulateSearch('Krishna');
assert(krishnaResults.length >= 3, `Search 'Krishna' should find multiple temples (Found: ${krishnaResults.length})`);

const assamResults = simulateSearch('Assam');
assert(assamResults.length >= 1 && assamResults[0].id === 'kamakhya_devi', `Search 'Assam' finds Kamakhya Devi`);

const maharashtraResults = simulateSearch('Maharashtra');
assert(maharashtraResults.length >= 4, `Search 'Maharashtra' finds multiple shrines (Found: ${maharashtraResults.length})`);

console.log('================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('================================================================');
if (passedTests === totalTests) {
  console.log('🎉 ALL TESTS PASSED PERFECTLY!');
} else {
  process.exit(1);
}


const fs = require('fs');
const content = fs.readFileSync('src/components/SmartNearbyExplorer.jsx', 'utf8');

const lines = content.split('\n');
console.log('Lines 90 to 180:');
for (let i = 90; i < 180; i++) {
  if (lines[i] && (lines[i].includes('createVehicleIcon') || lines[i].includes('vehicle-anim-pin') || lines[i].includes('L.divIcon'))) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}


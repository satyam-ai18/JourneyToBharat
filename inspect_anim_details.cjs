const fs = require('fs');
const content = fs.readFileSync('src/components/SmartNearbyExplorer.jsx', 'utf8');

const lines = content.split('\n');
console.log('Lines 655 to 750:');
for (let i = 655; i < 750; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}


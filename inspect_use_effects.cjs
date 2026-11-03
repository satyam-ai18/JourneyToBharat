const fs = require('fs');
const content = fs.readFileSync('src/components/SmartNearbyExplorer.jsx', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('useEffect(() => {')) {
    console.log(`useEffect at line ${i + 1}`);
    for (let j = i; j < Math.min(lines.length, i + 15); j++) {
      if (lines[j].includes('}, [')) {
        console.log(`  Deps at line ${j + 1}: ${lines[j]}`);
        break;
      }
    }
  }
});


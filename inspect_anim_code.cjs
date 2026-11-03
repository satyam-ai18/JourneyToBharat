const fs = require('fs');
const content = fs.readFileSync('src/components/SmartNearbyExplorer.jsx', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('requestAnimationFrame') || l.includes('animFrameRef') || l.includes('vehicleMarkerRef') || l.includes('startAnimation') || l.includes('stopAnimation') || l.includes('animateRoute') || l.includes('panTo')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});


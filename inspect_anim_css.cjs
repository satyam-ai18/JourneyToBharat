const fs = require('fs');
const content = fs.readFileSync('src/index.css', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('animated-car') || l.includes('vehicle-anim')) {
    console.log(`Line ${i + 1}: ${l}`);
    for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 20); j++) {
      console.log(`  ${j + 1}: ${lines[j]}`);
    }
  }
});


// Script to query Wikimedia Commons API for verified files and download them to public/images
import fs from 'fs';
import path from 'path';
import https from 'https';

const DESTINATION_FILES = {
  // 1. Badrinath Temple: The colorful traditional painted facade of Badrinarayan temple in Garhwal Himalayas
  badrinath_temple: "File:Badrinath_temple_DSCN9998.jpg",
  // 2. Gangotri Dham: The white granite Gangotri temple on the banks of Bhagirathi
  gangotri_dham: "File:Gangotri_temple.jpg",
  // 3. Yamunotri Dham: The ancient Yamunotri shrine nestled under the mountain cleft
  yamunotri_dham: "File:Yamunotri_temple_and_ashram.jpg",
  // 4. Vaishno Devi: The holy Bhawan complex nestled in the Trikuta Hills of Katra, Jammu & Kashmir
  vaishno_devi: "File:Vaishno_Devi_Bhawan.jpg",
  // 5. Jagannath Puri: The majestic 12th-century Kalinga-style Shikhara of Jagannath Temple in Puri, Odisha
  jagannath_puri: "File:Jagannath_Temple_-_Right_View.jpg",
  // 6. Somnath Temple: The seaside Maru-Gurjara Jyotirlinga temple at Prabhas Patan, Gujarat
  somnath_temple: "File:Somanath_mandir_(cropped).jpg",
  // 7. Tirupati Balaji: The historic Dravidian entrance gopuram and golden Ananda Nilayam of Tirumala Venkateswara
  tirupati_balaji: "File:A_View_of_Tirumala_Venkateswara_Temple.JPG",
  // 8. Kamakhya Devi: The unique beehive shikhara of Maa Kamakhya atop Nilachal Hill, Guwahati, Assam
  kamakhya_devi: "File:Kamakhya_Temple,_Guwahati.jpg",
  // 9. Mahakaleshwar Ujjain: The sacred Mahakaleshwar Jyotirlinga sanctum and temple complex in Ujjain, MP
  mahakaleshwar_ujjain: "File:Mahakaleshwar_Temple,_Ujjain.jpg",
  // 10. Meenakshi Amman Temple: The towering multicolored sculpted Gopuram in Madurai, Tamil Nadu
  meenakshi_temple: "File:Madurai_Meenakshi_Amman_temple_view_from_South_Tower.jpg",
  // 11. Rameshwaram: The famous pillared corridors of Ramanathaswamy Temple
  dhanushkodi_rameshwaram: "File:Ramanathaswamy_Temple,_corridor.jpg",
  // 12. Hampi Virupaksha: The grand 15th-century Virupaksha temple gopuram by Tungabhadra River, Karnataka
  hampi_virupaksha: "File:Virupaksha_temple_hampi.jpg",
  // 13. Bhedaghat Dhuandhar Falls: The thunderous marble rock cascade on Narmada River, Jabalpur, MP
  bhedaghat_dhuandhar: "File:Dhuandhar_Falls_Bhedaghat_Jabalpur.jpg"
};

async function fetchWikimediaFileInfo(fileName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TirthYatraVerificationBot/1.0 (contact@tirthyatra.org)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const page = Object.values(pages)[0];
          if (!page || !page.imageinfo || !page.imageinfo[0]) return resolve(null);
          
          const info = page.imageinfo[0];
          resolve({
            title: page.title,
            url: info.url,
            thumbUrl: info.thumburl || info.url,
            artist: info.extmetadata?.Artist?.value || 'Wikimedia Commons Contributor',
            license: info.extmetadata?.LicenseShortName?.value || 'CC BY-SA',
            description: info.extmetadata?.ImageDescription?.value || ''
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = https.get(url, { headers: { 'User-Agent': 'TirthYatraVerificationBot/1.0 (contact@tirthyatra.org)' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        https.get(response.headers.location, { headers: { 'User-Agent': 'TirthYatraVerificationBot/1.0 (contact@tirthyatra.org)' } }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
      }
    });
    request.on('error', reject);
  });
}

async function main() {
  const outputDir = path.resolve('./public/images/destinations');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = {};

  for (const [id, fileName] of Object.entries(DESTINATION_FILES)) {
    console.log(`Checking ${id} (${fileName})...`);
    try {
      const info = await fetchWikimediaFileInfo(fileName);
      if (info) {
        console.log(`Found: ${info.title} -> ${info.url}`);
        const ext = path.extname(info.url).toLowerCase() || '.jpg';
        const localFilename = `${id}${ext}`;
        const localPath = path.join(outputDir, localFilename);
        
        console.log(`Downloading to ${localPath}...`);
        await downloadFile(info.url, localPath);
        console.log(`Successfully saved ${localFilename} (${fs.statSync(localPath).size} bytes)`);

        results[id] = {
          id,
          fileName,
          localPath: `/images/destinations/${localFilename}`,
          wikimediaUrl: info.url,
          artist: info.artist,
          license: info.license
        };
      } else {
        console.warn(`No info found for ${fileName}`);
      }
    } catch (err) {
      console.error(`Error processing ${id}:`, err.message);
    }
  }

  fs.writeFileSync('./scripts/wikimediaResults.json', JSON.stringify(results, null, 2));
  console.log('All processed. Results saved to scripts/wikimediaResults.json');
}

main();

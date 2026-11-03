// Complete Tourist Attractions Database for Varanasi -> MP -> Nashik Circuit
// Verified against official MP Tourism, Maharashtra Tourism, and Temple Trusts

export const MP_NASHIK_ATTRACTIONS = [
  // ================= 1. VARANASI =================
  {
    id: "att_kashi_vishwanath",
    name: "Kashi Vishwanath Temple & Corridor",
    destinationId: "dest_varanasi",
    region: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3109,
    lng: 83.0107,
    category: "Jyotirlinga / Sacred Heart",
    isDetour: false,
    description: "Supreme Jyotirlinga of Lord Shiva on the western bank of the Ganges. The newly renovated 50,000 sq m corridor seamlessly connects the sacred sanctum to the river ghats.",
    nearestPracticalStation: {
      code: "BSB",
      name: "Varanasi Junction (BSB)",
      roadDistanceKm: 4.8,
      travelTime: "20 mins",
      notes: "Take an e-rickshaw to Godowlia Chowk (3.5 km), then walk 400m through the pedestrianised temple corridor."
    },
    alternativeStations: [
      { code: "BSBS", name: "Banaras (formerly Manduadih)", distanceKm: 4.2, travelTime: "18 mins" },
      { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Jn", distanceKm: 19.5, travelTime: "50 mins" }
    ],
    nearestBusTerminal: "Varanasi Cantt UPSRTC Bus Stand (4.5 km)",
    recommendedTransport: "E-rickshaw to Godowlia, then walking inside pedestrian corridor.",
    nearbyAttractions: ["Dashashwamedh Ghat (0.4 km)", "Manikarnika Ghat (0.3 km)", "Annapurna Temple (0.1 km)"]
  },
  {
    id: "att_sankat_mochan",
    name: "Sankat Mochan Hanuman Temple",
    destinationId: "dest_varanasi",
    region: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.2818,
    lng: 82.9995,
    category: "Temple / Hanuman Shrine",
    isDetour: false,
    description: "Revered temple established by Sant Goswami Tulsidas on the banks of Assi River, famous for the Tuesday and Saturday congregation and special besan laddoo prasad.",
    nearestPracticalStation: {
      code: "BSBS",
      name: "Banaras Railway Station",
      roadDistanceKm: 4.5,
      travelTime: "15 mins",
      notes: "Conveniently accessible from Lanka / BHU gate side."
    },
    alternativeStations: [{ code: "BSB", name: "Varanasi Junction", distanceKm: 7.2, travelTime: "25 mins" }],
    nearestBusTerminal: "Lanka Bus Stop (1.2 km)",
    recommendedTransport: "Auto-rickshaw or e-rickshaw to Lanka road.",
    nearbyAttractions: ["Durga Kund Temple (1.2 km)", "Banaras Hindu University (1 km)", "Assi Ghat (2 km)"]
  },
  {
    id: "att_durga_kund",
    name: "Durga Kund Temple (Monkey Temple)",
    destinationId: "dest_varanasi",
    region: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.2882,
    lng: 82.9985,
    category: "Temple / Nagara Architecture",
    isDetour: false,
    description: "18th-century ochre-red temple built in North Indian Nagara style by a Bengali Maharani, adjoining the rectangular sacred Durga Kund tank.",
    nearestPracticalStation: {
      code: "BSBS",
      name: "Banaras Station",
      roadDistanceKm: 3.8,
      travelTime: "14 mins",
      notes: "Direct e-rickshaw route along Durgakund Road."
    },
    alternativeStations: [{ code: "BSB", name: "Varanasi Jn", distanceKm: 6.5, travelTime: "22 mins" }],
    nearestBusTerminal: "Durgakund Auto Stand (100m)",
    recommendedTransport: "Shared electric rickshaw.",
    nearbyAttractions: ["Tulsi Manas Mandir (0.3 km)", "Sankat Mochan (1.2 km)", "Assi Ghat (1.8 km)"]
  },
  {
    id: "att_dashashwamedh_assi",
    name: "Dashashwamedh & Assi Ghats (Ganga Aarti)",
    destinationId: "dest_varanasi",
    region: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3075,
    lng: 83.0104,
    category: "Ghats / Riverfront",
    isDetour: false,
    description: "The dual life-centers of the Varanasi riverfront. Dashashwamedh hosts the mesmerizing grand evening Maha Aarti; Assi is famous for Subah-e-Banaras sunrise concerts and morning yoga.",
    nearestPracticalStation: {
      code: "BSB",
      name: "Varanasi Junction",
      roadDistanceKm: 4.5,
      travelTime: "20 mins",
      notes: "Vehicles stop at Godowlia; 5-min walk down to the river."
    },
    alternativeStations: [{ code: "BSBS", name: "Banaras", distanceKm: 4.0, travelTime: "18 mins" }],
    nearestBusTerminal: "Godowlia Auto / Rickshaw Stand",
    recommendedTransport: "Shared e-rickshaw + evening wooden hand-rowed boat along ghats.",
    nearbyAttractions: ["Kashi Vishwanath (0.4 km)", "Harishchandra Ghat (1.5 km)", "Assi Ghat (2.5 km by boat)"]
  },
  {
    id: "att_sarnath",
    name: "Sarnath (Dhamekh Stupa & Deer Park)",
    destinationId: "dest_varanasi",
    region: "Varanasi Outskirts",
    state: "Uttar Pradesh",
    lat: 25.3812,
    lng: 83.0233,
    category: "Buddhist Heritage / UNESCO Tentative",
    isDetour: false,
    description: "Where Gautama Buddha delivered his first sermon after enlightenment (Dhammacakkappavattana Sutta). Features the 43.6m tall cylindrical Dhamekh Stupa, Ashoka Pillar ruins, and archaeological museum.",
    nearestPracticalStation: {
      code: "SRNT",
      name: "Sarnath Railway Station",
      roadDistanceKm: 1.2,
      travelTime: "5 mins",
      notes: "Branch station on Varanasi-Chhapra line. For trunk express trains, use Varanasi Jn (BSB - 10 km)."
    },
    alternativeStations: [{ code: "BSB", name: "Varanasi Jn", distanceKm: 10.5, travelTime: "30 mins" }],
    nearestBusTerminal: "Sarnath Bus Stop (opposite Archaeological Museum)",
    recommendedTransport: "Prepaid taxi or auto-rickshaw from Varanasi city center.",
    nearbyAttractions: ["Chaukhandi Stupa (1 km)", "Thai Temple & Giant Buddha (0.8 km)"]
  },

  // ================= 2. MIRZAPUR & VINDHYACHAL =================
  {
    id: "att_vindhyavasini",
    name: "Maa Vindhyavasini Devi Temple",
    destinationId: "dest_vindhyachal",
    region: "Vindhyachal",
    state: "Uttar Pradesh",
    lat: 25.1633,
    lng: 82.4988,
    category: "Shaktipeeth / Main Temple",
    isDetour: false,
    description: "Supreme seat of Goddess Mahalakshmi on the banks of Ganga. Unique among Shaktipeeths as the deity is said to have chosen this hill abode after Mahishasuramardini avatar.",
    nearestPracticalStation: {
      code: "BDL",
      name: "Vindhyachal Railway Station (BDL)",
      roadDistanceKm: 1.2,
      travelTime: "5 mins",
      notes: "BDL is right in the pilgrim town; walking distance or ₹30 e-rickshaw to temple entrance."
    },
    alternativeStations: [{ code: "MZP", name: "Mirzapur Railway Station", distanceKm: 6.5, travelTime: "15 mins" }],
    nearestBusTerminal: "Vindhyachal Mandir Bus Stand (400m)",
    recommendedTransport: "E-rickshaw from Vindhyachal or Mirzapur station.",
    nearbyAttractions: ["Ramgaya Ghat (0.5 km)", "Ashtabhuja Devi Temple (3.5 km)", "Kali Khoh (2.5 km)"]
  },
  {
    id: "att_ashtabhuja_devi",
    name: "Ashtabhuja Devi Temple",
    destinationId: "dest_vindhyachal",
    region: "Vindhyachal",
    state: "Uttar Pradesh",
    lat: 25.1528,
    lng: 82.4822,
    category: "Shaktipeeth / Trikona Yatra",
    isDetour: false,
    description: "Dedicated to Goddess Saraswati (eight-armed Mahasaraswati), perched atop a hillock inside a cave sanctuary. Part of the sacred 3-cornered Trikona Yatra.",
    nearestPracticalStation: {
      code: "BDL",
      name: "Vindhyachal Station",
      roadDistanceKm: 3.5,
      travelTime: "10 mins",
      notes: "Accessible by winding hill road or stone flight of stairs with newly installed ropeway."
    },
    alternativeStations: [{ code: "MZP", name: "Mirzapur", distanceKm: 8.5, travelTime: "20 mins" }],
    nearestBusTerminal: "Vindhyachal Bus Stand (3 km)",
    recommendedTransport: "Auto-rickshaw or Passenger Ropeway connecting Kali Khoh to Ashtabhuja hill.",
    nearbyAttractions: ["Kali Khoh (1.5 km)", "Vindhyavasini Temple (3.5 km)", "Gerua Talab (1 km)"]
  },
  {
    id: "att_kali_khoh",
    name: "Kali Khoh Temple",
    destinationId: "dest_vindhyachal",
    region: "Vindhyachal",
    state: "Uttar Pradesh",
    lat: 25.1565,
    lng: 82.4905,
    category: "Shaktipeeth / Cave Shrine",
    isDetour: false,
    description: "Revered cave shrine representing Mahakali, nestled at the base of the Vindhya hillside amidst dense foliage; completes the holy Trikona parikrama.",
    nearestPracticalStation: {
      code: "BDL",
      name: "Vindhyachal Station",
      roadDistanceKm: 2.2,
      travelTime: "8 mins",
      notes: "Situated between Vindhyavasini and Ashtabhuja shrines."
    },
    alternativeStations: [{ code: "MZP", name: "Mirzapur", distanceKm: 7.0, travelTime: "18 mins" }],
    nearestBusTerminal: "Vindhyachal Stand (2 km)",
    recommendedTransport: "E-rickshaw or Trikona Parikrama walking trail.",
    nearbyAttractions: ["Ashtabhuja Devi (1.5 km)", "Maa Vindhyavasini (2.2 km)"]
  },
  {
    id: "att_mirzapur_town",
    name: "Mirzapur Town, Clock Tower & Ganga Ghats",
    destinationId: "dest_mirzapur",
    region: "Mirzapur",
    state: "Uttar Pradesh",
    lat: 25.1462,
    lng: 82.5685,
    category: "Heritage / Riverfront Town",
    isDetour: false,
    description: "Colonial-era stone clock tower (Ghanta Ghar), ancient brass-carving lanes, Pakka Ghat, and Narghat along the wide sweep of the Ganges.",
    nearestPracticalStation: {
      code: "MZP",
      name: "Mirzapur Railway Station (MZP)",
      roadDistanceKm: 1.5,
      travelTime: "6 mins",
      notes: "Main trunk station on Delhi-Howrah mainline. All major express trains halt here."
    },
    alternativeStations: [{ code: "BDL", name: "Vindhyachal", distanceKm: 6.0, travelTime: "15 mins" }],
    nearestBusTerminal: "Mirzapur UPSRTC Bus Stand (1 km)",
    recommendedTransport: "Cycle rickshaw or auto in the town core.",
    nearbyAttractions: ["Windom Falls (14 km)", "Ojhala Bridge (4 km)", "Tanda Falls (16 km)"]
  },
  {
    id: "att_windom_sirsi_falls",
    name: "Windom Falls & Sirsi Waterfalls",
    destinationId: "dest_mirzapur",
    region: "Mirzapur Foothills",
    state: "Uttar Pradesh",
    lat: 25.0422,
    lng: 82.5955,
    category: "Nature / Waterfall",
    isDetour: true,
    description: "Cascading forested waterfalls dropping from the rocky sandstone Vindhya escarpments into serene plunge pools, surrounded by deciduous forest reserves.",
    nearestPracticalStation: {
      code: "MZP",
      name: "Mirzapur Railway Station",
      roadDistanceKm: 14.5,
      travelTime: "30 mins",
      notes: "Sirsi Dam & Falls is 45 km south on the MP border road."
    },
    alternativeStations: [{ code: "BDL", name: "Vindhyachal", distanceKm: 19.0, travelTime: "40 mins" }],
    nearestBusTerminal: "Mirzapur Depot",
    recommendedTransport: "Private taxi or rented vehicle from Mirzapur.",
    nearbyAttractions: ["Tanda Dam (8 km)", "Kantit Sharif (16 km)"]
  },

  // ================= 3. MAIHAR, MADHYA PRADESH =================
  {
    id: "att_maihar_sharda",
    name: "Maa Sharda Devi Temple (Trikuta Hill)",
    destinationId: "dest_maihar",
    region: "Maihar",
    state: "Madhya Pradesh",
    lat: 24.2690,
    lng: 80.7570,
    category: "Shaktipeeth / Hilltop Shrine",
    isDetour: false,
    description: "Ancient 52-Shaktipeeth shrine atop the 600-ft Trikuta mountain. Pilgrims ascend via 1,063 stone steps or the aerial ropeway. Reenowned for the legend of warriors Alha and Udal who first worship the deity every dawn.",
    nearestPracticalStation: {
      code: "MYR",
      name: "Maihar Railway Station (MYR)",
      roadDistanceKm: 5.2,
      travelTime: "15 mins",
      notes: "PRACTICAL DIRECT STATION: Major halt on Jabalpur-Prayagraj mainline; dozens of express trains stop. Continuous auto shuttles to ropeway base."
    },
    alternativeStations: [
      { code: "STA", name: "Satna Junction", distanceKm: 36.0, travelTime: "45 mins" },
      { code: "KTE", name: "Katni Junction", distanceKm: 65.0, travelTime: "1 hr 15 mins" }
    ],
    nearestBusTerminal: "Maihar Bus Stand (near station - 5 km) / Ropeway Base Stand",
    recommendedTransport: "Auto-rickshaw from MYR station to ropeway base + Ropeway car (₹130) or 1063-step pilgrimage stairs.",
    nearbyAttractions: ["Alha Talab & Akhada (2 km)", "Badi Khermai Mandir (4 km)", "Ichchhapuran Hanuman Mandir (5 km)"]
  },
  {
    id: "att_alha_udal_akhada",
    name: "Alha-Udal Akhada & Pond",
    destinationId: "dest_maihar",
    region: "Maihar",
    state: "Madhya Pradesh",
    lat: 24.2588,
    lng: 80.7482,
    category: "Historical / Legend",
    isDetour: false,
    description: "Historic arena and sacred reservoir behind Trikuta Hill where 12th-century warrior Alha practiced martial arts and meditated upon Maa Sharda for 12 years.",
    nearestPracticalStation: {
      code: "MYR",
      name: "Maihar Station",
      roadDistanceKm: 6.5,
      travelTime: "18 mins",
      notes: "Located just behind the rear base of the temple hill."
    },
    alternativeStations: [{ code: "STA", name: "Satna Jn", distanceKm: 38.0, travelTime: "50 mins" }],
    nearestBusTerminal: "Maihar Stand (6 km)",
    recommendedTransport: "Auto-rickshaw from Maihar town.",
    nearbyAttractions: ["Maa Sharda Temple (2 km)", "Badi Khermai (3 km)"]
  },

  // ================= 4. JABALPUR =================
  {
    id: "att_dhuandhar",
    name: "Dhuandhar Falls (Smoke Cascade)",
    destinationId: "dest_jabalpur",
    region: "Bhedaghat / Jabalpur",
    state: "Madhya Pradesh",
    lat: 23.1292,
    lng: 79.8055,
    category: "Waterfall / Natural Wonder",
    isDetour: false,
    description: "The roaring 30m plunge of the holy River Narmada where water strikes hard rock creating an ethereal cloud of water mist resembling smoke (Dhuan), accompanied by a dramatic ropeway crossing above the gorge.",
    nearestPracticalStation: {
      code: "MML",
      name: "Madan Mahal Railway Station (MML)",
      roadDistanceKm: 18.0,
      travelTime: "30 mins",
      notes: "Madan Mahal is on the western city fringe, closer to Bhedaghat than main station."
    },
    alternativeStations: [{ code: "JBP", name: "Jabalpur Main Junction", distanceKm: 22.0, travelTime: "40 mins" }],
    nearestBusTerminal: "Bhedaghat Bus Stand (800m) / Jabalpur ISBT Damoh Naka (24 km)",
    recommendedTransport: "City bus #Metro from Jabalpur or auto/cab + MP Tourism cable car crossing.",
    nearbyAttractions: ["Bhedaghat Marble Rocks (1.5 km)", "Chausath Yogini Temple (1 km)"]
  },
  {
    id: "att_bhedaghat_marble",
    name: "Bhedaghat Marble Rocks (Narmada Boating)",
    destinationId: "dest_jabalpur",
    region: "Bhedaghat",
    state: "Madhya Pradesh",
    lat: 23.1325,
    lng: 79.8012,
    category: "Canyon / Boating / Geological Wonder",
    description: "Soaring 100-ft magnesium limestone marble cliffs flanking the emerald Narmada river for 3 km; world-famous for guided rowboat safaris, especially under moonlit nights.",
    nearestPracticalStation: {
      code: "MML",
      name: "Madan Mahal Station",
      roadDistanceKm: 19.0,
      travelTime: "32 mins",
      notes: "Direct 4-lane bypass road from Madan Mahal."
    },
    alternativeStations: [{ code: "JBP", name: "Jabalpur Junction", distanceKm: 23.0, travelTime: "42 mins" }],
    nearestBusTerminal: "Bhedaghat Boat Jetty Stop",
    recommendedTransport: "Official MP Tourism rowboat (shared ₹100 or private ₹800).",
    nearbyAttractions: ["Dhuandhar Falls (1.5 km)", "Bandar Kudani canyon narrows (1 km)"]
  },
  {
    id: "att_chausath_yogini",
    name: "Chausath Yogini Temple (Bhedaghat)",
    destinationId: "dest_jabalpur",
    region: "Bhedaghat",
    state: "Madhya Pradesh",
    lat: 23.1308,
    lng: 79.7995,
    category: "Ancient Temple / Kalachuri Heritage",
    description: "10th-century circular hypaethral stone temple built by Kalachuri kings on a hilltop overlooking the Narmada gorge, housing 64 intricately carved Yogini idols and Lord Shiva & Parvati mounted on Nandi.",
    nearestPracticalStation: {
      code: "MML",
      name: "Madan Mahal",
      roadDistanceKm: 18.5,
      travelTime: "30 mins",
      notes: "Climbed via 150 wide stone steps from Bhedaghat car park."
    },
    alternativeStations: [{ code: "JBP", name: "Jabalpur Jn", distanceKm: 22.5, travelTime: "40 mins" }],
    nearestBusTerminal: "Bhedaghat Stand (600m)",
    recommendedTransport: "Walking from Bhedaghat boat jetty up the hill steps.",
    nearbyAttractions: ["Bhedaghat Marble Rocks (0.5 km)", "Dhuandhar (1 km)"]
  },
  {
    id: "att_madan_mahal",
    name: "Madan Mahal Fort & Balancing Rock",
    destinationId: "dest_jabalpur",
    region: "Jabalpur City",
    state: "Madhya Pradesh",
    lat: 23.1538,
    lng: 79.9015,
    category: "Fort / Gond Heritage / Geologic Wonder",
    description: "11th-century watchtower citadel built by Gond ruler Raja Madan Shah atop an enormous granite hill, flanked at the base by a geological marvel: an enormous boulder balancing precariously on a tiny rock fulcrum through major earthquakes.",
    nearestPracticalStation: {
      code: "MML",
      name: "Madan Mahal Railway Station (MML)",
      roadDistanceKm: 2.2,
      travelTime: "7 mins",
      notes: "Station is named directly after this fort."
    },
    alternativeStations: [{ code: "JBP", name: "Jabalpur Junction", distanceKm: 6.5, travelTime: "18 mins" }],
    nearestBusTerminal: "Madan Mahal Auto Stand",
    recommendedTransport: "Auto-rickshaw from Madan Mahal or city center.",
    nearbyAttractions: ["Rani Durgavati Museum (4 km)", "Pisanhari Ki Madiya (5 km)"]
  },
  {
    id: "att_bargi_dam",
    name: "Bargi Dam & Narmada Reservoir Cruise",
    destinationId: "dest_jabalpur",
    region: "Jabalpur Outskirts",
    state: "Madhya Pradesh",
    lat: 22.9465,
    lng: 79.8812,
    category: "Dam / Lake Cruise / Eco-Tourism",
    description: "One of the first completed major multi-purpose dams across River Narmada, creating a colossal 75-km lake with MP Tourism speedboat rides, cruise vessels, and bird-watching.",
    nearestPracticalStation: {
      code: "JBP",
      name: "Jabalpur Junction",
      roadDistanceKm: 38.0,
      travelTime: "55 mins",
      notes: "Scenic highway through rural Mahakoshal."
    },
    alternativeStations: [{ code: "MML", name: "Madan Mahal", distanceKm: 34.0, travelTime: "50 mins" }],
    nearestBusTerminal: "Bargi Dam Bus Stop",
    recommendedTransport: "Private taxi or highway bus towards Mandla.",
    nearbyAttractions: ["Maikal Resort Water Sports", "Bhedaghat (40 km)"]
  },

  // ================= 5. BHOPAL & SURROUNDINGS =================
  {
    id: "att_bhojpur",
    name: "Bhojpur Temple (Bhojeshwar Mahadev)",
    destinationId: "dest_bhopal",
    region: "Bhojpur (Bhopal Detour)",
    state: "Madhya Pradesh",
    lat: 23.1005,
    lng: 77.5855,
    category: "Monumental Temple / Paramara Architecture",
    isDetour: true,
    description: "11th-century unfinished architectural masterpiece founded by King Bhoja, housing one of the world's tallest single-stone monolithic Shiva Lingams (7.5 ft high, 17.8 ft circumference) set on a massive square limestone platform.",
    nearestPracticalStation: {
      code: "RKMP",
      name: "Rani Kamlapati Railway Station (RKMP - Bhopal)",
      roadDistanceKm: 26.0,
      travelTime: "40 mins",
      notes: "PRACTICAL STATION: Modern terminal on the southern side of Bhopal, right on the road to Bhojpur & Bhimbetka."
    },
    alternativeStations: [
      { code: "BPL", name: "Bhopal Junction", distanceKm: 32.0, travelTime: "55 mins" },
      { code: "MDDP", name: "Mandideep Industrial Halt", distanceKm: 12.0, travelTime: "20 mins" }
    ],
    nearestBusTerminal: "Mandideep Bus Stop (12 km) / Kushabhau Thakre ISBT Bhopal (25 km)",
    recommendedTransport: "Taxi or state bus to Mandideep + auto-rickshaw down the Betwa river road.",
    nearbyAttractions: ["Bhimbetka Caves (28 km south)", "Betwa Riverbank (0.5 km)"]
  },
  {
    id: "att_sanchi_stupa",
    name: "Sanchi Stupa (Great Stupa 1)",
    destinationId: "dest_bhopal",
    region: "Sanchi (Bhopal Detour - North)",
    state: "Madhya Pradesh",
    lat: 23.4873,
    lng: 77.7412,
    category: "UNESCO World Heritage / Buddhist Monument",
    isDetour: true,
    description: "Oldest stone structure in India commissioned by Emperor Ashoka in the 3rd century BCE, famed for hemispherical dome and 4 intricately carved Torana gateways depicting Jataka tales.",
    nearestPracticalStation: {
      code: "SCI",
      name: "Sanchi Railway Station (SCI)",
      roadDistanceKm: 1.5,
      travelTime: "5 mins",
      notes: "Passenger trains halt at SCI. For major express trains, Vidisha (BHS - 9 km) or Bhopal (BPL - 48 km) are best."
    },
    alternativeStations: [
      { code: "BHS", name: "Vidisha Junction", distanceKm: 9.0, travelTime: "15 mins" },
      { code: "BPL", name: "Bhopal Junction", distanceKm: 48.0, travelTime: "1 hr 10 mins" }
    ],
    nearestBusTerminal: "Sanchi Town Bus Stand (on NH-146)",
    recommendedTransport: "Local train to Sanchi or express bus from Bhopal Nadra stand.",
    nearbyAttractions: ["Udayagiri Caves (14 km)", "Vidisha Heliodorus Pillar (12 km)"]
  },
  {
    id: "att_bhimbetka",
    name: "Bhimbetka Rock Shelters",
    destinationId: "dest_bhopal",
    region: "Bhimbetka (Bhopal Detour - South)",
    state: "Madhya Pradesh",
    lat: 22.9372,
    lng: 77.6125,
    category: "UNESCO World Heritage / Paleolithic Cave Art",
    isDetour: true,
    description: "Sprawling prehistoric archaeological site with over 750 rock shelters spanning from the Upper Paleolithic to the Medieval era, featuring vibrant red and white ochre paintings depicting bison hunts, rituals, and elephant rides.",
    nearestPracticalStation: {
      code: "ODG",
      name: "Obedullaganj Railway Station",
      roadDistanceKm: 8.5,
      travelTime: "15 mins",
      notes: "Small halt. For all trunk trains use Rani Kamlapati (RKMP - 42 km) or Hoshangabad (NDPM - 35 km)."
    },
    alternativeStations: [{ code: "RKMP", name: "Rani Kamlapati", distanceKm: 42.0, travelTime: "55 mins" }],
    nearestBusTerminal: "Bhimbetka Turnoff on NH-46 (3 km from ticket counter)",
    recommendedTransport: "Private cab or highway bus to Obedullaganj bypass + local auto.",
    nearbyAttractions: ["Ratapani Tiger Reserve (surrounds site)", "Bhojpur Temple (28 km north)"]
  },
  {
    id: "att_bhopal_lakes",
    name: "Upper Lake (Bhojtal) & Van Vihar National Park",
    destinationId: "dest_bhopal",
    region: "Bhopal City",
    state: "Madhya Pradesh",
    lat: 23.2325,
    lng: 77.3685,
    category: "Lake / Wildlife Reserve",
    isDetour: false,
    description: "Bhojtal, an enormous 31 sq km artificial lake created in the 11th century by King Bhoja, flanked along its southern shoreline by Van Vihar, a natural open-air safari sanctuary for tigers, sloth bears, and migratory birds.",
    nearestPracticalStation: {
      code: "BPL",
      name: "Bhopal Junction",
      roadDistanceKm: 6.5,
      travelTime: "18 mins",
      notes: "Accessible via VIP Road with sweeping lake vistas."
    },
    alternativeStations: [{ code: "RKMP", name: "Rani Kamlapati", distanceKm: 9.0, travelTime: "22 mins" }],
    nearestBusTerminal: "Polytechnic Square / Boat Club Stand",
    recommendedTransport: "City bus or auto-rickshaw + bicycle rental inside Van Vihar.",
    nearbyAttractions: ["Madhya Pradesh Tribal Museum (3 km)", "Taj-ul-Masajid (5 km)"]
  },

  // ================= 6. UJJAIN =================
  {
    id: "att_mahakaleshwar",
    name: "Mahakaleshwar Jyotirlinga & Mahakal Lok Corridor",
    destinationId: "dest_ujjain",
    region: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.1827,
    lng: 75.7682,
    category: "Jyotirlinga / Mahakal Lok",
    isDetour: false,
    description: "One of the 12 sacred Jyotirlingas, unique as the only south-facing (Dakshinmukhi) Jyotirlinga, world-famous for its dawn Bhasma Aarti. The sprawling 900-meter Mahakal Lok corridor features 108 grand stone pillars and 200 sculptures depicting Shiva legends around Rudrasagar Lake.",
    nearestPracticalStation: {
      code: "UJN",
      name: "Ujjain Junction (UJN)",
      roadDistanceKm: 1.8,
      travelTime: "8 mins",
      notes: "PRACTICAL DIRECT STATION: Short ₹50 auto or e-rickshaw ride from UJN platform 1 exit to Mahakal Lok entrance."
    },
    alternativeStations: [{ code: "FTD", name: "Fatehabad Chandrawatiganj Jn", distanceKm: 22.0, travelTime: "30 mins" }],
    nearestBusTerminal: "Dewas Gate Bus Stand (opposite UJN station - 2 km)",
    recommendedTransport: "E-rickshaw to Mahakal Lok gate or pedestrian walking corridor.",
    nearbyAttractions: ["Harsiddhi Temple (0.5 km)", "Ram Ghat (0.8 km)", "Bade Ganeshji Ka Mandir (0.2 km)"]
  },
  {
    id: "att_harsiddhi",
    name: "Harsiddhi Temple (51 Shaktipeeths)",
    destinationId: "dest_ujjain",
    region: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.1802,
    lng: 75.7645,
    category: "Shaktipeeth / Deepstambh",
    isDetour: false,
    description: "Revered Shaktipeeth where Goddess Sati's elbow fell; legendary patron deity of King Vikramaditya. Famous for two colossal 50-ft multi-tiered stone lamp pillars (Deepstambhs) illuminated with over 1,000 oil lamps during evening aarti.",
    nearestPracticalStation: {
      code: "UJN",
      name: "Ujjain Junction",
      roadDistanceKm: 2.2,
      travelTime: "9 mins",
      notes: "Located just behind Rudrasagar Lake, 400m walk from Mahakaleshwar."
    },
    alternativeStations: [{ code: "FTD", name: "Fatehabad", distanceKm: 22.0, travelTime: "30 mins" }],
    nearestBusTerminal: "Mahakal Stand (500m)",
    recommendedTransport: "Walking from Mahakal temple through Mahakal Lok plaza.",
    nearbyAttractions: ["Mahakaleshwar (0.4 km)", "Ram Ghat (0.5 km)", "Char Dham Mandir (0.3 km)"]
  },
  {
    id: "att_kal_bhairav",
    name: "Kal Bhairav Temple",
    destinationId: "dest_ujjain",
    region: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.2125,
    lng: 75.7758,
    category: "Tantric Temple / Living Miracle",
    description: "Fierce guardian deity of Ujjain situated along the Kshipra river, famous for the centuries-old ritual where priests offer alcohol cups directly to the stone mouth of the deity, which disappears inside.",
    nearestPracticalStation: {
      code: "UJN",
      name: "Ujjain Junction",
      roadDistanceKm: 5.5,
      travelTime: "15 mins",
      notes: "Located in northern Ujjain along the river road."
    },
    alternativeStations: [{ code: "FTD", name: "Fatehabad", distanceKm: 25.0, travelTime: "35 mins" }],
    nearestBusTerminal: "Dewas Gate Stand (5 km)",
    recommendedTransport: "Auto-rickshaw or town bus along Bhairavgarh road.",
    nearbyAttractions: ["Mangalnath Temple (3 km)", "Bhartrihari Caves (2.5 km)", "Pir Matsyendranath (2 km)"]
  },
  {
    id: "att_mangalnath_sandipani",
    name: "Mangalnath Temple & Sandipani Ashram",
    destinationId: "dest_ujjain",
    region: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.2052,
    lng: 75.7822,
    category: "Astrological Origin / Sacred Gurukul",
    isDetour: false,
    description: "Mangalnath is celebrated in the Matsya Purana as the cosmic birthplace of Mars (Mangal Graha) and Prime Meridian of ancient Indian astronomy. Nearby Sandipani Ashram is the sacred Vedic gurukul where Lord Krishna, Balarama, and Sudama mastered the 64 arts.",
    nearestPracticalStation: {
      code: "UJN",
      name: "Ujjain Junction",
      roadDistanceKm: 4.8,
      travelTime: "14 mins",
      notes: "Situated along the scenic bend of the holy Kshipra river."
    },
    alternativeStations: [{ code: "FTD", name: "Fatehabad", distanceKm: 24.0, travelTime: "32 mins" }],
    nearestBusTerminal: "Mangalnath Auto Stand",
    recommendedTransport: "Auto-rickshaw or city tempo route.",
    nearbyAttractions: ["Kal Bhairav (2.5 km)", "Gomti Kund (inside Sandipani Ashram)"]
  },
  {
    id: "att_ram_ghat",
    name: "Ram Ghat & Kshipra Riverfront",
    destinationId: "dest_ujjain",
    region: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.1788,
    lng: 75.7622,
    category: "Ghats / Kumbh Mela Venue",
    isDetour: false,
    description: "The most sacred bathing ghat on the River Kshipra where millions take the holy dip during Simhastha Kumbh Mela. Scene of evening musical Deepdaan floating lamp ceremonies.",
    nearestPracticalStation: {
      code: "UJN",
      name: "Ujjain Junction",
      roadDistanceKm: 2.0,
      travelTime: "8 mins",
      notes: "Walking distance from Harsiddhi and Mahakal temples."
    },
    alternativeStations: [{ code: "FTD", name: "Fatehabad", distanceKm: 21.0, travelTime: "28 mins" }],
    nearestBusTerminal: "Ramghat Local Stop",
    recommendedTransport: "Walk through heritage lanes from Mahakaleshwar.",
    nearbyAttractions: ["Harsiddhi Temple (0.5 km)", "Mahakaleshwar (0.8 km)"]
  },

  // ================= 7. INDORE =================
  {
    id: "att_khajrana_ganesh",
    name: "Khajrana Ganesh Temple",
    destinationId: "dest_indore",
    region: "Indore",
    state: "Madhya Pradesh",
    lat: 22.7388,
    lng: 75.9082,
    category: "Temple / Wish-Fulfilling Shrine",
    isDetour: false,
    description: "Historic temple constructed in 1735 by Maharani Ahilyabai Holkar to protect the deity from Mughal desecration; one of Central India's most visited Ganesha shrines with an expansive community complex.",
    nearestPracticalStation: {
      code: "INDB",
      name: "Indore Junction (INDB)",
      roadDistanceKm: 6.2,
      travelTime: "18 mins",
      notes: "Direct AICTSL iBus corridor and shared auto routes along Ring Road."
    },
    alternativeStations: [{ code: "LMNR", name: "Laxmibai Nagar", distanceKm: 7.0, travelTime: "20 mins" }],
    nearestBusTerminal: "Khajrana Square iBus Station (600m)",
    recommendedTransport: "Indore iBus BRTS or app-based auto (Ola/Uber/Rapido).",
    nearbyAttractions: ["Bada Ganpati (7 km)", "Rajwada Palace (6 km)"]
  },
  {
    id: "att_rajwada_palace",
    name: "Rajwada Palace & Sarafa Bazaar",
    destinationId: "dest_indore",
    region: "Indore Central",
    state: "Madhya Pradesh",
    lat: 22.7188,
    lng: 75.8552,
    category: "Palace / Night Food Street",
    isDetour: false,
    description: "The 7-storey Indo-Saracenic and Maratha wooden palace of the Holkars (1766). At 9:00 PM, the adjoining jewelry market Sarafa Bazaar transforms into India's legendary midnight street food festival serving Bhutte Ka Kees, Garadu, and Joshi's Dahi Vada.",
    nearestPracticalStation: {
      code: "INDB",
      name: "Indore Junction",
      roadDistanceKm: 1.8,
      travelTime: "7 mins",
      notes: "Within walking distance or ₹40 auto from Sarwate bus stand & INDB station."
    },
    alternativeStations: [{ code: "LMNR", name: "Laxmibai Nagar", distanceKm: 4.5, travelTime: "14 mins" }],
    nearestBusTerminal: "Rajwada City Bus Stop / Sarwate Stand (1.8 km)",
    recommendedTransport: "Walking through heritage market or e-rickshaw.",
    nearbyAttractions: ["Sarafa Night Market (adjacent)", "Bada Ganpati (1.5 km)", "Kanch Mandir (1.2 km)"]
  },
  {
    id: "att_chappan_dukan",
    name: "Chappan Dukan (56 Shops Street)",
    destinationId: "dest_indore",
    region: "Indore",
    state: "Madhya Pradesh",
    lat: 22.7235,
    lng: 75.8825,
    category: "Culinary Capital / Street Food",
    isDetour: false,
    description: "Pedestrianised gourmet street housing exactly 56 legendary food establishments, celebrated for Johnny Hot Dog (pork/mutton/veg hotdogs), Vijay Chaat House Khopra Patties, and authentic Indori Poha Jalebi.",
    nearestPracticalStation: {
      code: "INDB",
      name: "Indore Junction",
      roadDistanceKm: 3.2,
      travelTime: "10 mins",
      notes: "Located in upscale New Palasia."
    },
    alternativeStations: [{ code: "DADN", name: "Mhow", distanceKm: 24.0, travelTime: "40 mins" }],
    nearestBusTerminal: "Palasia Bus Stop (300m)",
    recommendedTransport: "Auto-rickshaw or iBus to Palasia.",
    nearbyAttractions: ["Rajwada (3 km)", "Khajrana Ganesh (4 km)"]
  },
  {
    id: "att_lalbagh_palace",
    name: "Lal Bagh Palace",
    destinationId: "dest_indore",
    region: "Indore South",
    state: "Madhya Pradesh",
    lat: 22.6985,
    lng: 75.8455,
    category: "Palace / European Opulence",
    isDetour: false,
    description: "Sprawling 28-acre European palace built by Tukojirao Holkar II with entrance gates modeled on Buckingham Palace, Italian marble floors, Persian carpets, and grand Belgian chandeliers.",
    nearestPracticalStation: {
      code: "INDB",
      name: "Indore Junction",
      roadDistanceKm: 4.2,
      travelTime: "14 mins",
      notes: "Located along Khan River."
    },
    alternativeStations: [{ code: "DADN", name: "Mhow", distanceKm: 19.0, travelTime: "30 mins" }],
    nearestBusTerminal: "Lalbagh Bus Stop",
    recommendedTransport: "Auto-rickshaw or city taxi.",
    nearbyAttractions: ["Annapurna Temple (2 km)", "Rajwada (3.5 km)"]
  },
  {
    id: "att_patalpani",
    name: "Patalpani Waterfall",
    destinationId: "dest_indore",
    region: "Indore Outskirts / Mhow",
    state: "Madhya Pradesh",
    lat: 22.4988,
    lng: 75.7895,
    category: "Waterfall / Valley / Monsoon Beauty",
    isDetour: true,
    description: "Spectacular 300-ft roaring cascade surrounded by lush Vindhya hills, believed locally to drop straight into the netherworld (Patal). Scenic heritage train stop on Mhow-Kalakund route.",
    nearestPracticalStation: {
      code: "PTP",
      name: "Patalpani Railway Station (Heritage Line)",
      roadDistanceKm: 0.8,
      travelTime: "3 mins",
      notes: "Heritage hill train stops right at the falls. For broad gauge, use Dr. Ambedkar Nagar (DADN - 6 km)."
    },
    alternativeStations: [{ code: "DADN", name: "Dr. Ambedkar Nagar (Mhow)", distanceKm: 6.5, travelTime: "15 mins" }],
    nearestBusTerminal: "Mhow KSRTC Stand (7 km)",
    recommendedTransport: "Scenic Mhow-Kalakund Vistadome Heritage Toy Train or private car.",
    nearbyAttractions: ["Choral Dam (14 km)", "Janapav Kuti (Parashurama birthplace - 18 km)"]
  },

  // ================= 8. OMKARESHWAR =================
  {
    id: "att_omkareshwar_temple",
    name: "Omkareshwar Jyotirlinga (Mandhata Island)",
    destinationId: "dest_omkareshwar",
    region: "Omkareshwar",
    state: "Madhya Pradesh",
    lat: 22.2464,
    lng: 76.1511,
    category: "Jyotirlinga / Island Shrine",
    isDetour: false,
    description: "One of the 12 sacred Jyotirlingas, situated on the sacred island of Mandhata in the holy Narmada shaped naturally like the symbol 'Om'. Reached via suspension bridges (Jhula Pul) or river boat ferries.",
    nearestPracticalStation: {
      code: "OM",
      name: "Omkareshwar Road Station (OM)",
      roadDistanceKm: 12.0,
      travelTime: "25 mins",
      notes: "Omkareshwar Road station is 12 km west (passenger services). Practical broad-gauge trunk junction is Khandwa (KNW - 70 km) or Indore (INDB - 77 km) with direct buses."
    },
    alternativeStations: [
      { code: "KNW", name: "Khandwa Junction", distanceKm: 70.0, travelTime: "1 hr 45 mins" },
      { code: "INDB", name: "Indore Junction", distanceKm: 77.0, travelTime: "2 hrs 15 mins" }
    ],
    nearestBusTerminal: "Omkareshwar Nagar Parishad Bus Stand (500m walk to Jhula Pul)",
    recommendedTransport: "MP State bus to Omkareshwar bus stand + walking across Jhula Pul suspension bridge or country boat crossing.",
    nearbyAttractions: ["Mamleshwar Temple (0.6 km across bridge)", "7km Omkareshwar Parikrama Path", "Kaveri Sangam (1.5 km)"]
  },
  {
    id: "att_mamleshwar",
    name: "Mamleshwar Temple (Amareshwar)",
    destinationId: "dest_omkareshwar",
    region: "Omkareshwar Mainland",
    state: "Madhya Pradesh",
    lat: 22.2425,
    lng: 76.1505,
    category: "Jyotirlinga / Heritage Shrine",
    isDetour: false,
    description: "Located on the southern mainland bank opposite Mandhata Island. Traditionally, the Jyotirlinga darshan is incomplete without visiting both Omkareshwar (on the island) and Mamleshwar (on mainland).",
    nearestPracticalStation: {
      code: "OM",
      name: "Omkareshwar Road",
      roadDistanceKm: 11.5,
      travelTime: "22 mins",
      notes: "Accessible by road from south bank or by crossing the pedestrian bridge from the island."
    },
    alternativeStations: [{ code: "KNW", name: "Khandwa Jn", distanceKm: 69.0, travelTime: "1 hr 40 mins" }],
    nearestBusTerminal: "South Bank Bus Stop / Omkareshwar Stand",
    recommendedTransport: "Walk across the new pedestrian bridge or Jhula Pul.",
    nearbyAttractions: ["Omkareshwar Island (0.6 km)", "Gauri Somnath Temple (1.2 km)"]
  },
  {
    id: "att_omkareshwar_parikrama",
    name: "Omkareshwar 7-km Island Parikrama Path",
    destinationId: "dest_omkareshwar",
    region: "Omkareshwar Island",
    state: "Madhya Pradesh",
    lat: 22.2512,
    lng: 76.1565,
    category: "Pilgrimage Trek / Scenic River Circuit",
    isDetour: false,
    description: "A consecrated 7-kilometer circumambulation path traversing the rocky perimeter of the Om-shaped island, passing ancient Kalchuri and Paramara ruins, Sangam point, and cliffside shrines.",
    nearestPracticalStation: {
      code: "OM",
      name: "Omkareshwar Road",
      roadDistanceKm: 12.0,
      travelTime: "25 mins",
      notes: "Pedestrian hiking trail starting and ending at Omkareshwar Temple."
    },
    alternativeStations: [{ code: "INDB", name: "Indore", distanceKm: 77.0, travelTime: "2 hrs 15 mins" }],
    nearestBusTerminal: "Omkareshwar Bus Stand",
    recommendedTransport: "Foot journey (takes ~2.5 to 3 hours).",
    nearbyAttractions: ["Rinn Mukteshwar Temple", "Kaveri-Narmada Sangam", "Gauri Somnath Colossal Nandi"]
  },

  // ================= 9. MAHESHWAR =================
  {
    id: "att_ahilya_fort",
    name: "Ahilya Fort & Maheshwar Palace",
    destinationId: "dest_maheshwar",
    region: "Maheshwar",
    state: "Madhya Pradesh",
    lat: 22.1764,
    lng: 75.5866,
    category: "Fort / Royal Residence / Museum",
    isDetour: false,
    description: "Magnificent 18th-century stone fort perched high above the Narmada River, seat of the pious Queen Ahilyabai Holkar; houses her personal shrine, palanquin room, and royal heirloom museum.",
    nearestPracticalStation: {
      code: "DADN",
      name: "Dr. Ambedkar Nagar / Mhow",
      roadDistanceKm: 65.0,
      travelTime: "1 hr 30 mins",
      notes: "PRACTICAL BG RAILHEAD: Direct road down the scenic Jam Ghat to Maheshwar. For major express trains, Indore (INDB - 90 km) or Khandwa (KNW - 110 km) are best."
    },
    alternativeStations: [
      { code: "INDB", name: "Indore Junction", distanceKm: 90.0, travelTime: "2 hrs 15 mins" },
      { code: "KNW", name: "Khandwa Junction", distanceKm: 110.0, travelTime: "2 hrs 45 mins" }
    ],
    nearestBusTerminal: "Maheshwar Bus Stand (Old Fort Road - 600m walk)",
    recommendedTransport: "Direct bus from Indore Sarwate stand or Omkareshwar (65 km via Barwaha).",
    nearbyAttractions: ["Ahilya Ghat (directly below fort)", "Ahilyeshwar Temple (100m)", "Rehwa Society Handloom (inside fort complex)"]
  },
  {
    id: "att_ahilya_ghat",
    name: "Ahilya Ghat & Ahilyeshwar Temple",
    destinationId: "dest_maheshwar",
    region: "Maheshwar Riverfront",
    state: "Madhya Pradesh",
    lat: 22.1755,
    lng: 75.5872,
    category: "River Ghats / Stone Carvings",
    isDetour: false,
    description: "One of the most photogenic riverfronts in India, praised for symmetrical stone flights of stairs, cenotaphs (chhatris), and the Ahilyeshwar Temple featuring intricate Maratha stone filigree and dancers.",
    nearestPracticalStation: {
      code: "DADN",
      name: "Mhow",
      roadDistanceKm: 65.0,
      travelTime: "1 hr 30 mins",
      notes: "Direct stone stairs lead from the fort down to the water."
    },
    alternativeStations: [{ code: "INDB", name: "Indore", distanceKm: 90.0, travelTime: "2 hrs 15 mins" }],
    nearestBusTerminal: "Maheshwar Stand (700m)",
    recommendedTransport: "Walking through fort gates down to ghats + wooden boat ride across Narmada.",
    nearbyAttractions: ["Baneshwar Mahadev (mid-river island temple)", "Ek Mukhi Datta Temple (2 km)"]
  },
  {
    id: "att_rehwa_society",
    name: "Rehwa Society & Maheshwari Handloom Weavers",
    destinationId: "dest_maheshwar",
    region: "Maheshwar",
    state: "Madhya Pradesh",
    lat: 22.1772,
    lng: 75.5858,
    category: "Craft / Handloom Heritage",
    isDetour: false,
    description: "Established by the Holkar royal family to revive the traditional weaving craft of royal Maheshwari silk and cotton sarees with distinctive zari borders and geometric pallus.",
    nearestPracticalStation: {
      code: "DADN",
      name: "Mhow",
      roadDistanceKm: 65.0,
      travelTime: "1 hr 30 mins",
      notes: "Located inside the Ahilya Fort compound."
    },
    alternativeStations: [{ code: "INDB", name: "Indore", distanceKm: 90.0, travelTime: "2 hrs 15 mins" }],
    nearestBusTerminal: "Maheshwar Stand",
    recommendedTransport: "Walking inside fort precinct.",
    nearbyAttractions: ["Ahilya Fort (100m)", "Maheshwar Bazaar (400m)"]
  },

  // ================= 10. MANDU (MANDAVGARH) =================
  {
    id: "att_jahaz_mahal",
    name: "Jahaz Mahal (Ship Palace) & Hindola Mahal",
    destinationId: "dest_mandu",
    region: "Mandu",
    state: "Madhya Pradesh",
    lat: 22.3662,
    lng: 75.4024,
    category: "Medieval Palace / Afghan Architecture",
    isDetour: true,
    description: "Architectural triumph of Sultan Ghiyas-ud-din Khilji; a two-storey palace built between two artificial lakes (Kapur and Munj) appearing like a floating royal ship, adjacent to Hindola Mahal (Swinging Palace with 77-degree sloping walls).",
    nearestPracticalStation: {
      code: "DADN",
      name: "Dr. Ambedkar Nagar / Mhow",
      roadDistanceKm: 60.0,
      travelTime: "1 hr 30 mins",
      notes: "PRACTICAL BROAD GAUGE RAILHEAD: Mandu has no railway line. Mhow or Indore (98 km) or Ratlam (120 km) are the transfer hubs."
    },
    alternativeStations: [
      { code: "INDB", name: "Indore Junction", distanceKm: 98.0, travelTime: "2 hrs 30 mins" },
      { code: "RTM", name: "Ratlam Junction", distanceKm: 120.0, travelTime: "2 hrs 45 mins" }
    ],
    nearestBusTerminal: "Mandu Local Bus Stand (1 km) / Dhar Central Bus Depot (35 km)",
    recommendedTransport: "Direct bus from Indore Gangwal Stand (via Dhar) or hired taxi from Maheshwar (45 km).",
    nearbyAttractions: ["Hindola Mahal (200m)", "Hoshang Shah's Tomb (1 km)", "Jami Masjid (1 km)"]
  },
  {
    id: "att_roopmati_pavilion",
    name: "Rani Roopmati Pavilion & Baz Bahadur Palace",
    destinationId: "dest_mandu",
    region: "Mandu Southern Edge",
    state: "Madhya Pradesh",
    lat: 22.3325,
    lng: 75.4085,
    category: "Pavilion / Romantic Legend / Valley View",
    isDetour: true,
    description: "Perched dramatically on the southern cliff edge of the Mandu plateau (365m above the plains) where poetess Queen Roopmati gazed down at the silver thread of River Narmada, alongside Sultan Baz Bahadur's palace with musical courtyards.",
    nearestPracticalStation: {
      code: "DADN",
      name: "Mhow",
      roadDistanceKm: 65.0,
      travelTime: "1 hr 45 mins",
      notes: "Terminal point of the Mandu plateau heritage drive."
    },
    alternativeStations: [{ code: "INDB", name: "Indore", distanceKm: 104.0, travelTime: "2 hrs 40 mins" }],
    nearestBusTerminal: "Mandu Stand (4.5 km)",
    recommendedTransport: "Rented scooter or auto from Mandu village.",
    nearbyAttractions: ["Baz Bahadur Palace (1 km)", "Rewa Kund (1.2 km)"]
  },
  {
    id: "att_hoshang_shah_tomb",
    name: "Hoshang Shah's Tomb & Jami Masjid",
    destinationId: "dest_mandu",
    region: "Mandu Village Core",
    state: "Madhya Pradesh",
    lat: 22.3555,
    lng: 75.4055,
    category: "Tomb / Marble Monument",
    isDetour: true,
    description: "India's first completely marble-clad structure (1440 CE) with crescent finial, lattice jaalis, and Afghan dome; served as the direct architectural template for Shah Jahan's architects before building the Taj Mahal.",
    nearestPracticalStation: {
      code: "DADN",
      name: "Mhow",
      roadDistanceKm: 61.0,
      travelTime: "1 hr 35 mins",
      notes: "Located inside Mandu village center."
    },
    alternativeStations: [{ code: "INDB", name: "Indore", distanceKm: 99.0, travelTime: "2 hrs 30 mins" }],
    nearestBusTerminal: "Mandu Stand (400m)",
    recommendedTransport: "Walking or bicycle in Mandu village.",
    nearbyAttractions: ["Jami Masjid (adjacent)", "Ashrafi Mahal (opposite)", "Neelkanth Temple (3.5 km)"]
  },

  // ================= 11. NASHIK & TRIMBAKESHWAR =================
  {
    id: "att_trimbakeshwar_jyotirlinga",
    name: "Trimbakeshwar Jyotirlinga & Kushavarta Kund",
    destinationId: "dest_trimbakeshwar",
    region: "Trimbakeshwar",
    state: "Maharashtra",
    lat: 19.9328,
    lng: 73.5307,
    category: "Jyotirlinga / River Godavari Origin",
    isDetour: false,
    description: "One of the 12 supreme Jyotirlingas, extraordinary for enshrining a three-faced lingam representing the holy Trinity: Brahma, Vishnu, and Rudra. Adjacent Kushavarta pond is the sacred reservoir where Sage Gautama gathered River Godavari.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road Railway Station (NK)",
      roadDistanceKm: 36.5,
      travelTime: "50 mins",
      notes: "PRACTICAL RAILHEAD: Central Railway trunk station with dozens of trains from Mumbai, MP, and UP. Direct MSRTC red buses and shared taxis run to Trimbak every 10 mins from CBS."
    },
    alternativeStations: [
      { code: "DVL", name: "Devlali", distanceKm: 34.0, travelTime: "50 mins" },
      { code: "IGP", name: "Igatpuri", distanceKm: 48.0, travelTime: "1 hr 10 mins" }
    ],
    nearestBusTerminal: "Trimbakeshwar MSRTC Bus Stand (300m walk to temple gate)",
    recommendedTransport: "MSRTC bus from Nashik CBS or private cab directly to temple gate.",
    nearbyAttractions: ["Brahmagiri Mountain Trek (steps behind temple)", "Anjaneri Hills (7 km)", "Kushavarta Kund (200m)"]
  },
  {
    id: "att_brahmagiri_anjaneri",
    name: "Brahmagiri Mountain Trek & Anjaneri Hills",
    destinationId: "dest_trimbakeshwar",
    region: "Trimbakeshwar / Anjaneri",
    state: "Maharashtra",
    lat: 19.9255,
    lng: 73.5185,
    category: "Sacred Mountain Trek / Hanuman Birthplace",
    isDetour: false,
    description: "Brahmagiri (1,295m) is climbed via 750 stone-carved steps to the Gangadwar cave where River Godavari trickles from Gomukh. Anjaneri hill (7 km east) is revered as the birthplace of Lord Hanuman.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 37.0,
      travelTime: "55 mins",
      notes: "Trek base begins immediately at the rear boundary of Trimbakeshwar town."
    },
    alternativeStations: [{ code: "IGP", name: "Igatpuri", distanceKm: 45.0, travelTime: "1 hr 5 mins" }],
    nearestBusTerminal: "Trimbakeshwar Stand (1 km to Brahmagiri steps) / Anjaneri Phata (on highway)",
    recommendedTransport: "Walking from temple to Gangadwar steps / Auto to Anjaneri base.",
    nearbyAttractions: ["Dugarwadi Waterfall (8 km)", "Coin Museum (6 km)"]
  },
  {
    id: "att_panchavati_kalaram",
    name: "Panchavati, Sita Gufa & Kalaram Temple",
    destinationId: "dest_nashik",
    region: "Nashik City",
    state: "Maharashtra",
    lat: 20.0055,
    lng: 73.7925,
    category: "Ramayana Heritage / Temple",
    isDetour: false,
    description: "Sacred grove of five banyan trees where Lord Rama, Sita, and Lakshmana stayed during their exile. Kalaram Temple (1788) is built entirely from black stone; Sita Gufa is the cave from where Ravana abducted Sita.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road Railway Station",
      roadDistanceKm: 8.5,
      travelTime: "22 mins",
      notes: "City buses #10 and continuous shared autos connect Nashik Road station to Panchavati."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 12.0, travelTime: "28 mins" }],
    nearestBusTerminal: "Panchavati Bus Stop / Nimani Bus Stand (500m)",
    recommendedTransport: "Auto-rickshaw or city bus from Nashik Road.",
    nearbyAttractions: ["Ramkund Ghat (0.4 km)", "Kapaleshwar Mahadev (0.3 km)", "Sundarnarayan Temple (0.6 km)"]
  },
  {
    id: "att_ramkund_godavari",
    name: "Ramkund & Godavari River Ghats",
    destinationId: "dest_nashik",
    region: "Nashik City",
    state: "Maharashtra",
    lat: 20.0042,
    lng: 73.7912,
    category: "Sacred Ghats / Kumbh Mela Epicenter",
    isDetour: false,
    description: "The holiest bathing tank in Nashik on the Godavari River, venue of the Nasik Kumbh Mela Shahi Snan. Lord Rama is believed to have performed his father Dasharatha's funeral rites here.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 8.2,
      travelTime: "20 mins",
      notes: "Located at the heart of old Nashik."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 11.5, travelTime: "25 mins" }],
    nearestBusTerminal: "Panchavati Stand (400m)",
    recommendedTransport: "Heritage walking circuit around Panchavati ghats.",
    nearbyAttractions: ["Kapaleshwar Temple (200m)", "Gandhi Memorial (100m)", "Kalaram (400m)"]
  },
  {
    id: "att_muktidham",
    name: "Muktidham Temple (Makrana Marble)",
    destinationId: "dest_nashik",
    region: "Nashik Road",
    state: "Maharashtra",
    lat: 19.9575,
    lng: 73.8345,
    category: "Marble Complex / 12 Jyotirlingas Replica",
    isDetour: false,
    description: "Pure white Makrana marble temple complex containing full-scale replicas of all 12 Jyotirlingas, with the 18 chapters of Bhagavad Gita inscribed upon its marble walls.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road Railway Station",
      roadDistanceKm: 1.5,
      travelTime: "5 mins (walkable)",
      notes: "Station is right next door! Ideal first stop when arriving at Nashik Road."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 4.5, travelTime: "10 mins" }],
    nearestBusTerminal: "Nashik Road Bus Depot (1.2 km)",
    recommendedTransport: "5-minute auto or 15-minute walk from station exit.",
    nearbyAttractions: ["Devlali Cantonment (5 km)", "Panchavati (9 km)"]
  },
  {
    id: "att_pandavleni_caves",
    name: "Pandav Leni Caves (Trirashmi Caves)",
    destinationId: "dest_nashik",
    region: "Nashik South / Mumbai Highway",
    state: "Maharashtra",
    lat: 19.9612,
    lng: 73.7485,
    category: "Rock-Cut Buddhist Caves / 2nd Century BCE",
    isDetour: false,
    description: "Ancient group of 24 rock-cut Hinayana Buddhist monasteries (viharas and chaityas) carved into the Trirashmi hill between the 2nd century BCE and 2nd century CE, offering panoramic views of the city.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 12.0,
      travelTime: "25 mins",
      notes: "Located right on NH-848 / Mumbai-Agra highway."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 10.0, travelTime: "20 mins" }],
    nearestBusTerminal: "Pathardi Phata Bus Stop (1 km)",
    recommendedTransport: "City bus or auto to base, then ascend 300 steps.",
    nearbyAttractions: ["Dadasaheb Phalke Smarak (at base)", "Buddha Smarak"]
  },
  {
    id: "att_sula_vineyards",
    name: "Sula Vineyards & Gangapur Dam Backwaters",
    destinationId: "dest_nashik",
    region: "Gangapur / Nashik West",
    state: "Maharashtra",
    lat: 20.0055,
    lng: 73.6885,
    category: "Vineyard Country / Scenic Lake",
    isDetour: true,
    description: "India's premier wine-tourism estate on Gangapur backwaters; features sprawling grape vineyards, Italian wine-tasting rooms, amphitheatres, and quiet country roads.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 21.0,
      travelTime: "40 mins",
      notes: "Scenic drive heading west toward Gangapur lake."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 23.0, travelTime: "45 mins" }],
    nearestBusTerminal: "Gangapur Village Bus Stop (2.5 km)",
    recommendedTransport: "Private taxi or auto-rickshaw from Nashik city.",
    nearbyAttractions: ["York Winery (2 km)", "Gangapur Dam Promenade (4 km)", "Someshwar Waterfall (8 km)"]
  },
  {
    id: "att_dugarwadi_waterfall",
    name: "Dugarwadi Waterfall",
    destinationId: "dest_trimbakeshwar",
    region: "Trimbak Valley",
    state: "Maharashtra",
    lat: 19.9688,
    lng: 73.4855,
    category: "Waterfall / Forest Canyon",
    isDetour: true,
    description: "Magnificent natural cascade nestled deep inside a dense forest canyon in the Sahyadris, reached via a 2-km nature trail through teak forests.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 42.0,
      travelTime: "1 hr 10 mins",
      notes: "Located 8 km past Trimbakeshwar on the Jawhar road."
    },
    alternativeStations: [{ code: "IGP", name: "Igatpuri", distanceKm: 52.0, travelTime: "1 hr 20 mins" }],
    nearestBusTerminal: "Sapgaon Phata (2 km)",
    recommendedTransport: "Private vehicle from Trimbakeshwar + 20-min forest trek.",
    nearbyAttractions: ["Trimbakeshwar Temple (8 km)", "Brahmagiri (10 km)"]
  },
  {
    id: "att_someshwar_waterfall",
    name: "Someshwar Waterfall (Dudhsagar) & Temple",
    destinationId: "dest_nashik",
    region: "Someshwar",
    state: "Maharashtra",
    lat: 20.0185,
    lng: 73.7425,
    category: "Waterfall / River Temple",
    isDetour: false,
    description: "Picturesque 10m waterfall on the Godavari River that turns milky white during the monsoon, accompanied by the ancient Someshwar Mahadev temple and landscaped riverside gardens.",
    nearestPracticalStation: {
      code: "NK",
      name: "Nashik Road",
      roadDistanceKm: 14.0,
      travelTime: "30 mins",
      notes: "En route to Gangapur Dam."
    },
    alternativeStations: [{ code: "DVL", name: "Devlali", distanceKm: 16.0, travelTime: "35 mins" }],
    nearestBusTerminal: "Someshwar Bus Stop (400m)",
    recommendedTransport: "City bus from Old CBS or auto.",
    nearbyAttractions: ["Balaji Temple Gangapur (2 km)", "Sula Vineyards (9 km)"]
  },
  {
    id: "att_igatpuri_bhavali",
    name: "Igatpuri, Bhavali Dam & Vipassana Pagoda",
    destinationId: "dest_nashik",
    region: "Igatpuri Hill Station (Detour)",
    state: "Maharashtra",
    lat: 19.6965,
    lng: 73.5585,
    category: "Hill Station / Dam / Meditation Centre",
    isDetour: true,
    description: "Famous hill station on the crest of Kasara Ghat, home to the golden Myanmar-style Dhamma Giri Vipassana Pagoda, misty Tringalwadi Fort, and the roaring spillways of Bhavali Dam.",
    nearestPracticalStation: {
      code: "IGP",
      name: "Igatpuri Railway Station (IGP)",
      roadDistanceKm: 2.0,
      travelTime: "6 mins",
      notes: "Major DC-AC traction changeover junction on Central Railway mainline. All express trains stop."
    },
    alternativeStations: [{ code: "NK", name: "Nashik Road", distanceKm: 48.0, travelTime: "1 hr" }],
    nearestBusTerminal: "Igatpuri MSRTC Stand",
    recommendedTransport: "Express train from Nashik Road (40 mins) or drive down NH-160.",
    nearbyAttractions: ["Bhavali Dam (8 km)", "Tringalwadi Fort (10 km)", "Camel Valley (3 km)"]
  }
];

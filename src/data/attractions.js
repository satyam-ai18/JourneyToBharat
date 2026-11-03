// Comprehensive Tourist Attractions and Discovered Sights
// Fully annotated with exact coordinates, nearest practical railway station vs geographical station,
// road/walking distances, travel time, and transit recommendations.

export const ATTRACTIONS = [
  // ================= ANDHRA PRADESH =================
  {
    id: "att-tirumala",
    name: "Tirumala Venkateswara Temple",
    region: "Andhra Pradesh",
    destinationId: "tirupati",
    lat: 13.6833,
    lng: 79.3472,
    category: "Temple / Pilgrimage",
    description: "One of the most visited sacred shrines in the world, dedicated to Lord Venkateswara (Balaji) atop the Seven Hills of Seshachalam at 853m elevation.",
    nearestPracticalStation: {
      code: "TPTY",
      name: "Tirupati Main (TPTY)",
      roadDistanceKm: 22.0,
      travelTime: "50 mins (ghat road)",
      notes: "PRACTICAL CHOICE: 24/7 APSRTC electric buses every 3 mins from station forecourt to hilltop. Do NOT use nearest small stations without ghat transport."
    },
    alternativeStations: [
      { code: "RU", name: "Renigunta Jn", distanceKm: 31.0, travelTime: "1 hr 15 mins" },
      { code: "CGR", name: "Chandragiri", distanceKm: 28.0, travelTime: "1 hr" }
    ],
    nearestBusTerminal: "Tirumala CRO Bus Stand (Hilltop) / APSRTC Central Bus Station Tirupati",
    recommendedTransport: "APSRTC Hill Bus (₹65 round-trip) or pre-booked TTD Electric Taxi; two-wheelers allowed only 06:00-18:00.",
    nearbyAttractions: ["Silathoranam (1.5 km)", "Papavinasam Theertham (5 km)", "Srivari Padalu (4 km)"]
  },
  {
    id: "att-kalahasti",
    name: "Sri Kalahasti Temple",
    region: "Andhra Pradesh",
    destinationId: "tirupati",
    lat: 13.7498,
    lng: 79.7036,
    category: "Temple / Heritage",
    description: "Ancient Vayu Lingam (Wind Element) Pancha Bhoota shrine situated on the banks of Swarnamukhi River, famed for Rahu-Ketu Sarpa Dosha Nivarana puja.",
    nearestPracticalStation: {
      code: "KHT",
      name: "Sri Kalahasti (KHT)",
      roadDistanceKm: 2.2,
      travelTime: "8 mins",
      notes: "Walkable or ₹40 auto ride directly to Rajagopuram. Halts many express trains between Vijayawada and Tirupati."
    },
    alternativeStations: [
      { code: "RU", name: "Renigunta Jn", distanceKm: 26.0, travelTime: "35 mins" },
      { code: "TPTY", name: "Tirupati Main", distanceKm: 38.0, travelTime: "50 mins" }
    ],
    nearestBusTerminal: "Sri Kalahasti APSRTC Bus Stand (1.5 km)",
    recommendedTransport: "APSRTC Nonstop Palle Velugu bus from Tirupati CBS (every 15 mins, ₹45).",
    nearbyAttractions: ["Bharadwaja Theertham (1 km)", "Durgambika Temple Hill (2 km)"]
  },
  {
    id: "att-kanipakam",
    name: "Kanipakam Vinayaka Temple",
    region: "Andhra Pradesh",
    destinationId: "tirupati",
    lat: 13.2762,
    lng: 79.0345,
    category: "Temple / Pilgrimage",
    description: "Historic 11th-century Chola temple of Lord Ganesha located in the Bahuda River; the swayambhu (self-manifested) idol is renowned for expanding in size inside a natural well.",
    nearestPracticalStation: {
      code: "CTO",
      name: "Chittoor Railway Station (CTO)",
      roadDistanceKm: 12.0,
      travelTime: "20 mins",
      notes: "Chittoor station is directly connected by Bangalore-Tirupati express trains. Auto or town bus to temple."
    },
    alternativeStations: [
      { code: "TPTY", name: "Tirupati Main", distanceKm: 72.0, travelTime: "1 hr 45 mins" }
    ],
    nearestBusTerminal: "Kanipakam Temple Bus Stop / Chittoor APSRTC Bus Stand",
    recommendedTransport: "Direct APSRTC bus from Tirupati CBS or Chittoor town.",
    nearbyAttractions: ["Ardhagiri Veeranjaneya Temple (18 km)", "Chittoor Fort (14 km)"]
  },
  {
    id: "att-silathoranam",
    name: "Silathoranam (Natural Rock Arch)",
    region: "Andhra Pradesh",
    destinationId: "tirupati",
    lat: 13.6912,
    lng: 79.3512,
    category: "Nature / Geological Wonder",
    description: "Rare natural geological arch formation dating back 2.5 billion years to the Pre-Cambrian era, located 1 km north of Tirumala Temple in Chakra Theertham gardens.",
    nearestPracticalStation: {
      code: "TPTY",
      name: "Tirupati Main",
      roadDistanceKm: 23.5,
      travelTime: "55 mins",
      notes: "Located inside the Tirumala hill protected sanctuary zone."
    },
    alternativeStations: [{ code: "RU", name: "Renigunta Jn", distanceKm: 32.5, travelTime: "1 hr 20 mins" }],
    nearestBusTerminal: "Tirumala CRO Bus Stand (1.8 km)",
    recommendedTransport: "Free TTD electric bus or 20-min walking trail from Tirumala Temple.",
    nearbyAttractions: ["Tirumala Venkateswara Temple (1.5 km)", "Chakra Theertham (0.5 km)"]
  },
  {
    id: "att-chandragiri",
    name: "Chandragiri Fort & Raja Mahal",
    region: "Andhra Pradesh",
    destinationId: "tirupati",
    lat: 13.5833,
    lng: 79.3175,
    category: "Heritage / Fort",
    description: "11th-century fortified capital of the Vijayanagara Empire with imposing granite walls, crown-shaped towers, and the Indo-Saracenic Raja Mahal archaeological museum.",
    nearestPracticalStation: {
      code: "CGR",
      name: "Chandragiri (CGR)",
      roadDistanceKm: 2.0,
      travelTime: "5 mins",
      notes: "Small halt with passenger train connectivity. For express trains use TPTY."
    },
    alternativeStations: [{ code: "TPTY", name: "Tirupati Main", distanceKm: 14.0, travelTime: "25 mins" }],
    nearestBusTerminal: "Chandragiri Bus Stop (1 km)",
    recommendedTransport: "City bus #111 or auto-rickshaw from Tirupati central.",
    nearbyAttractions: ["Talakona Waterfalls (35 km)", "Kalyani Dam (8 km)"]
  },

  // ================= CHENNAI & MAHABALIPURAM =================
  {
    id: "att-marina",
    name: "Marina Beach",
    region: "Chennai",
    destinationId: "chennai",
    lat: 13.0500,
    lng: 80.2824,
    category: "Beach / Landmark",
    description: "World's second-longest natural urban beach extending 13 km along the Coromandel Coast, featuring memorials, lighthouse, and vibrant street food stalls.",
    nearestPracticalStation: {
      code: "MS",
      name: "Chennai Egmore (MS) / Chepauk MRTS",
      roadDistanceKm: 3.5,
      travelTime: "12 mins",
      notes: "Chepauk MRTS station is 400m walk. From Egmore or Central, 10 mins by auto or metro."
    },
    alternativeStations: [
      { code: "MAS", name: "MGR Chennai Central", distanceKm: 4.5, travelTime: "15 mins" }
    ],
    nearestBusTerminal: "Marina Beach / Vivekanandar Illam MTC Bus Stop",
    recommendedTransport: "MTC Bus #21G, #27D or Chennai Metro to LIC / Government Estate + 10-min walk.",
    nearbyAttractions: ["Kapaleeshwarar Temple (3 km)", "Fort St. George (4 km)", "Santhome Basilica (2 km)"]
  },
  {
    id: "att-kapaleeshwarar",
    name: "Kapaleeshwarar Temple (Mylapore)",
    region: "Chennai",
    destinationId: "chennai",
    lat: 13.0336,
    lng: 80.2699,
    category: "Temple / Heritage",
    description: "Architectural masterpiece of 7th-century Dravidian craftsmanship dedicated to Lord Shiva, featuring an intricately carved 37-meter rainbow gopuram and a tranquil sacred tank.",
    nearestPracticalStation: {
      code: "MS",
      name: "Chennai Egmore (or Thirumayilai MRTS)",
      roadDistanceKm: 5.5,
      travelTime: "18 mins",
      notes: "Thirumayilai MRTS station is just 300m walking distance from the temple tank."
    },
    alternativeStations: [{ code: "MAS", name: "Chennai Central", distanceKm: 7.0, travelTime: "22 mins" }],
    nearestBusTerminal: "Mylapore Tank Bus Stand (100m)",
    recommendedTransport: "MRTS train to Thirumayilai or auto-rickshaw from Central.",
    nearbyAttractions: ["Marina Beach (2.5 km)", "Santhome Cathedral (1.5 km)", "Ramakrishna Math (1.2 km)"]
  },
  {
    id: "att-fortstgeorge",
    name: "Fort St. George & St. Mary's Church",
    region: "Chennai",
    destinationId: "chennai",
    lat: 13.0792,
    lng: 80.2872,
    category: "Heritage / Colonial",
    description: "The first English fortress constructed in India by the East India Company in 1644; now houses the Tamil Nadu Legislative Assembly, Fort Museum, and India's oldest Anglican church.",
    nearestPracticalStation: {
      code: "MAS",
      name: "MGR Chennai Central (MAS)",
      roadDistanceKm: 2.0,
      travelTime: "8 mins",
      notes: "Walkable via Fort MRTS station or 8-min auto ride from Central."
    },
    alternativeStations: [{ code: "MSB", name: "Chennai Beach", distanceKm: 1.5, travelTime: "6 mins" }],
    nearestBusTerminal: "Fort Bus Stop / Central MTC Terminus",
    recommendedTransport: "Suburban train to Chennai Beach/Fort or short auto ride.",
    nearbyAttractions: ["Marina Beach (2.5 km)", "Madras High Court (1 km)"]
  },
  {
    id: "att-shoretemple",
    name: "Shore Temple (Mamallapuram)",
    region: "Mahabalipuram",
    destinationId: "mahabalipuram",
    lat: 12.6166,
    lng: 80.1989,
    category: "UNESCO Heritage / Temple",
    description: "8th-century monolithic structural granite temple built by Pallava king Rajasimha overlooking the roaring Bay of Bengal waves, UNESCO World Heritage inscribed.",
    nearestPracticalStation: {
      code: "CGL",
      name: "Chengalpattu Junction (CGL)",
      roadDistanceKm: 29.5,
      travelTime: "45 mins",
      notes: "PRACTICAL RAILHEAD: Direct broad-gauge trains from across South India. Board TNSTC bus #108 right outside station to temple."
    },
    alternativeStations: [
      { code: "TBM", name: "Tambaram", distanceKm: 52.0, travelTime: "1 hr 15 mins" },
      { code: "MS", name: "Chennai Egmore", distanceKm: 56.0, travelTime: "1 hr 30 mins" }
    ],
    nearestBusTerminal: "Mamallapuram Town Bus Stand (800m walk)",
    recommendedTransport: "TNSTC Bus #108 from Chengalpattu or ECR AC Deluxe Bus #588 from Chennai.",
    nearbyAttractions: ["Pancha Rathas (1.5 km)", "Krishna's Butter Ball (1 km)", "Descent of the Ganges (0.8 km)"]
  },
  {
    id: "att-pancharathas",
    name: "Pancha Rathas (Five Rathas)",
    region: "Mahabalipuram",
    destinationId: "mahabalipuram",
    lat: 12.6108,
    lng: 80.1925,
    category: "UNESCO Heritage / Monolithic",
    description: "Five monolithic processional chariot shrines carved out of single pink granite boulders in the 7th century, named after the Pandavas and Draupadi.",
    nearestPracticalStation: {
      code: "CGL",
      name: "Chengalpattu Junction",
      roadDistanceKm: 30.0,
      travelTime: "45 mins",
      notes: "Short auto or cycle ride from Mahabalipuram town centre."
    },
    alternativeStations: [{ code: "TBM", name: "Tambaram", distanceKm: 53.0, travelTime: "1 hr 20 mins" }],
    nearestBusTerminal: "Mamallapuram Town Stand (1.2 km)",
    recommendedTransport: "Rented geared bicycle or walking along the heritage zone.",
    nearbyAttractions: ["Shore Temple (1.5 km)", "Mahabalipuram Lighthouse (0.8 km)"]
  },
  {
    id: "att-butterball",
    name: "Krishna's Butter Ball & Descent of the Ganges",
    region: "Mahabalipuram",
    destinationId: "mahabalipuram",
    lat: 12.6178,
    lng: 80.1928,
    category: "UNESCO Heritage / Wonder",
    description: "A gigantic 250-ton spherical granite boulder perched defying gravity on a 45-degree smooth rock slope, flanked by the massive open-air relief 'Descent of the Ganges' (Arjuna's Penance).",
    nearestPracticalStation: {
      code: "CGL",
      name: "Chengalpattu Junction",
      roadDistanceKm: 29.0,
      travelTime: "40 mins",
      notes: "Part of the central Mamallapuram archaeological park."
    },
    alternativeStations: [{ code: "MS", name: "Chennai Egmore", distanceKm: 55.0, travelTime: "1 hr 25 mins" }],
    nearestBusTerminal: "Mamallapuram Town Bus Stand (500m)",
    recommendedTransport: "5-minute walk from the town bus terminal.",
    nearbyAttractions: ["Varaha Cave Temple (0.3 km)", "Shore Temple (1 km)"]
  },

  // ================= PONDICHERRY =================
  {
    id: "att-auroville",
    name: "Auroville & Matrimandir",
    region: "Pondicherry",
    destinationId: "pondicherry",
    lat: 11.9808,
    lng: 79.8000,
    category: "Universal Township / Meditation",
    description: "Experimental international township founded by Mirra Alfassa ('The Mother') in 1968. Centered on the golden metallic sphere of Matrimandir with pristine concentration chambers.",
    nearestPracticalStation: {
      code: "PDY",
      name: "Puducherry Railway Station (PDY)",
      roadDistanceKm: 12.5,
      travelTime: "25 mins",
      notes: "Rent a scooter at White Town near PDY station to ride to Auroville via ECR. Auto fare is flat ₹350."
    },
    alternativeStations: [{ code: "VM", name: "Villupuram Jn", distanceKm: 42.0, travelTime: "55 mins" }],
    nearestBusTerminal: "Auroville Visitors Centre Stop / Pondicherry New Bus Stand",
    recommendedTransport: "Rented scooter/electric cycle or shared taxi from White Town.",
    nearbyAttractions: ["Auroville Beach (6 km)", "Sadhana Forest (5 km)"]
  },
  {
    id: "att-whitetown",
    name: "White Town (French Quarter) & Promenade",
    region: "Pondicherry",
    destinationId: "pondicherry",
    lat: 11.9328,
    lng: 79.8335,
    category: "Colonial / Cultural Heritage",
    description: "Cobblestone grid of mustard-yellow colonial villas, bougainvillea gardens, chic French bakeries, Roman Catholic churches, and the 1.5-km Seaside Promenade Beach (vehicle-free at night).",
    nearestPracticalStation: {
      code: "PDY",
      name: "Puducherry Railway Station",
      roadDistanceKm: 0.8,
      travelTime: "10 mins walk",
      notes: "Station is right at the edge of the French Quarter. No vehicle needed!"
    },
    alternativeStations: [{ code: "VM", name: "Villupuram Jn", distanceKm: 38.0, travelTime: "45 mins" }],
    nearestBusTerminal: "Thiruvalluvar Stand (1 km) / New Bus Stand (2.5 km)",
    recommendedTransport: "Walking or rental vintage Dutch bicycle.",
    nearbyAttractions: ["Sri Aurobindo Ashram (0.8 km)", "Promenade Beach (0.2 km)", "French Institute (0.3 km)"]
  },
  {
    id: "att-paradisebeach",
    name: "Paradise Beach & Chunnambar Boat House",
    region: "Pondicherry",
    destinationId: "pondicherry",
    lat: 11.8845,
    lng: 79.8164,
    category: "Beach / Boating",
    description: "Isolated golden sand spit separated from the mainland by Chunnambar backwaters; accessible only via a scenic 15-minute motorboat ride through mangrove estuaries.",
    nearestPracticalStation: {
      code: "PDY",
      name: "Puducherry Railway Station",
      roadDistanceKm: 8.5,
      travelTime: "18 mins to Chunnambar boat jetty",
      notes: "Take an auto or PRTC town bus down Cuddalore Road to Chunnambar boat house."
    },
    alternativeStations: [{ code: "CUPJ", name: "Cuddalore Port Jn", distanceKm: 16.0, travelTime: "25 mins" }],
    nearestBusTerminal: "Chunnambar Bus Stop / Nonankuppam",
    recommendedTransport: "Scooter or PRTC bus to boat house + official tourism ferry (₹350).",
    nearbyAttractions: ["Arikamedu Roman Port Ruins (4.5 km)", "Promenade Beach (9 km)"]
  },

  // ================= THANJAVUR & TIRUCHIRAPPALLI =================
  {
    id: "att-bigtemple",
    name: "Brihadeeswarar Temple (Thanjavur Big Temple)",
    region: "Thanjavur",
    destinationId: "thanjavur",
    lat: 10.7828,
    lng: 79.1318,
    category: "UNESCO Heritage / Temple",
    description: "Built by Emperor Raja Raja Chola I in 1010 CE; a 66m high granite vimana crowned with an 80-tonne single granite capstone, featuring monumental Nandi and frescoes.",
    nearestPracticalStation: {
      code: "TJ",
      name: "Thanjavur Junction (TJ)",
      roadDistanceKm: 2.1,
      travelTime: "8 mins",
      notes: "Short ₹60 auto ride or local bus #1 / #6 directly to the North Gate."
    },
    alternativeStations: [{ code: "TPJ", name: "Trichy Junction", distanceKm: 52.0, travelTime: "1 hr" }],
    nearestBusTerminal: "Thanjavur Old Bus Stand (1.5 km)",
    recommendedTransport: "Auto-rickshaw or 20-min heritage walk from Old Bus Stand.",
    nearbyAttractions: ["Thanjavur Maratha Palace (1.8 km)", "Sivaganga Park (0.3 km)"]
  },
  {
    id: "att-thanjavurpalace",
    name: "Thanjavur Maratha Palace & Saraswathi Mahal Library",
    region: "Thanjavur",
    destinationId: "thanjavur",
    lat: 10.7915,
    lng: 79.1368,
    category: "Palace / Royal Heritage",
    description: "Royal residence of Nayak and Maratha rulers featuring the 7-storey Bell Tower, Arsenal Tower, and the rare Saraswathi Mahal Library preserving ancient palm-leaf manuscripts.",
    nearestPracticalStation: {
      code: "TJ",
      name: "Thanjavur Junction",
      roadDistanceKm: 2.5,
      travelTime: "10 mins",
      notes: "Located in the heart of old walled Thanjavur."
    },
    alternativeStations: [{ code: "TPJ", name: "Trichy Jn", distanceKm: 54.0, travelTime: "1 hr 5 mins" }],
    nearestBusTerminal: "Old Bus Stand Thanjavur (600m)",
    recommendedTransport: "Auto-rickshaw or city bus.",
    nearbyAttractions: ["Brihadeeswarar Temple (1.8 km)", "Schwartz Church (0.4 km)"]
  },
  {
    id: "att-srirangam",
    name: "Sri Ranganathaswamy Temple (Srirangam)",
    region: "Tiruchirappalli",
    destinationId: "tiruchirappalli",
    lat: 10.8625,
    lng: 78.6902,
    category: "Temple / World Wonder",
    description: "The largest functioning Hindu temple complex in the world (156 acres), enclosed by 7 concentric rectangular granite walls with 21 monumental gopurams on an island in the Cauvery.",
    nearestPracticalStation: {
      code: "SRGM",
      name: "Srirangam Railway Station (SRGM)",
      roadDistanceKm: 1.2,
      travelTime: "5 mins (walkable)",
      notes: "SRGM is right on the temple island. Many express trains stop here. If arriving by VB or Duronto, use TPJ."
    },
    alternativeStations: [
      { code: "TPJ", name: "Tiruchchirappalli Jn", distanceKm: 9.5, travelTime: "25 mins" },
      { code: "TP", name: "Trichy Fort", distanceKm: 5.5, travelTime: "15 mins" }
    ],
    nearestBusTerminal: "Srirangam Bus Stand (outside Rajagopuram) / Chatiram Bus Stand Trichy",
    recommendedTransport: "Trichy City Bus #1 (every 2 mins from TPJ station / Central Stand) or auto.",
    nearbyAttractions: ["Jambukeswarar Temple (1.8 km)", "Kallanai Grand Anicut Dam (14 km)"]
  },
  {
    id: "att-rockfort",
    name: "Rockfort Ucchi Pillayar Temple",
    region: "Tiruchirappalli",
    destinationId: "tiruchirappalli",
    lat: 10.8286,
    lng: 78.6967,
    category: "Temple / Geologic Monolith",
    description: "Ancient 83-meter high monolithic rock formation older than the Himalayas (3.8 billion years), climbed via 437 stone steps cut into rock cavern sanctuaries with panoramic city views.",
    nearestPracticalStation: {
      code: "TP",
      name: "Tiruchchirappalli Fort (TP)",
      roadDistanceKm: 1.5,
      travelTime: "6 mins",
      notes: "Suburban station closest to base. For main line express trains, TPJ is 4.5 km away."
    },
    alternativeStations: [{ code: "TPJ", name: "Tiruchirappalli Jn", distanceKm: 4.8, travelTime: "15 mins" }],
    nearestBusTerminal: "Chatiram Bus Stand (1 km) / Main Guard Gate",
    recommendedTransport: "Auto-rickshaw to Main Guard Gate, then ascend on foot.",
    nearbyAttractions: ["Sri Ranganathaswamy Temple (5 km)", "Teppakulam sacred tank (base of rock)"]
  },

  // ================= MADURAI, RAMESWARAM & KANYAKUMARI =================
  {
    id: "att-meenakshi",
    name: "Meenakshi Sundareswarar Temple",
    region: "Madurai",
    destinationId: "madurai",
    lat: 9.9195,
    lng: 78.1193,
    category: "Temple / Dravidian Crown",
    description: "Centuries-old epicentre of Tamil culture featuring 14 towering gopurams, the sacred Golden Lotus Tank (Potramarai Kulam), and the Hall of Thousand Pillars.",
    nearestPracticalStation: {
      code: "MDU",
      name: "Madurai Junction (MDU)",
      roadDistanceKm: 1.8,
      travelTime: "8 mins",
      notes: "Walking distance from Railway Station West Gate or ₹50 battery/auto-rickshaw."
    },
    alternativeStations: [{ code: "TDN", name: "Tirupparankundram", distanceKm: 7.5, travelTime: "20 mins" }],
    nearestBusTerminal: "Periyar Bus Stand (800m walk)",
    recommendedTransport: "Walking via West Chitrai Street or battery-operated rickshaw.",
    nearbyAttractions: ["Thirumalai Nayakkar Palace (1.5 km)", "Puthu Mandapam (0.2 km)"]
  },
  {
    id: "att-thirumalainayakkar",
    name: "Thirumalai Nayakkar Mahal",
    region: "Madurai",
    destinationId: "madurai",
    lat: 9.9150,
    lng: 78.1242,
    category: "Palace / Indo-Saracenic",
    description: "17th-century royal palace of King Thirumalai Nayak celebrated for its massive stuccoed circular pillars (82 ft high), grand courtyard, and nightly sound & light show.",
    nearestPracticalStation: {
      code: "MDU",
      name: "Madurai Junction",
      roadDistanceKm: 2.5,
      travelTime: "12 mins",
      notes: "Short auto ride from station or Meenakshi Temple."
    },
    alternativeStations: [{ code: "KON", name: "Kudalnagar", distanceKm: 5.5, travelTime: "18 mins" }],
    nearestBusTerminal: "Periyar Bus Stand (1.8 km)",
    recommendedTransport: "Auto-rickshaw or town bus.",
    nearbyAttractions: ["Meenakshi Temple (1.5 km)", "Vandiyur Mariamman Teppakulam (3 km)"]
  },
  {
    id: "att-ramanathaswamy",
    name: "Ramanathaswamy Temple (Rameswaram)",
    region: "Rameswaram",
    destinationId: "rameswaram",
    lat: 9.2881,
    lng: 79.3174,
    category: "Char Dham / Jyotirlinga Temple",
    description: "One of the 12 sacred Jyotirlingas and India's southern Char Dham; contains the world's longest pillared corridor (1,220m) with 1,212 sculptured pillars and 22 sacred teertham wells.",
    nearestPracticalStation: {
      code: "RMM",
      name: "Rameswaram Railway Station (RMM)",
      roadDistanceKm: 1.5,
      travelTime: "6 mins",
      notes: "₹50 auto or 15-minute walk from RMM platform exit to West Gopuram."
    },
    alternativeStations: [
      { code: "MMM", name: "Mandapam", distanceKm: 19.0, travelTime: "30 mins" },
      { code: "RMD", name: "Ramanathapuram", distanceKm: 54.0, travelTime: "1 hr" }
    ],
    nearestBusTerminal: "Rameswaram Municipal Bus Stand (1.2 km)",
    recommendedTransport: "Walking or local auto-rickshaw; e-rickshaws available inside temple perimeter.",
    nearbyAttractions: ["Agni Theertham Sea Shore (0.2 km)", "Pamban Bridge (12 km)", "Dhanushkodi (18 km)"]
  },
  {
    id: "att-pambanbridge",
    name: "Pamban Sea Bridge & Rail Cantilever",
    region: "Rameswaram",
    destinationId: "rameswaram",
    lat: 9.2783,
    lng: 79.1989,
    category: "Engineering Marvel / Marine",
    description: "India's first historic cantilever sea bridge (1914) spanning 2.06 km across the Palk Strait, flanked by the newly built state-of-the-art vertical lift railway bridge and the high-level road bridge.",
    nearestPracticalStation: {
      code: "PBM",
      name: "Pamban Railway Station (PBM)",
      roadDistanceKm: 1.5,
      travelTime: "5 mins",
      notes: "Station sits at the island abutment of the bridge."
    },
    alternativeStations: [
      { code: "MMM", name: "Mandapam (Mainland end)", distanceKm: 2.5, travelTime: "8 mins" },
      { code: "RMM", name: "Rameswaram", distanceKm: 11.0, travelTime: "15 mins" }
    ],
    nearestBusTerminal: "Pamban Road Bridge Bus Stop (on NH-49)",
    recommendedTransport: "TNSTC bus or rented scooter stopping at the high road bridge viewing bays.",
    nearbyAttractions: ["Mandapam Marine Sanctuary (3 km)", "Ramanathaswamy Temple (12 km)"]
  },
  {
    id: "att-kalammemorial",
    name: "Dr. APJ Abdul Kalam National Memorial",
    region: "Rameswaram",
    destinationId: "rameswaram",
    lat: 9.2942,
    lng: 79.2885,
    category: "National Memorial / Museum",
    description: "Architectural tribute to the 'Missile Man' and People's President, built by DRDO with Chettinad stone, replicas of Agni and Prithvi missiles, and preserved personal memorabilia.",
    nearestPracticalStation: {
      code: "RMM",
      name: "Rameswaram Railway Station",
      roadDistanceKm: 3.5,
      travelTime: "10 mins",
      notes: "Situated right along NH-49 on the approach to Rameswaram."
    },
    alternativeStations: [{ code: "PBM", name: "Pamban", distanceKm: 7.0, travelTime: "12 mins" }],
    nearestBusTerminal: "Peikarumbu Bus Stop (directly outside memorial)",
    recommendedTransport: "Auto-rickshaw or town bus stopping at Peikarumbu.",
    nearbyAttractions: ["House of Kalam (in town - 3.5 km)", "Ramanathaswamy Temple (4 km)"]
  },
  {
    id: "att-dhanushkodi",
    name: "Dhanushkodi Ghost Town & Arichal Munai (Land's End)",
    region: "Dhanushkodi",
    destinationId: "dhanushkodi",
    lat: 9.1762,
    lng: 79.4235,
    category: "Ghost Town / Ocean Convergence",
    description: "Atmospheric ghost town submerged in the 1964 super-cyclone; features eerie church and rail ruins. NH-49 terminates at Arichal Munai where Indian Ocean and Bay of Bengal waters visibly meet.",
    nearestPracticalStation: {
      code: "RMM",
      name: "Rameswaram Railway Station (RMM)",
      roadDistanceKm: 18.5,
      travelTime: "35 mins",
      notes: "IMPORTANT: Old railway line to Dhanushkodi was washed away in 1964. Practical transport is strictly by road via NH-49."
    },
    alternativeStations: [{ code: "MMM", name: "Mandapam", distanceKm: 37.0, travelTime: "55 mins" }],
    nearestBusTerminal: "Arichal Munai Bus Turnaround (TNSTC Bus #3 terminus)",
    recommendedTransport: "TNSTC Government Bus #3 (₹30, leaves every 20 mins from Rameswaram Temple) or shared 4x4 tourist van. Must exit before 18:00 curfew.",
    nearbyAttractions: ["Submerged Railway Station & Water Tank Ruins (3 km)", "Kothandaramaswamy Temple (12 km)"]
  },
  {
    id: "att-vivekanandarock",
    name: "Vivekananda Rock Memorial & Thiruvalluvar Statue",
    region: "Kanyakumari",
    destinationId: "kanyakumari",
    lat: 8.0780,
    lng: 77.5550,
    category: "Monument / Ocean Shrine",
    description: "Two granite island rocks 500m off the mainland where Swami Vivekananda attained enlightenment in 1892, crowned by a 133-ft stone colossus of Tamil philosopher-poet Thiruvalluvar.",
    nearestPracticalStation: {
      code: "CAPE",
      name: "Kanniyakumari Railway Station (CAPE)",
      roadDistanceKm: 1.2,
      travelTime: "5 mins (or 15 mins walk)",
      notes: "Walkable from station to Poompuhar Shipping ferry jetty."
    },
    alternativeStations: [{ code: "NCJ", name: "Nagercoil Junction", distanceKm: 16.5, travelTime: "30 mins" }],
    nearestBusTerminal: "Kanyakumari Central Bus Stand (800m)",
    recommendedTransport: "Poompuhar official ferry ticket (₹50) from mainland jetty; 7-minute boat crossing.",
    nearbyAttractions: ["Bhagavathy Amman Temple (0.4 km)", "Sunset Point (1.5 km)", "Gandhi Memorial Mandapam (0.5 km)"]
  },
  {
    id: "att-suchindram",
    name: "Suchindram Thanumalayan Temple",
    region: "Kanyakumari",
    destinationId: "kanyakumari",
    lat: 8.1568,
    lng: 77.4552,
    category: "Temple / Heritage",
    description: "Unique temple where the Trinity (Brahma, Vishnu, and Shiva) are enshrined as a single composite deity (Sthanumalayan), famed for 18-ft monolithic Hanuman and musical stone pillars.",
    nearestPracticalStation: {
      code: "NCJ",
      name: "Nagercoil Junction (NCJ)",
      roadDistanceKm: 5.5,
      travelTime: "12 mins",
      notes: "Nagercoil is the practical station. Cape station is 12 km south."
    },
    alternativeStations: [{ code: "CAPE", name: "Kanniyakumari", distanceKm: 12.0, travelTime: "20 mins" }],
    nearestBusTerminal: "Suchindram Bus Stand (on NH-47)",
    recommendedTransport: "Frequent buses between Kanyakumari and Nagercoil halt directly in front of the temple.",
    nearbyAttractions: ["Padmanabhapuram Palace (25 km)", "Vattakottai Fort (16 km)"]
  },

  // ================= MUNNAR & THEKKADY =================
  {
    id: "att-eravikulam",
    name: "Eravikulam National Park (Rajamalai)",
    region: "Munnar",
    destinationId: "munnar",
    lat: 10.2012,
    lng: 77.0583,
    category: "National Park / Wildlife",
    description: "High-altitude shola-grassland sanctuary protecting the world's largest population of endangered Nilgiri Tahr mountain goats, situated at the base of Anamudi (2,695m).",
    nearestPracticalStation: {
      code: "AWY",
      name: "Aluva Railway Station (AWY)",
      roadDistanceKm: 118.0,
      travelTime: "3 hrs 45 mins",
      notes: "PRACTICAL TRUNK RAILHEAD. Take direct KSRTC bus to Munnar town, then park safari minibus from entrance."
    },
    alternativeStations: [
      { code: "UDT", name: "Udumalaipettai", distanceKm: 78.0, travelTime: "2 hrs 30 mins (scenic ghat)" },
      { code: "ERS", name: "Ernakulam Jn", distanceKm: 138.0, travelTime: "4 hrs 15 mins" }
    ],
    nearestBusTerminal: "Munnar KSRTC Depot (9 km)",
    recommendedTransport: "Auto/taxi to Rajamalai base gate + official forest department safari minibus.",
    nearbyAttractions: ["Lakkam Waterfalls (15 km)", "Munnar Tea Museum (8 km)"]
  },
  {
    id: "att-mattupetty",
    name: "Mattupetty Dam & Echo Point",
    region: "Munnar",
    destinationId: "munnar",
    lat: 10.1062,
    lng: 77.1245,
    category: "Dam / Lake / Viewpoint",
    description: "Concrete gravity dam at 1,700m surrounded by tea plantations and rolling hills; offers speed-boating, followed 4 km later by the natural acoustic phenomenon of Echo Point.",
    nearestPracticalStation: {
      code: "AWY",
      name: "Aluva Railway Station",
      roadDistanceKm: 122.0,
      travelTime: "4 hrs",
      notes: "Located along the Munnar-Top Station mountain highway."
    },
    alternativeStations: [{ code: "ERS", name: "Ernakulam Jn", distanceKm: 142.0, travelTime: "4 hrs 30 mins" }],
    nearestBusTerminal: "Munnar Town Stand (12 km)",
    recommendedTransport: "Rented scooter or shared Jeep on the Top Station route.",
    nearbyAttractions: ["Kundala Lake (12 km)", "Top Station (20 km)", "Elephant Arrival Spot (6 km)"]
  },
  {
    id: "att-topstation",
    name: "Top Station & Kundala Lake",
    region: "Munnar",
    destinationId: "munnar",
    lat: 10.1235,
    lng: 77.2445,
    category: "Viewpoint / Cloud Peak",
    description: "Highest point on Munnar-Kodaikanal road (1,880m) on the Kerala-Tamil Nadu border; historic upper terminus of Kundala Valley railway with dramatic views plunging into the Theni valley.",
    nearestPracticalStation: {
      code: "AWY",
      name: "Aluva Railway Station",
      roadDistanceKm: 142.0,
      travelTime: "4 hrs 45 mins",
      notes: "Terminal point of the eastern high-range circuit."
    },
    alternativeStations: [{ code: "BDNK", name: "Bodinayakkanur", distanceKm: 42.0, travelTime: "1 hr 45 mins" }],
    nearestBusTerminal: "Top Station Bus Turnaround",
    recommendedTransport: "KSRTC Top Station town bus or rented bike for adventurous riders.",
    nearbyAttractions: ["Kundala Arch Dam (14 km)", "Echo Point (18 km)"]
  },
  {
    id: "att-periyar",
    name: "Periyar National Park & Tiger Reserve",
    region: "Thekkady",
    destinationId: "thekkady",
    lat: 9.4679,
    lng: 77.1432,
    category: "Tiger Reserve / Boating Safari",
    description: "Celebrated 925 sq km biodiversity hotspot centered around the 1895 Mullaperiyar reservoir, famous for herds of wild elephants swimming in the lake and bamboo rafting.",
    nearestPracticalStation: {
      code: "KTYM",
      name: "Kottayam Railway Station (KTYM)",
      roadDistanceKm: 108.0,
      travelTime: "3 hrs",
      notes: "PRACTICAL WESTERN RAILHEAD: Direct KSRTC hill buses up NH-183 (KK Road) to Kumily gate."
    },
    alternativeStations: [
      { code: "MDU", name: "Madurai Junction", distanceKm: 140.0, travelTime: "3 hrs 30 mins via Theni" }
    ],
    nearestBusTerminal: "Kumily Bus Terminal (1.5 km from Periyar Forest Gate)",
    recommendedTransport: "Walk or ₹50 auto from Kumily town into reserve reception + KTDC safari boat.",
    nearbyAttractions: ["Elephant Junction (3.5 km)", "Chellarkovil Viewpoint (14 km)", "Kadathanadan Kalari Centre (1 km)"]
  },

  // ================= ALLEPPEY & KOCHI =================
  {
    id: "att-alleppeybackwaters",
    name: "Alleppey Backwaters (Punnamada & Kuttanad)",
    region: "Alleppey",
    destinationId: "alleppey",
    lat: 9.5085,
    lng: 76.3512,
    category: "Backwaters / Houseboat",
    description: "The emerald aquatic heart of Kerala; venue of the Nehru Trophy Snake Boat Race, lined with paddy fields cultivated below sea level, coconut lagoons, and traditional houseboats.",
    nearestPracticalStation: {
      code: "ALLP",
      name: "Alappuzha Railway Station (ALLP)",
      roadDistanceKm: 4.0,
      travelTime: "12 mins",
      notes: "ALLP station is directly connected by coastal trunk trains. Auto fare to Finishing Point jetty is approx ₹80-₹100."
    },
    alternativeStations: [{ code: "KTYM", name: "Kottayam", distanceKm: 46.0, travelTime: "1 hr 15 mins" }],
    nearestBusTerminal: "Alappuzha KSRTC Bus Stand (2.5 km)",
    recommendedTransport: "SWTD Government Public Ferry (₹18 for 2.5 hrs to Kottayam) or private Shikara boat (₹600-₹800/hr).",
    nearbyAttractions: ["Alappuzha Beach & Pier (4.5 km)", "Marari Beach (15 km)"]
  },
  {
    id: "att-marari",
    name: "Marari Beach (Mararikulam)",
    region: "Alleppey",
    destinationId: "alleppey",
    lat: 9.6002,
    lng: 76.2982,
    category: "Beach / Serenity",
    description: "Pristine, peaceful golden sand fishing beach lined with swaying coconut palms, far quieter than urban beaches and ideal for cycling and swimming.",
    nearestPracticalStation: {
      code: "MAKM",
      name: "Mararikulam Railway Station",
      roadDistanceKm: 1.5,
      travelTime: "5 mins",
      notes: "Small halt with passenger trains. For express trains, use ALLP (14 km south)."
    },
    alternativeStations: [{ code: "ALLP", name: "Alappuzha", distanceKm: 14.0, travelTime: "25 mins" }],
    nearestBusTerminal: "Mararikulam Junction Bus Stop (1.2 km)",
    recommendedTransport: "Town bus from Alleppey or rented scooter.",
    nearbyAttractions: ["Alleppey Backwaters (15 km)", "Arthunkal St. Andrew's Basilica (7 km)"]
  },
  {
    id: "att-fortkochi",
    name: "Fort Kochi & Chinese Fishing Nets (Cheena Vala)",
    region: "Kochi",
    destinationId: "kochi",
    lat: 9.9667,
    lng: 76.2415,
    category: "Heritage / Coastal Port",
    description: "Centuries-old spice trading enclave dotted with cantilevered Chinese fishing nets introduced by 14th-century court of Kublai Khan, St. Francis Church (Vasco da Gama's original tomb), and colonial lanes.",
    nearestPracticalStation: {
      code: "ERS",
      name: "Ernakulam Junction South (ERS)",
      roadDistanceKm: 12.0,
      travelTime: "30 mins",
      notes: "PRACTICAL: Take AC low floor electric bus from ERS, or ₹6 public water ferry from Ernakulam Main Boat Jetty to Fort Kochi (20 mins, scenic and avoids road traffic)."
    },
    alternativeStations: [{ code: "ERN", name: "Ernakulam Town North", distanceKm: 14.0, travelTime: "35 mins" }],
    nearestBusTerminal: "Fort Kochi Bus Stand (Vasco da Gama Square - 100m)",
    recommendedTransport: "SWTD Ferry from Ernakulam jetty (₹6) or rented Dutch bicycle.",
    nearbyAttractions: ["Mattancherry Dutch Palace (3.5 km)", "Jew Town & Paradesi Synagogue (3.8 km)", "Santa Cruz Cathedral Basilica (0.5 km)"]
  },
  {
    id: "att-mattancherry",
    name: "Mattancherry Palace (Dutch Palace) & Jew Town",
    region: "Kochi",
    destinationId: "kochi",
    lat: 9.9582,
    lng: 76.2592,
    category: "Heritage / Palace / Culture",
    description: "Portuguese-built palace (1555) renovated by the Dutch with magnificent Ramayana mythological murals, adjacent to Jew Town antique shops and the 1568 Paradesi Synagogue with Belgian glass chandeliers.",
    nearestPracticalStation: {
      code: "ERS",
      name: "Ernakulam Junction (ERS)",
      roadDistanceKm: 10.0,
      travelTime: "25 mins",
      notes: "Or take ferry to Mattancherry Customs Jetty (300m walk)."
    },
    alternativeStations: [{ code: "ERN", name: "Ernakulam Town", distanceKm: 12.0, travelTime: "30 mins" }],
    nearestBusTerminal: "Mattancherry Bus Stop (400m)",
    recommendedTransport: "Auto-rickshaw from Fort Kochi (10 mins) or heritage walking trail.",
    nearbyAttractions: ["Fort Kochi (3.5 km)", "Jew Town Synagogue (0.3 km)", "Dharmanath Jain Temple (1 km)"]
  },

  // ================= OOTY & COONOOR =================
  {
    id: "att-botanicalgarden",
    name: "Government Botanical Garden (Ooty)",
    region: "Ooty",
    destinationId: "ooty",
    lat: 11.4178,
    lng: 76.7112,
    category: "Botanical / Nature",
    description: "55-acre terraced garden established in 1848 by William Graham McIvor on the slopes of Doddabetta, home to over a thousand exotic species, Italian garden, and a 20-million-year-old fossil tree trunk.",
    nearestPracticalStation: {
      code: "UAM",
      name: "Udhagamandalam Railway Station (UAM - Ooty)",
      roadDistanceKm: 2.8,
      travelTime: "10 mins",
      notes: "UAM is the terminus of the UNESCO Nilgiri Toy Train. From plains (MTP / CBE), take mountain train or bus."
    },
    alternativeStations: [{ code: "MTP", name: "Mettupalayam (Broad Gauge)", distanceKm: 48.0, travelTime: "1 hr 45 mins" }],
    nearestBusTerminal: "Ooty Central Bus Stand (2.5 km)",
    recommendedTransport: "Local town bus from Charring Cross or ₹80 auto-rickshaw.",
    nearbyAttractions: ["Ooty Lake (3.5 km)", "Rose Garden (2 km)", "Doddabetta Peak (8 km)"]
  },
  {
    id: "att-doddabetta",
    name: "Doddabetta Peak & Telescope House",
    region: "Ooty",
    destinationId: "ooty",
    lat: 11.4010,
    lng: 76.7358,
    category: "Mountain Peak / Panorama",
    description: "Highest mountain in the Nilgiris (2,637m elevation) offering sweeping 360-degree vistas across the mist-shrouded valleys of Coimbatore plains and Mukurthi national park.",
    nearestPracticalStation: {
      code: "UAM",
      name: "Udhagamandalam (Ooty)",
      roadDistanceKm: 9.0,
      travelTime: "25 mins",
      notes: "Narrow mountain spur road ascending through pine and shola forests."
    },
    alternativeStations: [{ code: "ONR", name: "Coonoor", distanceKm: 16.0, travelTime: "40 mins" }],
    nearestBusTerminal: "Doddabetta Junction Bus Stop (3 km below peak)",
    recommendedTransport: "Rented scooter or taxi from Ooty town centre.",
    nearbyAttractions: ["Tea Factory & Museum (4 km)", "Botanical Garden (8 km)"]
  },
  {
    id: "att-pykara",
    name: "Pykara Falls & Pykara Lake",
    region: "Ooty",
    destinationId: "ooty",
    lat: 11.4725,
    lng: 76.5982,
    category: "Waterfall / Lake / Sacred River",
    description: "Sacred river of the indigenous Toda community, dropping through twin cascading waterfalls into the tranquil forested Pykara Reservoir with speed-boating facilities.",
    nearestPracticalStation: {
      code: "UAM",
      name: "Udhagamandalam (Ooty)",
      roadDistanceKm: 21.0,
      travelTime: "40 mins",
      notes: "Located on the scenic Ooty-Mysuru / Gudalur highway (NH-181)."
    },
    alternativeStations: [{ code: "MTP", name: "Mettupalayam", distanceKm: 68.0, travelTime: "2 hrs 30 mins" }],
    nearestBusTerminal: "Pykara Dam Bus Stop (on NH-181)",
    recommendedTransport: "TNSTC Gudalur bus from Ooty bus stand or rented motorcycle.",
    nearbyAttractions: ["Shooting Point / Wenlock Downs (9 km)", "Glenmorgan (15 km)"]
  },
  {
    id: "att-simspark",
    name: "Sim's Park (Coonoor)",
    region: "Coonoor",
    destinationId: "coonoor",
    lat: 11.3562,
    lng: 76.7972,
    category: "Botanical / Park",
    description: "Uniquely designed 12-hectare Japanese-style botanical garden set in a natural ravine at 1,780m, featuring rare temperate plants, rose beds, and century-old Queensland Karry Pines.",
    nearestPracticalStation: {
      code: "ONR",
      name: "Coonoor Railway Station (ONR)",
      roadDistanceKm: 3.5,
      travelTime: "10 mins",
      notes: "ONR is a major halt on the UNESCO Nilgiri Mountain Toy Train."
    },
    alternativeStations: [{ code: "UAM", name: "Ooty", distanceKm: 19.0, travelTime: "45 mins" }],
    nearestBusTerminal: "Coonoor Municipal Bus Stand (3 km)",
    recommendedTransport: "Local auto-rickshaw (₹80) or town bus from Coonoor stand.",
    nearbyAttractions: ["Dolphin's Nose (10 km)", "Lamb's Rock (7 km)", "Highfield Tea Estate (2 km)"]
  },
  {
    id: "att-dolphinsnose",
    name: "Dolphin's Nose Viewpoint & Catherine Falls Vista",
    region: "Coonoor",
    destinationId: "coonoor",
    lat: 11.3418,
    lng: 76.8778,
    category: "Viewpoint / Canyon",
    description: "Dramatic rocky promontory resembling the snout of a dolphin protruding over an enormous 1,000-ft canyon, offering direct views of Catherine Falls plunging across the abyss.",
    nearestPracticalStation: {
      code: "ONR",
      name: "Coonoor Railway Station",
      roadDistanceKm: 11.5,
      travelTime: "30 mins",
      notes: "Scenic mountain road passing through tea estates of Tiger Hill."
    },
    alternativeStations: [{ code: "MTP", name: "Mettupalayam", distanceKm: 38.0, travelTime: "1 hr 30 mins" }],
    nearestBusTerminal: "Coonoor Bus Stand (11 km)",
    recommendedTransport: "Shared jeep or rented scooter along the winding tea-estate road.",
    nearbyAttractions: ["Lamb's Rock (4 km)", "Sim's Park (10 km)"]
  },

  // ================= COORG (KODAGU) =================
  {
    id: "att-abbeyfalls",
    name: "Abbey Falls (Abbi Falls)",
    region: "Coorg",
    destinationId: "coorg",
    lat: 12.4542,
    lng: 75.7198,
    category: "Waterfall / Nature",
    description: "Spectacular 70-ft roaring cascade nestled inside private coffee estates and spice plantations, viewed from a hanging suspension bridge across the roaring Kaveri tributary.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction (MYS)",
      roadDistanceKm: 126.0,
      travelTime: "3 hrs",
      notes: "PRACTICAL BEST RAILHEAD: Coorg has no railway lines. Take direct KSRTC bus from Mysuru to Madikeri (118 km), then 8 km auto to the falls."
    },
    alternativeStations: [
      { code: "SBHR", name: "Subrahmanya Road", distanceKm: 92.0, travelTime: "2 hrs 45 mins" },
      { code: "HAS", name: "Hassan Jn", distanceKm: 115.0, travelTime: "3 hrs" }
    ],
    nearestBusTerminal: "Madikeri KSRTC Bus Stand (8 km)",
    recommendedTransport: "Auto-rickshaw or rented scooter from Madikeri town.",
    nearbyAttractions: ["Raja's Seat (9 km)", "Madikeri Fort (8 km)", "Mandalpatti Peak (18 km)"]
  },
  {
    id: "att-rajaseat",
    name: "Raja's Seat (Sunset Garden)",
    region: "Coorg",
    destinationId: "coorg",
    lat: 12.4170,
    lng: 75.7360,
    category: "Viewpoint / Garden",
    description: "Seasonal garden of flowers and musical fountains perched on a high cliff edge where the Kings of Kodagu sat with their queens to watch glorious sunsets over mist-filled rolling valleys.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction",
      roadDistanceKm: 119.0,
      travelTime: "2 hrs 45 mins",
      notes: "Located inside Madikeri town limits, 1.2 km from the bus stand."
    },
    alternativeStations: [{ code: "SBHR", name: "Subrahmanya Road", distanceKm: 86.0, travelTime: "2 hrs 30 mins" }],
    nearestBusTerminal: "Madikeri KSRTC Bus Stand (1.2 km)",
    recommendedTransport: "15-minute walk or ₹40 auto from Madikeri bus terminal.",
    nearbyAttractions: ["Madikeri Fort (1 km)", "Omkareshwara Temple (1.5 km)", "Abbey Falls (9 km)"]
  },
  {
    id: "att-talakaveri",
    name: "Talakaveri & Brahmagiri Peak",
    region: "Coorg",
    destinationId: "coorg",
    lat: 12.3842,
    lng: 75.4952,
    category: "Sacred Origin / Mountain Peak",
    description: "The revered birthplace of the holy River Cauvery on the Brahmagiri hill (1,276m); water flows from a small sacred spring (Kundike) into a sacred bathing tank.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction",
      roadDistanceKm: 162.0,
      travelTime: "4 hrs",
      notes: "Deep inside Western Ghats. From Madikeri, 44 km via Bhagamandala."
    },
    alternativeStations: [{ code: "SBHR", name: "Subrahmanya Road", distanceKm: 78.0, travelTime: "2 hrs 15 mins (ghat road)" }],
    nearestBusTerminal: "Bhagamandala Bus Stand (8 km) / Talakaveri Temple Stop",
    recommendedTransport: "KSRTC bus from Madikeri to Bhagamandala + shared jeep to temple steps.",
    nearbyAttractions: ["Bhagandeshwara Temple (8 km)", "Brahmagiri Peak Trek (steps starting behind temple)"]
  },
  {
    id: "att-dubare",
    name: "Dubare Elephant Camp & River Rafting",
    region: "Coorg",
    destinationId: "coorg",
    lat: 12.3688,
    lng: 75.9042,
    category: "Wildlife / Eco-Tourism",
    description: "Karnataka Forest Department camp on the banks of River Cauvery where historic Mysore Dasara elephants are trained; visitors can participate in elephant bathing and feeding.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction",
      roadDistanceKm: 98.0,
      travelTime: "2 hrs 15 mins",
      notes: "En route from Mysuru to Madikeri, branching off near Kushalnagar."
    },
    alternativeStations: [{ code: "HAS", name: "Hassan Jn", distanceKm: 92.0, travelTime: "2 hrs 15 mins" }],
    nearestBusTerminal: "Kushalnagar Bus Stand (14 km)",
    recommendedTransport: "Town bus or auto from Kushalnagar + boat crossing across Cauvery.",
    nearbyAttractions: ["Namdroling Golden Temple (18 km)", "Nisargadhama Bamboo Island (12 km)"]
  },

  // ================= MYSURU =================
  {
    id: "att-mysorepalace",
    name: "Mysore Palace (Amba Vilas)",
    region: "Mysuru",
    destinationId: "mysuru",
    lat: 12.3051,
    lng: 76.6551,
    category: "Palace / Royal Heritage",
    description: "The grand seat of the Wadiyar dynasty designed by Henry Irwin in Indo-Saracenic grandeur, famous for its stained glass Peacock Pavilion and 97,000 bulbs illuminated every Sunday evening.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction (MYS)",
      roadDistanceKm: 2.3,
      travelTime: "8 mins",
      notes: "Short ₹60 auto ride or 20-min heritage walk through Sayyaji Rao road."
    },
    alternativeStations: [{ code: "AP", name: "Ashokapuram", distanceKm: 4.5, travelTime: "12 mins" }],
    nearestBusTerminal: "Mysuru City Bus Stand (K.R. Circle - 400m walk)",
    recommendedTransport: "Walking from City Bus Stand or prepaid auto from Junction.",
    nearbyAttractions: ["Devaraja Market (0.8 km)", "Jaganmohan Palace & Art Gallery (0.6 km)", "Chamundi Hill (11 km)"]
  },
  {
    id: "att-chamundeshwari",
    name: "Chamundeshwari Temple (Chamundi Hill)",
    region: "Mysuru",
    destinationId: "mysuru",
    lat: 12.2725,
    lng: 76.6710,
    category: "Temple / Hill Peak",
    description: "Patron deity of Mysore perched atop the 1,000m Chamundi Hill, climbed either by a winding ghat road or 1,008 ancient stone steps passing the colossal 16-ft monolithic Nandi statue.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction",
      roadDistanceKm: 12.5,
      travelTime: "25 mins",
      notes: "Direct city bus #201 leaves every 10 mins from City Bus Stand to hilltop."
    },
    alternativeStations: [{ code: "AP", name: "Ashokapuram", distanceKm: 10.0, travelTime: "20 mins" }],
    nearestBusTerminal: "Chamundi Hill Bus Stand (hilltop terminal)",
    recommendedTransport: "KSRTC City Bus #201 or rented scooter for the scenic climb.",
    nearbyAttractions: ["Monolithic Nandi (halfway down steps - 3 km)", "Mahishasura Statue (hilltop)", "Mysore Zoo (8 km)"]
  },
  {
    id: "att-brindavan",
    name: "Brindavan Gardens & KRS Dam",
    region: "Mysuru",
    destinationId: "mysuru",
    lat: 12.4228,
    lng: 76.5742,
    category: "Garden / Musical Fountain",
    description: "Terraced Mughal-style garden built adjoining the Krishnarajasagara (KRS) Dam across River Cauvery, internationally acclaimed for symmetrical water channels and dancing musical fountains at dusk.",
    nearestPracticalStation: {
      code: "MYS",
      name: "Mysuru Junction",
      roadDistanceKm: 18.5,
      travelTime: "35 mins",
      notes: "Direct Volvo city buses run between City Bus Stand and Brindavan Gardens entrance."
    },
    alternativeStations: [{ code: "S", name: "Shrirangapattana", distanceKm: 14.0, travelTime: "25 mins" }],
    nearestBusTerminal: "KRS Bus Stand (adjacent to garden gate)",
    recommendedTransport: "Mysuru City Bus #303 or auto-rickshaw.",
    nearbyAttractions: ["Ranganathittu Bird Sanctuary (12 km)", "Srirangapatna Fort (14 km)"]
  },
  {
    id: "att-ranganathittu",
    name: "Ranganathittu Bird Sanctuary",
    region: "Mysuru",
    destinationId: "mysuru",
    lat: 12.4245,
    lng: 76.6845,
    category: "Wildlife / Bird Sanctuary",
    description: "Ramsar wetland site comprising six islets on the Cauvery River, nesting grounds for thousands of painted storks, spoonbills, and home to marsh crocodiles viewed from guided rowboats.",
    nearestPracticalStation: {
      code: "S",
      name: "Shrirangapattana Railway Station",
      roadDistanceKm: 4.5,
      travelTime: "10 mins",
      notes: "Shrirangapattana halt is very close; for all express trains use Mysuru Jn (16 km)."
    },
    alternativeStations: [{ code: "MYS", name: "Mysuru Junction", distanceKm: 16.0, travelTime: "30 mins" }],
    nearestBusTerminal: "Srirangapatna Bus Stand (4.5 km)",
    recommendedTransport: "Auto from Srirangapatna or taxi from Mysuru + guided boat safari.",
    nearbyAttractions: ["Brindavan Gardens (12 km)", "Tipu Sultan's Summer Palace Srirangapatna (5 km)"]
  },

  // ================= BENGALURU =================
  {
    id: "att-bangalorepalace",
    name: "Bengaluru Palace",
    region: "Bengaluru",
    destinationId: "bengaluru",
    lat: 12.9988,
    lng: 77.5925,
    category: "Palace / Tudor Architecture",
    description: "19th-century royal palace built in Tudor-revival architecture modeled on Windsor Castle, featuring fortified towers, battlements, Gothic windows, and hunting trophy rooms.",
    nearestPracticalStation: {
      code: "BNC",
      name: "Bengaluru Cantt (BNC)",
      roadDistanceKm: 2.5,
      travelTime: "8 mins",
      notes: "Cantt station is closest. From Majestic (SBC), it is 5 km."
    },
    alternativeStations: [
      { code: "SBC", name: "KSR Bengaluru (Majestic)", distanceKm: 5.2, travelTime: "18 mins" },
      { code: "YPR", name: "Yesvantpur Jn", distanceKm: 6.8, travelTime: "20 mins" }
    ],
    nearestBusTerminal: "Vasanth Nagar / Palace Guttahalli BMTC Stop",
    recommendedTransport: "BMTC Bus or short auto ride from Cantt or Cubbon Park Metro.",
    nearbyAttractions: ["Cubbon Park (3.5 km)", "National Gallery of Modern Art (2 km)"]
  },
  {
    id: "att-lalbagh",
    name: "Lalbagh Botanical Garden & Glass House",
    region: "Bengaluru",
    destinationId: "bengaluru",
    lat: 12.9507,
    lng: 77.5848,
    category: "Botanical / Historic Garden",
    description: "240-acre botanical paradise commissioned by Hyder Ali in 1760; houses India's largest collection of tropical plants, centuries-old trees, and the iconic London Crystal Palace-inspired Glass House.",
    nearestPracticalStation: {
      code: "SBC",
      name: "KSR Bengaluru (Majestic)",
      roadDistanceKm: 4.8,
      travelTime: "15 mins",
      notes: "DIRECT METRO ACCESS: Board Green Line at Majestic directly to Lalbagh Metro Station (West Gate entrance)."
    },
    alternativeStations: [{ code: "BNC", name: "Bengaluru Cantt", distanceKm: 6.5, travelTime: "22 mins" }],
    nearestBusTerminal: "Lalbagh Main Gate BMTC Bus Stop / Lalbagh Metro Station",
    recommendedTransport: "Namma Metro Green Line to Lalbagh Station (exit directly onto garden gate).",
    nearbyAttractions: ["Bull Temple (Basavanagudi - 2 km)", "Tipu Sultan's Summer Palace (2.2 km)", "Cubbon Park (3.5 km)"]
  },
  {
    id: "att-cubbonpark",
    name: "Cubbon Park & Vidhana Soudha",
    region: "Bengaluru",
    destinationId: "bengaluru",
    lat: 12.9763,
    lng: 77.5929,
    category: "Park / Neo-Dravidian Landmark",
    description: "The 300-acre green lung of the city laid out in 1870, leading to the monumental Vidhana Soudha (Neo-Dravidian state secretariat inscribed with 'Government Work is God's Work').",
    nearestPracticalStation: {
      code: "SBC",
      name: "KSR Bengaluru (Majestic)",
      roadDistanceKm: 2.5,
      travelTime: "8 mins",
      notes: "Just 2 metro stops from Majestic on the Purple Line."
    },
    alternativeStations: [{ code: "BNC", name: "Bengaluru Cantt", distanceKm: 3.5, travelTime: "12 mins" }],
    nearestBusTerminal: "K.R. Circle / Vidhana Soudha BMTC Stop",
    recommendedTransport: "Namma Metro Purple Line to Vidhana Soudha / Dr. B.R. Ambedkar Metro Station.",
    nearbyAttractions: ["Visvesvaraya Industrial & Technological Museum (0.5 km)", "UB City (1 km)", "Bengaluru Palace (3.5 km)"]
  },
  {
    id: "att-nandihills",
    name: "Nandi Hills (Nandidurga)",
    region: "Bengaluru Outskirts",
    destinationId: "bengaluru",
    lat: 13.3702,
    lng: 77.6835,
    category: "Hill Fortress / Sunrise",
    description: "Ancient hill fortress at 1,478m elevation famous for ethereal sunrise above cloud oceans, Tipu's Drop (a 600m sheer cliff), and the 9th-century Bhoga Nandeeshwara Temple at the base.",
    nearestPracticalStation: {
      code: "CBP",
      name: "Chikkaballapur Railway Station",
      roadDistanceKm: 18.0,
      travelTime: "30 mins",
      notes: "Suburban train connects Bangalore to Chikkaballapur. From central Bangalore (SBC), 60 km."
    },
    alternativeStations: [
      { code: "YPR", name: "Yesvantpur Jn", distanceKm: 58.0, travelTime: "1 hr 15 mins" },
      { code: "SBC", name: "KSR Bengaluru", distanceKm: 61.0, travelTime: "1 hr 25 mins" }
    ],
    nearestBusTerminal: "Nandi Hills Hilltop Bus Stop (KSRTC special sunrise buses from Majestic at 05:00 AM)",
    recommendedTransport: "Early morning KSRTC bus or rented scooter/cab starting at 04:30 AM for sunrise.",
    nearbyAttractions: ["Bhoga Nandeeshwara Temple (base - 12 km)", "Tipu's Drop (hilltop)", "Amrita Sarovar (hilltop)"]
  },

  // ================= VARANASI (ORIGIN & RETURN) =================
  {
    id: "att-kashivishwanath",
    name: "Kashi Vishwanath Temple & Ganga Corridor",
    region: "Varanasi",
    destinationId: "varanasi_start",
    lat: 25.3109,
    lng: 83.0107,
    category: "Jyotirlinga / Sacred Heart",
    description: "Supreme Jyotirlinga of Lord Shiva on the western bank of holy Ganga; newly expanded world-class corridor connects the sanctum directly to the river ghats.",
    nearestPracticalStation: {
      code: "BSB",
      name: "Varanasi Junction (BSB)",
      roadDistanceKm: 4.8,
      travelTime: "20 mins",
      notes: "E-rickshaw to Godowlia Chowk (3.5 km), then 400m walk through the pedestrian corridor."
    },
    alternativeStations: [
      { code: "BSBS", name: "Banaras", distanceKm: 4.2, travelTime: "18 mins" },
      { code: "DDU", name: "Pt. Deen Dayal Upadhyaya Jn", distanceKm: 19.5, travelTime: "50 mins" }
    ],
    nearestBusTerminal: "Varanasi Cantt UPSRTC Bus Stand (4.5 km)",
    recommendedTransport: "E-rickshaw to Godowlia or Maidagin, then walk into pedestrian corridor.",
    nearbyAttractions: ["Dashashwamedh Ghat (0.4 km)", "Manikarnika Ghat (0.3 km)", "Annapurna Temple (0.1 km)"]
  },
  {
    id: "att-dashashwamedh",
    name: "Dashashwamedh Ghat (Grand Ganga Aarti)",
    region: "Varanasi",
    destinationId: "varanasi_start",
    lat: 25.3075,
    lng: 83.0104,
    category: "Ghat / Cultural Spectacle",
    description: "The most prominent and sacred ghat on the Ganges where Lord Brahma performed the ten-horse sacrifice; legendary venue for the mesmerizing evening Maha Aarti ceremony.",
    nearestPracticalStation: {
      code: "BSB",
      name: "Varanasi Junction",
      roadDistanceKm: 4.5,
      travelTime: "20 mins",
      notes: "Godowlia is the vehicle drop point; 5-min walk down to the river."
    },
    alternativeStations: [{ code: "BSBS", name: "Banaras", distanceKm: 4.0, travelTime: "18 mins" }],
    nearestBusTerminal: "Godowlia Auto / Rickshaw Stand",
    recommendedTransport: "Shared electric rickshaw to Godowlia + evening wooden rowboat on the river.",
    nearbyAttractions: ["Assi Ghat (2.5 km by boat)", "Kashi Vishwanath Temple (0.4 km)"]
  }
];

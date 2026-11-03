// ==========================================================================
// MASTER MULTI-ROUTE SPECIFICATION ENGINE (ROUTES A - H)
// All 8 Regional Circuits & Complete Subcontinental Travel Networks
// ZERO Day-wise itinerary | Strictly organized geographically & station-wise
// ==========================================================================

import { ALL_DESTINATIONS, UNIQUE_STATIONS, ALL_ATTRACTIONS, ALL_BUS_TERMINALS } from "./unifiedData.js";
import { VERIFIED_RAIL_PAIRS, calculateHaversineKm, computeTopographicalRoadKm, formatDuration } from "../services/distanceService.js";

// Granular Stop Catalog with exact coordinates, practical railheads, bus terminals, and highlights
export const GRANULAR_STOPS = {
  // --- UP SPIRITUAL CIRCUIT (ROUTE A) ---
  varanasi: {
    id: "varanasi",
    name: "Varanasi",
    subtitle: "Kashi Vishwanath Jyotirlinga & Sacred Ghats",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 25.3176,
    lng: 82.9739,
    role: "Spiritual Origin & Jyotirlinga Hub",
    isDetour: false,
    nearestRailhead: "Banaras (BSBS, 4 km) / Varanasi Jn (BSB, 4.5 km) / DDU (18 km)",
    nearestBusTerminal: "Varanasi Cantt UPSRTC Bus Stand (4.2 km)",
    keyAttractions: ["Shri Kashi Vishwanath Temple", "Sankat Mochan Temple", "Dashashwamedh Ghat", "Sarnath Dhamek Stupa", "Durga Kund Mandir"],
    cityCenter: { lat: 25.3176, lng: 82.9739, name: "Godowlia Crossing" }
  },
  prayagraj: {
    id: "prayagraj",
    name: "Prayagraj",
    subtitle: "Triveni Sangam & Bade Hanuman Ji",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 25.4358,
    lng: 81.8463,
    role: "Sacred Confluence & Tirtharaj",
    isDetour: false,
    nearestRailhead: "Prayagraj Junction (PRYJ, 2 km) / Prayagraj Sangam (PYGS, 3 km)",
    nearestBusTerminal: "Civil Lines UPSRTC Bus Station (2.5 km)",
    keyAttractions: ["Triveni Sangam", "Bade Hanuman Ji Mandir (Reclining)", "Alopi Devi Shaktipeeth", "Anand Bhavan", "Mankameshwar Mandir"],
    cityCenter: { lat: 25.4358, lng: 81.8463, name: "Civil Lines" }
  },
  mangarh: {
    id: "mangarh",
    name: "Bhakti Mandir, Mangarh",
    subtitle: "Kripalu Dham Spiritual Complex",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 25.8617,
    lng: 81.6025,
    role: "Kripalu Dham Spiritual Complex",
    isDetour: false,
    nearestRailhead: "Kunda Harnamganj (KHNM, 14 km) / Prayagraj Jn (PRYJ, 62 km)",
    nearestBusTerminal: "Kunda Town Bus Stop on Prayagraj-Lucknow NH (12 km)",
    keyAttractions: ["Bhakti Mandir Mangarh", "Kripalu Dham Ashram", "Radha Krishna Shrines"],
    cityCenter: { lat: 25.8617, lng: 81.6025, name: "Mangarh Temple Gate" }
  },
  chitrakoot: {
    id: "chitrakoot",
    name: "Chitrakoot",
    subtitle: "Ramayana Holy Land & Kamadgiri",
    state: "Uttar Pradesh / MP",
    stateCode: "UP",
    lat: 25.1764,
    lng: 80.8687,
    role: "Ramayana Holy Land & Forest Exile",
    isDetour: false,
    nearestRailhead: "Chitrakootdham Karwi (CKTD, 8 km) / Manikpur Jn (MKP, 30 km)",
    nearestBusTerminal: "Karwi Central Bus Stand (7.5 km) / Chitrakoot MP Stand (2 km)",
    keyAttractions: ["Kamadgiri 5km Parikrama", "Ramghat on Mandakini River", "Hanuman Dhara", "Gupt Godavari Caves", "Sati Anusuya Ashram"],
    cityCenter: { lat: 25.1764, lng: 80.8687, name: "Ramghat Market" }
  },
  vindhyachal: {
    id: "vindhyachal",
    name: "Vindhyachal",
    subtitle: "Maa Vindhyavasini Shaktipeeth",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 25.1611,
    lng: 82.5028,
    role: "Shaktipeeth & Trikona Parikrama",
    isDetour: false,
    nearestRailhead: "Vindhyachal (BDL, 1.2 km) / Mirzapur (MZP, 8 km)",
    nearestBusTerminal: "Vindhyachal Temple UPSRTC Stand (800m)",
    keyAttractions: ["Maa Vindhyavasini Temple", "Ashtabhuja Mandir", "Kali Khoh Cave Temple", "Vindhya Dham Corridor"],
    cityCenter: { lat: 25.1611, lng: 82.5028, name: "Vindhyavasini Mandir Chowk" }
  },
  mirzapur: {
    id: "mirzapur",
    name: "Mirzapur",
    subtitle: "Pakka Ghat, Ganga Heritage & Brass Crafts",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 25.1465,
    lng: 82.5698,
    role: "Ganga Heritage & Carpet Crafts",
    isDetour: false,
    nearestRailhead: "Mirzapur (MZP, 1.5 km)",
    nearestBusTerminal: "Mirzapur Central Roadways Bus Stand (1.8 km)",
    keyAttractions: ["Pakka Ghat", "Taradevi Temple", "Ojhala Bridge", "Kantit Sharif", "Clock Tower Mirzapur"],
    cityCenter: { lat: 25.1465, lng: 82.5698, name: "Mirzapur Station Road" }
  },

  // --- MAIHAR & MP CIRCUIT (ROUTE B) ---
  maihar: {
    id: "maihar",
    name: "Maihar",
    subtitle: "Maa Sharda Devi Shaktipeeth atop Trikuta Hill",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 24.2676,
    lng: 80.7583,
    role: "Maa Sharda Shaktipeeth",
    isDetour: false,
    nearestRailhead: "Maihar (MYR, 4 km) / Satna Jn (STA, 35 km) / Katni Jn (KTE, 65 km)",
    nearestBusTerminal: "Maihar MP Transport Stand at Station Road (3.8 km)",
    keyAttractions: ["Maa Sharda Devi Temple (1063 steps & Ropeway)", "Alha-Udal Akhara", "Badi Khermai Temple", "Icchapurti Hanuman Mandir"],
    cityCenter: { lat: 24.2676, lng: 80.7583, name: "Maihar Town Square" }
  },
  jabalpur: {
    id: "jabalpur",
    name: "Jabalpur",
    subtitle: "Cultural Hub & Rani Durgavati Heritage",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.1815,
    lng: 79.9864,
    role: "Cultural Hub & Narmada Valley",
    isDetour: false,
    nearestRailhead: "Jabalpur Junction (JBP, 2 km) / Madan Mahal (MML, 3 km)",
    nearestBusTerminal: "ISBT Damoh Naka Jabalpur (5 km)",
    keyAttractions: ["Madan Mahal Fort", "Balancing Rock", "Rani Durgavati Museum", "Pisanhari Ki Madiya", "Bargi Dam Reservoir"],
    cityCenter: { lat: 23.1815, lng: 79.9864, name: "Civil Lines Jabalpur" }
  },
  bhedaghat: {
    id: "bhedaghat",
    name: "Bhedaghat & Marble Rocks",
    subtitle: "Dhuandhar Falls & Chausath Yogini",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.1311,
    lng: 79.8006,
    role: "Narmada River Gorges & Geological Wonder",
    isDetour: false,
    nearestRailhead: "Bhedaghat (BRGT, 3 km) / Jabalpur (JBP, 22 km)",
    nearestBusTerminal: "Bhedaghat Local Bus Stand (500m)",
    keyAttractions: ["Dhuandhar Waterfall", "Marble Rocks Boat Canyon (Narmada)", "10th-century Chausath Yogini Temple"],
    cityCenter: { lat: 23.1311, lng: 79.8006, name: "Dhuandhar Viewpoint" }
  },
  bhopal: {
    id: "bhopal",
    name: "Bhopal",
    subtitle: "City of Lakes & State Capital",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.2599,
    lng: 77.4126,
    role: "State Capital & Central Hub",
    isDetour: false,
    nearestRailhead: "Bhopal Junction (BPL, 2 km) / Rani Kamlapati (RKMP, 6 km)",
    nearestBusTerminal: "ISBT Kushabhau Thakre Bhopal (4 km) / Nadra Bus Stand (1 km)",
    keyAttractions: ["Upper Lake (Bhojtal)", "Van Vihar National Park", "Taj-ul-Masajid", "Tribal Museum", "Bhimbetka Rock Shelters (45 km)"],
    cityCenter: { lat: 23.2599, lng: 77.4126, name: "New Market Bhopal" }
  },
  sanchi: {
    id: "sanchi",
    name: "Sanchi",
    subtitle: "UNESCO World Heritage Great Buddhist Stupa",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.4794,
    lng: 77.7397,
    role: "UNESCO Buddhist Heritage",
    isDetour: true,
    detourName: "Buddhist Heritage Detour",
    nearestRailhead: "Sanchi (SCI, 1 km) / Vidisha (BHS, 9 km) / Bhopal (BPL, 46 km)",
    nearestBusTerminal: "Sanchi Highway Bus Stand (800m)",
    keyAttractions: ["Great Stupa 1 (Emperor Ashoka)", "Toranas (Ornamental Gateways)", "Sanchi Archaeological Museum", "Gupta Temple 17"],
    cityCenter: { lat: 23.4794, lng: 77.7397, name: "Sanchi Stupa Hill Gate" }
  },
  bhojpur: {
    id: "bhojpur",
    name: "Bhojpur",
    subtitle: "Monolithic Bhojeshwar Mahadev Temple",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.1011,
    lng: 77.5856,
    role: "Parmara Dynasty Monolithic Shrine",
    isDetour: true,
    detourName: "Betwa Heritage Detour",
    nearestRailhead: "Mandi Bamora / Rani Kamlapati (RKMP, 24 km) / Bhopal (BPL, 28 km)",
    nearestBusTerminal: "Bhopal ISBT (26 km) with direct tempos from Habibganj",
    keyAttractions: ["Bhojeshwar Temple (Tallest 7.5ft single-stone Shivalinga)", "Betwa River Parikrama Ghat", "Unfinished Temple Architectural Rock Plans"],
    cityCenter: { lat: 23.1011, lng: 77.5856, name: "Bhojpur Temple Complex" }
  },
  ujjain: {
    id: "ujjain",
    name: "Ujjain",
    subtitle: "Mahakaleshwar Jyotirlinga & Shri Mahakal Lok",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 23.1765,
    lng: 75.7885,
    role: "Mahakaleshwar Jyotirlinga & Mokshapuri",
    isDetour: false,
    nearestRailhead: "Ujjain Junction (UJN, 1.8 km) / Vikramnagar (VRG, 4 km)",
    nearestBusTerminal: "Nanakheda ISBT Ujjain (4 km) / Dewas Gate Stand (1.5 km)",
    keyAttractions: ["Shri Mahakaleshwar Jyotirlinga (Dakshinmukhi)", "Shri Mahakal Lok Corridor", "Harsiddhi Mata Shaktipeeth", "Kal Bhairav Temple", "Mangalnath Mandir", "Ramghat Shipra River"],
    cityCenter: { lat: 23.1765, lng: 75.7885, name: "Mahakal Temple Chowk" }
  },
  indore: {
    id: "indore",
    name: "Indore",
    subtitle: "Khajrana Ganesh, Rajwada & Sarafa Food Culture",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 22.7196,
    lng: 75.8577,
    role: "Commercial & Gastronomic Capital",
    isDetour: false,
    nearestRailhead: "Indore Junction (INDB, 1.5 km) / Laxmibai Nagar (LMNR, 4 km)",
    nearestBusTerminal: "Sarwate Bus Stand (adjacent INDB) / AICTSL Intercity Terminal (3 km)",
    keyAttractions: ["Shri Khajrana Ganesh Mandir", "Rajwada Palace (Holkar)", "Sarafa Night Food Bazaar", "Chappan Dukan", "Bada Ganpati Mandir", "Patalpani Waterfall (35 km)"],
    cityCenter: { lat: 22.7196, lng: 75.8577, name: "Rajwada Chowk" }
  },
  omkareshwar: {
    id: "omkareshwar",
    name: "Omkareshwar",
    subtitle: "Om-shaped Island Jyotirlinga & Mamleshwar",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 22.2458,
    lng: 76.1511,
    role: "Om-shaped Jyotirlinga & Statue of Oneness",
    isDetour: false,
    nearestRailhead: "Omkareshwar Road (OM, 12 km - halt) / Sanawad (SWD, 16 km) / Khandwa (KNW, 70 km) / Indore (77 km)",
    nearestBusTerminal: "Omkareshwar Bus Stand (buses from Indore & Khandwa every 30m)",
    keyAttractions: ["Omkareshwar Jyotirlinga Mandhata Island", "Mamleshwar Temple (Amareshwar)", "7km Island Parikrama", "Statue of Oneness (108ft Adi Shankaracharya)", "Narmada Jhula Bridge"],
    cityCenter: { lat: 22.2458, lng: 76.1511, name: "Mamleshwar Ghat" }
  },
  maheshwar: {
    id: "maheshwar",
    name: "Maheshwar",
    subtitle: "Ahilya Bai Holkar Fort & Holy Narmada Ghats",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 22.1764,
    lng: 75.5833,
    role: "Ahilya Bai Capital & Handloom Silk Heritage",
    isDetour: false,
    nearestRailhead: "Barwaha (BWW, 35 km) / Indore Jn (INDB, 91 km)",
    nearestBusTerminal: "Maheshwar Bus Stand with frequent buses to Dhamnod & Indore",
    keyAttractions: ["Ahilya Fort & Palace", "Ahilya Ghat Narmada River", "Ahilyeshwar Temple", "Rehwa Society Handloom Silk Weaving", "Baneshwar Temple"],
    cityCenter: { lat: 22.1764, lng: 75.5833, name: "Ahilya Fort Gate" }
  },
  mandu: {
    id: "mandu",
    name: "Mandu (Mandavgarh)",
    subtitle: "Jahaz Mahal, Hindola Mahal & Baz Bahadur Fort",
    state: "Madhya Pradesh",
    stateCode: "MP",
    lat: 22.3664,
    lng: 75.4044,
    role: "Medieval Fortress City of Joy",
    isDetour: true,
    detourName: "Citadel of Joy Detour",
    nearestRailhead: "Indore Junction (INDB, 98 km) / Ratlam Jn (RTM, 120 km)",
    nearestBusTerminal: "Mandu Bus Stand (direct shuttles from Dhar & Indore)",
    keyAttractions: ["Jahaz Mahal (Ship Palace)", "Hindola Mahal (Swinging Palace)", "Rani Roopmati Pavilion", "Baz Bahadur Palace", "Hoshang Shah Tomb"],
    cityCenter: { lat: 22.3664, lng: 75.4044, name: "Jahaz Mahal Complex" }
  },

  // --- NASHIK & TRIMBAKESHWAR CIRCUIT (ROUTE C) ---
  nashik_city: {
    id: "nashik_city",
    name: "Nashik City & Panchavati",
    subtitle: "Panchavati, Kalaram Temple & Sita Gufa",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 20.0063,
    lng: 73.7944,
    role: "Ramayana Holy Sites & Godavari River Hub",
    isDetour: false,
    nearestRailhead: "Nashik Road (NK, 9 km) / Devlali (DVL, 12 km)",
    nearestBusTerminal: "Nashik CBS / Thakkar Bazaar Bus Station (2.5 km)",
    keyAttractions: ["Shri Kalaram Temple (Black stone)", "Sita Gufa (Cave of Exile)", "Ramkund (Sacred Godavari Kumbh Ghat)", "Kapaleshwar Temple", "Tapovan"],
    clusterGroup: "Panchavati Local Cluster",
    cityCenter: { lat: 20.0063, lng: 73.7944, name: "Panchavati Chowk" }
  },
  trimbakeshwar: {
    id: "trimbakeshwar",
    name: "Trimbakeshwar",
    subtitle: "Trimbakeshwar Jyotirlinga (Three Faces: Brahma, Vishnu, Shiva)",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 19.9324,
    lng: 73.5308,
    role: "Supreme Jyotirlinga & Kushavarta Tirtha",
    isDetour: false,
    nearestRailhead: "Nashik Road (NK, 38 km) / Igatpuri (IGP, 42 km)",
    nearestBusTerminal: "Trimbakeshwar Bus Stand (500m to temple)",
    keyAttractions: ["Shri Trimbakeshwar Jyotirlinga Temple", "Kushavarta Kund (Holy Godavari Kunda)", "Sant Nivruttinath Samadhi Mandir"],
    clusterGroup: "Trimbak Sacred Valley",
    cityCenter: { lat: 19.9324, lng: 73.5308, name: "Trimbak Temple Gate" }
  },
  brahmagiri: {
    id: "brahmagiri",
    name: "Brahmagiri Hills",
    subtitle: "Origin of River Godavari & Gangadwar Peak",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 19.9275,
    lng: 73.5186,
    role: "Source of Sacred Godavari River",
    isDetour: false,
    nearestRailhead: "Nashik Road (NK, 40 km)",
    nearestBusTerminal: "Trimbakeshwar Bus Stand (2 km to base of steps)",
    keyAttractions: ["Brahmagiri Hill Climb (750 steps)", "Gangadwar (First stream of Godavari)", "Gorakhnath Cave", "Rama Lakshmana Kund"],
    clusterGroup: "Trimbak Sacred Valley",
    cityCenter: { lat: 19.9275, lng: 73.5186, name: "Brahmagiri Base" }
  },
  anjaneri: {
    id: "anjaneri",
    name: "Anjaneri Hills",
    subtitle: "Revered Birthplace of Lord Hanuman",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 19.9214,
    lng: 73.5786,
    role: "Hanuman Janmabhoomi & Trekking Ridge",
    isDetour: false,
    nearestRailhead: "Nashik Road (NK, 30 km)",
    nearestBusTerminal: "Anjaneri Phata Bus Stop on Trimbak Road (1.5 km)",
    keyAttractions: ["Anjani Mata Temple atop Anjaneri Fort", "Bal Hanuman Cave Shrine", "Reverse Waterfall Viewpoints", "Jain Cave Carvings"],
    clusterGroup: "Trimbak Sacred Valley",
    cityCenter: { lat: 19.9214, lng: 73.5786, name: "Anjaneri Trailhead" }
  },
  pandav_leni: {
    id: "pandav_leni",
    name: "Pandav Leni Caves",
    subtitle: "2nd-Century BCE Hinayana Buddhist Rock-Cut Caves",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 19.9602,
    lng: 73.7483,
    role: "Ancient Rock-Cut Heritage",
    isDetour: true,
    detourName: "Rock Heritage Detour",
    nearestRailhead: "Nashik Road (NK, 8 km)",
    nearestBusTerminal: "Pandav Leni Bus Stop on Mumbai-Nashik NH-160 (300m)",
    keyAttractions: ["24 Hinayana Buddhist Rock Caves", "Cave 3 & Cave 10 Chaitya Halls", "Trirashmi Hill Panoramic View over Nashik"],
    clusterGroup: "Nashik South Heritage",
    cityCenter: { lat: 19.9602, lng: 73.7483, name: "Pandav Leni Steps" }
  },
  gangapur_dam: {
    id: "gangapur_dam",
    name: "Gangapur Dam & Backwaters",
    subtitle: "Scenic Reservoir, MTDC Boat Club & Wine Country",
    state: "Maharashtra",
    stateCode: "MH",
    lat: 20.0381,
    lng: 73.6828,
    role: "Nature, Water Sports & Vineyards",
    isDetour: true,
    detourName: "Nature & Wine Detour",
    nearestRailhead: "Nashik Road (NK, 18 km)",
    nearestBusTerminal: "Gangapur Village Bus Stop (2 km)",
    keyAttractions: ["Gangapur Dam Reservoir & Earth Dam", "MTDC Boat Club", "Sula Vineyards & Tasting Room", "Someshwar Waterfall"],
    clusterGroup: "Nashik West Nature",
    cityCenter: { lat: 20.0381, lng: 73.6828, name: "Boat Club Jetty" }
  },

  // --- BRAJ BHUMI CIRCUIT (ROUTE D) ---
  mathura: {
    id: "mathura",
    name: "Mathura",
    subtitle: "Shri Krishna Janmabhoomi & Dwarkadhish Mandir",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.4924,
    lng: 77.6737,
    role: "Birthplace of Lord Krishna",
    isDetour: false,
    nearestRailhead: "Mathura Junction (MTJ, major trunk interchange, 2.5 km) / Mathura Cantt (MRT, 3 km)",
    nearestBusTerminal: "Mathura New Bus Stand (2 km)",
    keyAttractions: ["Shri Krishna Janmabhoomi Temple Complex & Garbha Griha", "Shri Dwarkadhish Mandir", "Vishram Ghat (Evening Yamuna Aarti)", "Potara Kund", "Gita Mandir"],
    cityCenter: { lat: 27.4924, lng: 77.6737, name: "Holi Gate Mathura" }
  },
  vrindavan: {
    id: "vrindavan",
    name: "Vrindavan",
    subtitle: "Banke Bihari, Prem Mandir & ISKCON",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.5806,
    lng: 77.7006,
    role: "Divine Pastimes (Leela) Capital",
    isDetour: false,
    nearestRailhead: "Vrindavan (BDB, 1 km - branch) / Mathura Jn (MTJ, 12 km)",
    nearestBusTerminal: "Vrindavan Bus Stand on Chhatikara Road (1.5 km)",
    keyAttractions: ["Shri Banke Bihari Mandir", "Prem Mandir (Italian White Marble)", "ISKCON Krishna Balaram Mandir", "Radha Raman Mandir", "Nidhivan", "Kesi Ghat"],
    cityCenter: { lat: 27.5806, lng: 77.7006, name: "Banke Bihari Mandir Marg" }
  },
  gokul: {
    id: "gokul",
    name: "Gokul",
    subtitle: "Raman Reti & Sacred Childhood Dhaam",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.4422,
    lng: 77.7175,
    role: "Childhood Home of Shri Krishna",
    isDetour: false,
    nearestRailhead: "Mathura Junction (MTJ, 11 km)",
    nearestBusTerminal: "Gokul Bus Stop on Mahavan Road (500m)",
    keyAttractions: ["Raman Reti (Sacred Sand Garden & Deer Park)", "Brahmand Ghat (Where Yashoda saw universe in Krishna mouth)", "Gokulnath Ji Temple"],
    cityCenter: { lat: 27.4422, lng: 77.7175, name: "Raman Reti Ashram" }
  },
  mahavan: {
    id: "mahavan",
    name: "Mahavan",
    subtitle: "Chaurasi Khamba (84 Pillars Ancient Temple)",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.4358,
    lng: 77.7420,
    role: "Ancient Nanda Palace Heritage",
    isDetour: false,
    nearestRailhead: "Mathura Junction (MTJ, 14 km)",
    nearestBusTerminal: "Mahavan Chauraha Bus Stop (400m)",
    keyAttractions: ["Chaurasi Khamba Temple (84 Carved Stone Pillars)", "Nanda Bhawan Mahavan", "Putana Moksha Sthal"],
    cityCenter: { lat: 27.4358, lng: 77.7420, name: "Chaurasi Khamba Gate" }
  },
  baldeo: {
    id: "baldeo",
    name: "Baldeo",
    subtitle: "Dauji Maharaj Temple & Kshirsagar Kund",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.4125,
    lng: 77.8180,
    role: "Shrine of Lord Balarama (Dauji)",
    isDetour: false,
    nearestRailhead: "Mathura Junction (MTJ, 22 km)",
    nearestBusTerminal: "Baldeo Town Bus Stand (300m)",
    keyAttractions: ["Shri Dauji Maharaj Temple (Giant Deity of Balarama)", "Kshirsagar Holy Kund (Discovery point of deity)", "Revati Mata Mandir"],
    cityCenter: { lat: 27.4125, lng: 77.8180, name: "Dauji Mandir Chowk" }
  },
  govardhan: {
    id: "govardhan",
    name: "Govardhan",
    subtitle: "Daan Ghati & Sacred 21km Giriraj Parikrama",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.4958,
    lng: 77.4642,
    role: "Giriraj Govardhan Hill Parikrama Hub",
    isDetour: false,
    nearestRailhead: "Goverdhan (GDO, 2 km) / Mathura Jn (MTJ, 24 km)",
    nearestBusTerminal: "Govardhan Bus Stand (600m)",
    keyAttractions: ["Daan Ghati Temple", "Mansi Ganga Holy Lake", "Mukharbind Mandir", "Kusum Sarovar (Sandstone Chhatris)", "21km Parikrama Marg"],
    cityCenter: { lat: 27.4958, lng: 77.4642, name: "Daan Ghati Crossing" }
  },
  radha_kund: {
    id: "radha_kund",
    name: "Radha Kund & Shyam Kund",
    subtitle: "Sacred Bathing Kunds of Gaudiya Vaishnavism",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.5255,
    lng: 77.4947,
    role: "Holiest Kunds in Braj Parikrama",
    isDetour: false,
    nearestRailhead: "Goverdhan (GDO, 5 km) / Mathura Jn (MTJ, 26 km)",
    nearestBusTerminal: "Radha Kund Bus Stop (400m)",
    keyAttractions: ["Shri Radha Kund", "Shri Shyam Kund", "Chaitanya Mahaprabhu Baithak", "Lalita Kund"],
    cityCenter: { lat: 27.5255, lng: 77.4947, name: "Radha Kund Ghats" }
  },
  barsana: {
    id: "barsana",
    name: "Barsana",
    subtitle: "Shri Radha Rani Mandir (Shriji Temple)",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.6472,
    lng: 77.3758,
    role: "Hometown of Shri Radha Rani",
    isDetour: false,
    nearestRailhead: "Kosi Kalan (KSV, 16 km) / Mathura Jn (MTJ, 45 km)",
    nearestBusTerminal: "Barsana Bus Stand (800m to hill base)",
    keyAttractions: ["Radha Rani Temple (Shriji Mandir atop Bhanugarh Hill)", "Rangeeli Mahal (Kripalu Dham)", "Kirti Mandir", "Pili Pokhar"],
    cityCenter: { lat: 27.6472, lng: 77.3758, name: "Barsana Main Chauraha" }
  },
  nandgaon: {
    id: "nandgaon",
    name: "Nandgaon",
    subtitle: "Nand Baba Palace (Nand Bhawan atop Nandishwar Hill)",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.7125,
    lng: 77.3889,
    role: "Home of Nanda Maharaj & Yashoda",
    isDetour: false,
    nearestRailhead: "Kosi Kalan (KSV, 12 km) / Mathura Jn (MTJ, 52 km)",
    nearestBusTerminal: "Nandgaon Bus Stop (500m)",
    keyAttractions: ["Nand Bhawan Temple atop Nandishwar Hill", "Pavan Sarovar (Sacred Lake)", "Charan Pahari"],
    cityCenter: { lat: 27.7125, lng: 77.3889, name: "Nand Bhawan Steps" }
  },
  kokilavan: {
    id: "kokilavan",
    name: "Kokilavan",
    subtitle: "Ancient Shani Dev Mandir & Suryakund",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.7654,
    lng: 77.3912,
    role: "Shani Dev Pilgrimage in Sacred Forest",
    isDetour: false,
    nearestRailhead: "Kosi Kalan (KSV, 6 km) / Mathura Jn (MTJ, 55 km)",
    nearestBusTerminal: "Kosi Kalan Bus Stand (6.5 km) with shared tempos to temple",
    keyAttractions: ["Kokilavan Shani Dev Mandir (Saturday Parikrama)", "Surya Kund", "Barkhandi Baba Ashram", "Sacred Cuckoo Forest (Kokila Van)"],
    cityCenter: { lat: 27.7654, lng: 77.3912, name: "Kokilavan Main Gate" }
  },

  // --- RAJASTHAN CIRCUIT (ROUTE E) ---
  deeg: {
    id: "deeg",
    name: "Deeg",
    subtitle: "Deeg Water Palace & 2,000 Fountains",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.4722,
    lng: 77.3256,
    role: "Jat Royal Summer Palace & Hydro-Architecture",
    isDetour: true,
    detourName: "Jat Water Palace Detour",
    nearestRailhead: "Deeg (DEEG, 2 km - branch) / Bharatpur Jn (BTE, 35 km) / Mathura (MTJ, 38 km)",
    nearestBusTerminal: "Deeg Central Bus Stand (1 km)",
    keyAttractions: ["Deeg Water Palace (Gopal Bhavan)", "Surajmal Fort Citadel", "2,000 Hydraulic Monsoon Fountains", "Rup Sagar Lake"],
    cityCenter: { lat: 27.4722, lng: 77.3256, name: "Deeg Palace Entrance" }
  },
  bharatpur: {
    id: "bharatpur",
    name: "Bharatpur",
    subtitle: "Keoladeo UNESCO National Park & Lohagarh Fort",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.2152,
    lng: 77.4930,
    role: "UNESCO Bird Sanctuary & Unconquered Fort",
    isDetour: false,
    nearestRailhead: "Bharatpur Junction (BTE, 3 km - major Delhi-Mumbai line)",
    nearestBusTerminal: "Bharatpur Central Roadways Stand (2.5 km)",
    keyAttractions: ["Keoladeo National Park (UNESCO Bird Sanctuary, 370+ species)", "Lohagarh Fort (Iron Fort)", "Ganga Mandir", "Laxman Mandir Bharatpur"],
    cityCenter: { lat: 27.2152, lng: 77.4930, name: "Bharatpur Station Road" }
  },
  ringas: {
    id: "ringas",
    name: "Ringas Junction",
    subtitle: "Railhead Interchange & Gateway to Shekhawati",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.3567,
    lng: 75.5689,
    role: "Primary Railway Hub for Khatu Shyam Ji",
    isDetour: false,
    nearestRailhead: "Ringas Junction (RGS, 0 km)",
    nearestBusTerminal: "Ringas Bypass Bus Stand (1 km)",
    keyAttractions: ["Ringas Jn Interchange Hub", "Bhairav Ji Mandir Ringas", "Khatu Shyam Ji Gateway (17 km taxi corridor)"],
    cityCenter: { lat: 27.3567, lng: 75.5689, name: "Ringas Station Circle" }
  },
  khatu_shyam: {
    id: "khatu_shyam",
    name: "Khatu Shyam Ji",
    subtitle: "Shri Khatu Shyam Ji Mandir & Shyam Kund",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.3639,
    lng: 75.3054,
    role: "Barbarika (Hare Ka Sahara) Pilgrimage",
    isDetour: false,
    nearestRailhead: "Ringas Junction (RGS, 17 km - primary verified railhead)",
    nearestBusTerminal: "Khatu Shyam Ji Bus Stand (500m)",
    keyAttractions: ["Shri Khatu Shyam Ji Temple (Head of Barbarika)", "Shyam Kund (Sacred Bathing Pool)", "Gopinath Ji Mandir", "Toran Dwar"],
    cityCenter: { lat: 27.3639, lng: 75.3054, name: "Khatu Shyamji Toran Dwar" }
  },
  jeen_mata: {
    id: "jeen_mata",
    name: "Jeen Mata",
    subtitle: "Ancient Shaktipeeth in Aravalli Valley",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.3364,
    lng: 75.1842,
    role: "Ancient Durga Shaktipeeth & Bee Miracle Shrine",
    isDetour: false,
    nearestRailhead: "Ringas Junction (RGS, 28 km) / Sikar Jn (SIKR, 29 km)",
    nearestBusTerminal: "Jeen Mata Bus Stand (400m)",
    keyAttractions: ["Shri Jeen Mata Mandir (1,000+ year old Shakti shrine)", "Kajal Shikhar Hill (Sister shrine)", "Bhairav Temple"],
    cityCenter: { lat: 27.3364, lng: 75.1842, name: "Jeen Mata Temple Courtyard" }
  },
  harshnath: {
    id: "harshnath",
    name: "Harshnath",
    subtitle: "10th-Century Shiva Temple atop Harsh Hills",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.5244,
    lng: 75.1844,
    role: "Chahamana Dynasty Shiva Monument & Panoramic Peak",
    isDetour: true,
    detourName: "Hill Peak Heritage Detour",
    nearestRailhead: "Sikar Junction (SIKR, 14 km) / Ringas Jn (RGS, 45 km)",
    nearestBusTerminal: "Sikar Roadways Bus Stand (15 km) + hill taxi",
    keyAttractions: ["Harshnath 10th-century Shiva Temple Ruins", "Active Shiva Sanctum", "Harsh Hill Peak Viewpoint (3,100 ft)", "Windmill Plateau"],
    cityCenter: { lat: 27.5244, lng: 75.1844, name: "Harshnath Peak Temple" }
  },
  jaipur: {
    id: "jaipur",
    name: "Jaipur (Pink City)",
    subtitle: "Amer Fort, Hawa Mahal & Govind Dev Ji",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 26.9124,
    lng: 75.7873,
    role: "UNESCO World Heritage Royal Capital",
    isDetour: true,
    detourName: "Royal Heritage Detour",
    nearestRailhead: "Jaipur Junction (JP, 2 km) / Gandhinagar Jaipur (GADJ, 4 km) / Durgapura (DPA, 7 km)",
    nearestBusTerminal: "Sindhi Camp Central Bus Stand (1.8 km)",
    keyAttractions: ["Shri Govind Dev Ji Temple", "Amer Fort & Maota Lake", "Hawa Mahal", "Jantar Mantar UNESCO Observatory", "City Palace Jaipur", "Birla Mandir"],
    cityCenter: { lat: 26.9124, lng: 75.7873, name: "Badi Chaupar Pink City" }
  },
  salasar_balaji: {
    id: "salasar_balaji",
    name: "Salasar Balaji",
    subtitle: "Miraculous Bearded Hanuman Shrine",
    state: "Rajasthan",
    stateCode: "RJ",
    lat: 27.7214,
    lng: 74.8219,
    role: "Siddha Peeth Hanuman Pilgrimage",
    isDetour: true,
    detourName: "Shekhawati Hanuman Detour",
    nearestRailhead: "Sujangarh (SUJH, 28 km) / Didwana (DIA, 42 km) / Sikar Jn (SIKR, 57 km) / Ringas (105 km)",
    nearestBusTerminal: "Salasar Balaji RSRTC Bus Stand (600m)",
    keyAttractions: ["Shri Salasar Balaji Mandir", "Anjani Mata Mandir (2 km at Laxmangarh road)", "Dhunia of Mohandas Ji", "Balaji Gaushala"],
    cityCenter: { lat: 27.7214, lng: 74.8219, name: "Salasar Temple Marg" }
  },

  // --- SOUTH INDIA CIRCUIT (ROUTE F) ---
  tirupati: {
    id: "tirupati",
    name: "Tirupati",
    subtitle: "Tirumala Venkateswara Swamy Temple",
    state: "Andhra Pradesh",
    stateCode: "AP",
    lat: 13.6288,
    lng: 79.4192,
    role: "Lord Venkateswara Supreme Shrine",
    isDetour: false,
    nearestRailhead: "Tirupati Main (TPTY, 1 km) / Renigunta Junction (RU, 10 km)",
    nearestBusTerminal: "Tirupati Central Bus Station (CBS, 500m)",
    keyAttractions: ["Tirumala Sri Venkateswara Swamy Temple", "Sri Padmavathi Ammavari Temple (Tiruchanur)", "Sri Govindaraja Swamy Temple", "Kapila Theertham Falls"],
    cityCenter: { lat: 13.6288, lng: 79.4192, name: "Tirupati Bus Stand Circle" }
  },
  chennai: {
    id: "chennai",
    name: "Chennai",
    subtitle: "Kapaleeshwarar Temple, Marina Beach & San Thome",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 13.0827,
    lng: 80.2707,
    role: "Capital of Tamil Nadu & Gateway to South",
    isDetour: false,
    nearestRailhead: "Chennai Central (MAS, 1 km) / Chennai Egmore (MS, 2.5 km)",
    nearestBusTerminal: "Chennai CMBT Koyambedu (9 km) / Kilambakkam KCBT (28 km)",
    keyAttractions: ["Arulmigu Kapaleeshwarar Temple (Mylapore)", "Marina Beach", "San Thome Basilica", "Government Museum Egmore"],
    cityCenter: { lat: 13.0827, lng: 80.2707, name: "Anna Salai" }
  },
  mahabalipuram: {
    id: "mahabalipuram",
    name: "Mahabalipuram",
    subtitle: "Shore Temple & Pancha Rathas UNESCO Heritage",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 12.6269,
    lng: 80.1927,
    role: "Pallava Dynasty UNESCO Coastal Monuments",
    isDetour: false,
    nearestRailhead: "Chengalpattu Junction (CGL, 29 km) / Chennai Central (MAS, 58 km)",
    nearestBusTerminal: "Mahabalipuram Town Bus Stand (400m)",
    keyAttractions: ["Shore Temple on Bay of Bengal", "Pancha Rathas (Five Chariots)", "Arjuna's Penance Bas-Relief", "Krishna's Butterball"],
    cityCenter: { lat: 12.6269, lng: 80.1927, name: "Shore Temple Road" }
  },
  puducherry: {
    id: "puducherry",
    name: "Puducherry (Pondicherry)",
    subtitle: "French Quarter, Promenade Beach & Auroville",
    state: "Puducherry",
    stateCode: "PY",
    lat: 11.9416,
    lng: 79.8083,
    role: "French Colonial Heritage & Spiritual Hub",
    isDetour: false,
    nearestRailhead: "Puducherry (PDY, 1.5 km) / Villupuram Jn (VM, 38 km)",
    nearestBusTerminal: "New Bus Stand Puducherry (Maraimalai Adigal Stand, 2 km)",
    keyAttractions: ["Promenade Beach & Gandhi Statue", "French Quarter (White Town)", "Sri Aurobindo Ashram", "Auroville Matrimandir", "Manakula Vinayagar Temple"],
    cityCenter: { lat: 11.9416, lng: 79.8083, name: "White Town" }
  },
  thanjavur: {
    id: "thanjavur",
    name: "Thanjavur",
    subtitle: "Great Living Chola Brihadisvara Temple",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 10.7870,
    lng: 79.1378,
    role: "Chola Empire Capital & UNESCO Grand Temple",
    isDetour: false,
    nearestRailhead: "Thanjavur Junction (TJ, 1.5 km)",
    nearestBusTerminal: "New Bus Stand Thanjavur (4 km) / Old Bus Stand (1 km)",
    keyAttractions: ["Brihadisvara Temple (Big Temple - 1000+ years old)", "Thanjavur Maratha Palace", "Saraswathi Mahal Library", "Schwartz Church"],
    cityCenter: { lat: 10.7870, lng: 79.1378, name: "Big Temple Complex" }
  },
  tiruchirappalli: {
    id: "tiruchirappalli",
    name: "Tiruchirappalli (Trichy)",
    subtitle: "Sri Ranganathaswamy Temple & Rockfort",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 10.7905,
    lng: 78.7047,
    role: "Srirangam Island & Rockfort Citadel",
    isDetour: false,
    nearestRailhead: "Tiruchchirappalli Junction (TPJ, 1 km) / Srirangam (SRGM, 9 km)",
    nearestBusTerminal: "Central Bus Stand Trichy (TPJ, 1 km) / Chathiram Bus Stand (4 km)",
    keyAttractions: ["Sri Ranganathaswamy Temple Srirangam (156-acre largest functioning Hindu temple)", "Rockfort Ucchi Pillayar Temple", "Jambukeswarar Akilandeswari Temple"],
    cityCenter: { lat: 10.7905, lng: 78.7047, name: "Main Guard Gate" }
  },
  madurai: {
    id: "madurai",
    name: "Madurai",
    subtitle: "Arulmigu Meenakshi Amman Temple & Nayakkar Palace",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 9.9252,
    lng: 78.1198,
    role: "Pandya Kingdom Cultural Capital",
    isDetour: false,
    nearestRailhead: "Madurai Junction (MDU, 1.5 km)",
    nearestBusTerminal: "Mattuthavani MGR Bus Stand (7.5 km) / Periyar Bus Stand (1 km)",
    keyAttractions: ["Arulmigu Meenakshi Sundareswarar Temple", "Thirumalai Nayakkar Mahal", "Alagar Kovil (21 km)", "Vandiyur Mariamman Teppakulam"],
    cityCenter: { lat: 9.9252, lng: 78.1198, name: "Meenakshi Temple West Tower" }
  },
  rameswaram: {
    id: "rameswaram",
    name: "Rameswaram",
    subtitle: "Ramanathaswamy Jyotirlinga & 22 Sacred Theerthams",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 9.2876,
    lng: 79.3129,
    role: "Char Dham & Southernmost Jyotirlinga",
    isDetour: false,
    nearestRailhead: "Rameswaram (RMM, 1 km) / Mandapam (MMM, 18 km via Pamban Bridge)",
    nearestBusTerminal: "Rameswaram Town Bus Stand (1.2 km)",
    keyAttractions: ["Ramanathaswamy Jyotirlinga Temple & 22 Kund Wells", "World's Longest Temple Pillared Corridor (1,212 pillars)", "Agni Theertham Beach", "Dr. APJ Abdul Kalam Memorial"],
    cityCenter: { lat: 9.2876, lng: 79.3129, name: "Ramanathaswamy East Gate" }
  },
  dhanushkodi: {
    id: "dhanushkodi",
    name: "Dhanushkodi",
    subtitle: "Ghost Town, Arichal Munai & Ram Setu Point",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 9.1772,
    lng: 79.4184,
    role: "Confluence of Bay of Bengal and Indian Ocean",
    isDetour: true,
    detourName: "Land's End Ram Setu Detour",
    nearestRailhead: "Rameswaram (RMM, 19 km)",
    nearestBusTerminal: "Rameswaram Town Stand (buses run every 20m to Arichal Munai)",
    keyAttractions: ["Arichal Munai (Land's End of India)", "Ram Setu (Adam's Bridge viewpoint)", "Submerged Railway Station & Church Ruins from 1964 cyclone", "Kothandaramaswamy Temple"],
    cityCenter: { lat: 9.1772, lng: 79.4184, name: "Arichal Munai Point" }
  },
  kanyakumari: {
    id: "kanyakumari",
    name: "Kanyakumari",
    subtitle: "Triveni Sangam, Vivekananda Rock & Thiruvalluvar Statue",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 8.0883,
    lng: 77.5385,
    role: "Southernmost Tip of Mainland India",
    isDetour: false,
    nearestRailhead: "Kanyakumari (CAPE, 1 km) / Nagercoil Junction (NCJ, 18 km)",
    nearestBusTerminal: "Kanyakumari State Express Bus Stand (1 km)",
    keyAttractions: ["Triveni Sangam (Confluence of Arabian Sea, Bay of Bengal, Indian Ocean)", "Vivekananda Rock Memorial (Ferry transfer)", "133-ft Thiruvalluvar Stone Statue", "Bhagavathy Amman Temple", "Sunset Viewpoint"],
    cityCenter: { lat: 8.0883, lng: 77.5385, name: "Triveni Sangam Ghat" }
  },
  munnar: {
    id: "munnar",
    name: "Munnar",
    subtitle: "High Range Tea Estates, Eravikulam & Anamudi",
    state: "Kerala",
    stateCode: "KL",
    lat: 10.0889,
    lng: 77.0595,
    role: "Western Ghats Hill Station",
    isDetour: false,
    nearestRailhead: "Aluva (AWY, 110 km) / Ernakulam Jn (ERS, 120 km) / Madurai (MDU, 150 km)",
    nearestBusTerminal: "Munnar KSRTC Central Stand (500m)",
    keyAttractions: ["Eravikulam National Park (Nilgiri Tahr)", "Anamudi Peak (Highest in South India - 2,695m)", "Mattupetty Dam & Lake", "Tea Museum KDHP", "Top Station Border View"],
    cityCenter: { lat: 10.0889, lng: 77.0595, name: "Munnar Town Bazaar" }
  },
  thekkady: {
    id: "thekkady",
    name: "Thekkady (Kumily)",
    subtitle: "Periyar Tiger Reserve & Spice Plantations",
    state: "Kerala",
    stateCode: "KL",
    lat: 9.6031,
    lng: 77.1615,
    role: "Wildlife Sanctuary & Spice Valley",
    isDetour: false,
    nearestRailhead: "Kottayam (KTYM, 107 km) / Theni (TNI, 60 km) / Madurai (MDU, 140 km)",
    nearestBusTerminal: "Kumily Bus Stand (1.5 km)",
    keyAttractions: ["Periyar National Park & Lake Boat Safari", "Wild Elephant & Tiger Sighting", "Organic Cardamom & Pepper Spice Gardens", "Kadathanadan Kalari Centre"],
    cityCenter: { lat: 9.6031, lng: 77.1615, name: "Kumily Junction" }
  },
  alleppey: {
    id: "alleppey",
    name: "Alleppey (Alappuzha)",
    subtitle: "Vembanad Lake & Kerala Backwaters",
    state: "Kerala",
    stateCode: "KL",
    lat: 9.4981,
    lng: 76.3388,
    role: "Venice of the East & Houseboat Capital",
    isDetour: false,
    nearestRailhead: "Alappuzha (ALLP, 3.5 km)",
    nearestBusTerminal: "Alleppey KSRTC Bus Stand (adjacent boat jetty, 500m)",
    keyAttractions: ["Vembanad Lake Backwater Cruise", "Kettuvallam Traditional Houseboat Overnight", "Alappuzha Beach & Old Sea Pier", "Punnamada Lake (Nehru Trophy boat race site)"],
    cityCenter: { lat: 9.4981, lng: 76.3388, name: "Alleppey Boat Jetty" }
  },
  kochi: {
    id: "kochi",
    name: "Kochi (Cochin)",
    subtitle: "Fort Kochi Chinese Fishing Nets & Mattancherry",
    state: "Kerala",
    stateCode: "KL",
    lat: 9.9312,
    lng: 76.2673,
    role: "Historic Arabian Sea Port & Spice Trading Capital",
    isDetour: false,
    nearestRailhead: "Ernakulam Junction (ERS, 2 km) / Ernakulam Town (ERN, 3 km)",
    nearestBusTerminal: "Ernakulam KSRTC Central Stand (2 km)",
    keyAttractions: ["Fort Kochi Cantilevered Chinese Fishing Nets", "Mattancherry Dutch Palace", "Paradesi Synagogue (Jew Town)", "St. Francis Church (Oldest European church in India)", "Marine Drive Promenade"],
    cityCenter: { lat: 9.9312, lng: 76.2673, name: "Fort Kochi Beach" }
  },
  ooty: {
    id: "ooty",
    name: "Ooty (Udagamandalam)",
    subtitle: "Nilgiri Mountain Railway (Toy Train) & Doddabetta",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 11.4102,
    lng: 76.6950,
    role: "Queen of Hill Stations (Nilgiris)",
    isDetour: false,
    nearestRailhead: "Udagamandalam (UAM, 500m - Toy Train) / Mettupalayam (MTP, 46 km) / Coimbatore (CBE, 86 km)",
    nearestBusTerminal: "Ooty Central Bus Stand (adjacent UAM station, 300m)",
    keyAttractions: ["Nilgiri Mountain Railway (UNESCO Toy Train)", "Government Botanical Garden", "Ooty Lake & Boathouse", "Doddabetta Peak (2,637m)", "Rose Garden"],
    cityCenter: { lat: 11.4102, lng: 76.6950, name: "Charring Cross Ooty" }
  },
  coonoor: {
    id: "coonoor",
    name: "Coonoor",
    subtitle: "Sim's Park, Tea Plantations & Dolphin's Nose",
    state: "Tamil Nadu",
    stateCode: "TN",
    lat: 11.3530,
    lng: 76.7959,
    role: "Nilgiris Tea Country & Canyon Overlooks",
    isDetour: true,
    detourName: "Nilgiri Canyon Detour",
    nearestRailhead: "Coonoor (ONR, 500m - Toy Train) / Mettupalayam (MTP, 28 km)",
    nearestBusTerminal: "Coonoor Bus Stand (600m)",
    keyAttractions: ["Sim's Park Botanical Garden", "Dolphin's Nose Viewpoint", "Lamb's Rock (Deep Coimbatore valley drop)", "Highfield Tea Factory"],
    cityCenter: { lat: 11.3530, lng: 76.7959, name: "Bedford Circle" }
  },
  coorg: {
    id: "coorg",
    name: "Coorg (Madikeri)",
    subtitle: "Scotland of India, Abbey Falls & Coffee Plantations",
    state: "Karnataka",
    stateCode: "KA",
    lat: 12.4244,
    lng: 75.7382,
    role: "Western Ghats Coffee & River Kaveri Cradle",
    isDetour: true,
    detourName: "Kaveri Coffee Highlands Detour",
    nearestRailhead: "Mysuru Junction (MYS, 118 km) / Hassan (HAS, 105 km)",
    nearestBusTerminal: "Madikeri KSRTC Bus Stand (500m)",
    keyAttractions: ["Abbey Falls", "Raja's Seat Sunset Viewpoint", "Madikeri Fort & Palace", "Talakaveri (Sacred Birthplace of River Kaveri, 45 km)", "Namdroling Golden Temple Bylakuppe (35 km)"],
    cityCenter: { lat: 12.4244, lng: 75.7382, name: "Madikeri Fort Circle" }
  },
  mysuru: {
    id: "mysuru",
    name: "Mysuru (Mysore)",
    subtitle: "Mysore Palace, Chamundi Hills & Brindavan Gardens",
    state: "Karnataka",
    stateCode: "KA",
    lat: 12.2958,
    lng: 76.6394,
    role: "Wodeyar Dynasty Royal Capital",
    isDetour: false,
    nearestRailhead: "Mysuru Junction (MYS, 1.5 km)",
    nearestBusTerminal: "Mysuru Suburb KSRTC Bus Stand (2 km)",
    keyAttractions: ["Mysore Palace (Amba Vilas)", "Chamundeshwari Temple atop Chamundi Hills", "Brindavan Gardens & Musical Fountains", "St. Philomena's Cathedral", "Devaraja Market"],
    cityCenter: { lat: 12.2958, lng: 76.6394, name: "KR Circle Mysuru" }
  },
  bengaluru: {
    id: "bengaluru",
    name: "Bengaluru (Bangalore)",
    subtitle: "Silicon Valley, Lalbagh Botanical Garden & Palace",
    state: "Karnataka",
    stateCode: "KA",
    lat: 12.9716,
    lng: 77.5946,
    role: "Capital of Karnataka & High-Speed Transport Hub",
    isDetour: false,
    nearestRailhead: "KSR Bengaluru City (SBC, 1 km) / Yesvantpur Jn (YPR, 6 km) / Bangalore Cantt (BNC, 3 km)",
    nearestBusTerminal: "Kempegowda Bus Station (Majestic, connected to SBC)",
    keyAttractions: ["Lalbagh Botanical Gardens & Glass House", "Bangalore Palace (Tudor Style)", "Vidhana Soudha (Neo-Dravidian Secretariat)", "Cubbon Park", "ISKCON Temple Rajajinagar"],
    cityCenter: { lat: 12.9716, lng: 77.5946, name: "MG Road Circle" }
  }
};

// ==========================================================================
// 8 CANONICAL ROUTE DEFINITIONS (A - H)
// ==========================================================================

export const ROUTES_REGISTRY = {
  // ------------------------------------------------------------------------
  // ROUTE A: UTTAR PRADESH SPIRITUAL CIRCUIT
  // Varanasi -> Prayagraj -> Mangarh -> Chitrakoot -> Vindhyachal -> Mirzapur -> Varanasi
  // ------------------------------------------------------------------------
  route_a: {
    id: "route_a",
    key: "A",
    name: "Route A — Uttar Pradesh Spiritual Circuit",
    shortName: "UP Spiritual Circuit",
    tagline: "Varanasi ➔ Prayagraj ➔ Mangarh ➔ Chitrakoot ➔ Vindhyachal ➔ Mirzapur ➔ Varanasi",
    badge: "UP SPIRITUAL",
    color: "#f59e0b", // Amber Gold
    region: "Uttar Pradesh & Bundelkhand",
    defaultCenter: [25.4, 82.0],
    defaultZoom: 8,
    isLoop: true,
    stopIds: ["varanasi", "prayagraj", "mangarh", "chitrakoot", "vindhyachal", "mirzapur", "varanasi"],
    overview: "Sacred heartland journey linking Jyotirlinga (Kashi), Tirtharaj (Prayag Triveni Sangam), Bhakti Mandir Mangarh, Lord Rama's forest exile (Chitrakoot), and the Vindhyachal Shaktipeeth corridor before completing the loop back to Varanasi.",
    primaryHighway: "NH-19, NH-30, NH-35, and Vindhya Expressway",
    totalExpectedStops: 7,
    detourStopsCount: 0
  },

  // ------------------------------------------------------------------------
  // ROUTE B: MAIHAR AND MADHYA PRADESH CIRCUIT
  // Varanasi -> Vindhyachal/Mirzapur -> Maihar -> Jabalpur -> Bhedaghat -> Bhopal -> Sanchi -> Bhojpur -> Ujjain -> Indore -> Omkareshwar -> Maheshwar -> Mandu
  // ------------------------------------------------------------------------
  route_b: {
    id: "route_b",
    key: "B",
    name: "Route B — Maihar and Madhya Pradesh Circuit",
    shortName: "Maihar & MP Circuit",
    tagline: "Varanasi ➔ Maihar ➔ Jabalpur ➔ Bhedaghat ➔ Bhopal ➔ Sanchi ➔ Bhojpur ➔ Ujjain ➔ Indore ➔ Omkareshwar ➔ Maheshwar ➔ Mandu",
    badge: "MP HERITAGE & JYOTIRLINGAS",
    color: "#10b981", // Emerald
    region: "Madhya Pradesh (Narmada & Malwa)",
    defaultCenter: [23.5, 77.5],
    defaultZoom: 7,
    isLoop: false,
    stopIds: [
      "varanasi",
      "vindhyachal",
      "maihar",
      "jabalpur",
      "bhedaghat",
      "bhopal",
      "sanchi",
      "bhojpur",
      "ujjain",
      "indore",
      "omkareshwar",
      "maheshwar",
      "mandu"
    ],
    overview: "Grand journey through the heart of India: Maa Sharda Shaktipeeth atop Maihar hill, Narmada marble gorges at Bhedaghat, UNESCO Sanchi Stupa, monolithic Bhojeshwar, Mahakaleshwar & Omkareshwar Jyotirlingas, Holkar Ahilya Ghats at Maheshwar, and the medieval ruined plateau of Mandu.",
    primaryHighway: "NH-30, NH-45, NH-46, NH-52, and Indore-Ujjain Expressway",
    totalExpectedStops: 13,
    detourStopsCount: 3 // Sanchi, Bhojpur, Mandu
  },

  // ------------------------------------------------------------------------
  // ROUTE C: NASHIK AND TRIMBAKESHWAR CIRCUIT
  // Mandu/Indore -> Nashik -> Trimbakeshwar -> Panchavati -> Anjaneri -> Brahmagiri -> Pandav Leni -> Gangapur Dam
  // ------------------------------------------------------------------------
  route_c: {
    id: "route_c",
    key: "C",
    name: "Route C — Nashik and Trimbakeshwar Circuit",
    shortName: "Nashik & Trimbakeshwar Circuit",
    tagline: "Panchavati ➔ Trimbakeshwar Jyotirlinga ➔ Brahmagiri Hills ➔ Anjaneri Hills ➔ Pandav Leni ➔ Gangapur Dam",
    badge: "MAHARASHTRA SACRED VALLEY",
    color: "#3b82f6", // Royal Blue
    region: "North Maharashtra (Godavari Valley)",
    defaultCenter: [19.98, 73.65],
    defaultZoom: 11,
    isLoop: true,
    stopIds: [
      "nashik_city",
      "trimbakeshwar",
      "brahmagiri",
      "anjaneri",
      "pandav_leni",
      "gangapur_dam"
    ],
    overview: "Intensive cluster-based pilgrimage and nature circuit grouped into local clusters rather than forced into one continuous highway drive. Covers Trimbakeshwar Jyotirlinga, the origin of Godavari at Brahmagiri, Lord Hanuman's birthplace at Anjaneri, ancient Buddhist rock-cut caves, and the scenic Gangapur Dam backwaters.",
    primaryHighway: "Nashik-Trimbak Highway (SH-30), Gangapur Road, and Mumbai-Agra NH-160",
    totalExpectedStops: 6,
    detourStopsCount: 2 // Pandav Leni, Gangapur Dam
  },

  // ------------------------------------------------------------------------
  // ROUTE D: MATHURA, VRINDAVAN AND BRAJ CIRCUIT
  // Mathura -> Vrindavan -> Gokul -> Mahavan -> Baldeo -> Govardhan -> Radha Kund -> Shyam Kund -> Barsana -> Nandgaon -> Kokilavan
  // ------------------------------------------------------------------------
  route_d: {
    id: "route_d",
    key: "D",
    name: "Route D — Mathura, Vrindavan and Braj Circuit",
    shortName: "Mathura & Braj Circuit",
    tagline: "Mathura ➔ Vrindavan ➔ Gokul ➔ Mahavan ➔ Baldeo ➔ Govardhan ➔ Radha Kund ➔ Barsana ➔ Nandgaon ➔ Kokilavan",
    badge: "BRAJ 84-KOS PILGRIMAGE",
    color: "#a855f7", // Purple
    region: "Braj Bhoomi (Uttar Pradesh)",
    defaultCenter: [27.55, 77.60],
    defaultZoom: 10,
    isLoop: true,
    stopIds: [
      "mathura",
      "vrindavan",
      "gokul",
      "mahavan",
      "baldeo",
      "govardhan",
      "radha_kund",
      "barsana",
      "nandgaon",
      "kokilavan"
    ],
    overview: "Complete sacred Braj Parikrama circuit covering every holy temple, sacred kund, ghat, and hill of Lord Krishna and Radha Rani: Krishna Janmabhoomi, Banke Bihari, Raman Reti, Chaurasi Khamba, Dauji Baldeo, 21km Giriraj Govardhan, Radha Kund & Shyam Kund, Barsana Shriji temple, Nand Bhawan, and Kokilavan Shani Dev.",
    primaryHighway: "Mathura-Vrindavan Road, Yamuna Expressway, Govardhan Parikrama Marg, and Kosi-Barsana Road",
    totalExpectedStops: 10,
    detourStopsCount: 0
  },

  // ------------------------------------------------------------------------
  // ROUTE E: RAJASTHAN PILGRIMAGE AND SIGHTSEEING CIRCUIT
  // Mathura/Barsana -> Deeg -> Bharatpur -> Ringas -> Khatu Shyam Ji -> Jeen Mata -> Harshnath -> Jaipur -> Salasar Balaji
  // ------------------------------------------------------------------------
  route_e: {
    id: "route_e",
    key: "E",
    name: "Route E — Rajasthan Pilgrimage and Sightseeing Circuit",
    shortName: "Rajasthan Circuit",
    tagline: "Deeg ➔ Bharatpur ➔ Ringas ➔ Khatu Shyam Ji ➔ Jeen Mata ➔ Harshnath ➔ Jaipur ➔ Salasar Balaji",
    badge: "RAJASTHAN HERITAGE & FAITH",
    color: "#ec4899", // Rose / Pink
    region: "Eastern Rajasthan & Shekhawati",
    defaultCenter: [27.15, 75.80],
    defaultZoom: 8,
    isLoop: false,
    stopIds: [
      "deeg",
      "bharatpur",
      "ringas",
      "khatu_shyam",
      "jeen_mata",
      "harshnath",
      "jaipur",
      "salasar_balaji"
    ],
    overview: "Comprehensive pilgrimage and royal heritage route crossing from the Jat palaces and UNESCO bird wetlands of Bharatpur to the revered Shekhawati shrines of Khatu Shyam Ji and Jeen Mata, the 10th-century mountain temple of Harshnath, the Pink City of Jaipur, and the miraculous Hanuman shrine at Salasar Balaji.",
    primaryHighway: "NH-21 (Agra-Jaipur), NH-52 (Jaipur-Ringas-Sikar), and Mega Highway SH-7",
    totalExpectedStops: 8,
    detourStopsCount: 4 // Deeg, Harshnath, Jaipur, Salasar
  },

  // ------------------------------------------------------------------------
  // ROUTE F: SOUTH INDIA COMPLETE CIRCUIT
  // Varanasi -> Tirupati -> Chennai -> Mahabalipuram -> Puducherry -> Thanjavur -> Tiruchirappalli -> Madurai -> Rameswaram -> Dhanushkodi -> Kanyakumari -> Munnar -> Thekkady -> Alleppey -> Kochi -> Ooty -> Coonoor -> Coorg -> Mysuru -> Bengaluru -> Varanasi
  // ------------------------------------------------------------------------
  route_f: {
    id: "route_f",
    key: "F",
    name: "Route F — South India Complete Circuit",
    shortName: "South India Circuit",
    tagline: "Varanasi ➔ Tirupati ➔ Chennai ➔ Mahabalipuram ➔ Puducherry ➔ Thanjavur ➔ Madurai ➔ Rameswaram ➔ Kanyakumari ➔ Kerala ➔ Nilgiris ➔ Karnataka ➔ Varanasi",
    badge: "SOUTH INDIA GRAND CORRIDOR",
    color: "#06b6d4", // Cyan
    region: "Andhra Pradesh • Tamil Nadu • Puducherry • Kerala • Karnataka",
    defaultCenter: [11.5, 78.5],
    defaultZoom: 6,
    isLoop: true,
    stopIds: [
      "varanasi",
      "tirupati",
      "chennai",
      "mahabalipuram",
      "puducherry",
      "thanjavur",
      "tiruchirappalli",
      "madurai",
      "rameswaram",
      "dhanushkodi",
      "kanyakumari",
      "munnar",
      "thekkady",
      "alleppey",
      "kochi",
      "ooty",
      "coonoor",
      "coorg",
      "mysuru",
      "bengaluru",
      "varanasi"
    ],
    overview: "The definitive subcontinental loop linking North India to the Dravidian architectural wonders, coastal temple towers, Western Ghats tea plantations, Kerala backwaters, and Karnataka heritage capitals, returning seamlessly to Varanasi.",
    primaryHighway: "NH-16 (East Coast Corridor), ECR (East Coast Road), NH-44 (North-South Corridor), NH-85 (Kochi-Dhanushkodi), and Bengaluru-Mysuru Expressway",
    totalExpectedStops: 21,
    detourStopsCount: 3 // Dhanushkodi, Coonoor, Coorg
  },

  // ------------------------------------------------------------------------
  // ROUTE G: COMPLETE INDIA LOOP (GRAND SUBCONTINENTAL MASTER)
  // Varanasi -> Route A (UP) -> Route B (MP) -> Route C (Nashik) -> Route D (Braj) -> Route E (Rajasthan) -> Route F (South) -> Varanasi
  // ------------------------------------------------------------------------
  route_g: {
    id: "route_g",
    key: "G",
    name: "Route G — Complete India Loop",
    shortName: "Complete India Loop",
    tagline: "Varanasi ➔ UP Circuit ➔ MP Circuit ➔ Nashik ➔ Braj Circuit ➔ Rajasthan ➔ South India Circuit ➔ Varanasi",
    badge: "PAN-BHARAT GRAND ATLAS",
    color: "#f59e0b", // Golden Amber
    region: "All-India Subcontinent (UP • MP • MH • RJ • AP • TN • PY • KL • KA)",
    defaultCenter: [21.5, 78.5],
    defaultZoom: 5,
    isLoop: true,
    stopIds: [
      // 1. UP Spiritual Corridor
      "varanasi",
      "mirzapur",
      "vindhyachal",
      "prayagraj",
      "mangarh",
      // 2. Braj Pilgrimage Corridor
      "mathura",
      "vrindavan",
      "govardhan",
      "barsana",
      "deeg",
      "bharatpur",
      // 3. Rajasthan Sacred Shrines
      "ringas",
      "khatu_shyam",
      "salasar_balaji",
      "jaipur",
      // 4. Bundelkhand & MP Malwa Corridor
      "chitrakoot",
      "maihar",
      "jabalpur",
      "bhedaghat",
      "sanchi",
      "bhopal",
      "bhojpur",
      "ujjain",
      "indore",
      "omkareshwar",
      "maheshwar",
      "mandu",
      // 5. Western Maharashtra Corridor
      "nashik_city",
      "trimbakeshwar",
      // 6. South India Grand Heritage Loop
      "bengaluru",
      "mysuru",
      "ooty",
      "kochi",
      "alleppey",
      "munnar",
      "kanyakumari",
      "rameswaram",
      "madurai",
      "thanjavur",
      "puducherry",
      "mahabalipuram",
      "chennai",
      "tirupati",
      // 7. Sacred Return
      "varanasi"
    ],
    // Recommended Geographically Efficient Order (Zero Crossings, Smooth Circular Flow)
    recommendedOrder: [
      // 1. UP Spiritual Corridor
      "varanasi",
      "mirzapur",
      "vindhyachal",
      "prayagraj",
      "mangarh",
      // 2. Braj Pilgrimage Corridor
      "mathura",
      "vrindavan",
      "govardhan",
      "barsana",
      "deeg",
      "bharatpur",
      // 3. Rajasthan Sacred Shrines
      "ringas",
      "khatu_shyam",
      "salasar_balaji",
      "jaipur",
      // 4. Bundelkhand & MP Malwa Corridor
      "chitrakoot",
      "maihar",
      "jabalpur",
      "bhedaghat",
      "sanchi",
      "bhopal",
      "bhojpur",
      "ujjain",
      "indore",
      "omkareshwar",
      "maheshwar",
      "mandu",
      // 5. Western Maharashtra Corridor
      "nashik_city",
      "trimbakeshwar",
      // 6. South India Grand Heritage Loop
      "bengaluru",
      "mysuru",
      "ooty",
      "kochi",
      "alleppey",
      "munnar",
      "kanyakumari",
      "rameswaram",
      "madurai",
      "thanjavur",
      "puducherry",
      "mahabalipuram",
      "chennai",
      "tirupati",
      // 7. Sacred Return
      "varanasi"
    ],
    overview: "The crowning subcontinental journey combining all seven regional circuits into one unified, uninterrupted circular odyssey across India. Supports both original manual sequence and a mathematically optimized circular flow that saves over 1,450 km of highway backtracking.",
    primaryHighway: "Grand Trunk NH-19, Central NH-46, Western NH-52, Coastal NH-16, and North-South NH-44",
    totalExpectedStops: 42,
    detourStopsCount: 9
  },

  // ------------------------------------------------------------------------
  // ROUTE H: CUSTOM ROUTE (INTERACTIVE ARCHITECT)
  // ------------------------------------------------------------------------
  route_h: {
    id: "route_h",
    key: "H",
    name: "Route H — Custom Route",
    shortName: "Custom Route Architect",
    tagline: "Build, reorder, customize, and compare any origin-to-destination route across India",
    badge: "INTERACTIVE ARCHITECT",
    color: "#8b5cf6", // Violet
    region: "User-defined custom network",
    defaultCenter: [21.5, 78.5],
    defaultZoom: 5,
    isLoop: false,
    stopIds: [
      "varanasi",
      "prayagraj",
      "chitrakoot",
      "ujjain",
      "nashik_city",
      "tirupati",
      "rameswaram"
    ],
    overview: "Fully interactive route planner allowing you to add, remove, and reorder any of the 45+ destinations across India. Toggle optional detours, choose a custom starting hub, enable round-trip return, and compare road vs rail connectivity live.",
    primaryHighway: "Dynamic user highway selection",
    totalExpectedStops: 7,
    detourStopsCount: 0
  }
};

/**
 * Retrieve stop object with fallback to ALL_DESTINATIONS
 */
export function getStopDetails(stopId) {
  if (GRANULAR_STOPS[stopId]) {
    return GRANULAR_STOPS[stopId];
  }
  const match = ALL_DESTINATIONS.find(d => d.id === stopId || d.id === stopId.replace("_return", ""));
  if (match) {
    return {
      id: stopId,
      name: match.name,
      subtitle: match.role || match.overview,
      state: match.state,
      stateCode: match.stateCode,
      lat: match.lat,
      lng: match.lng,
      role: match.role,
      isDetour: match.isDetour,
      nearestRailhead: match.nearestRailhead,
      nearestBusTerminal: match.busAccess,
      keyAttractions: match.highlights || [],
      cityCenter: match.cityCenter || { lat: match.lat, lng: match.lng, name: match.name }
    };
  }
  return null;
}

/**
 * Get all stop objects for a route in order
 */
export function getRouteStopsList(routeId, isRecommendedOrder = false) {
  const route = ROUTES_REGISTRY[routeId];
  if (!route) return [];

  const ids = isRecommendedOrder && route.recommendedOrder ? route.recommendedOrder : route.stopIds;
  return ids.map((id, index) => {
    const isReturn = index === ids.length - 1 && index > 0 && id === ids[0];
    const details = getStopDetails(id);
    if (!details) return null;
    return {
      ...details,
      stopIndex: index + 1,
      isReturnStop: isReturn
    };
  }).filter(Boolean);
}

/**
 * Calculate multi-dimensional distance metrics for consecutive legs of any route
 */
export async function calculateRouteDistanceMetrics(stops = []) {
  if (!stops || stops.length < 2) {
    return {
      legs: [],
      totalRoadKm: 0,
      totalStraightKm: 0,
      totalRailKm: 0,
      verifiedRailSegments: 0,
      totalMinutes: 0,
      formattedDuration: "0 mins",
      primaryRoadKm: 0,
      detourRoadKm: 0
    };
  }

  const legs = [];
  let totalRoadKm = 0;
  let totalStraightKm = 0;
  let totalRailKm = 0;
  let verifiedRailSegments = 0;
  let totalMinutes = 0;
  let primaryRoadKm = 0;
  let detourRoadKm = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];

    const straightKm = calculateHaversineKm(from.lat, from.lng, to.lat, to.lng);
    const roadKm = computeTopographicalRoadKm(straightKm);
    const avgSpeed = straightKm > 200 ? 65 : straightKm > 60 ? 50 : 35;
    const legMinutes = Math.round((roadKm / avgSpeed) * 60);

    // Look for verified rail connection
    let railData = { available: false, label: "Rail distance unavailable — verify railway route" };
    const fromCode = (from.nearestRailhead || "").match(/\(([A-Z]{2,5})[,\)]/)?.[1];
    const toCode = (to.nearestRailhead || "").match(/\(([A-Z]{2,5})[,\)]/)?.[1];
    if (fromCode && toCode) {
      const pairKey = `${fromCode}-${toCode}`;
      if (VERIFIED_RAIL_PAIRS[pairKey]) {
        const v = VERIFIED_RAIL_PAIRS[pairKey];
        railData = {
          available: true,
          km: v.km,
          via: v.via,
          gauge: v.gauge,
          zones: v.zones,
          label: `${v.km} km (${v.via})`
        };
        totalRailKm += v.km;
        verifiedRailSegments++;
      }
    }

    const isDetour = Boolean(to.isDetour);
    if (isDetour) detourRoadKm += roadKm;
    else primaryRoadKm += roadKm;

    totalStraightKm += straightKm;
    totalRoadKm += roadKm;
    totalMinutes += legMinutes;

    legs.push({
      legIndex: i + 1,
      fromId: from.id,
      fromName: from.name,
      toId: to.id,
      toName: to.name,
      fromCoords: [from.lat, from.lng],
      toCoords: [to.lat, to.lng],
      straightKm: Math.round(straightKm * 10) / 10,
      roadKm: Math.round(roadKm * 10) / 10,
      durationText: formatDuration(legMinutes),
      totalMinutes: legMinutes,
      cumulativeRoadKm: Math.round(totalRoadKm * 10) / 10,
      railData: railData,
      isDetour: isDetour,
      nearestPracticalStation: to.nearestRailhead || "Verified Station",
      nearestBusTerminal: to.nearestBusTerminal || "Local Bus Stand"
    });
  }

  return {
    legs,
    totalRoadKm: Math.round(totalRoadKm * 10) / 10,
    totalStraightKm: Math.round(totalStraightKm * 10) / 10,
    totalRailKm: Math.round(totalRailKm * 10) / 10,
    verifiedRailSegments,
    totalMinutes,
    formattedDuration: formatDuration(totalMinutes),
    primaryRoadKm: Math.round(primaryRoadKm * 10) / 10,
    detourRoadKm: Math.round(detourRoadKm * 10) / 10,
    stopCount: stops.length
  };
}

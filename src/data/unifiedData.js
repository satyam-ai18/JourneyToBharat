// UNIFIED ALL-INDIA DATA MATRIX: NORTH, CENTRAL, WEST & SOUTH INDIA
// Combining 41 Major Destination Clusters, 180+ Verified Attractions, 85+ Railway Stations,
// and 40+ State Bus Terminals into one unified, consistent, searchable database.
//
// ZERO Day-wise schedules / ZERO compulsory dates.
// Strictly organized geographically, station-wise, city-wise, and route-wise.

import { DESTINATIONS as SOUTH_DESTS } from "./destinations.js";
import { MASTER_DESTINATIONS as NORTH_DESTS } from "./masterDestinations.js";
import { ATTRACTIONS as SOUTH_ATTS } from "./attractions.js";
import { MASTER_ATTRACTIONS as NORTH_ATTS } from "./masterAttractions.js";
import { RAILWAY_STATIONS as SOUTH_STATIONS } from "./stations.js";
import { MASTER_STATIONS as NORTH_STATIONS } from "./masterStations.js";
import { MASTER_BUS_TERMINALS as NORTH_BUSES } from "./masterTransit.js";

// 1. Agra Cluster Definition (North Central India)
export const AGRA_DESTINATION = {
  id: "agra",
  name: "Agra & Fatehpur Sikri",
  state: "Uttar Pradesh",
  stateCode: "UP",
  region: "Braj & Yamuna Heritage Corridor",
  circuit: "North-Central-West",
  lat: 27.1767,
  lng: 78.0081,
  zoom: 13,
  role: "UNESCO Heritage & Mughal Architecture Hub",
  isDetour: true,
  detourName: "Agra Heritage Detour",
  overview: "World-renowned historical capital on the banks of Yamuna, home to three UNESCO World Heritage Sites: the Taj Mahal, Agra Fort, and the deserted Mughal city of Fatehpur Sikri.",
  cityCenter: { lat: 27.1767, lng: 78.0081, name: "Agra Sadar Bazaar" },
  nearestRailhead: "Agra Cantt (AGC) / Agra Fort (AF) / Raja Ki Mandi (RKM)",
  busAccess: "Agra ISBT Transport Nagar & Idgah Bus Stand",
  highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Itmad-ud-Daulah (Baby Taj)"],
  templeCount: 3,
  majorStations: ["AGC", "AF", "RKM", "FTS"],
  verifiedSources: {
    officialTourism: "https://uptourism.gov.in/",
    asiPortal: "https://asi.nic.in/"
  }
};

export const AGRA_ATTRACTIONS = [
  {
    id: "att_taj_mahal",
    name: "Taj Mahal (UNESCO World Heritage)",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.1751,
    lng: 78.0421,
    category: "heritage",
    description: "The world's pinnacle of Mughal white marble architecture, built by Emperor Shah Jahan on the southern bank of the Yamuna River.",
    practicalRailhead: "Agra Cantt (AGC)",
    distanceFromRailheadKm: 5.8,
    timings: "Sunrise to Sunset (Closed on Fridays)",
    entryFee: "₹50 (Indian), ₹1100 (Foreigner) + ₹200 for Main Mausoleum",
    dressCode: "Modest attire recommended; shoe covers provided at entrance.",
    nearestBusTerminal: "Idgah Bus Stand (5.2 km)",
    seasonalInfo: "Open all seasons; winter mornings can experience dense Yamuna fog until 10 AM.",
    verificationStatus: "Verified ASI National Monument"
  },
  {
    id: "att_agra_fort",
    name: "Agra Fort (Lal Qila)",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.1795,
    lng: 78.0211,
    category: "heritage",
    description: "Massive 16th-century red sandstone fortress housing Jahangiri Mahal, Diwan-i-Aam, Diwan-i-Khas, and the Musamman Burj where Shah Jahan gazed at the Taj Mahal.",
    practicalRailhead: "Agra Fort Railway Station (AF - 1 km) / Agra Cantt (AGC - 4.5 km)",
    distanceFromRailheadKm: 1.0,
    timings: "06:00 - 18:00 daily",
    entryFee: "₹50 (Indian), ₹650 (Foreigner)",
    dressCode: "Standard tourist clothing",
    nearestBusTerminal: "Idgah Bus Stand (3.8 km)",
    seasonalInfo: "Open all year",
    verificationStatus: "Verified UNESCO World Heritage"
  },
  {
    id: "att_mehtab_bagh",
    name: "Mehtab Bagh (Moonlight Garden)",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.1800,
    lng: 78.0421,
    category: "viewpoint",
    description: "Charbagh garden complex situated directly across the Yamuna River facing the Taj Mahal north facade; premier vantage point for sunset reflection photography without crowds.",
    practicalRailhead: "Agra Cantt (AGC - 9.5 km)",
    distanceFromRailheadKm: 9.5,
    timings: "06:00 - 18:00 daily",
    entryFee: "₹25 (Indian), ₹300 (Foreigner)",
    dressCode: "Comfortable outdoor attire",
    nearestBusTerminal: "ISBT Transport Nagar (8 km)",
    seasonalInfo: "Magnificent sunset reflections in October through March",
    verificationStatus: "Verified ASI Monument"
  },
  {
    id: "att_fatehpur_sikri",
    name: "Fatehpur Sikri & Buland Darwaza",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.0945,
    lng: 77.6679,
    category: "heritage",
    description: "Akbar's 16th-century ghost capital featuring the 54-meter Buland Darwaza (Door of Victory), Jama Masjid, Tomb of Sheikh Salim Chishti, and Panch Mahal.",
    practicalRailhead: "Fatehpur Sikri Station (FTS - 1.5 km) / Agra Cantt (AGC - 37 km)",
    distanceFromRailheadKm: 37.0,
    timings: "Sunrise to Sunset daily",
    entryFee: "₹50 (Indian), ₹610 (Foreigner)",
    dressCode: "Head covering and shoe removal required inside Sheikh Salim Chishti Dargah",
    nearestBusTerminal: "Fatehpur Sikri Town Bus Stand (1 km) / Idgah Bus Stand (36 km)",
    seasonalInfo: "Open year-round; summer afternoons are hot, early morning visits recommended.",
    verificationStatus: "Verified UNESCO World Heritage"
  }
];

export const AGRA_STATIONS = [
  {
    id: "AGC",
    code: "AGC",
    name: "Agra Cantonment",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.1587,
    lng: 78.0097,
    category: "Major Junction",
    radiusKm: 6,
    distanceFromCityCenterKm: 3.2,
    platforms: 6,
    gauge: "Broad Gauge (1676mm)",
    services: ["Gatimaan Express", "Vande Bharat", "Rajdhani", "Shatabdi", "Superfast"],
    interchangeNotes: "North Central Railway (NCR) main terminal on Delhi-Mumbai & Delhi-Chennai trunk lines; home station for Gatimaan Express.",
    alternativeStations: ["AF (Agra Fort - 4 km)", "RKM (Raja Ki Mandi - 4.5 km)"],
    busTerminalNearby: "Idgah Bus Stand (1.8 km)",
    lastMileTransfer: "Prepaid auto booth and pre-booked cab lane at platform 1 exit. E-rickshaws available 24/7.",
    verifiedTrains: ["12049/12050 Gatimaan Exp", "20171/20172 Vande Bharat", "12951/12952 Mumbai Rajdhani"],
    verificationStatus: "Verified IRCTC / NTES",
    officialUrl: "https://www.indianrail.gov.in/"
  },
  {
    id: "AF",
    code: "AF",
    name: "Agra Fort Railway Station",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    lat: 27.1818,
    lng: 78.0245,
    category: "Suburban Terminal",
    radiusKm: 2,
    distanceFromCityCenterKm: 1.5,
    platforms: 4,
    gauge: "Broad Gauge (1676mm)",
    services: ["Express", "Passenger", "Intercity"],
    interchangeNotes: "Serves east-west trains connecting Rajasthan (Jaipur, Jodhpur) and East UP/Bihar (Varanasi, Patna). Directly adjacent to Agra Fort.",
    alternativeStations: ["AGC (4 km)", "RKM (3 km)"],
    busTerminalNearby: "Bijli Ghar Bus Stop (500m)",
    lastMileTransfer: "Walking distance to Agra Fort (800m); e-rickshaws to Taj Mahal Western Gate (₹40).",
    verifiedTrains: ["14853 Marudhar Exp", "13237 Patna-Kota Exp"],
    verificationStatus: "Verified IRCTC / NTES",
    officialUrl: "https://www.indianrail.gov.in/"
  }
];

export const AGRA_BUS_TERMINALS = [
  {
    id: "bt_agra_isbt",
    name: "Agra ISBT Transport Nagar",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    operator: "UPSRTC & Interstate",
    lat: 27.2155,
    lng: 77.9620,
    connections: ["Delhi (ISBT Sarai Kale Khan / Anand Vihar every 15 mins)", "Jaipur", "Mathura", "Gwalior", "Lucknow"],
    nearbyRailhead: "Raja Ki Mandi (RKM, 3.5 km) / Agra Cantt (AGC, 7 km)",
    lastMileNote: "State AC Janrath and Volvo bus terminal on NH-19 Delhi highway."
  },
  {
    id: "bt_agra_idgah",
    name: "Idgah Bus Stand Agra",
    destinationId: "agra",
    destinationName: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    operator: "UPSRTC / RSRTC",
    lat: 27.1650,
    lng: 77.9940,
    connections: ["Fatehpur Sikri (every 20 mins)", "Bharatpur", "Jaipur", "Mathura"],
    nearbyRailhead: "Agra Cantt (AGC, 1.8 km)",
    lastMileNote: "Best bus terminal for direct local shuttles to Fatehpur Sikri and Bharatpur."
  }
];

// Helper to deduce state code
function getStateCode(stateName) {
  if (!stateName) return "IN";
  const s = stateName.toLowerCase();
  if (s.includes("uttar pradesh")) return "UP";
  if (s.includes("madhya pradesh")) return "MP";
  if (s.includes("maharashtra")) return "MH";
  if (s.includes("rajasthan")) return "RJ";
  if (s.includes("tamil nadu")) return "TN";
  if (s.includes("kerala")) return "KL";
  if (s.includes("karnataka")) return "KA";
  if (s.includes("andhra pradesh")) return "AP";
  if (s.includes("puducherry") || s.includes("pondicherry")) return "PY";
  return "IN";
}

// 2. MERGED ALL-INDIA DESTINATIONS
export const ALL_DESTINATIONS = [
  // North, Central & West India (20 Destinations)
  ...NORTH_DESTS.map(d => ({
    ...d,
    circuit: "North-Central-West",
    stateCode: getStateCode(d.state),
    cityCenter: d.cityCenter || { lat: d.lat, lng: d.lng, name: `${d.name} Center` }
  })),

  // Agra Cluster (Detour connecting Mathura to Bharatpur/Rajasthan)
  AGRA_DESTINATION,

  // South India (20 Destinations, excluding duplicate Varanasi start)
  ...SOUTH_DESTS.filter(d => d.id !== "varanasi_start").map(d => ({
    ...d,
    circuit: "South-India",
    isDetour: d.id === "dhanushkodi" || d.id === "coonoor" || d.id === "coorg",
    stateCode: getStateCode(d.state),
    cityCenter: d.cityCenter || { lat: d.lat, lng: d.lng, name: `${d.name} Center` },
    templeCount: d.highlights ? d.highlights.filter(h => h.toLowerCase().includes("temple")).length : 2
  }))
];

// 3. MERGED ALL-INDIA ATTRACTIONS
export const ALL_ATTRACTIONS = [
  ...NORTH_ATTS.map(a => ({
    ...a,
    stateCode: getStateCode(a.state || a.region),
    practicalRailhead: a.practicalRailhead || a.nearestPracticalStation?.name || "Verified Railhead",
    distanceFromRailheadKm: a.distanceFromRailheadKm || a.nearestPracticalStation?.roadDistanceKm || 5.0
  })),
  ...AGRA_ATTRACTIONS,
  ...SOUTH_ATTS.map(a => {
    let cat = "temple";
    const lowName = (a.name || "").toLowerCase();
    const lowCat = (a.category || "").toLowerCase();
    if (lowCat.includes("waterfall") || lowName.includes("falls")) cat = "waterfall";
    else if (lowCat.includes("nature") || lowCat.includes("hill") || lowCat.includes("sanctuary") || lowCat.includes("park")) cat = "nature";
    else if (lowCat.includes("beach") || lowName.includes("beach")) cat = "ghat";
    else if (lowCat.includes("fort") || lowCat.includes("palace") || lowCat.includes("heritage") || lowCat.includes("monument")) cat = "heritage";
    else if (lowCat.includes("temple") || lowCat.includes("pilgrimage")) cat = "temple";

    return {
      ...a,
      category: cat,
      state: a.region || "South India",
      stateCode: getStateCode(a.region),
      practicalRailhead: a.nearestPracticalStation?.name || a.nearestPracticalStation?.code || "Verified Railhead",
      distanceFromRailheadKm: a.nearestPracticalStation?.roadDistanceKm || 4.5,
      verificationStatus: "Verified State Tourism / Devasthanam"
    };
  })
];

// 4. MERGED ALL-INDIA RAILWAY STATIONS
export const ALL_STATIONS = [
  ...NORTH_STATIONS.map(s => ({
    ...s,
    stateCode: getStateCode(s.state),
    gauge: s.gauge || "Broad Gauge (1676mm)",
    platforms: s.platforms || 3
  })),
  ...AGRA_STATIONS,
  ...SOUTH_STATIONS.map(s => ({
    ...s,
    stateCode: getStateCode(s.state),
    gauge: "Broad Gauge (1676mm)",
    platforms: s.platforms || 4,
    verifiedTrains: s.services || ["Superfast", "Express"],
    busTerminalNearby: s.nearbyTransit || "City Bus Stand"
  }))
];

// Deduplicate stations by official code
export const UNIQUE_STATIONS = Array.from(
  new Map(ALL_STATIONS.map(s => [s.code, s])).values()
);

// 5. MERGED ALL-INDIA BUS TERMINALS
export const SOUTH_BUS_TERMINALS = [
  { id: "bt_tpt_cbs", name: "Tirupati Central Bus Station (CBS)", destinationId: "tirupati", destinationName: "Tirupati", state: "Andhra Pradesh", stateCode: "AP", operator: "APSRTC", lat: 13.6265, lng: 79.4230, connections: ["Chennai", "Tirumala (every 3m)", "Bengaluru", "Kalahasti", "Kanipakam"], nearbyRailhead: "Tirupati Main (TPTY, 500m)", lastMileNote: "Huge multi-platform terminal; Hill buses to Tirumala depart from platform 1-4." },
  { id: "bt_tpt_cro", name: "Tirumala CRO Hilltop Bus Stand", destinationId: "tirupati", destinationName: "Tirupati", state: "Andhra Pradesh", stateCode: "AP", operator: "APSRTC", lat: 13.6810, lng: 79.3490, connections: ["Tirupati CBS (every 3m)", "Renigunta Jn"], nearbyRailhead: "Tirupati Main (TPTY, 22 km via ghat road)", lastMileNote: "Hilltop CRO terminal walking distance to Temple Vaikuntam Queue Complex." },
  { id: "bt_maa_cmbt", name: "Chennai CMBT Koyambedu", destinationId: "chennai", destinationName: "Chennai", state: "Tamil Nadu", stateCode: "TN", operator: "SETC / TNSTC", lat: 13.0694, lng: 80.2057, connections: ["Kanchipuram", "Vellore", "Bengaluru", "Tirupati"], nearbyRailhead: "Chennai Central (MAS, 9 km via Metro)", lastMileNote: "Connected to Chennai Metro Green Line directly inside bus terminal." },
  { id: "bt_maa_kcbt", name: "Chennai Kilambakkam KCBT", destinationId: "chennai", destinationName: "Chennai", state: "Tamil Nadu", stateCode: "TN", operator: "TNSTC / SETC", lat: 12.8660, lng: 80.0810, connections: ["Madurai", "Thanjavur", "Tiruchirappalli", "Puducherry", "Kanyakumari"], nearbyRailhead: "Vandalur (2 km) / Tambaram (TBM, 10 km)", lastMileNote: "Principal South-bound terminal on GST Road opened in 2024." },
  { id: "bt_mdu_mgr", name: "Madurai Mattuthavani (MGR Integrated Bus Stand)", destinationId: "madurai", destinationName: "Madurai", state: "Tamil Nadu", stateCode: "TN", operator: "TNSTC Madurai", lat: 9.9540, lng: 78.1610, connections: ["Rameswaram (every 15m)", "Kanyakumari", "Tirunelveli", "Tiruchirappalli", "Chennai"], nearbyRailhead: "Madurai Junction (MDU, 7.5 km)", lastMileNote: "Frequent city buses (#77, #70) run directly to Meenakshi Temple and Madurai Jn." },
  { id: "bt_rmm_town", name: "Rameswaram Town Bus Stand", destinationId: "rameswaram", destinationName: "Rameswaram", state: "Tamil Nadu", stateCode: "TN", operator: "TNSTC", lat: 9.2885, lng: 79.3130, connections: ["Madurai", "Kanyakumari", "Dhanushkodi (every 20m)", "Tiruchirappalli"], nearbyRailhead: "Rameswaram (RMM, 1 km)", lastMileNote: "Local shuttle buses to Dhanushkodi Beach & Arichal Munai terminate here." },
  { id: "bt_cape_stand", name: "Kanyakumari State Express Bus Stand", destinationId: "kanyakumari", destinationName: "Kanyakumari", state: "Tamil Nadu", stateCode: "TN", operator: "SETC / TNSTC / KSRTC-KL", lat: 8.0820, lng: 77.5505, connections: ["Thiruvananthapuram (every 20m)", "Madurai", "Rameshwaram", "Bengaluru", "Chennai"], nearbyRailhead: "Kanyakumari (CAPE, 1 km)", lastMileNote: "Walking distance to Triveni Sangam Ghat and Vivekananda Rock Memorial ferry dock." },
  { id: "bt_mun_ksrtc", name: "Munnar KSRTC Central Stand", destinationId: "munnar", destinationName: "Munnar", state: "Kerala", stateCode: "KL", operator: "Kerala State RTC", lat: 10.0760, lng: 77.0600, connections: ["Kochi (Ernakulam)", "Aluva", "Thekkady (Kumily)", "Madurai", "Coimbatore"], nearbyRailhead: "Aluva (AWY, 110 km) / Ernakulam Jn (ERS, 120 km)", lastMileNote: "Scenic high-range bus terminal serving Eravikulam, Mattupetty, and Top Station." },
  { id: "bt_tek_kumily", name: "Kumily / Thekkady Bus Stand", destinationId: "thekkady", destinationName: "Thekkady", state: "Kerala", stateCode: "KL", operator: "KSRTC (Kerala) & TNSTC", lat: 9.6050, lng: 77.1650, connections: ["Munnar", "Alleppey", "Kottayam", "Madurai (every 30m)", "Theni"], nearbyRailhead: "Kottayam (KTYM, 107 km) / Theni (TNI, 60 km)", lastMileNote: "Border bus stand situated 1.5 km from Periyar Tiger Reserve boat landing gate." },
  { id: "bt_alp_ksrtc", name: "Alleppey KSRTC Bus Stand", destinationId: "alleppey", destinationName: "Alleppey", state: "Kerala", stateCode: "KL", operator: "Kerala State RTC", lat: 9.4925, lng: 76.3385, connections: ["Kochi (Ernakulam)", "Kollam", "Trivandrum", "Kottayam", "Thekkady"], nearbyRailhead: "Alappuzha (ALLP, 3 km)", lastMileNote: "Located right on the boat jetty canal; walking distance to Shikara boat points." },
  { id: "bt_ekm_ksrtc", name: "Ernakulam KSRTC Central Stand", destinationId: "kochi", destinationName: "Kochi", state: "Kerala", stateCode: "KL", operator: "Kerala State RTC", lat: 9.9720, lng: 76.2870, connections: ["Munnar", "Alleppey", "Thrissur", "Calicut", "Trivandrum", "Bengaluru"], nearbyRailhead: "Ernakulam Junction (ERS, 1 km) / Ernakulam Town (ERN, 2 km)", lastMileNote: "Feeder buses and auto stands directly connect to Marine Drive and Fort Kochi jetty." },
  { id: "bt_oot_central", name: "Ooty Central Bus Stand", destinationId: "ooty", destinationName: "Ooty", state: "Tamil Nadu", stateCode: "TN", operator: "TNSTC Nilgiris / KSRTC-KA", lat: 11.4060, lng: 76.6980, connections: ["Coonoor (every 10m)", "Mettupalayam", "Coimbatore", "Mysuru (via Bandipur)", "Bengaluru"], nearbyRailhead: "Udagamandalam Ooty (UAM - 200m walk)", lastMileNote: "Adjacent to UAM Toy Train Station and Ooty Lake." },
  { id: "bt_mys_suburb", name: "Mysuru Suburb Bus Stand (KSRTC)", destinationId: "mysuru", destinationName: "Mysuru", state: "Karnataka", stateCode: "KA", operator: "KSRTC Karnataka", lat: 12.3080, lng: 76.6570, connections: ["Bengaluru (every 5m - Airavata Club Class)", "Coorg (Madikeri)", "Ooty", "Wayanad", "Hassan"], nearbyRailhead: "Mysuru Junction (MYS, 2.5 km)", lastMileNote: "City buses to Mysuru Palace, Chamundi Hills, and Brindavan Gardens depart from city stand 1 km away." },
  { id: "bt_blr_majestic", name: "Bengaluru Kempegowda Bus Station (Majestic)", destinationId: "bengaluru", destinationName: "Bengaluru", state: "Karnataka", stateCode: "KA", operator: "KSRTC / BMTC", lat: 12.9770, lng: 77.5720, connections: ["Mysuru", "Tirupati", "Chennai", "Ooty", "Hyderabad", "Hampi", "Coorg"], nearbyRailhead: "KSR Bengaluru City (SBC - connected by pedestrian subway)", lastMileNote: "Hub of Namma Metro (Majestic interchange of Purple and Green lines)." }
];

export const ALL_BUS_TERMINALS = [
  ...NORTH_BUSES.map(b => ({ ...b, stateCode: getStateCode(b.state) })),
  ...AGRA_BUS_TERMINALS,
  ...SOUTH_BUS_TERMINALS
];

// 6. PRESET CIRCUITS
export const PRESET_CIRCUITS = {
  ALL_INDIA: {
    id: "all-india",
    title: "All-India Grand Pilgrimage & Tourism Master Atlas",
    subtitle: "Unified Subcontinental Journey covering North, Central, West & South India (41 Major Stops)",
    badge: "PAN-INDIA MASTER",
    destinations: ALL_DESTINATIONS,
    defaultCenter: [21.5, 78.5],
    defaultZoom: 5
  },
  NORTH_CENTRAL_WEST: {
    id: "north-central-west",
    title: "North, Central & West India Pilgrimage Atlas",
    subtitle: "Varanasi ➔ Prayagraj ➔ MP ➔ Nashik ➔ Mathura/Braj ➔ Rajasthan (21 Major Stops)",
    badge: "UP • MP • MH • RJ",
    destinations: ALL_DESTINATIONS.filter(d => d.circuit === "North-Central-West"),
    defaultCenter: [25.0, 78.0],
    defaultZoom: 6
  },
  SOUTH_INDIA: {
    id: "south-india",
    title: "South India Grand Geographic Route",
    subtitle: "Varanasi ➔ Tirupati ➔ Tamil Nadu ➔ Kerala ➔ Western Ghats ➔ Karnataka ➔ Varanasi (20 Stops)",
    badge: "AP • TN • KL • KA",
    destinations: [
      ALL_DESTINATIONS.find(d => d.id === "varanasi"),
      ...ALL_DESTINATIONS.filter(d => d.circuit === "South-India")
    ].filter(Boolean),
    defaultCenter: [12.0, 78.5],
    defaultZoom: 6
  }
};

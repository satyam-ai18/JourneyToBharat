// ==========================================================================
// JOURNEY TO BHARAT — AI TRAVEL PLANNER & UNIVERSAL LOCATION-BASED SMART BUDGET ENGINE
// Adheres strictly to Indian Railways Telescopic Slabs, State RTC Benchmarks,
// Location-Aware Cost-of-Living Indexes (5 Tiers), Universal Accommodation,
// Universal Food (Itemized Meals), Terrain-Aware Local Transit, and Multi-Stop Routing.
// ==========================================================================

import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration,
  isGhatOrHillTerrain
} from "./distanceService.js";
import { TRAIN_CONNECTIONS } from "../data/trains.js";
import { UNIQUE_STATIONS } from "../data/unifiedData.js";
import { FLAGSHIP_DESTINATIONS } from "../data/tirthData.js";
import { VARANASI_ORIGIN } from "../data/varanasiData.js";

/**
 * Universal Location-Based Cost Index (5 Geographical & Socio-Economic Tiers)
 * Reflects authentic differences in accommodation, food logistics, and local transit.
 */
export const LOCATION_COST_INDEX = {
  metro: {
    id: "metro",
    label: "Tier 1 Metro (Delhi, Mumbai, Bengaluru, Kolkata)",
    index: 1.35,
    dharamshalaAvailable: false,
    dharamshalaNote: "Temple trust dharamshalas are generally unavailable in city centers. Basic lodge/budget guesthouses used.",
    isAlpineTrek: false
  },
  pilgrimage_hub: {
    id: "pilgrimage_hub",
    label: "Major Pilgrimage Hub (Varanasi, Ayodhya, Ujjain, Puri, Tirupati, Haridwar, Mathura)",
    index: 0.95,
    dharamshalaAvailable: true,
    dharamshalaNote: "Abundant temple trust dharamshalas, ashrams, and free/subsidized annakshetras available.",
    isAlpineTrek: false
  },
  himalayan: {
    id: "himalayan",
    label: "Himalayan Mountain Shrine (Kedarnath, Badrinath, Gangotri, Yamunotri)",
    index: 1.45,
    dharamshalaAvailable: true,
    dharamshalaNote: "GMVN & Kali Kamli ashrams available. Supplies transported by mules, elevating food costs.",
    isAlpineTrek: true
  },
  tier2: {
    id: "tier2",
    label: "Tier 2 / Heritage City (Jaipur, Agra, Gwalior, Madurai, Amritsar)",
    index: 1.05,
    dharamshalaAvailable: true,
    dharamshalaNote: "Standard trust rest houses and widespread budget tourist accommodations available.",
    isAlpineTrek: false
  },
  rural_town: {
    id: "rural_town",
    label: "Rural / Small Town Shrine (Maihar, Benipatti, Dantewada, Shirdi, Deoghar)",
    index: 0.85,
    dharamshalaAvailable: true,
    dharamshalaNote: "Economical local lodges, dharamshalas, and affordable local eateries.",
    isAlpineTrek: false
  }
};

/**
 * Automatically detect cost tier from destination attributes
 */
export function detectLocationCostTier(dest) {
  if (!dest) return "pilgrimage_hub";

  const name = (dest.name || "").toLowerCase();
  const city = (dest.city || dest.location || "").toLowerCase();
  const state = (dest.state || "").toLowerCase();
  const altitudeStr = (dest.altitude || "").toString().toLowerCase();

  // 1. Alpine Himalayan Shrines
  const isHighAltitude = altitudeStr.includes("m") && parseInt(altitudeStr, 10) > 1800;
  if (
    isHighAltitude ||
    name.includes("kedarnath") ||
    name.includes("badrinath") ||
    name.includes("gangotri") ||
    name.includes("yamunotri") ||
    name.includes("amarnath") ||
    city.includes("kedarnath") ||
    city.includes("badrinath") ||
    city.includes("guptkashi") ||
    city.includes("joshimath")
  ) {
    return "himalayan";
  }

  // 2. Metros
  if (
    city.includes("delhi") ||
    city.includes("mumbai") ||
    city.includes("bengaluru") ||
    city.includes("bangalore") ||
    city.includes("kolkata") ||
    city.includes("chennai") ||
    city.includes("hyderabad")
  ) {
    return "metro";
  }

  // 3. Major Pilgrimage Hubs
  if (
    city.includes("varanasi") ||
    city.includes("kashi") ||
    city.includes("ayodhya") ||
    city.includes("prayagraj") ||
    city.includes("allahabad") ||
    city.includes("ujjain") ||
    city.includes("puri") ||
    city.includes("tirupati") ||
    city.includes("haridwar") ||
    city.includes("rishikesh") ||
    city.includes("mathura") ||
    city.includes("vrindavan") ||
    city.includes("somnath") ||
    city.includes("dwarka") ||
    city.includes("rameswaram")
  ) {
    return "pilgrimage_hub";
  }

  // 4. Tier 2 / Heritage Cities
  if (
    city.includes("jaipur") ||
    city.includes("agra") ||
    city.includes("madurai") ||
    city.includes("gwalior") ||
    city.includes("udaipur") ||
    city.includes("jodhpur") ||
    city.includes("amritsar") ||
    city.includes("lucknow") ||
    city.includes("indore") ||
    city.includes("bhopal")
  ) {
    return "tier2";
  }

  // 5. Default to Rural / Small Town for other shrines
  return "rural_town";
}

/**
 * Curated Pilgrimage & Destination Intelligence Registry
 */
export const DESTINATION_INTELLIGENCE_REGISTRY = {
  varanasi: {
    city: "Varanasi",
    state: "Uttar Pradesh",
    nearestStation: { code: "BSB", name: "Varanasi Jn (Cantt)", distanceKm: 4.5 },
    altStations: ["DDU (Pt. Deen Dayal Upadhyaya - 18 km)", "BSBS (Banaras - 4 km)"],
    sanctumName: "Shri Kashi Vishwanath Jyotirlinga",
    sanctumTimings: "03:00 AM - 11:00 PM (Mangala: 03:00 AM, Saptarishi: 07:00 PM)",
    darshanPassCost: 300,
    freeDarshanAvailable: true,
    localSpecialties: ["Kachori-Jalebi Breakfast", "Banarasi Dum Aloo Thali", "Blue Lassi / Pehalwan Lassi", "Malaiyo (Winter)"],
    dharamshalas: [
      { name: "Kashi Vishwanath Annakshetra Bhawan", type: "Temple Trust", pricePerNight: 500, distanceToTemple: "350 m", rating: 4.6 },
      { name: "Birla Sanskriti Kendra Dharamshala", type: "Pilgrim Bhawan", pricePerNight: 750, distanceToTemple: "800 m", rating: 4.4 },
      { name: "Marwari Seva Samiti Dharamshala", type: "Trust Dharamshala", pricePerNight: 600, distanceToTemple: "600 m", rating: 4.3 }
    ],
    budgetHotels: [
      { name: "Hotel Temple View Godowlia", type: "2-Star Budget Hotel", pricePerNight: 1650, distanceToTemple: "500 m", rating: 4.2 },
      { name: "Treebo Trend Kashi Darshan", type: "Comfort Hotel", pricePerNight: 2200, distanceToTemple: "1.2 km", rating: 4.3 }
    ],
    premiumHotels: [
      { name: "BrijRama Palace Heritage Havelis", type: "Luxury Heritage", pricePerNight: 8500, distanceToTemple: "On Darbhanga Ghat", rating: 4.8 },
      { name: "Taj Ganges Varanasi", type: "5-Star Deluxe", pricePerNight: 7200, distanceToTemple: "6.0 km", rating: 4.7 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 30, privateAuto: 150, taxi: 350 },
      hotelToSanctum: { walking: 0, eRickshaw: 15, privateAuto: 60 },
      halfDaySightseeing: { autoPackage: 650, cabPackage: 1500 },
      riverBoat: { sharedBoat: 120, privateHandBoat: 600 }
    },
    sightseeingHighlights: [
      { name: "Subah-e-Banaras & Ganga Aarti at Dashashwamedh Ghat", cost: 0, duration: "2 hrs", note: "Daily evening 06:45 PM" },
      { name: "Sankat Mochan Hanuman Mandir", cost: 0, duration: "1 hr", note: "Sacred shrine founded by Goswami Tulsidas" },
      { name: "Sarnath Deer Park & Dhamek Stupa", cost: 25, duration: "3 hrs", note: "10 km northeast of city" },
      { name: "Kal Bhairav Mandir (Kotwal of Kashi)", cost: 0, duration: "45 mins", note: "Mandatory visit for full Kashi pilgrimage" }
    ]
  },
  ayodhya: {
    city: "Ayodhya",
    state: "Uttar Pradesh",
    nearestStation: { code: "AY", name: "Ayodhya Dham Jn", distanceKm: 1.5 },
    altStations: ["AYC (Ayodhya Cantt - 8 km)"],
    sanctumName: "Shri Ram Janmabhoomi Mandir",
    sanctumTimings: "06:30 AM - 09:30 PM (Aarti: 06:30 AM, 12:00 PM, 07:30 PM)",
    darshanPassCost: 0,
    freeDarshanAvailable: true,
    localSpecialties: ["Awadhi Puri Sabzi", "Ayodhya Bedmi Kachori", "Pedas of Hanuman Garhi", "Khurchan Sweets"],
    dharamshalas: [
      { name: "Birla Dharamshala Ayodhya", type: "Trust Bhawan", pricePerNight: 650, distanceToTemple: "1.2 km", rating: 4.5 },
      { name: "Gujarat Bhawan Pilgrim Niwas", type: "Pilgrim Bhawan", pricePerNight: 550, distanceToTemple: "1.8 km", rating: 4.3 },
      { name: "Digambar Akhada Guest House", type: "Ashram Stay", pricePerNight: 400, distanceToTemple: "1.5 km", rating: 4.2 }
    ],
    budgetHotels: [
      { name: "Ramayana Hotel & Stay", type: "Budget Hotel", pricePerNight: 1800, distanceToTemple: "1.5 km", rating: 4.3 },
      { name: "Hotel Saket Ayodhya Cantt", type: "Standard Stay", pricePerNight: 1400, distanceToTemple: "7.0 km", rating: 4.0 }
    ],
    premiumHotels: [
      { name: "Park Inn by Radisson Ayodhya", type: "Premium Hotel", pricePerNight: 4800, distanceToTemple: "3.5 km", rating: 4.6 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 20, privateAuto: 100, taxi: 250 },
      hotelToSanctum: { walking: 0, eRickshaw: 15, privateAuto: 50 },
      halfDaySightseeing: { autoPackage: 450, cabPackage: 1200 },
      riverBoat: { sharedBoat: 50, privateHandBoat: 300 }
    },
    sightseeingHighlights: [
      { name: "Hanuman Garhi Fort & Temple", cost: 0, duration: "1.5 hrs", note: "Guardian shrine of Ayodhya, climb 76 steps" },
      { name: "Kanak Bhawan", cost: 0, duration: "45 mins", note: "Palace gifted to Sita by Kaikeyi" },
      { name: "Saryu Ghat Aarti at Ram Ki Paidi", cost: 0, duration: "1.5 hrs", note: "Mesmerizing illuminated riverfront" },
      { name: "Nageshwarnath Temple", cost: 0, duration: "45 mins", note: "Ancient temple established by Kusha" }
    ]
  },
  prayagraj: {
    city: "Prayagraj",
    state: "Uttar Pradesh",
    nearestStation: { code: "PRYJ", name: "Prayagraj Jn", distanceKm: 4.0 },
    altStations: ["PRRB (Prayagraj Rambag)", "PYGS (Prayag Ghat)"],
    sanctumName: "Triveni Sangam & Alopi Devi Shaktipeeth",
    sanctumTimings: "05:00 AM - 08:30 PM",
    darshanPassCost: 0,
    freeDarshanAvailable: true,
    localSpecialties: ["Allahabadi Dum Aloo", "Gulab Jamun at Loknath", "Subah Kachori Sabzi", "Sattvic Thali"],
    dharamshalas: [
      { name: "Kalyan Ashram Pilgrim Guest House", type: "Ashram", pricePerNight: 500, distanceToTemple: "2.0 km", rating: 4.4 },
      { name: "Mehta Dharamshala Civil Lines", type: "Trust Bhawan", pricePerNight: 650, distanceToTemple: "5.0 km", rating: 4.2 }
    ],
    budgetHotels: [
      { name: "Hotel Milan Palace", type: "Budget Hotel", pricePerNight: 1600, distanceToTemple: "5.5 km", rating: 4.1 },
      { name: "Hotel Polo Max Prayagraj", type: "Transit Hotel", pricePerNight: 2100, distanceToTemple: "Railway Station Complex", rating: 4.3 }
    ],
    premiumHotels: [
      { name: "Kanj Sarovar Portico", type: "Premium Hotel", pricePerNight: 4200, distanceToTemple: "6.0 km", rating: 4.5 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 25, privateAuto: 120, taxi: 300 },
      hotelToSanctum: { walking: 0, eRickshaw: 20, privateAuto: 80 },
      halfDaySightseeing: { autoPackage: 550, cabPackage: 1400 },
      riverBoat: { sharedBoat: 100, privateHandBoat: 500 }
    },
    sightseeingHighlights: [
      { name: "Triveni Sangam Holy Snan & Boat", cost: 100, duration: "2.5 hrs", note: "Confluence of Ganga, Yamuna & Saraswati" },
      { name: "Bade Hanuman Ji (Leete Hue Hanuman)", cost: 0, duration: "45 mins", note: "Reclining deity near Sangam" },
      { name: "Alopi Devi Shaktipeeth", cost: 0, duration: "45 mins", note: "Sacred Peeth without idol (wooden cart)" },
      { name: "Anand Bhawan & Swaraj Bhawan", cost: 50, duration: "1.5 hrs", note: "Historic memorial of national movement" }
    ]
  },
  ujjain: {
    city: "Ujjain",
    state: "Madhya Pradesh",
    nearestStation: { code: "UJN", name: "Ujjain Jn", distanceKm: 2.2 },
    altStations: ["NAD (Nagda Jn - 55 km)", "INDB (Indore Jn - 55 km)"],
    sanctumName: "Shri Mahakaleshwar Jyotirlinga",
    sanctumTimings: "04:00 AM - 11:00 PM (Bhasma Aarti: 04:00 AM, Sandhya: 07:00 PM)",
    darshanPassCost: 250,
    freeDarshanAvailable: true,
    localSpecialties: ["Ujjaini Poha Jalebi", "Dal Bafla Thali", "Rabdi Malpua", "Garadu (Winter)"],
    dharamshalas: [
      { name: "Mahakal Bhakta Niwas", type: "Temple Trust", pricePerNight: 600, distanceToTemple: "600 m", rating: 4.5 },
      { name: "Triveni Dharamshala", type: "Trust Bhawan", pricePerNight: 450, distanceToTemple: "1.1 km", rating: 4.2 },
      { name: "Avantika Seva Ashram", type: "Ashram Stay", pricePerNight: 500, distanceToTemple: "800 m", rating: 4.3 }
    ],
    budgetHotels: [
      { name: "Hotel Shreeram Mahakal View", type: "Budget Hotel", pricePerNight: 1500, distanceToTemple: "400 m", rating: 4.2 },
      { name: "Hotel Ananya Palace Ujjain", type: "Comfort Hotel", pricePerNight: 2100, distanceToTemple: "1.5 km", rating: 4.3 }
    ],
    premiumHotels: [
      { name: "Anjushree Hotel Ujjain", type: "4-Star Deluxe", pricePerNight: 4600, distanceToTemple: "5.0 km", rating: 4.6 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 20, privateAuto: 80, taxi: 200 },
      hotelToSanctum: { walking: 0, eRickshaw: 15, privateAuto: 50 },
      halfDaySightseeing: { autoPackage: 500, cabPackage: 1300 },
      riverBoat: { sharedBoat: 40, privateHandBoat: 200 }
    },
    sightseeingHighlights: [
      { name: "Mahakal Lok Corridor", cost: 0, duration: "2 hrs", note: "Magnificent 900m plaza with 108 pillars" },
      { name: "Maa Harsiddhi Shaktipeeth", cost: 0, duration: "45 mins", note: "Kuldevi of Emperor Vikramaditya" },
      { name: "Kal Bhairav Mandir (Liquor Prasad)", cost: 0, duration: "1 hr", note: "Ancient tantric sanctum on Shipra" },
      { name: "Ram Ghat Evening Shipra Aarti", cost: 0, duration: "1.5 hrs", note: "Kumbh Snan holy riverfront" }
    ]
  },
  puri: {
    city: "Puri",
    state: "Odisha",
    nearestStation: { code: "PURI", name: "Puri Railway Station", distanceKm: 2.8 },
    altStations: ["BBS (Bhubaneswar - 60 km)", "KUR (Khurda Road Jn - 44 km)"],
    sanctumName: "Shri Jagannath Temple",
    sanctumTimings: "05:00 AM - 11:30 PM (Mangala Alati: 05:00 AM)",
    darshanPassCost: 150,
    freeDarshanAvailable: true,
    localSpecialties: ["Mahaprasad Abadha Thali", "Khaja Sweets", "Chhena Poda", "Dalma Rice Thali"],
    dharamshalas: [
      { name: "Niladri Bhakta Niwas (Temple Trust)", type: "Temple Trust", pricePerNight: 700, distanceToTemple: "800 m", rating: 4.5 },
      { name: "Birla Nivas Puri", type: "Trust Bhawan", pricePerNight: 650, distanceToTemple: "1.5 km", rating: 4.3 },
      { name: "Dudhwala Dharamshala", type: "Pilgrim Bhawan", pricePerNight: 400, distanceToTemple: "600 m", rating: 4.1 }
    ],
    budgetHotels: [
      { name: "Hotel Golden Tree Sea Beach", type: "Budget Beach Hotel", pricePerNight: 1600, distanceToTemple: "2.0 km", rating: 4.2 },
      { name: "Toshali Sands Resort", type: "Resort Stay", pricePerNight: 2800, distanceToTemple: "6.0 km", rating: 4.4 }
    ],
    premiumHotels: [
      { name: "Mayfair Waves Puri", type: "Luxury Beachfront", pricePerNight: 7500, distanceToTemple: "2.5 km", rating: 4.8 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 25, privateAuto: 100, taxi: 250 },
      hotelToSanctum: { walking: 0, eRickshaw: 20, privateAuto: 70 },
      halfDaySightseeing: { autoPackage: 450, cabPackage: 1200 },
      riverBoat: { sharedBoat: 0, privateHandBoat: 0 }
    },
    sightseeingHighlights: [
      { name: "Ananda Bazar & Mahaprasad Feast", cost: 120, duration: "1 hr", note: "World's largest open-air kitchen dining" },
      { name: "Golden Beach (Blue Flag Certified)", cost: 20, duration: "1.5 hrs", note: "Clean sacred beach for morning stroll" },
      { name: "Gundicha Temple (Mausi Maa)", cost: 0, duration: "45 mins", note: "Garden home of Lord Jagannath during Rath Yatra" },
      { name: "Konark Sun Temple (Day Trip)", cost: 40, duration: "3 hrs", note: "35 km via Marine Drive" }
    ]
  },
  tirupati: {
    city: "Tirupati",
    state: "Andhra Pradesh",
    nearestStation: { code: "TPTY", name: "Tirupati Main", distanceKm: 1.0 },
    altStations: ["RU (Renigunta Jn - 10 km)"],
    sanctumName: "Lord Sri Venkateswara Swamy Temple (Tirumala)",
    sanctumTimings: "03:00 AM - 01:00 AM (22 hrs continuous)",
    darshanPassCost: 300,
    freeDarshanAvailable: true,
    localSpecialties: ["Tirupati Laddu Prasadam", "Andhra Meals Thali", "Pesarattu Upma", "Filter Coffee"],
    dharamshalas: [
      { name: "TTD Srinivasam Complex", type: "Temple Trust", pricePerNight: 350, distanceToTemple: "Near TPTY Station", rating: 4.6 },
      { name: "TTD Madhavam Guest House", type: "Temple Trust", pricePerNight: 800, distanceToTemple: "Tirupati Town", rating: 4.5 },
      { name: "Vishnu Nivasam Pilgrim Rest House", type: "Temple Trust", pricePerNight: 300, distanceToTemple: "Opposite TPTY Station", rating: 4.4 }
    ],
    budgetHotels: [
      { name: "Hotel Bliss Tirupati", type: "Comfort Hotel", pricePerNight: 1900, distanceToTemple: "2.0 km", rating: 4.2 },
      { name: "Fortune Select Grand Ridge", type: "3-Star Hotel", pricePerNight: 2800, distanceToTemple: "3.5 km", rating: 4.4 }
    ],
    premiumHotels: [
      { name: "Marasa Sarovar Premiere", type: "5-Star Dasavatara Theme", pricePerNight: 5500, distanceToTemple: "4.5 km", rating: 4.7 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 20, privateAuto: 80, taxi: 200 },
      hotelToSanctum: { walking: 0, eRickshaw: 0, privateAuto: 0, ghatBusTTD: 65, ghatTaxi: 800 },
      halfDaySightseeing: { autoPackage: 450, cabPackage: 1400 },
      riverBoat: { sharedBoat: 0, privateHandBoat: 0 }
    },
    sightseeingHighlights: [
      { name: "Tirumala Ghat Road & Hair Tonsure (Kalyanakatta)", cost: 0, duration: "2 hrs", note: "Scenic Eastern Ghats mountain drive" },
      { name: "Sri Padmavathi Ammavari Temple (Tiruchanur)", cost: 0, duration: "1 hr", note: "Consort of Lord Venkateswara (5 km south)" },
      { name: "Sri Govindaraja Swamy Temple", cost: 0, duration: "1 hr", note: "Historic 12th-century shrine in town center" },
      { name: "Kapila Theertham Waterfalls & Shiva Temple", cost: 0, duration: "1 hr", note: "Holy mountain cascade at base of Tirumala hills" }
    ]
  },
  kedarnath: {
    city: "Kedarnath / Guptkashi",
    state: "Uttarakhand",
    nearestStation: { code: "YNRK", name: "Yog Nagari Rishikesh", distanceKm: 215 },
    altStations: ["HW (Haridwar Jn - 240 km)"],
    sanctumName: "Shri Kedarnath Jyotirlinga",
    sanctumTimings: "06:00 AM - 09:00 PM (Afternoon break 03:00 - 05:00 PM)",
    darshanPassCost: 0,
    freeDarshanAvailable: true,
    localSpecialties: ["Garhwali Mandua Roti & Pahadi Dal", "Jhangora Kheer", "Hot Masala Ginger Chai & Maggi", "Pure Veg Thali"],
    dharamshalas: [
      { name: "GMVN Pilgrim Cottages Kedarnath", type: "Govt Pilgrim Rest", pricePerNight: 900, distanceToTemple: "300 m", rating: 4.3 },
      { name: "Bikaner Seva Sadan Lincholi", type: "Trek Midpoint Bhawan", pricePerNight: 600, distanceToTemple: "4.0 km", rating: 4.1 },
      { name: "Kali Kamli Dharamshala Gaurikund", type: "Base Camp Bhawan", pricePerNight: 500, distanceToTemple: "Base camp", rating: 4.2 }
    ],
    budgetHotels: [
      { name: "Hotel Shivalik Valley Guptkashi", type: "Valley Hotel", pricePerNight: 1800, distanceToTemple: "Base town", rating: 4.2 },
      { name: "GMVN Tourist Rest House Gaurikund", type: "Base Camp Lodge", pricePerNight: 1400, distanceToTemple: "16 km trek away", rating: 4.0 }
    ],
    premiumHotels: [
      { name: "Kedar River Retreat Guptkashi", type: "Premium Mountain Stay", pricePerNight: 4200, distanceToTemple: "Helipad base", rating: 4.5 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 0, privateAuto: 0, busFareRishikeshToGaurikund: 380, sharedJeep: 550 },
      hotelToSanctum: { walkingTrek: 0, ponyHorse: 2500, pitthuPalki: 4500, irctcHeliShuttle: 3500 },
      halfDaySightseeing: { autoPackage: 0, cabPackage: 1800 },
      riverBoat: { sharedBoat: 0, privateHandBoat: 0 }
    },
    sightseeingHighlights: [
      { name: "16 km Sacred Mountain Trek from Gaurikund", cost: 0, duration: "7 hrs", note: "Along Mandakini river with majestic Himalayan vistas" },
      { name: "Bhairavnath Temple Kedarnath", cost: 0, duration: "1.5 hrs", note: "Guardian deity on ridge overlooking Kedarnath bowl" },
      { name: "Triyuginarayan Temple (Eternal Wedding Flame)", cost: 0, duration: "2 hrs", note: "Celestial wedding site of Shiva and Parvati" },
      { name: "Guptkashi Vishwanath & Manikarnika Kund", cost: 0, duration: "1 hr", note: "Historic staging sanctum" }
    ]
  },
  haridwar: {
    city: "Haridwar",
    state: "Uttarakhand",
    nearestStation: { code: "HW", name: "Haridwar Jn", distanceKm: 1.5 },
    altStations: ["RKSH (Rishikesh - 25 km)"],
    sanctumName: "Har Ki Pauri & Mansa Devi Temple",
    sanctumTimings: "04:30 AM - 10:00 PM (Ganga Aarti: 06:30 PM)",
    darshanPassCost: 0,
    freeDarshanAvailable: true,
    localSpecialties: ["Haridwari Chhole Bhature", "Mohanji Puri Sabzi at Har Ki Pauri", "Mathura Pedas", "Ganga Jal Kheer"],
    dharamshalas: [
      { name: "Shantikunj Ashram Pilgrim Niwas", type: "Spiritual Ashram", pricePerNight: 350, distanceToTemple: "5.0 km", rating: 4.7 },
      { name: "Geeta Bhawan Dharamshala", type: "Trust Bhawan", pricePerNight: 500, distanceToTemple: "800 m", rating: 4.4 },
      { name: "Bholagiri Ashram Stay", type: "Ashram", pricePerNight: 400, distanceToTemple: "1.2 km", rating: 4.3 }
    ],
    budgetHotels: [
      { name: "Hotel Ganga Kinare (Rishikesh)", type: "Riverside Hotel", pricePerNight: 2800, distanceToTemple: "20 km", rating: 4.5 },
      { name: "Hotel Aarti Darshan Haridwar", type: "Budget Stay", pricePerNight: 1400, distanceToTemple: "600 m", rating: 4.1 }
    ],
    premiumHotels: [
      { name: "Haveli Hari Ganga Heritage Hotel", type: "Ghat Heritage Stay", pricePerNight: 5500, distanceToTemple: "Private Ghat access", rating: 4.7 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 20, privateAuto: 80, taxi: 200 },
      hotelToSanctum: { walking: 0, eRickshaw: 15, privateAuto: 50 },
      halfDaySightseeing: { autoPackage: 450, cabPackage: 1200 },
      ropeway: { mansaDeviRopeway: 140, chandiDeviRopeway: 180 }
    },
    sightseeingHighlights: [
      { name: "Maha Aarti at Har Ki Pauri (Brahmakund)", cost: 0, duration: "2 hrs", note: "Thousands of floating earthen diyas on Ganges" },
      { name: "Mansa Devi Ropeway & Temple", cost: 140, duration: "2 hrs", note: "Wish-fulfilling goddess atop Bilwa Parvat" },
      { name: "Chandi Devi Temple (Neel Parvat)", cost: 180, duration: "2.5 hrs", note: "Scenic cable car across river Ganges" },
      { name: "Daksh Mahadev Temple Kankhal", cost: 0, duration: "1 hr", note: "Historic site of King Daksha's Yajna" }
    ]
  }
};

/**
 * Calculates recommended room requirements based on group type and sharing preferences.
 * User can override the room count at any time.
 */
export function calculateRequiredRooms(adults = 2, children = 0, groupType = "couple", roomCountOverride = null) {
  if (roomCountOverride !== null && Number(roomCountOverride) > 0) {
    return Number(roomCountOverride);
  }
  const ad = Math.max(1, Number(adults) || 1);
  const ch = Math.max(0, Number(children) || 0);

  if (groupType === "solo" && ad === 1 && ch === 0) {
    return 1;
  }
  if (groupType === "couple" && ad <= 2 && ch === 0) {
    return 1;
  }
  if (groupType === "family") {
    if (ad <= 2) {
      // 2 adults + up to 2 kids can share 1 family room / double room with extra bedding
      return ch <= 2 ? 1 : 2;
    }
    return Math.ceil(ad / 2) + (ch > 2 ? 1 : 0);
  }
  // Friends, Boys group, Girls group, General group: standard double sharing
  return Math.max(1, Math.ceil(ad / 2));
}

/**
 * Universal Accommodation Estimator (No individual hotel search needed)
 * Calculates average category tariffs per room per night, room count, and total.
 */
export function estimateUniversalAccommodation(locationTier, numRooms = 1, numNights = 2) {
  const tierInfo = LOCATION_COST_INDEX[locationTier] || LOCATION_COST_INDEX.pilgrimage_hub;
  const mult = tierInfo.index;

  const tariffs = {
    economy: tierInfo.dharamshalaAvailable ? Math.round(550 * mult) : Math.round(750 * mult),
    comfortable: Math.round(1650 * mult),
    middle: Math.round(3600 * mult)
  };

  return {
    locationTier,
    multiplier: mult,
    numRooms,
    numNights,
    dharamshalaAvailable: tierInfo.dharamshalaAvailable,
    dharamshalaNote: tierInfo.dharamshalaNote,
    tariffs,
    totals: {
      economy: tariffs.economy * numRooms * numNights,
      comfortable: tariffs.comfortable * numRooms * numNights,
      middle: tariffs.middle * numRooms * numNights
    },
    labels: {
      economy: tierInfo.dharamshalaAvailable
        ? "Temple Dharamshala / Pilgrim Trust Bhawan"
        : "Basic Guesthouse / Economy Lodge (Dharamshala N/A in Metro)",
      comfortable: "Standard Budget Hotel (Private AC Room, Attached Bath)",
      middle: "Comfortable 3-Star Hotel (Elevator, Room Service, Prime Location)"
    }
  };
}

/**
 * Universal Food Estimator (Itemizes Adults and Children accurately)
 * Itemizes Breakfast, Lunch, and Dinner separately per person per day.
 * Children (5-11) receive a 50% discount / kid thali portion; Infants (0-4) are free.
 */
export function estimateUniversalFood(locationTier, travellersOrAdults = 2, childrenOrDuration = 0, durationDays = 3) {
  let adults = 2;
  let children = 0;
  let days = 3;

  if (arguments.length === 3 && typeof childrenOrDuration === "number") {
    adults = travellersOrAdults;
    children = 0;
    days = childrenOrDuration;
  } else {
    adults = Number(travellersOrAdults) || 1;
    children = Number(childrenOrDuration) || 0;
    days = Number(durationDays) || 1;
  }

  const tierInfo = LOCATION_COST_INDEX[locationTier] || LOCATION_COST_INDEX.pilgrimage_hub;
  const mult = tierInfo.index;

  const adultMealBreakdown = {
    economy: {
      breakfast: Math.round(45 * mult),
      lunch: Math.round(95 * mult),
      dinner: Math.round(95 * mult),
      totalDayPerPerson: Math.round(235 * mult)
    },
    comfortable: {
      breakfast: Math.round(110 * mult),
      lunch: Math.round(190 * mult),
      dinner: Math.round(190 * mult),
      totalDayPerPerson: Math.round(490 * mult)
    },
    middle: {
      breakfast: Math.round(220 * mult),
      lunch: Math.round(380 * mult),
      dinner: Math.round(380 * mult),
      totalDayPerPerson: Math.round(980 * mult)
    }
  };

  const childMealBreakdown = {
    economy: {
      totalDayPerPerson: Math.round(adultMealBreakdown.economy.totalDayPerPerson * 0.5)
    },
    comfortable: {
      totalDayPerPerson: Math.round(adultMealBreakdown.comfortable.totalDayPerPerson * 0.5)
    },
    middle: {
      totalDayPerPerson: Math.round(adultMealBreakdown.middle.totalDayPerPerson * 0.5)
    }
  };

  const totals = {
    economy: (adults * adultMealBreakdown.economy.totalDayPerPerson + children * childMealBreakdown.economy.totalDayPerPerson) * days,
    comfortable: (adults * adultMealBreakdown.comfortable.totalDayPerPerson + children * childMealBreakdown.comfortable.totalDayPerPerson) * days,
    middle: (adults * adultMealBreakdown.middle.totalDayPerPerson + children * childMealBreakdown.middle.totalDayPerPerson) * days
  };

  return {
    multiplier: mult,
    adultMealBreakdown,
    childMealBreakdown,
    mealBreakdown: adultMealBreakdown,
    totals,
    descriptions: {
      economy: "Simple local breakfast (poha/idli/tea) + Temple Annakshetra/Langar or affordable wholesome satvik bhojan thali",
      comfortable: "Decent pure veg restaurant: Fresh morning breakfast + Complete hygienic vegetarian lunch & dinner thalis",
      middle: "Better dining: Hotel breakfast buffet + Multi-cuisine quality restaurant lunch & dinner with regional specialties"
    }
  };
}

/**
 * Universal Local Transport Estimator (Terrain-Aware & Passenger-Group Sized)
 * Calculates auto-rickshaws and cabs based on vehicle capacity, not multiplied arbitrarily.
 */
export function estimateUniversalLocalTransport(locationTier, travellersOrAdults = 2, childrenOrDuration = 0, durationDays = 3) {
  let adults = 2;
  let children = 0;
  let days = 3;

  if (arguments.length === 3 && typeof childrenOrDuration === "number") {
    adults = travellersOrAdults;
    children = 0;
    days = childrenOrDuration;
  } else {
    adults = Number(travellersOrAdults) || 1;
    children = Number(childrenOrDuration) || 0;
    days = Number(durationDays) || 1;
  }

  const totalPax = adults + children;
  const tierInfo = LOCATION_COST_INDEX[locationTier] || LOCATION_COST_INDEX.pilgrimage_hub;
  const isHimalayan = tierInfo.isAlpineTrek;
  const mult = tierInfo.index;

  if (isHimalayan) {
    const econTotal = 350 * 2 * totalPax; // Shared Sumo/Jeep from base camp
    const comfTotal = (350 * 2 + 2500) * totalPax; // Sumo + Govt Pony/Mule ascent
    const midTotal = (1800 * days) + (3500 * totalPax); // Dedicated cab + IRCTC Heli-shuttle / Palki

    return {
      isHimalayan: true,
      terrainNotice: "High Himalayan alpine terrain. Regular auto-rickshaws do NOT operate. Local transport uses walking pilgrimage trek, shared mountain sumos, government-registered ponies, or helicopter shuttles.",
      modes: {
        economy: {
          style: "Sacred Walking Trek (₹0) + Shared Base Camp Jeep",
          dailyGroup: Math.round(econTotal / days),
          total: econTotal,
          note: "16-18 km scenic spiritual walking trek from base camp"
        },
        comfortable: {
          style: "Shared Mountain Sumo + Govt-Registered Pony/Mule (₹2,500/way)",
          dailyGroup: Math.round(comfTotal / days),
          total: comfTotal,
          note: "Equine ascent with verified registration token"
        },
        middle: {
          style: "Private Dedicated Mountain Cab + IRCTC Heli-Shuttle or Palki",
          dailyGroup: Math.round(midTotal / days),
          total: midTotal,
          note: "Direct helipad shuttle / 4-bearer palki for zero fatigue"
        }
      }
    };
  }

  // Plains / Metropolitan / Heritage pilgrimage towns: Auto fits 3-4 pax, Cab fits 4-6 pax
  const numAutos = Math.max(1, Math.ceil(totalPax / 3));
  const numCabs = Math.max(1, Math.ceil(totalPax / 4));

  const econDaily = Math.round((25 * 4 * totalPax) * mult); // 4 shared e-rickshaw rides/day
  const comfDaily = Math.round((120 * 2 * numAutos + 550 * numAutos) * mult); // 2 station transfers + half-day auto sightseeing circuit
  const midDaily = Math.round((350 * 2 * numCabs + 1500 * numCabs) * mult); // Private AC cab at disposal

  return {
    isHimalayan: false,
    terrainNotice: null,
    modes: {
      economy: {
        style: "Shared E-Rickshaws & Pedestrian Temple Corridors",
        dailyGroup: econDaily,
        total: econDaily * days,
        note: "₹20-30 per hop across temples & local ghats"
      },
      comfortable: {
        style: `Prepaid Private Autos (${numAutos} Auto${numAutos > 1 ? "s" : ""}) + Half-Day Circuit`,
        dailyGroup: comfDaily,
        total: comfDaily * Math.max(1, days - 1),
        note: "No haggling; includes guardian shrines & return station drop"
      },
      middle: {
        style: `Private AC Cab at Disposal (${numCabs} Cab${numCabs > 1 ? "s" : ""})`,
        dailyGroup: midDaily,
        total: midDaily * days,
        note: "Dedicated driver, door-to-door comfort, luggage security"
      }
    }
  };
}

/**
 * Universal Fallback Profile Generator
 */
export function buildUniversalDestinationProfile(destName, city, state, lat, lng) {
  const normKey = (city || destName || "").toLowerCase().replace(/[^a-z]/g, "");
  if (DESTINATION_INTELLIGENCE_REGISTRY[normKey]) {
    return DESTINATION_INTELLIGENCE_REGISTRY[normKey];
  }

  let nearestStation = { code: "RAIL", name: `${city || destName} Railhead`, distanceKm: 8 };
  let minKm = Infinity;
  if (lat && lng && UNIQUE_STATIONS && UNIQUE_STATIONS.length > 0) {
    UNIQUE_STATIONS.forEach((st) => {
      const d = calculateHaversineKm(lat, lng, st.lat, st.lng);
      if (d < minKm) {
        minKm = d;
        nearestStation = {
          code: st.code,
          name: st.name,
          distanceKm: Math.round(d * 10) / 10
        };
      }
    });
  }

  return {
    city: city || destName,
    state: state || "India",
    nearestStation,
    altStations: [`Regional Express Halts (${nearestStation.code})`],
    sanctumName: destName,
    sanctumTimings: "05:30 AM - 09:00 PM (Aarti: 06:00 AM & 07:00 PM)",
    darshanPassCost: 0,
    freeDarshanAvailable: true,
    localSpecialties: ["Regional Pure Vegetarian Thali", "Local Morning Breakfast", "Temple Sweet Prasad", "Chai & Snacks"],
    dharamshalas: [
      { name: `${destName} Yatri Bhawan`, type: "Pilgrim Rest House", pricePerNight: 500, distanceToTemple: "400 m", rating: 4.3 },
      { name: "Sri Rama Seva Dharamshala", type: "Trust Dharamshala", pricePerNight: 650, distanceToTemple: "800 m", rating: 4.2 }
    ],
    budgetHotels: [
      { name: `Hotel Temple View ${city || ""}`, type: "Budget Stay", pricePerNight: 1550, distanceToTemple: "900 m", rating: 4.1 },
      { name: `Comfort Residency ${city || ""}`, type: "2-Star Hotel", pricePerNight: 2100, distanceToTemple: "1.5 km", rating: 4.2 }
    ],
    premiumHotels: [
      { name: `Sarovar Grand ${city || ""}`, type: "3-4 Star Deluxe", pricePerNight: 3900, distanceToTemple: "3.0 km", rating: 4.5 }
    ],
    localTransitFares: {
      stationToHotel: { sharedAuto: 25, privateAuto: 100, taxi: 280 },
      hotelToSanctum: { walking: 0, eRickshaw: 15, privateAuto: 60 },
      halfDaySightseeing: { autoPackage: 450, cabPackage: 1200 },
      riverBoat: { sharedBoat: 0, privateHandBoat: 0 }
    },
    sightseeingHighlights: [
      { name: `${destName} Sanctum & Aarti`, cost: 0, duration: "2 hrs", note: "Primary holy darshan & pradakshina" },
      { name: "Local Pilgrimage Bazaar & Prasad Stalls", cost: 0, duration: "1 hr", note: "Traditional offerings & souvenirs" },
      { name: "Ancient Holy Tank / Kund", cost: 0, duration: "45 mins", note: "Spiritual ablution & peaceful reflection" }
    ]
  };
}

/**
 * Official Indian Railways Telescopic Fare Calculator
 * Includes Second Seating (2S), Sleeper (SL), 3rd AC (3A), 2nd AC (2A), Chair Car (CC).
 */
export function calculateRailwayFaresByDistance(distanceKm) {
  const km = Math.max(30, Math.round(distanceKm));

  let s2Base = 0;
  let slBase = 0;
  let ac3Base = 0;
  let ac2Base = 0;
  let ccBase = 0;

  if (km <= 50) {
    s2Base = 35;
    slBase = 145;
    ac3Base = 505;
    ac2Base = 760;
    ccBase = 245;
  } else if (km <= 300) {
    s2Base = 35 + (km - 50) * 0.22;
    slBase = 145 + (km - 50) * 0.49;
    ac3Base = 505 + (km - 50) * 1.38;
    ac2Base = 760 + (km - 50) * 1.95;
    ccBase = 245 + (km - 50) * 1.45;
  } else if (km <= 800) {
    s2Base = 35 + 250 * 0.22 + (km - 300) * 0.18;
    slBase = 145 + 250 * 0.49 + (km - 300) * 0.44;
    ac3Base = 505 + 250 * 1.38 + (km - 300) * 1.25;
    ac2Base = 760 + 250 * 1.95 + (km - 300) * 1.82;
    ccBase = 245 + 250 * 1.45 + (km - 300) * 1.35;
  } else {
    s2Base = 35 + 250 * 0.22 + 500 * 0.18 + (km - 800) * 0.15;
    slBase = 145 + 250 * 0.49 + 500 * 0.44 + (km - 800) * 0.39;
    ac3Base = 505 + 250 * 1.38 + 500 * 1.25 + (km - 800) * 1.15;
    ac2Base = 760 + 250 * 1.95 + 500 * 1.82 + (km - 800) * 1.65;
    ccBase = 245 + 250 * 1.45 + 500 * 1.35 + (km - 800) * 1.25;
  }

  const s2Fare = Math.round(s2Base + 15);
  const slFare = Math.round(slBase + 20);
  const ac3Fare = Math.round((ac3Base + 45) * 1.05);
  const ac2Fare = Math.round((ac2Base + 55) * 1.05);
  const ccFare = Math.round((ccBase + 45) * 1.05);

  const avgHours = Math.max(1, km / 58);
  const hrs = Math.floor(avgHours);
  const mins = Math.round((avgHours - hrs) * 60);

  return {
    railKm: km,
    durationFormatted: `${hrs}h ${mins}m`,
    fares: {
      "2S": s2Fare,
      SL: slFare,
      "3A": ac3Fare,
      "2A": ac2Fare,
      CC: ccFare
    }
  };
}

/**
 * State RTC & Private Bus Fares
 */
export function calculateBusOptionsByDistance(roadKm) {
  const km = Math.max(20, Math.round(roadKm));
  const ordinaryRate = 1.35;
  const acSeaterRate = 1.95;
  const acSleeperRate = 2.45;

  const avgHours = Math.max(1, km / 45);
  const hrs = Math.floor(avgHours);
  const mins = Math.round((avgHours - hrs) * 60);

  return {
    roadKm: km,
    durationFormatted: `${hrs}h ${mins}m`,
    fares: {
      ordinary: Math.round(km * ordinaryRate),
      acSeater: Math.round(km * acSeaterRate),
      acSleeper: Math.round(km * acSleeperRate)
    }
  };
}

/**
 * Private Cab & Driving Fastag Tolls
 */
export function calculatePrivateRoadTravel(roadKm, tripDays = 2) {
  const km = Math.max(20, Math.round(roadKm * 2));
  const fuelCost = Math.round((km / 14) * 97);
  const tollTax = Math.round(km * 0.95);
  const totalFuelAndTolls = fuelCost + tollTax;

  const taxiRatePerKm = 14;
  const driverBhatta = tripDays * 400;
  const commercialCabFare = Math.round(km * taxiRatePerKm + driverBhatta + tollTax);

  return {
    totalKmRoundTrip: km,
    ownCarFuelAndTolls: totalFuelAndTolls,
    fuelBreakdown: { fuelCost, tollTax },
    commercialCabFare
  };
}

/**
 * Smart Independent Transport Selector for Every Route Leg
 * Analyzes distance and passenger composition to recommend the cheapest practical option.
 * Prioritizes Sleeper Class (SL) for long distances.
 * For short hops (<=35 km, e.g. Mathura-Vrindavan), long-distance trains are NOT assigned.
 */
export function analyzeLegTransit({
  legDistanceKm = 50,
  isGhat = false,
  fromName = "Origin",
  toName = "Destination",
  adults = 2,
  children = 0,
  infants = 0
}) {
  const km = Math.max(1, Math.round(legDistanceKm));
  const ad = Math.max(1, Number(adults) || 1);
  const ch = Math.max(0, Number(children) || 0);
  const totalPax = ad + ch;
  const payingPax = ad + ch * 0.5; // Indian Railways & state RTC child ticket policy

  const numAutos = Math.max(1, Math.ceil(totalPax / 3));
  const numCabs = Math.max(1, Math.ceil(totalPax / 4));

  const isLocalHop = km <= 35;
  const isRegional = km > 35 && km <= 120;

  // Rail & Bus calculators
  const rail = calculateRailwayFaresByDistance(km * 1.05);
  const bus = calculateBusOptionsByDistance(km);

  if (isLocalHop) {
    // Short local journey (10-35 km)
    // Long-distance train is NOT practical / assigned!
    const sharedAutoPerPax = Math.min(60, Math.max(25, Math.round(km * 2.5)));
    const reservedAutoTotal = Math.round((120 + km * 8) * numAutos);
    const localCabTotal = Math.round((350 + km * 14) * numCabs);
    const localBusPerPax = Math.min(40, Math.max(20, Math.round(km * 1.5)));

    return {
      legKm: km,
      isLocalHop: true,
      category: "Local City Hop / Pilgrimage Corridor",
      transitAdvice: "Short distance hop. City auto-rickshaw, e-rickshaw or local bus is faster and cheaper than trains.",
      trainAvailable: false,
      trainNote: "Long-distance train not applicable for short local hops under 35 km",
      railFares: { "2S": 0, SL: 0, "3A": 0, "2A": 0 },
      busFares: {
        ordinary: localBusPerPax,
        acSeater: Math.round(localBusPerPax * 1.5)
      },
      cabFares: {
        commercialCab: localCabTotal
      },
      recommended: {
        economy: {
          mode: "Shared Auto / E-Rickshaw / Local Bus",
          costPerPax: sharedAutoPerPax,
          groupCost: Math.round(sharedAutoPerPax * payingPax),
          badge: "₹ Cheapest Local Transit",
          summary: `Shared E-Rickshaw / City Bus (~₹${sharedAutoPerPax}/pax)`
        },
        comfortable: {
          mode: `Reserved Auto (${numAutos} Auto${numAutos > 1 ? "s" : ""})`,
          costPerPax: Math.round(reservedAutoTotal / totalPax),
          groupCost: reservedAutoTotal,
          badge: "Direct Auto Transfer",
          summary: `Dedicated Auto for Group (~₹${reservedAutoTotal} total)`
        },
        middle: {
          mode: `Private Local AC Taxi (${numCabs} Cab${numCabs > 1 ? "s" : ""})`,
          costPerPax: Math.round(localCabTotal / totalPax),
          groupCost: localCabTotal,
          badge: "AC Comfort",
          summary: `Private AC Cab (~₹${localCabTotal} total)`
        }
      }
    };
  }

  if (isRegional) {
    // Regional corridor (35-120 km)
    const ordinaryBusFare = bus.fares.ordinary;
    const acBusFare = bus.fares.acSeater;
    const train2SFare = rail.fares["2S"] || 65;
    const trainSLFare = rail.fares.SL;
    const privateCabTotal = Math.round((km * 14 + 200) * numCabs);

    const econBestFare = Math.min(ordinaryBusFare, train2SFare > 0 ? train2SFare : trainSLFare);
    const econBestMode = ordinaryBusFare < trainSLFare
      ? `State RTC Bus (~₹${ordinaryBusFare}/pax)`
      : `Express Train 2S/SL (~₹${econBestFare}/pax)`;

    return {
      legKm: km,
      isLocalHop: false,
      category: "Regional Intercity Corridor",
      transitAdvice: "Medium distance. State RTC buses or regional express trains run frequently.",
      trainAvailable: true,
      railFares: rail.fares,
      busFares: bus.fares,
      cabFares: {
        commercialCab: privateCabTotal
      },
      recommended: {
        economy: {
          mode: econBestMode,
          costPerPax: econBestFare,
          groupCost: Math.round(econBestFare * payingPax),
          badge: "₹ Economy Transit",
          summary: `${econBestMode}`
        },
        comfortable: {
          mode: `Express Train (SL/CC) or AC Bus (~₹${Math.max(rail.fares.CC || rail.fares.SL, acBusFare)}/pax)`,
          costPerPax: Math.max(rail.fares.CC || rail.fares.SL, acBusFare),
          groupCost: Math.round(Math.max(rail.fares.CC || rail.fares.SL, acBusFare) * payingPax),
          badge: "Balanced Regional",
          summary: `AC Bus / Express Train (~₹${Math.max(rail.fares.CC || rail.fares.SL, acBusFare)}/pax)`
        },
        middle: {
          mode: `Private AC Cab (${numCabs} Cab${numCabs > 1 ? "s" : ""}) / 3AC Train`,
          costPerPax: Math.round(privateCabTotal / totalPax),
          groupCost: privateCabTotal,
          badge: "Direct Road Cab",
          summary: `Private Intercity Cab (~₹${privateCabTotal} total)`
        }
      }
    };
  }

  // Long-Distance Corridor (>120 km)
  // ECONOMY MUST PRIORITIZE SLEEPER CLASS (SL) TRAIN!
  const slFare = rail.fares.SL;
  const ac3Fare = rail.fares["3A"];
  const ac2Fare = rail.fares["2A"];
  const ordinaryBusFare = bus.fares.ordinary;
  const acSleeperBusFare = bus.fares.acSleeper;
  const privateCabTotal = Math.round((km * 14 + 500) * numCabs);

  return {
    legKm: km,
    isLocalHop: false,
    category: "Long-Distance National Corridor",
    transitAdvice: "Long distance journey. Sleeper Class train offers maximum savings and comfort over taxis.",
    trainAvailable: true,
    railFares: rail.fares,
    busFares: bus.fares,
    cabFares: {
      commercialCab: privateCabTotal
    },
    recommended: {
      economy: {
        mode: `IRCTC Sleeper Class (SL) Train (~₹${slFare}/adult)`,
        costPerPax: slFare,
        groupCost: Math.round(slFare * payingPax),
        badge: "₹ Sleeper Class Priority",
        summary: `Sleeper (SL) Train (~₹${slFare}/pax)`
      },
      comfortable: {
        mode: `IRCTC 3rd AC (3A) Train (~₹${ac3Fare}/adult) / AC Sleeper Bus`,
        costPerPax: ac3Fare,
        groupCost: Math.round(ac3Fare * payingPax),
        badge: "3rd AC / AC Sleeper",
        summary: `3rd AC (3A) Train (~₹${ac3Fare}/pax)`
      },
      middle: {
        mode: `IRCTC 2nd AC (2A) Train (~₹${ac2Fare}/adult) / Dedicated AC Cab`,
        costPerPax: ac2Fare,
        groupCost: Math.round(ac2Fare * payingPax),
        badge: "2nd AC Comfort",
        summary: `2nd AC (2A) Train (~₹${ac2Fare}/pax)`
      }
    }
  };
}

/**
 * Multi-Destination Route Leg Calculator
 */
export function calculateMultiDestinationRouteLegs(
  origin,
  destinationList,
  tripDays = 2,
  adults = 2,
  children = 0,
  infants = 0
) {
  const stops = [origin, ...destinationList];
  const legs = [];
  let totalRoadKm = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];

    const aLat = a.lat || 25.3176;
    const aLng = a.lng || 82.9739;
    const bLat = b.lat || 25.3283;
    const bLng = b.lng || 82.9863;

    const straightKm = calculateHaversineKm(aLat, aLng, bLat, bLng);
    const isGhat = isGhatOrHillTerrain(bLat, bLng);
    const roadKm = computeTopographicalRoadKm(straightKm, isGhat);
    totalRoadKm += roadKm;

    const transit = analyzeLegTransit({
      legDistanceKm: roadKm,
      isGhat,
      fromName: a.city || a.name || "Origin",
      toName: b.city || b.name || "Destination",
      adults,
      children,
      infants
    });

    const rail = calculateRailwayFaresByDistance(roadKm * 1.05);
    const bus = calculateBusOptionsByDistance(roadKm);
    const road = calculatePrivateRoadTravel(roadKm, Math.max(1, Math.round(tripDays / (stops.length - 1))));

    legs.push({
      legIndex: i + 1,
      from: a.city || a.name || "Origin",
      to: b.city || b.name || "Destination",
      roadKm,
      isGhat,
      duration: bus.durationFormatted,
      trainFares: rail.fares,
      busFares: bus.fares,
      transitAnalysis: transit,
      drivingCab: {
        fuelAndToll: Math.round(road.ownCarFuelAndTolls / 2),
        commercialCab: Math.round(road.commercialCabFare / 2)
      }
    });
  }

  return {
    legs,
    totalRoadKm
  };
}

/**
 * Master Comprehensive Travel Plan & Smart Budget Engine
 * Calculates accurate group budgets, passenger multipliers, independent leg transit,
 * and complete 3-tier side-by-side comparison.
 */
export function generateAiTravelPlan({
  origin = VARANASI_ORIGIN,
  destinations = [],
  startDate = new Date().toISOString().split("T")[0],
  travellers = 2,
  adults = null,
  children = 0,
  infants = 0,
  groupType = "couple",
  roomCountOverride = null,
  durationDays = 3,
  preferredTier = "comfortable",
  budgetCategory = "comfortable",
  customPreferences = null,
  actualRoadKm = null,
  actualRouteLegs = null
}) {
  const destList = Array.isArray(destinations) && destinations.length > 0
    ? destinations
    : [FLAGSHIP_DESTINATIONS[0]];
  const primaryDest = destList[0] || FLAGSHIP_DESTINATIONS[0];

  // Resolve passenger numbers accurately
  const ad = adults !== null && adults !== undefined ? Math.max(1, Number(adults)) : Math.max(1, Number(travellers) || 2);
  const ch = Math.max(0, Number(children) || 0);
  const inf = Math.max(0, Number(infants) || 0);
  const totalPax = ad + ch + inf;
  const payingPax = ad + ch * 0.5;

  // 1. Resolve Profile & Location Cost-of-Living Tier
  const locationTier = detectLocationCostTier(primaryDest);
  const tierMeta = LOCATION_COST_INDEX[locationTier];

  const destProfile =
    DESTINATION_INTELLIGENCE_REGISTRY[
      (primaryDest.city || primaryDest.name || "").toLowerCase().replace(/[^a-z]/g, "")
    ] ||
    buildUniversalDestinationProfile(
      primaryDest.name,
      primaryDest.city || primaryDest.location,
      primaryDest.state,
      primaryDest.lat,
      primaryDest.lng
    );

  // 2. Intercity Route Metrics & Smart Independent Leg Transit
  let routeLegs = [];
  let roadKm = 0;
  let isGhat = false;

  if (actualRouteLegs && actualRouteLegs.length > 0) {
    roadKm = actualRoadKm || Math.round(actualRouteLegs.reduce((acc, l) => acc + (l.roadKm || 0), 0) * 10) / 10;
    routeLegs = actualRouteLegs.map((l, i) => {
      const legKm = l.roadKm || 50;
      const legGhat = l.isGhat || false;
      if (legGhat) isGhat = true;

      const transit = analyzeLegTransit({
        legDistanceKm: legKm,
        isGhat: legGhat,
        fromName: l.from?.name || l.from?.city || "Origin",
        toName: l.to?.name || l.to?.city || "Destination",
        adults: ad,
        children: ch,
        infants: inf
      });

      const rail = calculateRailwayFaresByDistance(legKm * 1.05);
      const bus = calculateBusOptionsByDistance(legKm);
      const road = calculatePrivateRoadTravel(legKm, Math.max(1, Math.round(durationDays / actualRouteLegs.length)));

      return {
        legIndex: l.legNumber || i + 1,
        from: l.from?.name || l.from?.city || "Origin",
        to: l.to?.name || l.to?.city || "Destination",
        roadKm: legKm,
        isGhat: legGhat,
        duration: l.durationFormatted || bus.durationFormatted,
        trainFares: rail.fares,
        busFares: bus.fares,
        transitAnalysis: transit,
        drivingCab: {
          fuelAndToll: Math.round(road.ownCarFuelAndTolls / 2),
          commercialCab: Math.round(road.commercialCabFare / 2)
        }
      };
    });
  } else {
    const routeCalculations = calculateMultiDestinationRouteLegs(origin, destList, durationDays, ad, ch, inf);
    roadKm = actualRoadKm || routeCalculations.totalRoadKm;
    isGhat = routeCalculations.legs.some((l) => l.isGhat);
    routeLegs = routeCalculations.legs;
  }

  // Calculate sum of independent leg transports for all tiers
  let totalEconTransport = 0;
  let totalComfTransport = 0;
  let totalMidTransport = 0;

  if (routeLegs.length > 0) {
    routeLegs.forEach((leg) => {
      if (leg.transitAnalysis && leg.transitAnalysis.recommended) {
        totalEconTransport += leg.transitAnalysis.recommended.economy.groupCost;
        totalComfTransport += leg.transitAnalysis.recommended.comfortable.groupCost;
        totalMidTransport += leg.transitAnalysis.recommended.middle.groupCost;
      }
    });
  } else {
    const defaultTransit = analyzeLegTransit({
      legDistanceKm: roadKm || 100,
      isGhat,
      fromName: origin.city || origin.name,
      toName: primaryDest.city || primaryDest.name,
      adults: ad,
      children: ch,
      infants: inf
    });
    totalEconTransport = defaultTransit.recommended.economy.groupCost;
    totalComfTransport = defaultTransit.recommended.comfortable.groupCost;
    totalMidTransport = defaultTransit.recommended.middle.groupCost;
  }

  // 3. Room & Stay Logistics based on Group Type and Sharing
  const numRooms = calculateRequiredRooms(ad, ch, groupType, roomCountOverride);
  const numNights = Math.max(1, durationDays - 1);

  // 4. Universal Component Estimations
  const accommodationEst = estimateUniversalAccommodation(locationTier, numRooms, numNights);
  const foodEst = estimateUniversalFood(locationTier, ad, ch, durationDays);
  const localTransitEst = estimateUniversalLocalTransport(locationTier, ad, ch, durationDays);

  // 5. TIER A: CHEAPEST / ECONOMY (Prioritizes Sleeper Class train, Dharamshala, Langar/Satvik Thali)
  const econIntercityTransport = totalEconTransport;
  const econStayCost = accommodationEst.totals.economy;
  const econTotalFood = foodEst.totals.economy;
  const econTotalLocalTransport = localTransitEst.modes.economy.total;
  const econDarshanCost = 0; // Free general darshan queue
  const econTollsAndMisc = 200;
  const econBuffer = Math.round((econIntercityTransport + econStayCost + econTotalFood + econTotalLocalTransport) * 0.05);
  const econTotal =
    econIntercityTransport + econStayCost + econTotalFood + econTotalLocalTransport + econDarshanCost + econTollsAndMisc + econBuffer;

  // 6. TIER B: BALANCED / COMFORTABLE (RECOMMENDED — 3AC/AC Bus, Standard Hotel, Decent Meals)
  const comfIntercityTransport = totalComfTransport;
  const comfStayCost = accommodationEst.totals.comfortable;
  const comfTotalFood = foodEst.totals.comfortable;
  const comfTotalLocalTransport = localTransitEst.modes.comfortable.total;
  const comfDarshanCost = Math.round((destProfile.darshanPassCost || 150) * ad + (destProfile.darshanPassCost || 150) * 0.5 * ch);
  const comfTollsAndMisc = 500;
  const comfBuffer = Math.round((comfIntercityTransport + comfStayCost + comfTotalFood + comfTotalLocalTransport) * 0.08);
  const comfTotal =
    comfIntercityTransport + comfStayCost + comfTotalFood + comfTotalLocalTransport + comfDarshanCost + comfTollsAndMisc + comfBuffer;

  // 7. TIER C: MID BUDGET (2AC/Private Cab, Quality Hotel, Full Dining, VIP Tokens)
  const midIntercityTransport = totalMidTransport;
  const midStayCost = accommodationEst.totals.middle;
  const midTotalFood = foodEst.totals.middle;
  const midTotalLocalTransport = localTransitEst.modes.middle.total;
  const midDarshanCost = Math.round(((destProfile.darshanPassCost || 250) + 200) * (ad + ch));
  const midTollsAndMisc = 1000;
  const midBuffer = Math.round((midIntercityTransport + midStayCost + midTotalFood + midTotalLocalTransport) * 0.10);
  const midTotal =
    midIntercityTransport + midStayCost + midTotalFood + midTotalLocalTransport + midDarshanCost + midTollsAndMisc + midBuffer;

  // 8. CUSTOM MIXED PLAN (Safe object check to prevent null crash)
  const prefs = customPreferences || {};
  const customTransportTier = prefs.transport || preferredTier;
  const customStayTier = prefs.accommodation || preferredTier;
  const customFoodTier = prefs.food || preferredTier;
  const customLocalTier = prefs.localTransport || preferredTier;
  const customDarshanTier = prefs.darshan || preferredTier;

  const customIntercityTransport =
    customTransportTier === "economy"
      ? econIntercityTransport
      : customTransportTier === "middle"
      ? midIntercityTransport
      : comfIntercityTransport;

  const customStayCost =
    customStayTier === "economy"
      ? econStayCost
      : customStayTier === "middle"
      ? midStayCost
      : comfStayCost;

  const customTotalFood =
    customFoodTier === "economy"
      ? econTotalFood
      : customFoodTier === "middle"
      ? midTotalFood
      : comfTotalFood;

  const customTotalLocalTransport =
    customLocalTier === "economy"
      ? econTotalLocalTransport
      : customLocalTier === "middle"
      ? midTotalLocalTransport
      : comfTotalLocalTransport;

  const customDarshanCost =
    customDarshanTier === "economy"
      ? econDarshanCost
      : customDarshanTier === "middle"
      ? midDarshanCost
      : comfDarshanCost;

  const customTollsAndMisc = 500;
  const customBuffer = Math.round(
    (customIntercityTransport + customStayCost + customTotalFood + customTotalLocalTransport) * 0.08
  );
  const customTotal =
    customIntercityTransport +
    customStayCost +
    customTotalFood +
    customTotalLocalTransport +
    customDarshanCost +
    customTollsAndMisc +
    customBuffer;

  // 9. Day-Wise Itinerary Construction
  const itineraryDays = [];
  const startDayObj = new Date(startDate);

  for (let day = 1; day <= durationDays; day++) {
    const curDate = new Date(startDayObj);
    curDate.setDate(curDate.getDate() + (day - 1));
    const dateFormatted = curDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

    if (day === 1) {
      itineraryDays.push({
        dayNumber: 1,
        title: `Arrival at ${destProfile.city} & First Sacred Darshan`,
        dateFormatted,
        morning: {
          time: "06:30 AM - 10:00 AM",
          title: `Arrival at ${destProfile.nearestStation.name} & Check-in`,
          description: `Arrive at ${destProfile.nearestStation.name} (${destProfile.nearestStation.code}). Take ${
            preferredTier === "economy" ? "a shared E-rickshaw (₹20-30)" : "a private auto (₹100-150)"
          } to accommodation. Complete early check-in and freshen up.`,
          localTransitMode: preferredTier === "economy" ? "Shared E-Rickshaw" : "Private Auto Stand",
          estimatedCost: preferredTier === "economy" ? 30 * ad : 120
        },
        afternoon: {
          time: "11:30 AM - 03:00 PM",
          title: `Main Darshan at ${destProfile.sanctumName} & Sattvic Lunch`,
          description: `Proceed to ${destProfile.sanctumName}. ${
            preferredTier !== "economy" && destProfile.darshanPassCost > 0
              ? "Avail pre-booked Sugam / Special Entry Darshan pass for queue-free access."
              : "Join general darshan queue."
          } Enjoy sacred temple prasad or an authentic ${destProfile.localSpecialties[1] || "thali"} lunch nearby.`,
          localTransitMode: "Walking / 5-min E-rickshaw",
          estimatedCost: preferredTier === "economy" ? 120 * ad : 250 * ad
        },
        evening: {
          time: "05:30 PM - 08:30 PM",
          title: destProfile.sightseeingHighlights[0]?.name || "Evening Maha Aarti",
          description: `Attend the celestial evening Deeparadhana / Maha Aarti. Soak in the spiritual vibrations, chants, and holy bells. Explore adjacent pilgrimage corridors.`,
          localTransitMode: "Walking through pedestrian temple zone",
          estimatedCost: 50
        },
        night: {
          time: "08:45 PM - 10:00 PM",
          title: "Traditional Dinner & Rest",
          description: `Dinner at local bhojanalaya (${destProfile.localSpecialties[0]}). Return to accommodation for peaceful night rest.`,
          estimatedCost: preferredTier === "economy" ? 90 * ad : 200 * ad
        }
      });
    } else if (day === durationDays) {
      itineraryDays.push({
        dayNumber: day,
        title: `Final Morning Darshan & Journey Back to ${origin.city || "Origin"}`,
        dateFormatted,
        morning: {
          time: "06:00 AM - 09:30 AM",
          title: "Brahma Muhurta Darshan & Holy Snan",
          description: `Early morning quiet darshan, holy river ablution, or circumambulation (Parikrama). Savor hot morning breakfast (${destProfile.localSpecialties[0]}).`,
          localTransitMode: "Walking / E-Rickshaw",
          estimatedCost: preferredTier === "economy" ? 40 * ad : 80 * ad
        },
        afternoon: {
          time: "10:30 AM - 01:30 PM",
          title: "Prasad & Souvenir Shopping, Hotel Check-out",
          description: `Shop for authentic temple prasad, sacred dry fruits, and holy mementos. Complete hotel check-out by 12:00 PM. Enjoy concluding lunch.`,
          localTransitMode: "Local Bazar Walk",
          estimatedCost: 300
        },
        evening: {
          time: "03:30 PM Onwards",
          title: `Return Transfer to ${destProfile.nearestStation.name}`,
          description: `Take auto to ${destProfile.nearestStation.name}. Board return ${
            preferredTier === "economy" ? "Sleeper Class (SL)" : "3rd AC (3A)"
          } train back to ${origin.city || "Varanasi"}.`,
          localTransitMode: "Prepaid Auto / Taxi",
          estimatedCost: preferredTier === "economy" ? 30 * ad : 150
        },
        night: {
          time: "Overnight",
          title: "Safe Return Journey with Divine Blessings",
          description: `Overnight journey back home. Arrive refreshed and spiritually rejuvenated.`,
          estimatedCost: 0
        }
      });
    } else {
      const highlight = destProfile.sightseeingHighlights[day - 1] || destProfile.sightseeingHighlights[1];
      itineraryDays.push({
        dayNumber: day,
        title: `Sacred Shrines & Heritage Excursion (${highlight?.name || "Local Pilgrimage Exploration"})`,
        dateFormatted,
        morning: {
          time: "07:00 AM - 11:00 AM",
          title: highlight?.name || "Associated Shrines Tour",
          description: `Hire auto to visit ${highlight?.name}. ${highlight?.note || "Revered guardian temple of the region."}`,
          localTransitMode: "Dedicated Auto",
          estimatedCost: Math.round(destProfile.localTransitFares.halfDaySightseeing.autoPackage * 0.6)
        },
        afternoon: {
          time: "12:30 PM - 03:30 PM",
          title: "Authentic Regional Bhojan & Afternoon Rest",
          description: `Relish traditional satvik thali meal. Relax during the afternoon hours when temple sanctums are closed for Bhog.`,
          localTransitMode: "Rest at accommodation",
          estimatedCost: preferredTier === "economy" ? 100 * ad : 220 * ad
        },
        evening: {
          time: "05:00 PM - 08:30 PM",
          title: destProfile.sightseeingHighlights[2]?.name || "Ghats / Kund & Local Markets",
          description: `Visit ${destProfile.sightseeingHighlights[2]?.name || "holy kund & ancient mathas"}. Enjoy peaceful evening aarti and serene sunset.`,
          localTransitMode: "E-Rickshaw",
          estimatedCost: 80
        },
        night: {
          time: "08:45 PM - 10:00 PM",
          title: "Dinner & Spiritual Reflection",
          description: `Wholesome light dinner. Review photographs and journal the pilgrimage experiences.`,
          estimatedCost: preferredTier === "economy" ? 90 * ad : 200 * ad
        }
      });
    }
  }

  // 10. Side-by-Side Comparison Table (Mandatory for Section 6)
  const comparisonTable = [
    {
      id: "intercity",
      category: "Intercity Travel (Train / Bus)",
      economy: econIntercityTransport,
      comfortable: comfIntercityTransport,
      middle: midIntercityTransport,
      notes: {
        economy: "Sleeper Class (SL) train / Ordinary RTC bus",
        comfortable: "3rd AC (3A) train / AC Express bus",
        middle: "2nd AC (2A) train / Private AC cab"
      }
    },
    {
      id: "local",
      category: "Local Transport (Station & Darshan)",
      economy: econTotalLocalTransport,
      comfortable: comfTotalLocalTransport,
      middle: midTotalLocalTransport,
      notes: {
        economy: "Shared E-Rickshaw & temple walkways",
        comfortable: "Prepaid autos + half-day tour",
        middle: "Dedicated private AC cab at disposal"
      }
    },
    {
      id: "accommodation",
      category: `Accommodation (${numRooms} Room${numRooms > 1 ? "s" : ""}, ${numNights} Night${numNights > 1 ? "s" : ""})`,
      economy: econStayCost,
      comfortable: comfStayCost,
      middle: midStayCost,
      notes: {
        economy: accommodationEst.labels.economy,
        comfortable: accommodationEst.labels.comfortable,
        middle: accommodationEst.labels.middle
      }
    },
    {
      id: "food",
      category: `Food & Meals (${ad} Adults${ch > 0 ? `, ${ch} Children` : ""}, ${durationDays} Days)`,
      economy: econTotalFood,
      comfortable: comfTotalFood,
      middle: midTotalFood,
      notes: {
        economy: "Langar / Annakshetra / ₹235 satvik thali",
        comfortable: "Pure veg restaurants / ₹490 daily thalis",
        middle: "Hotel buffet & dining / ₹980 daily allowance"
      }
    },
    {
      id: "darshan",
      category: "Sightseeing & Darshan Spends",
      economy: econDarshanCost,
      comfortable: comfDarshanCost,
      middle: midDarshanCost,
      notes: {
        economy: "Free sanctum queue & open ghats",
        comfortable: "Sugam / Special Entry darshan tokens",
        middle: "VIP Darshan pass & Special Puja archana"
      }
    },
    {
      id: "tolls",
      category: "Tolls, Parking & Reserve Buffer",
      economy: econTollsAndMisc + econBuffer,
      comfortable: comfTollsAndMisc + comfBuffer,
      middle: midTollsAndMisc + midBuffer,
      notes: {
        economy: "Local municipal fees + 5% emergency buffer",
        comfortable: "Highway tolls + 8% contingency buffer",
        middle: "Tolls & parking + 10% premium buffer"
      }
    },
    {
      id: "total",
      isTotal: true,
      category: "TOTAL GROUP COST",
      economy: econTotal,
      comfortable: comfTotal,
      middle: midTotal
    },
    {
      id: "perPerson",
      isPerPerson: true,
      category: "PER PERSON COST",
      economy: Math.round(econTotal / (ad + ch || 1)),
      comfortable: Math.round(comfTotal / (ad + ch || 1)),
      middle: Math.round(midTotal / (ad + ch || 1))
    }
  ];

  return {
    origin,
    destination: primaryDest,
    destinations: destList,
    destProfile,
    startDate,
    travellers: totalPax,
    adults: ad,
    children: ch,
    infants: inf,
    groupType,
    roomCountOverride,
    payingTravellers: payingPax,
    durationDays,
    numRooms,
    numNights,
    roadKm,
    railKm: Math.round(roadKm * 1.05),
    isGhatTerrain: isGhat,
    travelTimeFormatted: `${Math.round(roadKm / 50)} hrs`,
    locationTier,
    tierMeta,
    accommodationEst,
    foodEst,
    localTransitEst,
    routeLegs,
    comparisonTable,
    plans: {
      economy: {
        id: "economy",
        title: "Cheapest / Economy",
        tagline: "Sleeper trains, temple dharamshalas & shared e-rickshaws",
        badge: "₹ Lowest Cost",
        totalCost: econTotal,
        perPersonCost: Math.round(econTotal / (ad + ch || 1)),
        perDayCost: Math.round(econTotal / durationDays),
        breakdown: {
          intercityTransport: econIntercityTransport,
          accommodation: econStayCost,
          food: econTotalFood,
          localTransport: econTotalLocalTransport,
          darshanAndSightseeing: econDarshanCost,
          tollsAndMisc: econTollsAndMisc,
          emergencyBuffer: econBuffer
        },
        details: {
          transportMode: "IRCTC Sleeper Class (SL) / Ordinary RTC Bus",
          stayType: accommodationEst.labels.economy,
          stayRatePerNight: accommodationEst.tariffs.economy,
          foodStyle: foodEst.descriptions.economy,
          localTransitStyle: localTransitEst.modes.economy.style,
          darshanType: "Free General Darshan Queue"
        }
      },
      comfortable: {
        id: "comfortable",
        title: "Balanced / Comfortable",
        tagline: "3rd AC / AC Bus, standard hotel & quality satvik meals",
        badge: "Recommended Best Value",
        isRecommended: true,
        totalCost: comfTotal,
        perPersonCost: Math.round(comfTotal / (ad + ch || 1)),
        perDayCost: Math.round(comfTotal / durationDays),
        breakdown: {
          intercityTransport: comfIntercityTransport,
          accommodation: comfStayCost,
          food: comfTotalFood,
          localTransport: comfTotalLocalTransport,
          darshanAndSightseeing: comfDarshanCost,
          tollsAndMisc: comfTollsAndMisc,
          emergencyBuffer: comfBuffer
        },
        details: {
          transportMode: "IRCTC 3rd AC (3A) / AC Express Bus",
          stayType: accommodationEst.labels.comfortable,
          stayRatePerNight: accommodationEst.tariffs.comfortable,
          foodStyle: foodEst.descriptions.comfortable,
          localTransitStyle: localTransitEst.modes.comfortable.style,
          darshanType:
            destProfile.darshanPassCost > 0
              ? `Sugam / Special Entry Pass (₹${destProfile.darshanPassCost}/adult)`
              : "Standard Priority Darshan"
        }
      },
      middle: {
        id: "middle",
        title: "Mid Budget / Premium",
        tagline: "2nd AC / private cab, 3-star hotel & VIP darshan access",
        badge: "Highest Comfort",
        totalCost: midTotal,
        perPersonCost: Math.round(midTotal / (ad + ch || 1)),
        perDayCost: Math.round(midTotal / durationDays),
        breakdown: {
          intercityTransport: midIntercityTransport,
          accommodation: midStayCost,
          food: midTotalFood,
          localTransport: midTotalLocalTransport,
          darshanAndSightseeing: midDarshanCost,
          tollsAndMisc: midTollsAndMisc,
          emergencyBuffer: midBuffer
        },
        details: {
          transportMode: "IRCTC 2nd AC (2A) / Dedicated AC Cab",
          stayType: accommodationEst.labels.middle,
          stayRatePerNight: accommodationEst.tariffs.middle,
          foodStyle: foodEst.descriptions.middle,
          localTransitStyle: localTransitEst.modes.middle.style,
          darshanType: "VIP Darshan Pass with Special Puja Tokens"
        }
      },
      custom: {
        id: "custom",
        title: "Custom Mixed Budget",
        tagline: "Personalized combination across transport, hotel & dining",
        badge: "Custom Mix",
        totalCost: customTotal,
        perPersonCost: Math.round(customTotal / (ad + ch || 1)),
        perDayCost: Math.round(customTotal / durationDays),
        breakdown: {
          intercityTransport: customIntercityTransport,
          accommodation: customStayCost,
          food: customTotalFood,
          localTransport: customTotalLocalTransport,
          darshanAndSightseeing: customDarshanCost,
          tollsAndMisc: customTollsAndMisc,
          emergencyBuffer: customBuffer
        },
        details: {
          transportMode: customTransportTier,
          stayType: customStayTier,
          stayRatePerNight: accommodationEst.tariffs[customStayTier] || accommodationEst.tariffs.comfortable,
          foodStyle: foodEst.descriptions[customFoodTier] || foodEst.descriptions.comfortable,
          localTransitStyle: localTransitEst.modes[customLocalTier]?.style || localTransitEst.modes.comfortable.style,
          darshanType: customDarshanTier
        }
      }
    },
    itineraryDays,
    bookingVerificationLinks: [
      { name: "IRCTC Official Train Booking", url: "https://www.irctc.co.in/", badge: "Govt Verified" },
      { name: "State RTC Bus Portal", url: "https://online.upsrtc.com/", badge: "State Transport" },
      { name: `${destProfile.sanctumName} Official Trust Portal`, url: "https://www.google.com/search?q=" + encodeURIComponent(destProfile.sanctumName + " official website darshan booking"), badge: "Temple Trust" },
      { name: "Google Maps Turn-by-Turn Navigation", url: `https://www.google.com/maps/dir/?api=1&origin=${origin.lat || 25.3176},${origin.lng || 82.9739}&destination=${primaryDest.lat || 25.3283},${primaryDest.lng || 82.9863}`, badge: "Live GPS" }
    ]
  };
}

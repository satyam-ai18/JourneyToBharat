/**
 * Voice Guide Dynamic Q&A Engine (Journey to Bharat)
 * True Bilingual Context-Aware Travel Intelligence (Devanagari Hindi + English)
 * Answers user's ACTUAL travel questions dynamically with pinpoint accuracy.
 * Powered by Google Maps Platform Places API (Live) + Sacred Knowledge Base.
 */

import { MASTER_EXPLORER_DESTINATIONS } from "../data/masterExplorerData.js";
import { DESTINATION_INTELLIGENCE_REGISTRY } from "./aiTravelPlannerService.js";
import { fetchGoogleLivePlaces } from "./googleMapsService.js";

/**
 * Rich Bilingual Alias Dictionary for All Major Sacred Sites in Bharat
 * with coordinates for instant live Google Places querying.
 */
const DEST_BILINGUAL_MAP = [
  {
    key: "puri",
    hindiName: "श्री जगन्नाथ मंदिर, पुरी",
    lat: 19.8049,
    lng: 85.8179,
    aliases: [
      "puri", "jagannath", "jagannatha", "jagannath puri", "vimala", "bimala", "gundicha",
      "पुरी", "पूरी", "जगन्नाथ", "जगन्नाथ पुरी", "जगन्नाथ पूरी", "जगन्नाथ मंदिर", "जगन्नाथ पूरी मंदिर", "विमला", "गुंडिचा", "बिमला"
    ]
  },
  {
    key: "konark",
    hindiName: "कोणार्क सूर्य मंदिर",
    lat: 19.8876,
    lng: 86.0945,
    aliases: [
      "konark", "sun temple", "black pagoda", "chandrabhaga",
      "कोणार्क", "सूर्य मंदिर", "ब्लैक पैगोडा", "चंद्रभागा"
    ]
  },
  {
    key: "chilika",
    hindiName: "चिल्का लेक व कालीजाई मंदिर",
    lat: 19.7000,
    lng: 85.3167,
    aliases: [
      "chilika", "chilka", "kalijai",
      "चिल्का", "चिलिका", "कालीजाई"
    ]
  },
  {
    key: "biraja",
    hindiName: "माँ बिरजा देवी मंदिर (जाजपुर)",
    lat: 20.8400,
    lng: 86.3300,
    aliases: [
      "biraja", "jajpur", "viraja",
      "बिरजा", "जाजपुर", "विराजा", "माँ बिरजा", "बिरजा देवी"
    ]
  },
  {
    key: "bhubaneswar",
    hindiName: "भुवनेश्वर (लिंगराज धाम)",
    lat: 20.2961,
    lng: 85.8245,
    aliases: [
      "bhubaneswar", "bhubaneshwar", "lingaraj", "khandagiri", "udaigiri",
      "भुवनेश्वर", "लिंगराज", "खंडगिरि", "उदयगिरि"
    ]
  },
  {
    key: "varanasi",
    hindiName: "श्री काशी विश्वनाथ, वाराणसी",
    lat: 25.3176,
    lng: 82.9739,
    aliases: [
      "varanasi", "kashi", "banaras", "benares", "vishwanath", "sarnath", "dashashwamedh",
      "वाराणसी", "काशी", "कासी", "बनारस", "विश्वनाथ", "बाबा विश्वनाथ", "सारनाथ", "दशाश्वमेध"
    ]
  },
  {
    key: "ayodhya",
    hindiName: "श्री राम जन्मभूमि मंदिर, अयोध्या",
    lat: 26.7922,
    lng: 82.1998,
    aliases: [
      "ayodhya", "ram mandir", "ram janmabhoomi", "hanuman garhi", "kanak bhawan", "saryu",
      "अयोध्या", "राम मंदिर", "राम जन्मभूमि", "हनुमान गढ़ी", "हनुमानगढ़ी", "कनक भवन", "सरयू", "रामलला"
    ]
  },
  {
    key: "ujjain",
    hindiName: "श्री महाकालेश्वर, उज्जैन",
    lat: 23.1765,
    lng: 75.7885,
    aliases: [
      "ujjain", "mahakal", "mahakaleshwar", "kal bhairav", "harsiddhi", "ramghat",
      "उज्जैन", "महाकाल", "महाकालेश्वर", "काल भैरव", "हरसिद्धि"
    ]
  },
  {
    key: "kedarnath",
    hindiName: "श्री केदारनाथ ज्योतिर्लिंग",
    lat: 30.7352,
    lng: 79.0669,
    aliases: [
      "kedarnath", "kedar", "rudraprayag", "gaurikund",
      "केदारनाथ", "केदार", "रुद्रप्रयाग", "गौरीकुंड"
    ]
  },
  {
    key: "badrinath",
    hindiName: "श्री बद्रीनाथ धाम",
    lat: 30.7433,
    lng: 79.4938,
    aliases: [
      "badrinath", "badri", "chamoli", "joshimath",
      "बद्रीनाथ", "बद्री", "जोशीमठ"
    ]
  },
  {
    key: "haridwar",
    hindiName: "हरिद्वार (हर की पौड़ी)",
    lat: 29.9457,
    lng: 78.1642,
    aliases: [
      "haridwar", "hardwar", "har ki pauri", "chandi devi", "mansa devi",
      "हरिद्वार", "हर की पौड़ी", "चंडी देवी", "मनसा देवी"
    ]
  },
  {
    key: "rishikesh",
    hindiName: "ऋषिकेश",
    lat: 30.0869,
    lng: 78.2676,
    aliases: [
      "rishikesh", "lakshman jhula", "ram jhula", "triveni ghat",
      "ऋषिकेश", "लक्ष्मण झूला", "राम झूला", "त्रिवेणी घाट"
    ]
  },
  {
    key: "tirupati",
    hindiName: "श्री तिरुपति बालाजी",
    lat: 13.6288,
    lng: 79.4192,
    aliases: [
      "tirupati", "balaji", "tirumala", "venkateswara",
      "तिरुपति", "बालाजी", "तिरुमला", "वेंकटेश्वर"
    ]
  },
  {
    key: "prayagraj",
    hindiName: "प्रयागराज (त्रिवेणी संगम)",
    lat: 25.4358,
    lng: 81.8463,
    aliases: [
      "prayagraj", "allahabad", "sangam", "triveni sangam",
      "प्रयागराज", "इलाहाबाद", "संगम", "त्रिवेणी संगम"
    ]
  },
  {
    key: "chitrakoot",
    hindiName: "चित्रकूट धाम",
    lat: 25.1765,
    lng: 80.8711,
    aliases: [
      "chitrakoot", "kamadgiri", "ramghat", "gupt godavari", "sati anusuya", "hanuman dhara",
      "चित्रकूट", "कामदगिरि", "रामघाट", "गुप्त गोदावरी", "सती अनुसुइया", "हनुमान धारा"
    ]
  },
  {
    key: "somnath",
    hindiName: "श्री सोमनाथ ज्योतिर्लिंग",
    lat: 20.8880,
    lng: 70.4012,
    aliases: [
      "somnath", "veraval", "prabhas patan",
      "सोमनाथ", "वेरावल", "प्रभास पाटन"
    ]
  },
  {
    key: "dwarka",
    hindiName: "श्री द्वारकाधीश मंदिर",
    lat: 22.2442,
    lng: 68.9685,
    aliases: [
      "dwarka", "dwarika", "dwarkadhish", "bet dwarka",
      "द्वारका", "द्वारिका", "द्वारकाधीश", "बेट द्वारका"
    ]
  },
  {
    key: "khatu",
    hindiName: "खाटू श्याम जी",
    lat: 27.3600,
    lng: 75.3100,
    aliases: [
      "khatu", "khatu shyam", "shyam baba", "ringas",
      "खाटू", "खाटू श्याम", "श्याम बाबा"
    ]
  },
  {
    key: "vrindavan",
    hindiName: "श्री बांके बिहारी, वृंदावन",
    lat: 27.5806,
    lng: 77.7006,
    aliases: [
      "vrindavan", "mathura", "banke bihari", "prem mandir", "govardhan", "barsana",
      "वृंदावन", "मथुरा", "बांके बिहारी", "प्रेम मंदिर", "गोवर्धन", "बरसाना"
    ]
  },
  {
    key: "shirdi",
    hindiName: "शिर्डी साईं बाबा",
    lat: 19.7667,
    lng: 74.4767,
    aliases: [
      "shirdi", "sai baba", "sai",
      "शिर्डी", "साईं बाबा", "साईं"
    ]
  },
  {
    key: "rameshwaram",
    hindiName: "श्री रामेश्वरम ज्योतिर्लिंग",
    lat: 9.2876,
    lng: 79.3129,
    aliases: [
      "rameshwaram", "rameshwar", "ramanathaswamy", "dhanushkodi",
      "रामेश्वरम", "रामेश्वर", "धनुषकोडी"
    ]
  },
  {
    key: "amarnath",
    hindiName: "श्री अमरनाथ धाम",
    lat: 34.2157,
    lng: 75.5036,
    aliases: [
      "amarnath", "baltal", "pahalgam",
      "अमरनाथ", "बालटाल", "पहलगाम"
    ]
  },
  {
    key: "vaishno_devi",
    hindiName: "माँ वैष्णो देवी धाम",
    lat: 33.0308,
    lng: 74.9490,
    aliases: [
      "vaishno", "vaishnodevi", "katra", "bhawan",
      "वैष्णो देवी", "वैष्णोदेवी", "कटरा"
    ]
  },
  {
    key: "kamakhya",
    hindiName: "माँ कामाख्या शक्तिपीठ (गुवाहाटी)",
    lat: 26.1664,
    lng: 91.7061,
    aliases: [
      "kamakhya", "guwahati", "nilachal",
      "कामाख्या", "गुवाहाटी", "नीलाचल"
    ]
  },
  {
    key: "baidyanath",
    hindiName: "श्री बैद्यनाथ ज्योतिर्लिंग (देवघर)",
    lat: 24.4925,
    lng: 86.7001,
    aliases: [
      "baidyanath", "deoghar", "baba dham",
      "बैद्यनाथ", "देवघर", "बाबा धाम"
    ]
  }
];

/**
 * Robust Bilingual Destination Resolver:
 * Accurately matches Hindi (Devanagari), English, and Hinglish queries against the active circuit.
 */
function findTargetDestination(query = "", selectedStops = [], activeDestination = null, journeyOrigin = null) {
  const q = (query || "").toLowerCase().trim();
  if (!q) {
    if (activeDestination) return activeDestination;
    if (selectedStops && selectedStops.length > 0) return selectedStops[0];
    return journeyOrigin;
  }

  // 1. First Priority: Check if query contains an alias in DEST_BILINGUAL_MAP
  for (const item of DEST_BILINGUAL_MAP) {
    const matchedAlias = item.aliases.find((alias) => q.includes(alias.toLowerCase()));
    if (matchedAlias) {
      // Find in selectedStops first
      if (selectedStops && selectedStops.length > 0) {
        const foundInCircuit = selectedStops.find((s) => {
          const sText = `${s.name || ""} ${s.city || ""} ${s.id || ""}`.toLowerCase();
          return item.aliases.some((a) => sText.includes(a.toLowerCase())) || sText.includes(item.key);
        });
        if (foundInCircuit) {
          return {
            ...foundInCircuit,
            resolvedHindiName: item.hindiName,
            lat: foundInCircuit.lat || item.lat,
            lng: foundInCircuit.lng || item.lng
          };
        }
      }

      // Check origin
      if (journeyOrigin) {
        const origText = `${journeyOrigin.name || ""} ${journeyOrigin.city || ""}`.toLowerCase();
        if (item.aliases.some((a) => origText.includes(a.toLowerCase())) || origText.includes(item.key)) {
          return {
            ...journeyOrigin,
            resolvedHindiName: item.hindiName,
            lat: journeyOrigin.lat || item.lat,
            lng: journeyOrigin.lng || item.lng
          };
        }
      }

      // Find in MASTER_EXPLORER_DESTINATIONS
      const foundInMaster = MASTER_EXPLORER_DESTINATIONS.find((d) => {
        const dText = `${d.name || ""} ${d.city || ""} ${d.id || ""}`.toLowerCase();
        return item.aliases.some((a) => dText.includes(a.toLowerCase())) || dText.includes(item.key);
      });
      if (foundInMaster) {
        return {
          ...foundInMaster,
          resolvedHindiName: item.hindiName,
          lat: foundInMaster.lat || item.lat,
          lng: foundInMaster.lng || item.lng
        };
      }

      // Direct entry with coordinates
      return {
        id: item.key,
        name: item.hindiName,
        resolvedHindiName: item.hindiName,
        lat: item.lat,
        lng: item.lng
      };
    }
  }

  // 2. Second Priority: Direct substring match in selected stops (Latin / English)
  if (selectedStops && selectedStops.length > 0) {
    const directMatch = selectedStops.find((s) => {
      const name = (s.name || "").toLowerCase();
      const city = (s.city || "").toLowerCase();
      return (name && q.includes(name)) || (city && q.includes(city));
    });
    if (directMatch) return directMatch;
  }

  // 3. Third Priority: Active inspected destination or origin if query mentions it
  if (activeDestination) return activeDestination;

  // 4. Fallback if query mentions temple/mandir/dham to first sacred stop in circuit
  if (/मंदिर|टेंपल|धाम|temple|shrine/.test(q) && selectedStops && selectedStops.length > 0) {
    const sacredStop = selectedStops.find(s => !s.name?.toLowerCase().includes("station") && !s.name?.toLowerCase().includes("junction")) || selectedStops[0];
    return sacredStop;
  }

  // 5. Fallback to first selected stop or origin
  if (selectedStops && selectedStops.length > 0) return selectedStops[0];
  return journeyOrigin;
}

/**
 * Normalize destination key for DESTINATION_INTELLIGENCE_REGISTRY
 */
function getIntelligenceData(dest) {
  if (!dest) return null;
  const name = (dest.name || "").toLowerCase();
  const city = (dest.city || "").toLowerCase();
  const state = (dest.state || "").toLowerCase();
  const id = (dest.id || "").toLowerCase();
  const combined = `${name} ${city} ${state} ${id}`;

  if (combined.includes("varanasi") || combined.includes("kashi")) return DESTINATION_INTELLIGENCE_REGISTRY.varanasi;
  if (combined.includes("puri") || combined.includes("jagannath")) return DESTINATION_INTELLIGENCE_REGISTRY.puri;
  if (combined.includes("ayodhya") || combined.includes("ram mandir")) return DESTINATION_INTELLIGENCE_REGISTRY.ayodhya;
  if (combined.includes("ujjain") || combined.includes("mahakal")) return DESTINATION_INTELLIGENCE_REGISTRY.ujjain;
  if (combined.includes("kedarnath")) return DESTINATION_INTELLIGENCE_REGISTRY.kedarnath;
  if (combined.includes("haridwar") || combined.includes("rishikesh")) return DESTINATION_INTELLIGENCE_REGISTRY.haridwar;
  if (combined.includes("tirupati") || combined.includes("balaji")) return DESTINATION_INTELLIGENCE_REGISTRY.tirupati;
  if (combined.includes("prayagraj") || combined.includes("allahabad")) return DESTINATION_INTELLIGENCE_REGISTRY.prayagraj;

  return null;
}

/**
 * Formats concise, human-like spoken answer for Restaurants & Dining
 * combining Live Google Places (ratings & inexpensive tiers) with sacred dining wisdom.
 */
function formatRestaurantAnswer({ places = [], destName, isHindi }) {
  const sorted = [...places].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  const topRated = sorted[0];

  const cheapOrSatvik = places.find(p =>
    p.name !== topRated?.name &&
    (/bhojan|veg|dhaba|swad|peace|shree bhog|ram lalla|bata mangala/i.test(p.name) || p.priceLevel === "PRICE_LEVEL_INEXPENSIVE")
  ) || sorted[1] || topRated;

  const dLower = (destName || "").toLowerCase();
  let sacredNoteHi = "";
  let sacredNoteEn = "";

  if (dLower.includes("puri") || dLower.includes("पुरी") || dLower.includes("जगन्नाथ")) {
    sacredNoteHi = "मंदिर परिसर के 'आनंद बाज़ार' का 56 भोग महाप्रसाद सबसे पवित्र व सस्ता भोजन है। ";
    sacredNoteEn = "Inside temple premises, the 56 Bhog Mahaprasad at Ananda Bazar is the most sacred and affordable dining. ";
  } else if (dLower.includes("kashi") || dLower.includes("varanasi") || dLower.includes("विश्वनाथ") || dLower.includes("काशी")) {
    sacredNoteHi = "श्री काशी विश्वनाथ अन्नक्षेत्र में निःशुल्क शुद्ध सात्विक प्रसाद मिलता है। ";
    sacredNoteEn = "Shree Kashi Vishwanath Annakshetra offers free pure satvik meals to devotees. ";
  } else if (dLower.includes("ayodhya") || dLower.includes("अयोध्या") || dLower.includes("राम मंदिर")) {
    sacredNoteHi = "अयोध्या में 'अमावां राम मंदिर' की राम रसोई में निःशुल्क व शुद्ध सात्विक थाली मिलती है। ";
    sacredNoteEn = "In Ayodhya, Amawa Ram Mandir Ram Rasoi serves free pure satvik thalis. ";
  } else if (dLower.includes("ujjain") || dLower.includes("उज्जैन") || dLower.includes("महाकाल")) {
    sacredNoteHi = "महाकाल मंदिर अन्नक्षेत्र में अत्यंत कम मूल्य पर शुद्ध भोजन मिलता है। ";
    sacredNoteEn = "Mahakal Temple Annakshetra provides pure meals at nominal rates. ";
  }

  let textHi = "";
  let textEn = "";

  if (topRated && cheapOrSatvik && topRated.name !== cheapOrSatvik.name) {
    textHi = `${destName} के पास सबसे किफायती और शुद्ध भोजन के लिए ${sacredNoteHi}पास में '${cheapOrSatvik.name}' (${cheapOrSatvik.rating || "4.2"}★) उत्तम है। वहीं बेहतरीन फैमिली डाइनिंग और टॉप रेटिंग के लिए '${topRated.name}' (${topRated.rating || "4.7"}★) सबसे अच्छा रेस्टोरेंट है।`;
    textEn = `Near ${destName}, ${sacredNoteEn}for budget dining '${cheapOrSatvik.name}' (${cheapOrSatvik.rating || "4.2"}★) is great. For top-rated family dining, '${topRated.name}' (${topRated.rating || "4.7"}★) is the best choice.`;
  } else if (topRated) {
    textHi = `${destName} के पास ${sacredNoteHi}लोकप्रिय रेस्टोरेंट्स में '${topRated.name}' (${topRated.rating || "4.5"}★) सबसे प्रसिद्ध व अच्छा विकल्प है।`;
    textEn = `Near ${destName}, ${sacredNoteEn}'${topRated.name}' (${topRated.rating || "4.5"}★) is one of the most popular and highly rated dining options.`;
  } else {
    textHi = `${destName} के पास ${sacredNoteHi}मंदिर के आसपास पारंपरिक सात्विक भोजनालय और प्रमाणित शाकाहारी रेस्टोरेंट सबसे सस्ते व सुरक्षित विकल्प हैं।`;
    textEn = `Near ${destName}, ${sacredNoteEn}traditional trust bhojanalayas and certified vegetarian restaurants are the safest, most economical options.`;
  }

  return { textHi, textEn };
}

/**
 * Formats concise, human-like spoken answer for Hotels & Accommodations
 */
function formatStayAnswer({ places = [], destName, isHindi, intel }) {
  const sorted = [...places].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  const topStay = sorted[0];
  const budgetStay = places.find(p =>
    p.name !== topStay?.name &&
    (/ashram|yatri|dharamshala|bhavan|guest house|darsan/i.test(p.name) || p.priceLevel === "PRICE_LEVEL_INEXPENSIVE")
  ) || sorted[1] || topStay;

  let textHi = "";
  let textEn = "";

  if (topStay && budgetStay && topStay.name !== budgetStay.name) {
    textHi = `${destName} के पास सबसे किफायती और सुरक्षित ठहराव में '${budgetStay.name}' और मंदिर ट्रस्ट की धर्मशालाएं (दरें ₹500 से ₹800) उत्तम हैं। वहीं अच्छी रेटिंग वाले फैमिली होटलों में '${topStay.name}' (${topStay.rating || "4.5"}★) ₹1,200 से ₹2,200 में उपलब्ध है।`;
    textEn = `Near ${destName}, top budget stays include '${budgetStay.name}' and trust dharamshalas (₹500 to ₹800). For comfortable family rooms, '${topStay.name}' (${topStay.rating || "4.5"}★) offers rooms from ₹1,200 to ₹2,200.`;
  } else if (topStay) {
    textHi = `${destName} के पास ठहरने के लिए '${topStay.name}' (${topStay.rating || "4.4"}★) और मंदिर के पास ₹1,200 से ₹2,000 में फैमिली होटल उपलब्ध हैं।`;
    textEn = `For lodging near ${destName}, '${topStay.name}' (${topStay.rating || "4.4"}★) and nearby family hotels range from ₹1,200 to ₹2,000.`;
  } else {
    textHi = `${destName} में सबसे सुरक्षित ठहराव मंदिर ट्रस्ट की अधिकृत धर्मशालाएं (₹400 से ₹800) और मंदिर के पास ₹1,200 से ₹2,200 में पारिवारिक होटल हैं।`;
    textEn = `In ${destName}, official temple trust dharamshalas (₹400 to ₹800) and licensed family hotels offer clean, safe accommodations.`;
  }

  return { textHi, textEn };
}

/**
 * Formats concise spoken answer from Live Google Places for any specific inquiry
 */
function formatGenericPlacesAnswer({ places = [], destName, isHindi }) {
  if (!places || places.length === 0) return null;
  const p1 = places[0];
  const p2 = places[1];

  let textHi = "";
  let textEn = "";

  if (p1 && p2) {
    textHi = `${destName} के पास आपके सवाल के अनुसार '${p1.name}' (${p1.rating ? p1.rating + "★" : "प्रसिद्ध"}) और '${p2.name}' (${p2.rating ? p2.rating + "★" : ""}) मुख्य विकल्प हैं, जो मंदिर क्षेत्र के पास स्थित हैं।`;
    textEn = `Near ${destName}, based on your query, '${p1.name}' (${p1.rating ? p1.rating + "★" : "popular"}) and '${p2.name}' are the top options located nearby.`;
  } else if (p1) {
    textHi = `${destName} के पास मुख्य रूप से '${p1.name}' (${p1.rating ? p1.rating + "★" : "प्रसिद्ध"}) स्थित है, जिसका पता ${p1.address ? p1.address.slice(0, 50) : "मंदिर क्षेत्र"} के समीप है।`;
    textEn = `Near ${destName}, '${p1.name}' (${p1.rating ? p1.rating + "★" : "popular"}) is located nearby at ${p1.address ? p1.address.slice(0, 50) : "close to the shrine"}.`;
  }

  return { textHi, textEn };
}

/**
 * Master Dynamic Q&A Solver:
 * Generates concise 1–3 sentence spoken answers to the user's SPECIFIC question.
 * Connects live with Google Maps Places API whenever the query touches dining, stays, markets, or local points.
 */
export async function resolveDynamicVoiceAnswer({
  query = "",
  language = "hi-IN",
  selectedStops = [],
  activeDestination = null,
  journeyOrigin = null,
  journeyRouteResult = null,
  activeBudget = null,
  lastSpokenText = ""
}) {
  const isHindi = language.startsWith("hi");
  const q = (query || "").toLowerCase().trim();

  // Find destination relevant to query
  const targetDest = findTargetDestination(q, selectedStops, activeDestination, journeyOrigin);
  const intel = getIntelligenceData(targetDest);

  // Natural Display Name
  const destName = isHindi
    ? (targetDest?.resolvedHindiName || targetDest?.name || "गंतव्य")
    : (targetDest?.name || "Destination");

  const searchPlaceName = targetDest?.name || targetDest?.resolvedHindiName || "Jagannath Puri";
  const targetLat = targetDest?.lat || targetDest?.latitude || 19.8049;
  const targetLng = targetDest?.lng || targetDest?.longitude || 85.8179;

  // Metrics
  const travellers = activeBudget?.travellers || 2;
  const roadKm = journeyRouteResult?.totalRoadKm || activeBudget?.roadKm || (selectedStops.length * 240);
  const duration = journeyRouteResult?.totalDurationFormatted || activeBudget?.travelTimeFormatted || (isHindi ? "लगभग 5 से 6 घंटे" : "approx 5 to 6 hours");
  const ecoCost = activeBudget?.plans?.economy?.totalCost || 2490;
  const balCost = activeBudget?.plans?.comfortable?.totalCost || activeBudget?.plans?.middle?.totalCost || 6860;
  const ecoPerPax = Math.round(ecoCost / travellers);
  const originName = isHindi
    ? (journeyOrigin?.resolvedHindiName || journeyOrigin?.name || "वाराणसी")
    : (journeyOrigin?.name || "Varanasi");

  // 0. IDENTITY / WHO ARE YOU (YAVIKA)
  if (/tum kaun ho|who are you|aap kaun ho|naam kya hai|your name|kaun ho tum|yavika|याविका|तुम कौन हो|आप कौन हैं|नाम क्या है|पहचान|intro/.test(q)) {
    const identHi = "नमस्ते! मैं याविका (YAVIKA) हूँ — भारत यात्रा के लिए आपकी व्यक्तिगत AI साथी। मैं आपके रूट, ट्रेन का समय व कितने घंटे लगेंगे, बजट, ठहरने के स्थान, और मंदिर दर्शन के नियमों में पूरी सहायता करूँगी।";
    const identEn = "Hello! I am YAVIKA, your personal AI travel companion for Bharat. I assist you with routes, train travel duration, budgets, stay options, and sacred shrine guidelines.";
    return { topic: "identity", text: isHindi ? identHi : identEn };
  }

  // 1. REPEAT REQUEST
  if (/repeat|again|fir se|phir se|dobara|wapas|दोबारा|फिर से/.test(q)) {
    return {
      topic: "repeat",
      text: lastSpokenText || (isHindi ? "मैं याविका, तैयार हूँ! कृपया अपना सवाल पूछें।" : "I am Yavika, ready! Please ask your question.")
    };
  }

  // 1.5. TRAIN TRAVEL TIME & DURATION ("बनारस से पुरी ट्रेन कितने घंटे में पहुँचाएगी", "ट्रेन से कितना समय लगेगा", "ट्रेन का किराया कितना है")
  const isTrainDurationQuery =
    (/ट्रेन|रेल|गाड़ी|train|rail/i.test(q) && /घंटे|समय|टाइम|देर|पहुँचाएगी|पहुँचेंगे|पहुँचने|किराया|duration|hours|time|how long|kitne ghante|kitna time|fare/i.test(q)) ||
    (/कितने घंटे|कितना समय|कितनी देर|पहुँचाएगी|पहुँचेंगे/.test(q) && /ट्रेन|रेल|गाड़ी|train/.test(q));

  if (isTrainDurationQuery) {
    // Determine effective origin from query or circuit
    let effOrigin = originName;
    if (/बनारस|वाराणसी|kashi|varanasi|banaras/.test(q)) effOrigin = "बनारस (वाराणसी)";
    else if (/दिल्ली|delhi/.test(q)) effOrigin = "दिल्ली";
    else if (/कोलकाता|हावड़ा|kolkata|howrah/.test(q)) effOrigin = "कोलकाता";

    // Determine effective destination from query or circuit
    let effDest = destName;
    if (/पुरी|जगन्नाथ|puri|jagannath/.test(q)) effDest = "जगन्नाथ पुरी";
    else if (/अयोध्या|ayodhya/.test(q)) effDest = "अयोध्या धाम";
    else if (/उज्जैन|महाकाल|ujjain/.test(q)) effDest = "उज्जैन (महाकाल)";
    else if (/हरिद्वार|haridwar/.test(q)) effDest = "हरिद्वार";
    else if (/तिरुपति|tirupati/.test(q)) effDest = "तिरुपति बालाजी";

    // Major direct rail corridors dictionary
    const CORRIDORS = {
      "varanasi_puri": {
        hoursHi: "लगभग 18 से 21 घंटे",
        hoursEn: "approx 18 to 21 hours",
        km: 980,
        trainsHi: "नीलांचल एक्सप्रेस (12876) और पुरुषोत्तम एक्सप्रेस (12802)",
        trainsEn: "Neelachal Express and Purushottam Express",
        slFare: 495,
        acFare: 1320
      },
      "varanasi_ayodhya": {
        hoursHi: "लगभग 2 से 3.5 घंटे",
        hoursEn: "approx 2 to 3.5 hours",
        km: 200,
        trainsHi: "वंदे भारत एक्सप्रेस और सरयू एक्सप्रेस",
        trainsEn: "Vande Bharat Express and Saryu Express",
        slFare: 145,
        acFare: 505
      },
      "varanasi_ujjain": {
        hoursHi: "लगभग 17 से 19 घंटे",
        hoursEn: "approx 17 to 19 hours",
        km: 950,
        trainsHi: "काशी महाकाल एक्सप्रेस व साबरमती एक्सप्रेस",
        trainsEn: "Kashi Mahakal Express and Sabarmati Express",
        slFare: 465,
        acFare: 1250
      },
      "varanasi_haridwar": {
        hoursHi: "लगभग 15 से 17 घंटे",
        hoursEn: "approx 15 to 17 hours",
        km: 860,
        trainsHi: "दून एक्सप्रेस व कुंभ एक्सप्रेस",
        trainsEn: "Doon Express and Kumbha Express",
        slFare: 440,
        acFare: 1180
      },
      "varanasi_tirupati": {
        hoursHi: "लगभग 32 से 34 घंटे",
        hoursEn: "approx 32 to 34 hours",
        km: 1850,
        trainsHi: "गंगा कावेरी एक्सप्रेस",
        trainsEn: "Ganga Kaveri Express",
        slFare: 720,
        acFare: 1920
      },
      "delhi_varanasi": {
        hoursHi: "लगभग 8 से 11 घंटे",
        hoursEn: "approx 8 to 11 hours",
        km: 760,
        trainsHi: "वंदे भारत एक्सप्रेस (8 घंटे) और शिवगंगा एक्सप्रेस (11 घंटे)",
        trainsEn: "Vande Bharat Express (8 hrs) and Shiv Ganga Express (11 hrs)",
        slFare: 415,
        acFare: 1110
      },
      "delhi_puri": {
        hoursHi: "लगभग 30 से 32 घंटे",
        hoursEn: "approx 30 to 32 hours",
        km: 1800,
        trainsHi: "पुरुषोत्तम एक्सप्रेस और नंदन कानन एक्सप्रेस",
        trainsEn: "Purushottam Express and Nandan Kanan Express",
        slFare: 710,
        acFare: 1890
      },
      "bhubaneswar_puri": {
        hoursHi: "लगभग 1 से 1.5 घंटे",
        hoursEn: "approx 1 to 1.5 hours",
        km: 60,
        trainsHi: "पुरी मेमू और तपस्विनी एक्सप्रेस",
        trainsEn: "Puri MEMU and Tapaswini Express",
        slFare: 60,
        acFare: 150
      }
    };

    let matchedCorridor = null;
    const effLower = (effOrigin + "_" + effDest).toLowerCase();
    const hasVaranasi = /varanasi|बनारस|वाराणसी|kashi|काशी/i.test(effLower);
    const hasPuri = /puri|पुरी|पूरी|जगन्नाथ/i.test(effLower);
    const hasAyodhya = /ayodhya|अयोध्या/i.test(effLower);
    const hasUjjain = /ujjain|उज्जैन|महाकाल/i.test(effLower);
    const hasHaridwar = /haridwar|हरिद्वार|ऋषिकेश|rishikesh/i.test(effLower);
    const hasTirupati = /tirupati|तिरुपति|बालाजी/i.test(effLower);
    const hasDelhi = /delhi|दिल्ली/i.test(effLower);
    const hasBhubaneswar = /bhubaneswar|भुवनेश्वर/i.test(effLower);

    if (hasVaranasi && hasPuri) matchedCorridor = CORRIDORS.varanasi_puri;
    else if (hasVaranasi && hasAyodhya) matchedCorridor = CORRIDORS.varanasi_ayodhya;
    else if (hasVaranasi && hasUjjain) matchedCorridor = CORRIDORS.varanasi_ujjain;
    else if (hasVaranasi && hasHaridwar) matchedCorridor = CORRIDORS.varanasi_haridwar;
    else if (hasVaranasi && hasTirupati) matchedCorridor = CORRIDORS.varanasi_tirupati;
    else if (hasDelhi && hasVaranasi) matchedCorridor = CORRIDORS.delhi_varanasi;
    else if (hasDelhi && hasPuri) matchedCorridor = CORRIDORS.delhi_puri;
    else if (hasBhubaneswar && hasPuri) matchedCorridor = CORRIDORS.bhubaneswar_puri;

    if (matchedCorridor) {
      const trainHi = `मैं याविका, आपको बताती हूँ: ${effOrigin} से ${effDest} तक ट्रेन से ${matchedCorridor.hoursHi} का समय लगता है। रेल दूरी करीब ${matchedCorridor.km} किमी है। इसमें ${matchedCorridor.trainsHi} मुख्य ट्रेनें हैं। स्लीपर क्लास का किराया लगभग ₹${matchedCorridor.slFare} और 3-AC का ₹${matchedCorridor.acFare} रहता है।`;
      const trainEn = `I am Yavika! The train journey from ${effOrigin} to ${effDest} takes ${matchedCorridor.hoursEn} covering about ${matchedCorridor.km} km. Main direct trains are ${matchedCorridor.trainsEn}. Sleeper fare is ~₹${matchedCorridor.slFare} and 3-AC is ~₹${matchedCorridor.acFare}.`;
      return { topic: "train_duration", text: isHindi ? trainHi : trainEn };
    }

    // Dynamic Average Calculation (If exact corridor not mapped, calculate realistic average)
    const railDist = Math.max(80, Math.round(roadKm * 0.95));
    const avgHrs = Math.max(1, Math.round(railDist / 52));
    const minHrs = Math.max(1, avgHrs - 1);
    const maxHrs = avgHrs + 2;
    const slFare = Math.round(railDist * 0.50);
    const acFare = Math.round(railDist * 1.35);

    const avgTrainHi = `मैं याविका, आपको बताती हूँ: ${effOrigin} से ${effDest} तक एक्सप्रेस ट्रेन से औसतन ${minHrs} से ${maxHrs} घंटे का समय लगेगा (दूरी लगभग ${railDist} किमी)। स्लीपर क्लास का अनुमानित किराया ₹${slFare} और 3-AC का किराया लगभग ₹${acFare} रहेगा।`;
    const avgTrainEn = `I am Yavika! By express train, travel from ${effOrigin} to ${effDest} takes on average ${minHrs} to ${maxHrs} hours (approx ${railDist} km). Estimated sleeper fare is ₹${slFare} and 3-AC is around ₹${acFare}.`;

    return { topic: "train_duration", text: isHindi ? avgTrainHi : avgTrainEn };
  }

  // 1.6. ROAD / CAR TRAVEL TIME
  if (/कार|रोड|सड़क|ड्राइव|car|drive|road/.test(q) && /घंटे|समय|टाइम|duration|hours|kitne ghante/.test(q)) {
    const roadTimeHi = `मैं याविका, आपको बताती हूँ: ${originName} से ${destName} तक सड़क मार्ग से कार द्वारा लगभग ${duration} का समय लगेगा (दूरी ${roadKm} किमी)। नेशनल हाईवे मार्ग सुगम है और टोल खर्च लगभग ₹${Math.round(roadKm * 1.5)} आएगा।`;
    const roadTimeEn = `I am Yavika! By road or car, travel from ${originName} to ${destName} takes about ${duration} covering ${roadKm} km via National Highways.`;
    return { topic: "route", text: isHindi ? roadTimeHi : roadTimeEn };
  }

  // 2. RESTAURANTS / DINING / FOOD / DHABAS / BHOJANALAYA / MENU / CHEAPEST & BEST DINING (Live Google Places Search)
  const isRestaurantFoodQuery = /रेस्टोरेंट|रेस्टोरेन्ट|होटल.*(खाना|खाने|रेस्टोरेंट|भोजन|डाइनिंग|नाश्ता)|ढाबा|भोजनालय|कैफे|रेस्तरां|restaurant|restaurants|dhaba|eating|bhojanalaya|cafe|khana|khayein|khao|food|specialty|speciality|prasad|mahaprasad|bhog|mithai|sweet|kachori|thali|bhojan|khaja|chhena|poda|peda|lassi|खाना|प्रसाद|भोग|मिठाई|कचौड़ी|थाल|भोजन|खाने|मेन्यू|menu|नाश्ता|डाइनिंग|लंच|डिनर|शुद्ध शाकाहारी|सात्विक|pure veg/.test(q);

  if (isRestaurantFoodQuery) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `best cheap pure veg restaurants bhojanalaya near ${searchPlaceName}`,
        targetLat,
        targetLng,
        6
      );

      const places = gRes.success && gRes.places ? gRes.places : [];
      const { textHi, textEn } = formatRestaurantAnswer({ places, destName, isHindi });

      return {
        topic: "food",
        text: isHindi ? textHi : textEn,
        places
      };
    } catch (err) {
      console.warn("Live restaurant search error:", err);
    }
  }

  // 3. HOTEL / STAY / DHARAMSHALA / CHEAPEST ROOMS / LODGE (Live Google Places Search)
  const isStayQuery = /stay|hotel|room|dharamshala|ashram|rukna|rukne|kamra|lodge|guest house|yatri niwas|होटल|धर्मशाला|रुकना|ठहर|कमरा|आश्रम|लॉज|गेस्ट हाउस|यात्री निवास/.test(q);

  if (isStayQuery) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `budget hotels ashram lodge and guest house near ${searchPlaceName}`,
        targetLat,
        targetLng,
        6
      );

      const places = gRes.success && gRes.places ? gRes.places : [];
      const { textHi, textEn } = formatStayAnswer({ places, destName, isHindi, intel });

      return {
        topic: "stay",
        text: isHindi ? textHi : textEn,
        places
      };
    } catch (err) {
      console.warn("Live stay search error:", err);
    }
  }

  // 4. TICKETS / ENTRY PASS / VIP DARSHAN (Strict: Never match bare 'पास' which means 'near')
  if (/(दर्शन|वीआईपी|वी\.आई\.पी|एंट्री|गेट)\s*पास|darshan\s*pass|entry\s*pass|vip\s*pass|टिकट|ticket|शुल्क|चार्ज|मुफ्त\s*दर्शन|फ्री\s*दर्शन|प्रवेश\s*शुल्क|वीआईपी|vip/.test(q)) {
    const isFree = intel ? intel.freeDarshanAvailable : true;
    const vipCost = intel?.darshanPassCost || 0;
    let passHi = "";
    let passEn = "";

    if (isFree && vipCost > 0) {
      passHi = `सामान्य कतार में दर्शन पूरी तरह निःशुल्क है। यदि आप सुगम या वीआईपी दर्शन चाहते हैं, तो इसका आधिकारिक शुल्क लगभग ₹${vipCost} है, जिसे मंदिर के अधिकृत काउंटर से ही लें।`;
      passEn = `General darshan is completely free. Special or VIP passes cost around ₹${vipCost} and must be purchased only at official trust counters.`;
    } else {
      passHi = "सामान्य दर्शन निःशुल्क है। किसी भी अनधिकृत दलाल को कतार आगे करने के लिए अतिरिक्त पैसे न दें।";
      passEn = "General entry is free. Never pay touts outside the temple claiming to skip queues.";
    }

    return { topic: "tickets", text: isHindi ? passHi : passEn };
  }

  // 5. TIMINGS / DARSHAN HOURS / AARTI SCHEDULE
  if ((/timing|timings|samay|aarti|bhor|darshan|mangala|sandhya|kapat|आरती|दर्शन|समय|कपाट|खुलने|बंद/.test(q) ||
       (/कब/.test(q) && /दर्शन|मंदिर|कपाट|आरती/.test(q))) &&
      !/kharcha|budget|kharch|cost|paisa|खर्चा|बजट/.test(q)) {
    const rawTimings = intel?.sanctumTimings || targetDest?.timings;
    let timingHi = "";
    let timingEn = "";

    if (rawTimings) {
      timingHi = `${destName} में दर्शन का समय ${rawTimings} है। दोपहर में भोग के समय कपाट कुछ देर के लिए बंद रहते हैं, और सामान्य दर्शन 30 से 45 मिनट में हो जाते हैं।`;
      timingEn = `Darshan timings at ${destName} are ${rawTimings}. Sanctum closes briefly during midday bhog, and general queue takes 30 to 45 minutes.`;
    } else {
      timingHi = `${destName} के मुख्य कपाट प्रातः 05:30 बजे से दोपहर 12:30 बजे तक और फिर शाम 04:30 से रात 09:30 बजे तक खुले रहते हैं।`;
      timingEn = `Main sanctum doors at ${destName} typically open from 5:30 AM to 12:30 PM and 4:30 PM to 9:30 PM.`;
    }

    return { topic: "timings", text: isHindi ? timingHi : timingEn };
  }

  // 6. WEATHER / BEST SEASON / BEST TIME TO VISIT
  if (/mausam|weather|best time|kab jayein|kab jana|season|thand|garmi|baarish|monsoon|winter|rain|मौसम|कब जाएं|तापमान|ठंड|बारिश/.test(q)) {
    const bestTime = targetDest?.bestTime;
    let weatherHi = "";
    let weatherEn = "";

    if (bestTime) {
      weatherHi = `${destName} जाने का सबसे उत्तम समय ${bestTime} है। इस दौरान मौसम सुहावना रहता है और यात्रा सुखद होती है।`;
      weatherEn = `The best time to visit ${destName} is ${bestTime}, offering pleasant weather and comfortable travel conditions.`;
    } else {
      weatherHi = `${destName} में अक्टूबर से मार्च के बीच मौसम सबसे सुखद रहता है। गर्मियों में पर्याप्त पानी साथ रखें और सर्दियों में हल्के गर्म कपड़े पहनें।`;
      weatherEn = `October to March is generally the most pleasant time for ${destName}. Carry light woolens during winter and stay hydrated.`;
    }

    return { topic: "weather", text: isHindi ? weatherHi : weatherEn };
  }

  // 7. AIRPORT / FLIGHTS / AIR TRANSIT
  if (/airport|flight|plane|hawaai|air|विमान|हवाई|एयरपोर्ट|फ्लाइट/.test(q)) {
    const airInfo = targetDest?.howToReach?.byAir;
    let airHi = "";
    let airEn = "";

    if (airInfo) {
      airHi = `${destName} का निकटतम हवाई मार्ग: ${airInfo}`;
      airEn = `For air travel to ${destName}: ${airInfo}`;
    } else if (targetDest?.name?.toLowerCase().includes("puri") || targetDest?.id?.includes("puri")) {
      airHi = "पुरी का सबसे नजदीकी एयरपोर्ट भुवनेश्वर (BBI) है, जो लगभग 60 किमी दूर है। वहाँ से सीधी कैब या बस से 1 घंटे में पुरी पहुँच सकते हैं।";
      airEn = "The nearest airport for Puri is Biju Patnaik International Airport in Bhubaneswar (BBI, 60 km), connected via direct highway cabs.";
    } else {
      airHi = `${destName} के नजदीकी एयरपोर्ट से सीधी प्री-पेड टैक्सी और एक्सप्रेस बसें उपलब्ध रहती हैं।`;
      airEn = `Direct prepaid cabs and state transport buses connect the nearest airport to ${destName}.`;
    }

    return { topic: "airport", text: isHindi ? airHi : airEn };
  }

  // 8. RAILWAY STATION / TRAINS
  if (/station|railway|train|gaadi|rail|स्टेशन|ट्रेन|रेलवे|गाड़ी/.test(q)) {
    const stn = intel?.nearestStation || targetDest?.nearestStation;
    let stnHi = "";
    let stnEn = "";

    if (stn) {
      const dist = stn.distanceKm ? `लगभग ${stn.distanceKm} किमी की दूरी पर है` : "";
      stnHi = `${destName} का मुख्य रेलवे स्टेशन ${stn.name || stn.code} ${dist}। यहाँ से मंदिर के लिए ई-रिक्शा और ऑटो आसानी से मिलते हैं।`;
      stnEn = `The main railhead for ${destName} is ${stn.name || stn.code} ${dist ? `(${stn.distanceKm} km away)` : ""} with easy auto and cab availability.`;
    } else {
      stnHi = `${destName} नजदीकी मुख्य जंक्शन से सुपरफास्ट और एक्सप्रेस ट्रेनों द्वारा देश के प्रमुख शहरों से अच्छी तरह जुड़ा है।`;
      stnEn = `${destName} is well-connected through express trains from major railway junctions across India.`;
    }

    return { topic: "train", text: isHindi ? stnHi : stnEn };
  }

  // 9. DRESS CODE / TEMPLE RULES
  if (/dress|code|kapde|rules|niyam|allowed|phone|camera|photography|ड्रेस|कपड़े|नियम|कैमरा|मोबाइल/.test(q)) {
    const dress = targetDest?.dressCode;
    let dressHi = "";
    let dressEn = "";

    if (dress) {
      dressHi = `${destName} में ड्रेस कोड: ${dress}। गर्भगृह के अंदर मोबाइल और चमड़े की वस्तुएं (बेल्ट, पर्स) ले जाना वर्जित है।`;
      dressEn = `Dress guidelines for ${destName}: ${dress}. Mobile phones and leather items are strictly prohibited inside the sanctum.`;
    } else {
      dressHi = "मंदिर परिसर में पारंपरिक और शालीन कपड़े (धोती-कुर्ता या पायजामा और महिलाओं के लिए साड़ी/सूट) पहनना अनिवार्य है।";
      dressEn = "Modest traditional attire is required at the shrine. Avoid shorts or sleeveless clothing, and deposit mobile phones at cloakrooms.";
    }

    return { topic: "dress_code", text: isHindi ? dressHi : dressEn };
  }

  // 10. SAFETY TIPS / CAUTIONS / SCAMS
  if (/safety|savdhan|bachein|scam|tout|dalal|panda|fraud|suraksha|दलाल|पंडा|सावधानी|सुरक्षा|बचें|ठगी/.test(q)) {
    let safeHi = `${destName} में मंदिर के बाहर अनधिकृत पंडों और दलालों से बचें। दर्शन पास, महाप्रसाद और पूजा केवल अधिकृत मंदिर ट्रस्ट काउंटर से ही बुक करें।`;
    let safeEn = `At ${destName}, avoid unauthorized touts outside shrines. Purchase prasadam and puja receipts solely from official trust counters.`;
    return { topic: "safety", text: isHindi ? safeHi : safeEn };
  }

  // 11. ROUTE & TRAVEL DISTANCE
  if (/route|rasta|km|kilometer|distance|door|duri|ghante|time|duration|raaste|दूरी|किमी|किलोमीटर|रास्ता|रूट/.test(q)) {
    let routeHi = `आपकी यात्रा ${originName} से ${destName} तक कुल ${roadKm} किलोमीटर की है, जिसमें सड़क मार्ग से लगभग ${duration} का समय लगेगा। नेशनल हाईवे मार्ग सुगम है।`;
    let routeEn = `Your journey from ${originName} to ${destName} spans about ${roadKm} km, taking approx ${duration} by highway.`;
    return { topic: "route", text: isHindi ? routeHi : routeEn };
  }

  // 12. BUDGET & CIRCUIT EXPENSES
  if (/budget|kharch|kharcha|paisa|cost|rate|rupaye|per person|price|fare|खर्च|बजट|पैसे|किराया/.test(q)) {
    let budHi = `${travellers} लोगों का सबसे सस्ता इकोनॉमी खर्च लगभग ₹${ecoCost.toLocaleString("en-IN")} है (प्रति व्यक्ति मात्र ₹${ecoPerPax.toLocaleString("en-IN")}), जिसमें स्लीपर ट्रेन, धर्मशाला और सात्विक भोजन शामिल है। बैलेंस्ड 3-AC प्लान ₹${balCost.toLocaleString("en-IN")} रहेगा।`;
    let budEn = `For ${travellers} travellers, economy budget starts at ₹${ecoCost.toLocaleString("en-IN")} (just ₹${ecoPerPax.toLocaleString("en-IN")} per person) covering train, dharamshala and meals. Balanced 3-AC plan is about ₹${balCost.toLocaleString("en-IN")}.`;
    return { topic: "budget", text: isHindi ? budHi : budEn };
  }

  // 13. SHOPPING / LOCAL MARKETS (Live Google Places Search)
  if (/market|shopping|bazaar|bazar|dukan|kharidari|हैंडलूम|दुकान|मार्केट|बाज़ार|बाजार|शॉपिंग|खरीदारी/.test(q)) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `best shopping market handicraft cloth near ${searchPlaceName}`,
        targetLat,
        targetLng,
        4
      );
      if (gRes.success && gRes.places && gRes.places.length > 0) {
        const topM = gRes.places[0];
        const secM = gRes.places[1];
        const shopHi = `${destName} के पास खरीदारी के लिए '${topM.name}' (${topM.rating ? topM.rating + "★" : "प्रसिद्ध"}) ${secM ? `और '${secM.name}'` : ""} सबसे प्रसिद्ध हैं, जहाँ पारंपरिक हस्तशिल्प और वस्त्र उचित दामों पर मिलते हैं।`;
        const shopEn = `Near ${destName}, top shopping destinations include '${topM.name}' (${topM.rating ? topM.rating + "★" : "popular"}) ${secM ? `and '${secM.name}'` : ""} for authentic handicrafts and handlooms.`;
        return { topic: "shopping", text: isHindi ? shopHi : shopEn, places: gRes.places };
      }
    } catch (e) {
      console.warn("Live market search error:", e);
    }
  }

  // 14. PARKING (Live Google Places Search)
  if (/parking|gaadi khadi|car parking|पार्किंग|गाड़ी खड़ी|पार्क/.test(q)) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `car parking near ${searchPlaceName}`,
        targetLat,
        targetLng,
        4
      );
      if (gRes.success && gRes.places && gRes.places.length > 0) {
        const topP = gRes.places[0];
        const parkHi = `${destName} के पास मुख्य और सुरक्षित कार पार्किंग '${topP.name}' है, जहाँ से मंदिर के लिए ई-रिक्शा और शटल सेवा आसानी से मिलती है।`;
        const parkEn = `Near ${destName}, the primary verified car parking is '${topP.name}', offering convenient shuttle and e-rickshaw connectivity to the shrine.`;
        return { topic: "parking", text: isHindi ? parkHi : parkEn, places: gRes.places };
      }
    } catch (e) {
      console.warn("Live parking search error:", e);
    }
  }

  // 15. HOSPITAL / MEDICAL EMERGENCY (Live Google Places Search)
  if (/hospital|doctor|medical|dawa|davai|अस्पताल|डॉक्टर|दवा|मेडिकल|इलाज/.test(q)) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `hospital medical emergency near ${searchPlaceName}`,
        targetLat,
        targetLng,
        4
      );
      if (gRes.success && gRes.places && gRes.places.length > 0) {
        const topH = gRes.places[0];
        const hospHi = `${destName} के पास आपातकालीन चिकित्सा सहायता के लिए '${topH.name}' (${topH.rating ? topH.rating + "★" : ""}) और मुख्य मार्ग पर 24 घंटे मेडिकल स्टोर्स उपलब्ध हैं।`;
        const hospEn = `Near ${destName}, the closest emergency medical facility is '${topH.name}' along with 24-hour pharmacies along the main corridor.`;
        return { topic: "medical", text: isHindi ? hospHi : hospEn, places: gRes.places };
      }
    } catch (e) {
      console.warn("Live medical search error:", e);
    }
  }

  // 16. BEACH / SEA / LAKE / GHATS (Live Google Places Search)
  if (/beach|samudra|sea|ghat|lake|बीच|समुद्र|तट|घाट|झील/.test(q)) {
    try {
      const gRes = await fetchGoogleLivePlaces(
        `famous beach lake ghat near ${searchPlaceName}`,
        targetLat,
        targetLng,
        4
      );
      if (gRes.success && gRes.places && gRes.places.length > 0) {
        const topB = gRes.places[0];
        const secB = gRes.places[1];
        const beachHi = `${destName} के पास दर्शनीय समुद्र तट और घाटों में '${topB.name}' (${topB.rating ? topB.rating + "★" : "प्रसिद्ध"}) ${secB ? `और '${secB.name}'` : ""} सबसे प्रमुख आकर्षण हैं।`;
        const beachEn = `Near ${destName}, notable water attractions include '${topB.name}' (${topB.rating ? topB.rating + "★" : "popular"}) ${secB ? `and '${secB.name}'` : ""}.`;
        return { topic: "beach", text: isHindi ? beachHi : beachEn, places: gRes.places };
      }
    } catch (e) {
      console.warn("Live beach search error:", e);
    }
  }

  // 17. SIGHTSEEING / NEARBY PLACES
  if (/nearby|aur kya|sightseeing|aas paas|aaspaas|dekhne|ghoomne|आस पास|आसपास|देखने|घूमने/.test(q)) {
    const nearby = targetDest?.nearbyPlaces;
    let sightHi = "";
    let sightEn = "";

    if (nearby && nearby.length > 0) {
      const names = nearby.slice(0, 3).map((n) => n.name).join(", ");
      sightHi = `${destName} के आसपास आप ${names} का भी भ्रमण कर सकते हैं, जो 1 से 2 घंटे के दायरे में स्थित हैं।`;
      sightEn = `Near ${destName}, notable attractions include ${names}, easily covered within half a day.`;
    } else {
      sightHi = `${destName} के मुख्य मंदिर के दर्शन के अलावा नजदीकी पवित्र कुंड, स्थानीय घाट और प्राचीन शक्ति स्थलों के दर्शन ज़रूर करें।`;
      sightEn = `Beyond the main shrine at ${destName}, explore nearby sacred water kunds, heritage ghats, and secondary shrines.`;
    }

    return { topic: "sightseeing", text: isHindi ? sightHi : sightEn };
  }

  // 18. HISTORY / SIGNIFICANCE / OVERVIEW
  if (/itihas|history|katha|story|significance|mahatva|famous|overview|kiske liye|महत्व|कथा|इतिहास|प्रसिद्ध/.test(q)) {
    const overview = targetDest?.overview || targetDest?.badge;
    let histHi = "";
    let histEn = "";

    if (overview) {
      histHi = `${destName}: ${overview.slice(0, 160)}... यह स्थान भारत के सबसे पवित्र तीर्थों में से एक माना जाता है।`;
      histEn = `${destName}: ${overview.slice(0, 160)}... It is celebrated as one of the most sacred pilgrimage centers in Bharat.`;
    } else {
      histHi = `${destName} एक अत्यंत प्राचीन और दिव्य तीर्थ स्थल है, जहाँ हर वर्ष लाखों श्रद्धालु दर्शन और आशीर्वाद के लिए आते हैं।`;
      histEn = `${destName} is an ancient holy pilgrimage center attracting millions of devotees annually.`;
    }

    return { topic: "history", text: isHindi ? histHi : histEn };
  }

  // 19. COMPREHENSIVE / DETAILED BREAKDOWN
  if (/poora|pura|detail|sab kuch|everything|full|all|विस्तार|पूरा|डिटेल/.test(q)) {
    let fullHi = `आपकी यात्रा ${originName} से ${destName} तक ${roadKm} किमी की है। दर्शन का समय प्रातः 05:00 से रात 11:30 बजे तक रहता है। ${travellers} लोगों का न्यूनतम बजट ₹${ecoCost} रहेगा, और ठहरने के लिए अधिकृत धर्मशालाएं सबसे उत्तम हैं।`;
    let fullEn = `Your journey from ${originName} to ${destName} covers ${roadKm} km. Sanctum doors are open morning to night, with economy budget starting at ₹${ecoCost} for ${travellers} travellers.`;
    return { topic: "detailed", text: isHindi ? fullHi : fullEn };
  }

  // 20. LIVE GOOGLE MAPS FALLBACK FOR ANY UNRECOGNIZED PLACE QUERY
  // (Whenever user asks a question the AI doesn't know, it searches Google Maps live!)
  if (q.length > 3) {
    try {
      const cleanQ = q.replace(/के पास|पास|बताओ|कहाँ है|क्या है|बताइए|प्लीज|please|near|where is|tell me|show me/g, "").trim();
      const gRes = await fetchGoogleLivePlaces(
        `${cleanQ || q} near ${searchPlaceName}`,
        targetLat,
        targetLng,
        4
      );

      if (gRes.success && gRes.places && gRes.places.length > 0) {
        const formatted = formatGenericPlacesAnswer({ places: gRes.places, destName, isHindi });
        if (formatted) {
          return {
            topic: "places_live",
            text: isHindi ? formatted.textHi : formatted.textEn,
            places: gRes.places
          };
        }
      }
    } catch (e) {
      console.warn("Live fallback place search error:", e);
    }
  }

  // 21. CONVERSATIONAL FALLBACK (Yavika Friendly Travel Companion)
  const companionHi = `मैं याविका, आपकी यात्रा में मदद के लिए तैयार हूँ! आप मुझसे ${destName} के ट्रेन समय, दर्शन, प्रसिद्ध खानपान, ठहरने के विकल्प, मौसम या बजट के बारे में कुछ भी पूछ सकते हैं।`;
  const companionEn = `I am Yavika, your AI travel companion for ${destName}! Feel free to ask about train travel hours, darshan timings, local food, stays, weather, or journey budget.`;

  return { topic: "general", text: isHindi ? companionHi : companionEn };
}

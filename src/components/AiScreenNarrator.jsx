import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Play,
  Pause,
  Square,
  Sparkles,
  Headphones,
  Compass,
  Coins,
  Hotel,
  CloudSun,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  Mic,
  MicOff,
  MessageSquare,
  Info,
  Send,
  Utensils,
  Clock,
  ExternalLink,
  Globe,
  Zap
} from "lucide-react";
import {
  speakText,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  startVoiceSearch,
  stopVoiceSearch,
  checkVoiceStudioHealth
} from "../services/voiceStudioService.js";
import { resolveDynamicVoiceAnswer } from "../services/voiceGuideAiService.js";
import {
  processOpenJarvisEccQuery,
  checkOpenJarvisHealth,
  eccMemory
} from "../services/openJarvisEccService.js";

/**
 * Natural Intent Parser for Voice Commands:
 * Matches spoken Hindi / Hinglish / English questions to focused answers.
 */
function parseVoiceCommandIntent(text) {
  if (!text || typeof text !== "string") return "summary";
  const q = text.toLowerCase().trim();

  // 1. Full detailed breakdown request
  if (/poora|pura|detail|sab kuch|everything|full|all|विस्तार|पूरा|डिटेल/.test(q)) {
    return "detailed";
  }

  // 2. Repeat / Replay request
  if (/repeat|again|fir se|phir se|dobara|wapas|दोबारा|फिर/.test(q)) {
    return "repeat";
  }

  // 3. Stay / Hotel / Accommodation (Checked before general budget so "hotel budget" goes to stay)
  if (/stay|hotel|room|dharamshala|ashram|rukna|rukne|kamra|lodge|guest house|होटल|धर्मशाला|रुकना|ठहर|कमरा|आश्रम/.test(q)) {
    return "stay";
  }

  // 4. Safety / Cautions / Scams
  if (/safety|caution|savdhan|bachein|scam|tout|dalal|fraud|dress|code|suraksha|दलाल|सावधानी|सुरक्षा|बचें|ड्रेस/.test(q)) {
    return "safety";
  }

  // 5. Route / Distance / Travel Time
  if (/route|rasta|km|kilometer|distance|door|duri|ghante|time|duration|raaste|दूरी|किमी|किलोमीटर|रास्ता|रूट/.test(q)) {
    return "route";
  }

  // 6. Budget / Cost / Price / Fare / Train / Transport fare
  if (/budget|kharch|kharcha|paisa|cost|rate|rupaye|sasta|cheapest|per person|price|fare|train|bus|cab|गाड़ी|किराया|खर्च|बजट|सस्ता|पैसे|ट्रेन|बस/.test(q)) {
    return "budget";
  }

  return "summary";
}

/**
 * Build concise, progressive answers (1–3 sentences each).
 * The assistant speaks ONLY the requested topic and NEVER dumps long text by default.
 */
function buildTopicResponses({
  language = "hi-IN",
  selectedStops = [],
  journeyOrigin = null,
  journeyRouteResult = null,
  activeBudget = null,
  activeDestination = null
}) {
  const isHindi = language.startsWith("hi");
  const originName = journeyOrigin?.name || (isHindi ? "वाराणसी (काशी)" : "Varanasi (Kashi)");

  // When no journey or stops are chosen yet
  if (!journeyRouteResult && selectedStops.length === 0 && !activeDestination) {
    const welcomeSpeechHi = "नमस्ते! मैं आपकी पर्सनल यात्रा असिस्टेंट हूँ। अपनी यात्रा शुरू करने के लिए कृपया प्रस्थान स्थल और दर्शनीय स्थल चुनें, फिर 'Calculate & Plan My Journey' पर क्लिक करें। मैं आपको पूरा रूट, बजट और स्टे गाइड करूँगी।";
    const welcomeSpeechEn = "Hello! I am your personal journey assistant. Please select your starting origin and destinations on the map. Once you click 'Calculate & Plan My Journey', I will give you a concise guide on route, budget, and stays.";

    return {
      isInitialState: true,
      summary: isHindi ? welcomeSpeechHi : welcomeSpeechEn,
      budget: isHindi
        ? "कृपया पहले प्रस्थान स्थल और गंतव्य चुनें, फिर मैं आपको सबसे सस्ता और बैलेंस्ड बजट बताऊँगी।"
        : "Please select destinations first, and I will calculate the cheapest and balanced budget for you.",
      route: isHindi
        ? `वर्तमान प्रस्थान स्थल ${originName} है। गंतव्य जोड़ते ही टर्न-बाय-टर्न दूरी तैयार हो जाएगी।`
        : `Current origin is ${originName}. Add destinations to calculate distance and driving times.`,
      stay: isHindi
        ? "गंतव्य चुनने के बाद मैं आपको मंदिर ट्रस्ट की अधिकृत धर्मशालाएं और साफ होटल्स की जानकारी दूँगी।"
        : "Once destinations are chosen, I will guide you to verified trust dharamshalas and hotels.",
      safety: isHindi
        ? "मंदिर के बाहर अनधिकृत दलालों से बचें और हमेशा अधिकृत काउंटर से ही दर्शन पास लें।"
        : "Strictly avoid unauthorized touts outside shrines and always use official trust counters.",
      detailed: isHindi ? welcomeSpeechHi : welcomeSpeechEn
    };
  }

  // When stops selected but route not calculated yet
  if (!journeyRouteResult && selectedStops.length > 0) {
    const names = selectedStops.map((s) => s.name).join(isHindi ? " और " : " and ");
    const waitHi = `आपने ${selectedStops.length} स्थान चुने हैं: ${names}। पूरा रूट और बजट अनलॉक करने के लिए कृपया 'Calculate & Plan My Journey' बटन दबाएं।`;
    const waitEn = `You have selected ${selectedStops.length} stops: ${names}. Click 'Calculate & Plan My Journey' to calculate your turn-by-turn route and complete budget.`;

    return {
      isInitialState: false,
      summary: isHindi ? waitHi : waitEn,
      budget: isHindi ? "बजट देखने के लिए 'Calculate & Plan My Journey' बटन दबाएं।" : "Click 'Calculate & Plan My Journey' to view budget.",
      route: isHindi ? `चुने गए स्थान: ${names}। रूट तैयार करने के लिए Calculate बटन दबाएं।` : `Selected: ${names}. Click Calculate to generate route.`,
      stay: isHindi ? "कहाँ रुकना सबसे अच्छा है, यह जानने के लिए पहले रूट कैलकुलेट करें।" : "Calculate the route first to see verified stay options.",
      safety: isHindi ? "हमेशा अधिकृत मंदिर काउंटर से ही दर्शन पास लें और पारंपरिक वेशभूषा पहनें।" : "Always buy passes at official counters and adhere to dress codes.",
      detailed: isHindi ? waitHi : waitEn
    };
  }

  // When route IS calculated OR inspecting a destination
  const primaryStop = activeDestination || (selectedStops.length > 0 ? selectedStops[0] : null);
  const lastStop = selectedStops.length > 0 ? selectedStops[selectedStops.length - 1] : primaryStop;
  const finalDestName = lastStop?.name || primaryStop?.name || (isHindi ? "गंतव्य" : "Destination");
  const stopNames = selectedStops.length > 0
    ? selectedStops.map((s) => s.name).join(isHindi ? " और " : " and ")
    : finalDestName;
  const destCount = selectedStops.length > 0 ? selectedStops.length : 1;

  // Key Destination Characteristics
  const combinedText = [
    primaryStop?.name || "",
    primaryStop?.city || "",
    primaryStop?.state || "",
    selectedStops.map((s) => `${s.name} ${s.city || ""}`).join(" ")
  ].join(" ").toLowerCase();

  const isHimalayan = /kedarnath|badrinath|gangotri|yamunotri|amarnath|tungnath|himalaya/.test(combinedText);
  const isChitrakoot = /chitrakoot|godavari|kamadgiri|ramghat/.test(combinedText);
  const isVaranasi = /varanasi|kashi|vishwanath/.test(combinedText);
  const isUjjain = /ujjain|mahakal/.test(combinedText);
  const isAyodhya = /ayodhya|ram mandir/.test(combinedText);
  const isTirupati = /tirupati|balaji/.test(combinedText);

  // Metrics
  const roadKm = journeyRouteResult?.totalRoadKm || activeBudget?.roadKm || (destCount * 250);
  const duration = journeyRouteResult?.totalDurationFormatted || activeBudget?.travelTimeFormatted || (isHindi ? "लगभग 5 से 6 घंटे" : "approx 5 to 6 hours");
  const travellers = activeBudget?.travellers || 2;
  const ecoCost = activeBudget?.plans?.economy?.totalCost || 2490;
  const balCost = activeBudget?.plans?.comfortable?.totalCost || activeBudget?.plans?.middle?.totalCost || 6860;
  const ecoPerPax = Math.round(ecoCost / travellers);
  const balPerPax = Math.round(balCost / travellers);

  // 1. DEFAULT SHORT SUMMARY (15–20 sec, 2–3 short sentences)
  const summaryHi = `आपकी यात्रा ${originName} से ${finalDestName} तक है। रास्ते में ${destCount} प्रमुख स्थान हैं और कुल दूरी लगभग ${roadKm} किलोमीटर है। सबसे किफायती बजट करीब ₹${ecoPerPax.toLocaleString("en-IN")} प्रति व्यक्ति है। क्या आप बजट या स्टे की पूरी जानकारी सुनना चाहेंगे?`;
  const summaryEn = `Your journey runs from ${originName} to ${finalDestName} across ${destCount} destination${destCount > 1 ? "s" : ""}, covering about ${roadKm} km. The economy plan starts at around ₹${ecoPerPax.toLocaleString("en-IN")} per person. Would you like to hear the budget or stay details?`;

  // 2. BUDGET ANSWER (15–25 sec, 2 sentences)
  const budgetHi = `${travellers} लोगों का सबसे सस्ता इकोनॉमी खर्च लगभग ₹${ecoCost.toLocaleString("en-IN")} है, यानी पर पर्सन मात्र ₹${ecoPerPax.toLocaleString("en-IN")}। इसमें स्लीपर ट्रेन या बस, ट्रस्ट धर्मशाला और भोजन शामिल है। अगर 3-AC ट्रेन और होटल वाला बैलेंस्ड प्लान चाहिए, तो कुल बजट लगभग ₹${balCost.toLocaleString("en-IN")} रहेगा।`;
  const budgetEn = `For ${travellers} travellers, the economy plan is around ₹${ecoCost.toLocaleString("en-IN")} total—just ₹${ecoPerPax.toLocaleString("en-IN")} per person, covering sleeper transit, trust dharamshala stay, and satvik meals. The balanced plan with 3-AC rail and hotels comes to about ₹${balCost.toLocaleString("en-IN")}.`;

  // 3. ROUTE / TRANSPORT ANSWER (15–20 sec, 2 sentences)
  const routeHi = `कुल सड़क दूरी लगभग ${roadKm} किलोमीटर है और कार या कैब से लगभग ${duration} का समय लगेगा। यह मार्ग नेशनल हाईवे से सुगम है, और नजदीकी मुख्य स्टेशन तक डायरेक्ट सुपरफास्ट ट्रेनें भी उपलब्ध हैं।`;
  const routeEn = `Your total road distance is about ${roadKm} km, taking around ${duration} by road. It connects smoothly via national highways, with direct express trains also running to the nearest railway junction.`;

  // 4. STAY ANSWER (15–25 sec, 2 sentences)
  let stayHi = "";
  let stayEn = "";
  if (isChitrakoot) {
    stayHi = "चित्रकूट में ठहरने के लिए आरोग्य धाम, जानकी कुण्ड आश्रम और कामदगिरि धर्मशाला सबसे शांत और सुरक्षित हैं (दरें ₹350 से ₹750)। रामघाट के पास ₹1,100 से ₹2,000 में अच्छे फैमिली होटल भी उपलब्ध हैं।";
    stayEn = "In Chitrakoot, trusted ashrams like Arogya Dham, Janki Kund Ashram, and Kamadgiri Trust Dharamshala provide serene, verified lodging (₹350 to ₹750/night). Family hotels near Ramghat cost ₹1,100 to ₹2,000.";
  } else if (isVaranasi) {
    stayHi = "वाराणसी में अन्नपूर्णा ट्रस्ट धर्मशाला, बिड़ला अतिथि भवन और कांची मठ सबसे भरोसेमंद और साफ हैं (दरें ₹400 से ₹800)। गोदौलिया के पास ₹1,400 से ₹2,500 में अच्छे एसी फैमिली होटल मिल जाते हैं।";
    stayEn = "In Varanasi, verified and clean stays are available at Annapurna Trust Dharamshala, Birla Guest House, and Kanchi Ashrams for ₹400 to ₹800. Private AC hotels near Godowlia range ₹1,400 to ₹2,500.";
  } else if (isUjjain) {
    stayHi = "उज्जैन में महाकाल मंदिर समिति के भक्त निवास और त्रिवेणी गेस्ट हाउस सबसे सुरक्षित हैं (दरें ₹500 से ₹900)। कमरे हमेशा मंदिर के अधिकृत काउंटर से ही बुक करें।";
    stayEn = "In Ujjain, Mahakaleshwar Temple Committee's Bhakta Niwas and Triveni Guest House offer safe lodging between ₹500 and ₹900. Always book through official counters.";
  } else if (isAyodhya) {
    stayHi = "अयोध्या में तीर्थ क्षेत्र पुरम, कारसेवकपुरम और गुजराती धर्मशाला सबसे सुरक्षित और शांत विकल्प हैं (दरें ₹400 से ₹800)। सरयू तट के पास अच्छे फैमिली होटल भी उपलब्ध हैं।";
    stayEn = "In Ayodhya, Teerth Kshetra Puram, Karsevakpuram, and trust ashrams offer secure and clean rooms for ₹400 to ₹800. Quality riverside hotels are also available.";
  } else if (isTirupati) {
    stayHi = "तिरुपति में टीटीडी के श्रीनिवासम और माधवं कॉम्प्लेक्स सर्वोत्तम हैं (दरें ₹500 से ₹1,000)। इन्हें ttdsevaonline पोर्टल से पहले ही बुक कर लेना चाहिए।";
    stayEn = "In Tirupati, official TTD complexes like Srinivasam and Madhavam offer verified rooms from ₹500 to ₹1,000. Book ahead via the official TTD portal.";
  } else if (isHimalayan) {
    stayHi = "पहाड़ी धामों में जीएमवीएन (GMVN) टूरिस्ट लॉज और काली कमली धर्मशाला सबसे सुरक्षित हैं (दरें ₹600 से ₹1,500)। पीक सीजन में ऑनलाइन एडवांस बुकिंग आवश्यक है।";
    stayEn = "In Himalayan shrines, official GMVN tourist bungalows and Kali Kamli Trust dharamshalas are the safest choices (₹600 to ₹1,500). Advance booking is essential.";
  } else {
    stayHi = "ठहरने के लिए संबंधित मंदिर ट्रस्ट की अधिकृत धर्मशालाएं और आश्रम सबसे शांत व किफायती होते हैं (दरें ₹400 से ₹800)। मंदिर के पास ₹1,200 से ₹2,200 में फैमिली होटल भी उपलब्ध हैं।";
    stayEn = "For lodging, authorized temple trust dharamshalas and ashrams offer safe, economical rooms (₹400 to ₹800). Clean family hotels nearby cost ₹1,200 to ₹2,200.";
  }

  // 5. SAFETY ANSWER (15–20 sec, 2 sentences)
  const localExtraHi = isChitrakoot ? " गुप्त गोदावरी गुफा में पानी का बहाव रहता है, इसलिए नॉन-स्लिप जूते या सैंडल पहनें।" : "";
  const localExtraEn = isChitrakoot ? " Inside Gupt Godavari caves, rocks are slick, so wear non-slip footwear." : "";
  const safetyHi = `मंदिर के बाहर वीआईपी दर्शन या विशेष पूजा का झांसा देने वाले अनधिकृत दलालों से पूरी तरह बचें। सुगम दर्शन पास केवल आधिकारिक काउंटर से लें और गर्भगृह में पारंपरिक वेशभूषा का पालन करें।${localExtraHi}`;
  const safetyEn = `Strictly avoid unauthorized touts outside offering fast VIP darshan passes. Always buy passes directly from official trust counters, and remember traditional attire is mandatory in the sanctum.${localExtraEn}`;

  // 6. FULL DETAILED BRIEFING (Only when explicitly asked for full details)
  const detailedHi = `नमस्ते! मैं आपको इस यात्रा का पूरा विस्तृत विवरण समझाती हूँ। ` +
    `रूट: ${originName} से ${stopNames} तक कुल दूरी ${roadKm} किमी है, जिसमें कार से लगभग ${duration} लगेंगे। ` +
    `बजट: ${travellers} लोगों का सबसे सस्ता इकोनॉमी खर्च ₹${ecoCost.toLocaleString("en-IN")} (₹${ecoPerPax.toLocaleString("en-IN")}/व्यक्ति) और बैलेंस्ड प्लान ₹${balCost.toLocaleString("en-IN")} है। ` +
    `ठहराव: ${stayHi} ` +
    `सावधानी: मंदिर के बाहर अनधिकृत दलालों से बचें और सुगम दर्शन टिकट ऑफिशियल काउंटर से ही लें। ` +
    `आपकी यात्रा मंगलमय और सुखद हो!`;

  const detailedEn = `Hello! Here is your complete detailed journey briefing. ` +
    `Route: From ${originName} to ${stopNames}, total distance is ${roadKm} km taking about ${duration} by road. ` +
    `Budget: For ${travellers} travellers, economy cost is ₹${ecoCost.toLocaleString("en-IN")} (₹${ecoPerPax.toLocaleString("en-IN")}/person) and balanced plan is ₹${balCost.toLocaleString("en-IN")}. ` +
    `Stay: ${stayEn} ` +
    `Safety: Avoid unauthorized middlemen outside temples and always purchase official darshan passes. ` +
    `Wishing you a blessed and safe journey!`;

  return {
    isInitialState: false,
    summary: isHindi ? summaryHi : summaryEn,
    budget: isHindi ? budgetHi : budgetEn,
    route: isHindi ? routeHi : routeEn,
    stay: isHindi ? stayHi : stayEn,
    safety: isHindi ? safetyHi : safetyEn,
    detailed: isHindi ? detailedHi : detailedEn
  };
}

/**
 * AI Screen Narrator (Live Voice Studio Explainer)
 * Concise, progressive, natural Hinglish personal assistant.
 */
export default function AiScreenNarrator({
  activeView = "home",
  selectedStops = [],
  journeyOrigin = null,
  journeyRouteResult = null,
  activeBudget = null,
  activeDestination = null,
  actions = null
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("hi-IN"); // hi-IN (Hinglish) | en-IN
  const [speechRate, setSpeechRate] = useState(1.15); // Fast but natural & normal fast conversational tempo (1.15x)
  const [isLocalVoiceEngine, setIsLocalVoiceEngine] = useState(false);
  const [isOpenJarvisActive, setIsOpenJarvisActive] = useState(false);
  const [currentActionNotice, setCurrentActionNotice] = useState(null);
  const [currentFocusEntity, setCurrentFocusEntity] = useState(null);
  const [autoNarrate, setAutoNarrate] = useState(true);
  const [activeTopic, setActiveTopic] = useState("summary"); // summary | budget | route | stay | safety | detailed
  const [lastNarratedKey, setLastNarratedKey] = useState(null);
  const [activeSpokenText, setActiveSpokenText] = useState("");
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [userQuery, setUserQuery] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [micNotice, setMicNotice] = useState(null);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [livePlacesFound, setLivePlacesFound] = useState([]);

  const autoNarrateTimerRef = useRef(null);

  // Check VoiceStudio and OpenJarvis local health on mount
  useEffect(() => {
    checkVoiceStudioHealth().then((isReady) => {
      setIsLocalVoiceEngine(isReady);
    });
    checkOpenJarvisHealth().then((res) => {
      setIsOpenJarvisActive(res.online);
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoNarrateTimerRef.current) clearTimeout(autoNarrateTimerRef.current);
      stopSpeech();
      stopVoiceSearch();
    };
  }, []);

  // Compute progressive topic responses
  const topicResponses = useMemo(() => {
    return buildTopicResponses({
      language,
      selectedStops,
      journeyOrigin,
      journeyRouteResult,
      activeBudget,
      activeDestination
    });
  }, [
    language,
    selectedStops,
    journeyOrigin,
    journeyRouteResult,
    activeBudget,
    activeDestination
  ]);

  // Unified speech executor
  const executeSpeech = (text, topic = "summary") => {
    if (!text) return;
    if (isSpeaking) {
      stopSpeech();
    }
    setIsPaused(false);
    setActiveTopic(topic);
    setActiveSpokenText(text);
    setLastSpokenText(text);

    speakText(text, {
      lang: language,
      rate: speechRate,
      volume: 1.0,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: (err) => {
        console.warn("[AiScreenNarrator] Speech error:", err);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    });
  };

  // Play short summary (default button)
  const handlePlaySummary = () => {
    setUserQuery(language.startsWith("hi") ? "संक्षिप्त सारांश (Short Summary)" : "Short Summary");
    executeSpeech(topicResponses.summary, "summary");
  };

  // Pause speech
  const handlePauseSpeech = () => {
    const ok = pauseSpeech();
    if (ok) {
      setIsPaused(true);
    } else {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // Resume speech
  const handleResumeSpeech = () => {
    const ok = resumeSpeech();
    if (ok) setIsPaused(false);
  };

  // Stop speech completely
  const handleStopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Repeat last spoken response
  const handleRepeatSpeech = () => {
    const textToRepeat = lastSpokenText || topicResponses.summary;
    executeSpeech(textToRepeat, activeTopic);
  };

  // Handle specific question click (Progressive Q&A)
  const handleAskTopic = async (topicKey) => {
    stopVoiceSearch();
    setIsListening(false);

    let queryLabel = "";
    if (topicKey === "budget") queryLabel = language.startsWith("hi") ? "खर्चा व बजट (Budget)" : "Budget & Costs";
    else if (topicKey === "route") queryLabel = language.startsWith("hi") ? "रूट व दूरी (Route)" : "Route & Travel";
    else if (topicKey === "food") queryLabel = language.startsWith("hi") ? "खानपान व प्रसाद (Food)" : "Food & Prasad";
    else if (topicKey === "timings") queryLabel = language.startsWith("hi") ? "दर्शन समय (Timings)" : "Darshan Timings";
    else if (topicKey === "weather") queryLabel = language.startsWith("hi") ? "मौसम (Best Season)" : "Weather & Season";
    else if (topicKey === "stay") queryLabel = language.startsWith("hi") ? "कहाँ रुकें? (Where to Stay)" : "Accommodation";
    else if (topicKey === "safety") queryLabel = language.startsWith("hi") ? "सेफ्टी टिप्स (Safety)" : "Safety Tips";
    else if (topicKey === "detailed") queryLabel = language.startsWith("hi") ? "पूरी डिटेल (Full Details)" : "Full Breakdown";
    else queryLabel = language.startsWith("hi") ? "संक्षिप्त सारांश" : "Summary";

    setUserQuery(queryLabel);
    setIsSearchingLive(true);

    try {
      const res = await processOpenJarvisEccQuery({
        query: topicKey,
        actions,
        language,
        selectedStops,
        activeDestination,
        journeyOrigin,
        journeyRouteResult,
        activeBudget,
        lastSpokenText
      });

      setIsSearchingLive(false);
      setLivePlacesFound(res.places || []);
      if (res.focusEntity) setCurrentFocusEntity(res.focusEntity);
      if (res.isAction) {
        setCurrentActionNotice(res.actionType);
        setTimeout(() => setCurrentActionNotice(null), 6000);
      }
      executeSpeech(res.text, topicKey);
    } catch (err) {
      setIsSearchingLive(false);
      console.warn("Topic Q&A error:", err);
    }
  };

  // Voice Command Listener (Speech to Text)
  const handleToggleVoiceInput = () => {
    if (isListening) {
      stopVoiceSearch();
      setIsListening(false);
      setLiveTranscript("");
      return;
    }

    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
    setMicNotice(null);
    setLiveTranscript("");
    setIsListening(true);

    const started = startVoiceSearch({
      lang: language,
      onInterim: (text) => {
        setLiveTranscript(text);
      },
      onResult: async (transcript) => {
        setIsListening(false);
        setLiveTranscript("");
        setMicNotice(null);
        setUserQuery(`"${transcript}"`);
        setIsSearchingLive(true);

        try {
          const res = await processOpenJarvisEccQuery({
            query: transcript,
            actions,
            language,
            selectedStops,
            activeDestination,
            journeyOrigin,
            journeyRouteResult,
            activeBudget,
            lastSpokenText
          });

          setIsSearchingLive(false);
          setLivePlacesFound(res.places || []);
          if (res.focusEntity) setCurrentFocusEntity(res.focusEntity);
          if (res.isAction) {
            setCurrentActionNotice(res.actionType);
            setTimeout(() => setCurrentActionNotice(null), 6000);
          }

          if (res.topic === "repeat") {
            handleRepeatSpeech();
          } else {
            executeSpeech(res.text, res.topic);
          }
        } catch (err) {
          setIsSearchingLive(false);
          console.warn("Voice command answer error:", err);
        }
      },
      onError: (err) => {
        console.warn("[VoiceSearch] Error:", err);
        setIsListening(false);
        setLiveTranscript("");
        const msg = typeof err === "object" && err?.message ? err.message : String(err);
        setMicNotice(msg);
        setTimeout(() => setMicNotice(null), 8000);
      },
      onEnd: () => {
        setIsListening(false);
        setLiveTranscript("");
      }
    });

    if (!started) {
      setIsListening(false);
      setLiveTranscript("");
    }
  };

  // Ask Question via text input (100% reliable in every browser)
  const handleAskTypedQuestion = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = (typedQuestion || "").trim();
    if (!query) return;

    stopVoiceSearch();
    setIsListening(false);
    setLiveTranscript("");
    setMicNotice(null);

    setUserQuery(`"${query}"`);
    setIsSearchingLive(true);

    try {
      const res = await processOpenJarvisEccQuery({
        query,
        actions,
        language,
        selectedStops,
        activeDestination,
        journeyOrigin,
        journeyRouteResult,
        activeBudget,
        lastSpokenText
      });

      setIsSearchingLive(false);
      setLivePlacesFound(res.places || []);
      if (res.focusEntity) setCurrentFocusEntity(res.focusEntity);
      if (res.isAction) {
        setCurrentActionNotice(res.actionType);
        setTimeout(() => setCurrentActionNotice(null), 6000);
      }

      if (res.topic === "repeat") {
        handleRepeatSpeech();
      } else {
        executeSpeech(res.text, res.topic);
      }
    } catch (err) {
      setIsSearchingLive(false);
      console.warn("Typed question answer error:", err);
    }
    setTypedQuestion("");
  };

  // Test Voice Audio
  const handleTestAudio = () => {
    const isHindi = language.startsWith("hi");
    const testPhrase = isHindi
      ? "नमस्ते! मैं याविका हूँ — आपकी AI यात्रा साथी और गाइड। आवाज़ स्पष्ट और तैयार है।"
      : "Hello! I am Yavika, your personal AI travel companion. Voice audio is crisp and ready.";
    setUserQuery(isHindi ? "वॉइस टेस्ट (याविका)" : "Voice Test (Yavika)");
    executeSpeech(testPhrase, "test");
  };

  // Switch language and re-announce concise summary
  const handleLanguageSwitch = (newLang) => {
    if (newLang === language) return;
    stopSpeech();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLanguage(newLang);

    setTimeout(() => {
      const freshResponses = buildTopicResponses({
        language: newLang,
        selectedStops,
        journeyOrigin,
        journeyRouteResult,
        activeBudget,
        activeDestination
      });
      setUserQuery(newLang.startsWith("hi") ? "संक्षिप्त सारांश" : "Short Summary");
      executeSpeech(freshResponses[activeTopic] || freshResponses.summary, activeTopic);
    }, 120);
  };

  // Auto-narrate ONLY when the journey route is calculated via "Calculate & Plan My Journey"
  // Speaks ONLY the 15-20 second short summary ONCE. Does not repeat on drag or unneeded UI events.
  useEffect(() => {
    if (!autoNarrate) return;
    if (!journeyRouteResult) return; // Strict requirement: Only trigger automatically when user calculates the route!

    const currentKey = `route-${journeyRouteResult.totalRoadKm}-${selectedStops.length}`;
    if (currentKey !== lastNarratedKey) {
      setLastNarratedKey(currentKey);
      if (autoNarrateTimerRef.current) clearTimeout(autoNarrateTimerRef.current);

      autoNarrateTimerRef.current = setTimeout(() => {
        setIsExpanded(true); // Open guide card so user sees assistant briefing
        const freshResponses = buildTopicResponses({
          language,
          selectedStops,
          journeyOrigin,
          journeyRouteResult,
          activeBudget,
          activeDestination
        });
        setUserQuery(language.startsWith("hi") ? "यात्रा सारांश (Journey Overview)" : "Journey Overview");
        executeSpeech(freshResponses.summary, "summary");
      }, 500);
    }
  }, [
    journeyRouteResult,
    selectedStops,
    autoNarrate,
    lastNarratedKey,
    language,
    journeyOrigin,
    activeBudget,
    activeDestination,
    speechRate
  ]);

  return (
    <div
      className="yavika-floating-container"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        pointerEvents: "auto"
      }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="yavika-panel-card"
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "360px",
              maxWidth: "calc(100vw - 36px)",
              background: "linear-gradient(145deg, rgba(7, 20, 15, 0.98) 0%, rgba(14, 30, 24, 0.96) 100%)",
              backdropFilter: "blur(18px)",
              border: "1.5px solid var(--gold-border, rgba(212, 175, 55, 0.38))",
              borderRadius: "14px",
              boxShadow: "0 12px 42px rgba(0, 0, 0, 0.65), 0 0 26px rgba(212, 175, 55, 0.22)",
              padding: "16px",
              color: "#f8fafc",
              marginBottom: "10px"
            }}
          >
            {/* Header: Personal Assistant & Status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "rgba(212, 175, 55, 0.2)",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fef3c7"
                  }}
                >
                  <UserCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#fef3c7", letterSpacing: "0.3px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>{language.startsWith("hi") ? "याविका (YAVIKA)" : "YAVIKA (AI Guide)"}</span>
                    <span style={{ fontSize: "8.5px", background: "rgba(212, 175, 55, 0.25)", color: "#fef3c7", padding: "1px 5px", borderRadius: "3px", border: "1px solid rgba(212, 175, 55, 0.4)", fontWeight: "700" }}>AI यात्रा साथी</span>
                  </div>
                  <div style={{ fontSize: "9px", color: isOpenJarvisActive ? "#6ee7b7" : "#a7f3d0", display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    {isOpenJarvisActive ? "Yavika Neural Core Active" : (isLocalVoiceEngine ? "OmniVoice + याविका Active" : "याविका वॉइस गाइड एक्टिव")}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                title="Minimize Guide"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Speaking / Listening Soundwave Bar */}
            {isListening ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  height: "26px",
                  marginBottom: "10px",
                  background: "rgba(14, 165, 233, 0.15)",
                  borderRadius: "6px",
                  padding: "0 10px",
                  border: "1px solid rgba(56, 189, 248, 0.35)"
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#38bdf8", display: "inline-block" }}
                />
                <span style={{ fontSize: "10.5px", color: "#e0f2fe", fontWeight: "800" }}>
                  {language.startsWith("hi") ? "सुन रही हूँ, पूछिए..." : "Listening, ask anything..."}
                </span>
              </div>
            ) : isSpeaking ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  height: "26px",
                  marginBottom: "10px",
                  background: isPaused ? "rgba(234, 179, 8, 0.12)" : "rgba(212, 175, 55, 0.12)",
                  borderRadius: "6px",
                  padding: "0 10px",
                  border: isPaused ? "1px solid rgba(234, 179, 8, 0.3)" : "1px solid rgba(212, 175, 55, 0.25)"
                }}
              >
                {[6, 14, 20, 10, 18, 12, 22, 16, 8, 14, 20, 6].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={isPaused ? { height: 4 } : { height: [4, h, 4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 3) * 0.15,
                      ease: "easeInOut"
                    }}
                    style={{
                      width: "3px",
                      background: isPaused ? "#facc15" : "linear-gradient(180deg, #d4af37 0%, #f59e0b 100%)",
                      borderRadius: "2px"
                    }}
                  />
                ))}
                <span style={{ fontSize: "10px", color: isPaused ? "#fef08a" : "#fef3c7", fontWeight: "700", marginLeft: "6px" }}>
                  {isPaused
                    ? (language.startsWith("hi") ? "रुका हुआ है (Paused)" : "Paused")
                    : (language.startsWith("hi") ? "बोल रही हूँ (15-30s)..." : "Speaking summary...")}
                </span>
              </div>
            ) : null}

            {/* Active Question / Topic Header */}
            {userQuery && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "9.5px",
                  color: "#e8c872",
                  fontWeight: "700",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px"
                }}
              >
                <MessageSquare size={11} className="text-amber-400" />
                <span>{userQuery}</span>
              </div>
            )}

            {/* OpenJarvis Action Execution Badge */}
            {currentActionNotice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  color: "#6ee7b7",
                  fontSize: "10px",
                  fontWeight: "800",
                  marginBottom: "6px"
                }}
              >
                <Zap size={11} className="text-emerald-400" />
                <span>⚡ याविका एक्शन: {currentActionNotice}</span>
              </motion.div>
            )}

            {/* ECC Episodic Memory Focus Tag */}
            {currentFocusEntity && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", color: "#cbd5e1", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "2px 6px", borderRadius: "4px", marginBottom: "6px" }}>
                <span style={{ color: "#d4af37" }}>📍 ECC Focus:</span>
                <span style={{ fontWeight: "700", color: "#fef3c7" }}>{currentFocusEntity.resolvedHindiName || currentFocusEntity.name}</span>
              </div>
            )}

            {/* Short Spoken Content Display (1-3 Sentences) */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.38)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "11px",
                lineHeight: "1.55",
                color: "#f1f5f9",
                maxHeight: "130px",
                overflowY: "auto",
                marginBottom: livePlacesFound && livePlacesFound.length > 0 ? "6px" : "10px"
              }}
            >
              {isSearchingLive ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontWeight: "600" }}>
                  <Globe size={13} className="animate-spin" />
                  <span>{language.startsWith("hi") ? "Google Maps से लाइव जानकारी खोजी जा रही है..." : "Fetching live data from Google Maps..."}</span>
                </div>
              ) : (
                activeSpokenText || topicResponses.summary
              )}
            </div>

            {/* Live Google Places Interactive Chips (Verified Places & Ratings) */}
            {livePlacesFound && livePlacesFound.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                {livePlacesFound.slice(0, 3).map((pl, idx) => (
                  <a
                    key={idx}
                    href={pl.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pl.name + ' ' + (pl.address || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={pl.address || pl.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "rgba(16, 185, 129, 0.16)",
                      border: "1px solid rgba(52, 211, 153, 0.35)",
                      borderRadius: "6px",
                      padding: "3px 7px",
                      color: "#a7f3d0",
                      fontSize: "9.5px",
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    <span>📍 {pl.name.length > 20 ? pl.name.slice(0, 20) + "..." : pl.name}</span>
                    {pl.rating && pl.rating !== "N/A" && (
                      <span style={{ color: "#facc15" }}>★{pl.rating}</span>
                    )}
                    <ExternalLink size={9} />
                  </a>
                ))}
              </div>
            )}

            {/* Progressive Quick Question Chips (Ask Assistant in 1-Click) */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", fontWeight: "700", color: "#94a3b8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                {language.startsWith("hi") ? "क्विक सवाल पूछें (Ask Assistant):" : "Ask Quick Questions:"}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollbarWidth: "none"
                }}
              >
                {[
                  { id: "route", labelHi: "रूट व दूरी", labelEn: "Route", icon: Compass },
                  { id: "budget", labelHi: "खर्चा कितना?", labelEn: "Budget", icon: Coins },
                  { id: "food", labelHi: "खानपान / प्रसाद", labelEn: "Food", icon: Utensils },
                  { id: "timings", labelHi: "दर्शन समय", labelEn: "Timings", icon: Clock },
                  { id: "weather", labelHi: "मौसम / Best Time", labelEn: "Weather", icon: CloudSun },
                  { id: "stay", labelHi: "कहाँ रुकें?", labelEn: "Stay", icon: Hotel },
                  { id: "safety", labelHi: "सेफ्टी टिप्स", labelEn: "Safety", icon: ShieldAlert },
                  { id: "detailed", labelHi: "पूरी डिटेल", labelEn: "Full Detail", icon: Info }
                ].map((chip) => {
                  const ChipIcon = chip.icon;
                  const isCur = activeTopic === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleAskTopic(chip.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        fontSize: "9.5px",
                        fontWeight: "700",
                        borderRadius: "20px",
                        border: "1px solid " + (isCur ? "#d4af37" : "rgba(255, 255, 255, 0.12)"),
                        background: isCur ? "rgba(212, 175, 55, 0.25)" : "rgba(255, 255, 255, 0.05)",
                        color: isCur ? "#fef3c7" : "#cbd5e1",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <ChipIcon size={10} className={isCur ? "text-amber-400" : "text-stone-400"} />
                      <span>{language.startsWith("hi") ? chip.labelHi : chip.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Listening Feedback Strip */}
            {isListening && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  background: "rgba(2, 132, 199, 0.22)",
                  border: "1px solid #38bdf8",
                  color: "#e0f2fe",
                  fontSize: "10.5px",
                  fontWeight: "700",
                  marginBottom: "8px"
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                    boxShadow: "0 0 8px #ef4444"
                  }}
                />
                <span style={{ flex: 1 }}>
                  {liveTranscript
                    ? `${language.startsWith("hi") ? "सुन रही हूँ" : "Hearing"}: "${liveTranscript}"`
                    : (language.startsWith("hi") ? "बोलिए, मैं सुन रही हूँ (उदा. 'रूट समझाओ', 'खर्चा कितना है')..." : "Listening... speak now (e.g. 'explain route', 'budget')...")}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    stopVoiceSearch();
                    setIsListening(false);
                    setLiveTranscript("");
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.25)",
                    border: "1px solid #ef4444",
                    color: "#fecaca",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "9px",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  {language.startsWith("hi") ? "रद्द करें" : "Cancel"}
                </button>
              </div>
            )}

            {/* Mic Notice (Brave / Permission / Network helper) */}
            {micNotice && (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  background: "rgba(234, 179, 8, 0.15)",
                  border: "1px solid rgba(234, 179, 8, 0.35)",
                  color: "#fef08a",
                  fontSize: "10px",
                  lineHeight: "1.4",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <ShieldAlert size={12} className="text-amber-400 shrink-0" />
                <span>{micNotice}</span>
              </div>
            )}

            {/* Ask Question Bar (Type or Ask Voice) */}
            <form
              onSubmit={handleAskTypedQuestion}
              style={{
                display: "flex",
                gap: "5px",
                marginBottom: "10px"
              }}
            >
              <input
                type="text"
                value={typedQuestion}
                onChange={(e) => setTypedQuestion(e.target.value)}
                placeholder={language.startsWith("hi") ? "याविका से पूछें (उदा. 'ट्रेन कितने घंटे में पहुँचाएगी')..." : "Ask Yavika (e.g. train duration, budget)..."}
                style={{
                  flex: 1,
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "6px",
                  padding: "6px 9px",
                  color: "#f8fafc",
                  fontSize: "10.5px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#d4af37",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "10.5px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Send size={11} />
                <span>{language.startsWith("hi") ? "पूछें" : "Ask"}</span>
              </button>
            </form>

            {/* Action Bar with Voice & Playback Controls */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              {!isSpeaking ? (
                <>
                  <button
                    type="button"
                    onClick={handlePlaySummary}
                    style={{
                      flex: 2,
                      background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
                      color: "#fef3c7",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "11px",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    <Play size={13} fill="#fef3c7" />
                    <span>{language.startsWith("hi") ? "संक्षिप्त सारांश सुनें" : "Play Short Summary"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    title={language.startsWith("hi") ? "माइक से बोलकर सवाल पूछें" : "Ask question by voice"}
                    style={{
                      flex: 1,
                      background: isListening ? "#0284c7" : "rgba(14, 165, 233, 0.15)",
                      color: isListening ? "#ffffff" : "#7dd3fc",
                      border: "1px solid " + (isListening ? "#38bdf8" : "rgba(56, 189, 248, 0.3)"),
                      borderRadius: "8px",
                      padding: "8px 8px",
                      fontSize: "10.5px",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                    <span>{isListening ? (language.startsWith("hi") ? "सुन रही हूँ" : "Listening") : (language.startsWith("hi") ? "बोलें" : "Ask Mic")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRepeatSpeech}
                    title={language.startsWith("hi") ? "पिछला जवाब दोबारा सुनें" : "Repeat last response"}
                    style={{
                      background: "rgba(212, 175, 55, 0.12)",
                      color: "#fef3c7",
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      borderRadius: "8px",
                      padding: "8px 8px",
                      fontSize: "10.5px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                </>
              ) : (
                <>
                  {/* Speaking Action Bar: Pause / Resume / Stop / Mic Interrupt */}
                  {!isPaused ? (
                    <button
                      type="button"
                      onClick={handlePauseSpeech}
                      style={{
                        flex: 1,
                        background: "rgba(234, 179, 8, 0.18)",
                        color: "#fef08a",
                        border: "1px solid rgba(234, 179, 8, 0.4)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        fontSize: "11px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        cursor: "pointer"
                      }}
                    >
                      <Pause size={13} />
                      <span>{language.startsWith("hi") ? "रोकें (Pause)" : "Pause"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResumeSpeech}
                      style={{
                        flex: 1,
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#a7f3d0",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        fontSize: "11px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        cursor: "pointer"
                      }}
                    >
                      <Play size={13} fill="#a7f3d0" />
                      <span>{language.startsWith("hi") ? "जारी रखें (Resume)" : "Resume"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleStopSpeaking}
                    style={{
                      flex: 1,
                      background: "#dc2626",
                      color: "#ffffff",
                      border: "1px solid #ef4444",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "11px",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      cursor: "pointer",
                      boxShadow: "0 2px 10px rgba(220, 38, 38, 0.4)"
                    }}
                  >
                    <Square size={13} fill="#ffffff" />
                    <span>{language.startsWith("hi") ? "बंद करें (Stop)" : "Stop"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    title={language.startsWith("hi") ? "बोलकर नया सवाल पूछें" : "Ask question by voice"}
                    style={{
                      background: isListening ? "#0284c7" : "rgba(14, 165, 233, 0.15)",
                      color: isListening ? "#ffffff" : "#7dd3fc",
                      border: "1px solid " + (isListening ? "#38bdf8" : "rgba(56, 189, 248, 0.3)"),
                      borderRadius: "8px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                  </button>
                </>
              )}
            </div>

            {/* Footer Options Strip: Language & Auto-Narrate */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "10px",
                fontSize: "10px"
              }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleLanguageSwitch("hi-IN")}
                  style={{
                    background: language === "hi-IN" ? "rgba(212, 175, 55, 0.3)" : "transparent",
                    color: language === "hi-IN" ? "#fef3c7" : "#94a3b8",
                    border: "1px solid " + (language === "hi-IN" ? "rgba(212, 175, 55, 0.6)" : "rgba(255, 255, 255, 0.1)"),
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Hinglish (हिंदी)
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSwitch("en-IN")}
                  style={{
                    background: language === "en-IN" ? "rgba(212, 175, 55, 0.3)" : "transparent",
                    color: language === "en-IN" ? "#fef3c7" : "#94a3b8",
                    border: "1px solid " + (language === "en-IN" ? "rgba(212, 175, 55, 0.6)" : "rgba(255, 255, 255, 0.1)"),
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate((r) => (r === 1.15 ? 1.25 : r === 1.25 ? 1.0 : 1.15))}
                  title="वॉइस गति बदलें (Voice Speed: 1x, 1.15x तेज़, 1.25x)"
                  style={{
                    background: "rgba(245, 158, 11, 0.2)",
                    color: "#fef3c7",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  ⚡ {speechRate}x {speechRate >= 1.15 ? "(तेज़)" : "(सामान्य)"}
                </button>
              </div>

              {/* Auto Explain Toggle */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  color: "#cbd5e1"
                }}
              >
                <input
                  type="checkbox"
                  checked={autoNarrate}
                  onChange={(e) => setAutoNarrate(e.target.checked)}
                  style={{ accentColor: "#d4af37", cursor: "pointer" }}
                />
                <span style={{ fontWeight: autoNarrate ? "700" : "400", color: autoNarrate ? "#fef3c7" : "#94a3b8" }}>
                  Auto-Explain
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Pill (Only shown when panel is collapsed) */}
      {!isExpanded && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setIsExpanded(true);
            handlePlaySummary();
          }}
          style={{
            background: isSpeaking
              ? "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)"
              : "linear-gradient(135deg, #091712 0%, #173829 100%)",
            color: "#fef3c7",
            border: "1.5px solid var(--gold-primary, #d4af37)",
            borderRadius: "50px",
            padding: "9px 16px",
            fontSize: "12px",
            fontWeight: "800",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            cursor: "pointer",
            boxShadow: isSpeaking
              ? "0 4px 20px rgba(220, 38, 38, 0.5), 0 0 16px rgba(220, 38, 38, 0.4)"
              : "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 16px rgba(212, 175, 55, 0.35)",
            backdropFilter: "blur(12px)",
            letterSpacing: "0.3px",
            flexShrink: 0
          }}
        >
          {isSpeaking ? (
            <>
              <Square size={13} fill="#ffffff" />
              <span>{language.startsWith("hi") ? "आवाज रोकें (Stop)" : "Stop Talking"}</span>
            </>
          ) : (
            <>
              <Headphones size={14} className="text-amber-400" />
              <span>{language.startsWith("hi") ? "याविका (YAVIKA)" : "YAVIKA (AI Guide)"}</span>
              <ChevronUp size={13} />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

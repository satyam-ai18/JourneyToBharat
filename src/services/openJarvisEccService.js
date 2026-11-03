/**
 * OpenJarvis + ECC Agentic Core (Journey to Bharat)
 * Inspired by:
 * - https://github.com/open-jarvis/OpenJarvis (Local-First Tool Execution & Autonomous Voice Agent)
 * - https://github.com/affaan-m/ecc (Agentic Harness, Episodic Context Memory & Skill Dispatcher)
 *
 * Capabilities:
 * 1. OpenJarvis Voice Tool Execution: Voice commands can interactively add stops, calculate routes,
 *    switch budget tiers, clear circuits, and inspect destinations on screen.
 * 2. ECC Episodic Context Memory: Retains conversational focus entity across multi-turn dialog
 *    (e.g., "वहाँ खाना कहाँ मिलेगा?" resolves to previously discussed shrine).
 * 3. ECC Skill Dispatcher: Routes seamlessly between Live Google Maps Places, Sacred Shrines,
 *    Highway Routing, and Algorithmic Budgeting.
 * 4. OpenJarvis Local Daemon Connector: Probes local OpenJarvis / Ollama daemon if running.
 */

import { MASTER_EXPLORER_DESTINATIONS } from "../data/masterExplorerData.js";
import { resolveDynamicVoiceAnswer } from "./voiceGuideAiService.js";

/**
 * ECC Episodic Memory System
 * Stores conversation turns, active focus shrine, and user preferences.
 */
class EccEpisodicMemory {
  constructor() {
    this.turns = [];
    this.focusEntity = null; // { id, name, resolvedHindiName, lat, lng }
    this.activeAction = null;
    this.userPreferences = {
      dietary: "pure_veg",
      budgetTier: "comfortable",
      preferredLanguage: "hi-IN"
    };
  }

  addTurn({ query, response, topic, places = [], action = null }) {
    this.turns.push({
      query,
      response,
      topic,
      places,
      action,
      timestamp: Date.now()
    });
    if (this.turns.length > 8) {
      this.turns.shift(); // Keep compact rolling window
    }
    if (action) {
      this.activeAction = action;
    }
  }

  setFocusEntity(entity) {
    if (!entity) return;
    this.focusEntity = {
      id: entity.id || entity.key || "puri",
      name: entity.name || "Jagannath Puri",
      resolvedHindiName: entity.resolvedHindiName || entity.name,
      lat: entity.lat || entity.latitude || 19.8049,
      lng: entity.lng || entity.longitude || 85.8179
    };
  }

  getFocusEntity() {
    return this.focusEntity;
  }

  getLastTurn() {
    return this.turns.length > 0 ? this.turns[this.turns.length - 1] : null;
  }

  clear() {
    this.turns = [];
    this.focusEntity = null;
    this.activeAction = null;
  }
}

// Global Singleton Memory Instance
export const eccMemory = new EccEpisodicMemory();

/**
 * OpenJarvis Local Server Connector
 * Probes whether a local OpenJarvis daemon (or Ollama/vLLM) is running on port 8000 or 11434.
 */
let isOpenJarvisDaemonOnline = false;

export async function checkOpenJarvisHealth(customUrl = null) {
  const targetUrl = customUrl || "http://localhost:8000/health";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      isOpenJarvisDaemonOnline = true;
      return { online: true, service: data.service || "OpenJarvis Local Neural Core" };
    }
  } catch {
    // Graceful offline fallback
    isOpenJarvisDaemonOnline = false;
  }
  return { online: false, service: "ECC Hyper-Fast Client Core" };
}

export function getOpenJarvisStatus() {
  return isOpenJarvisDaemonOnline;
}

/**
 * Finds destination matching query text or pronouns
 */
function resolveEntityFromText(queryText = "", focusEntity = null) {
  const q = (queryText || "").toLowerCase().trim();
  if (!q) return focusEntity;

  // 1. Check for pronouns: "वहाँ", "यहाँ", "इसको", "इसे", "it", "there", "this place"
  if (/वहाँ|यहाँ|इसको|इसे|इस जगह|वहां|यहाँ पर|it|there|this place|that place/.test(q) && focusEntity) {
    return focusEntity;
  }

  // 2. High-precision Sacred Aliases (Hindi + English)
  if (/पुरी|पूरी|जगन्नाथ|puri|jagannath/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("puri")) || {
      id: "jagannath_puri",
      name: "Jagannath Puri",
      resolvedHindiName: "श्री जगन्नाथ मंदिर, पुरी",
      lat: 19.8049,
      lng: 85.8179
    };
  }
  if (/काशी|वाराणसी|विश्वनाथ|बनारस|kashi|varanasi|vishwanath|banaras/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("kashi") || d.id?.includes("varanasi")) || {
      id: "kashi_vishwanath",
      name: "Kashi Vishwanath Mandir",
      resolvedHindiName: "श्री काशी विश्वनाथ, वाराणसी",
      lat: 25.3176,
      lng: 82.9739
    };
  }
  if (/अयोध्या|राम मंदिर|ayodhya|ram mandir/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("ayodhya")) || {
      id: "ayodhya_ram_mandir",
      name: "Ayodhya Ram Mandir",
      resolvedHindiName: "श्री राम जन्मभूमि मंदिर, अयोध्या",
      lat: 26.7922,
      lng: 82.1998
    };
  }
  if (/उज्जैन|महाकाल|ujjain|mahakal/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("ujjain")) || {
      id: "ujjain_mahakal",
      name: "Ujjain Mahakal",
      resolvedHindiName: "श्री महाकालेश्वर, उज्जैन",
      lat: 23.1765,
      lng: 75.7885
    };
  }
  if (/कोणार्क|सूर्य मंदिर|konark|sun temple/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("konark")) || {
      id: "konark_sun_temple",
      name: "Konark Sun Temple",
      resolvedHindiName: "कोणार्क सूर्य मंदिर",
      lat: 19.8876,
      lng: 86.0945
    };
  }
  if (/केदारनाथ|kedarnath/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("kedarnath"));
  }
  if (/बद्रीनाथ|badrinath/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("badrinath"));
  }
  if (/तिरुपति|बालाजी|tirupati|balaji/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("tirupati"));
  }
  if (/चित्रकूट|chitrakoot/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("chitrakoot"));
  }
  if (/सोमनाथ|somnath/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("somnath"));
  }
  if (/द्वारका|dwarka/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("dwarka"));
  }
  if (/हरिद्वार|haridwar/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("haridwar"));
  }
  if (/ऋषिकेश|rishikesh/.test(q)) {
    return MASTER_EXPLORER_DESTINATIONS.find((d) => d.id?.includes("rishikesh"));
  }

  // 3. Fallback to substring matching across master destinations (safe length check)
  const matched = MASTER_EXPLORER_DESTINATIONS.find((dest) => {
    const name = (dest.name || "").toLowerCase();
    const city = (dest.city || "").toLowerCase();
    const id = (dest.id || "").toLowerCase();
    return (name.length >= 3 && q.includes(name)) ||
           (city.length >= 3 && q.includes(city)) ||
           (id.length >= 3 && q.includes(id));
  });

  if (matched) return matched;

  return focusEntity;
}

/**
 * OpenJarvis Tool Calling / Action Execution Engine
 * Parses natural Hindi & English requests for UI actions and executes them.
 */
export async function executeOpenJarvisAction({
  query = "",
  actions = null,
  language = "hi-IN",
  selectedStops = [],
  activeDestination = null
}) {
  const isHindi = language.startsWith("hi");
  const q = (query || "").toLowerCase().trim();
  const currentFocus = eccMemory.getFocusEntity() || activeDestination || (selectedStops && selectedStops[0]);

  // 1. TOOL: ADD DESTINATION TO CIRCUIT (ACTION_ADD_STOP)
  if (/(जोड़ो|जोड़ो|ऐड करो|शामिल करो|डालो|रूट में डालो|यात्रा में डालो|add.*(stop|to|destination)|include)/i.test(q)) {
    const target = resolveEntityFromText(q, currentFocus);
    if (target && actions && typeof actions.addStop === "function") {
      try {
        await actions.addStop(target);
        eccMemory.setFocusEntity(target);
        const name = isHindi ? (target.resolvedHindiName || target.name) : target.name;
        const msg = isHindi
          ? `मैं याविका, ${name} को आपकी यात्रा में जोड़ दिया है!`
          : `I am Yavika, ${name} has been added to your journey circuit!`;

        eccMemory.addTurn({ query, response: msg, topic: "action_add", action: "ADD_STOP" });
        return {
          executed: true,
          actionType: "ADD_STOP",
          text: msg,
          targetName: name
        };
      } catch (e) {
        console.warn("Yavika addStop error:", e);
      }
    }
  }

  // 2. TOOL: CALCULATE & PLAN JOURNEY (ACTION_CALCULATE)
  if (/(कैलकुलेट|प्लान करो|रूट बनाओ|सफर प्लान करो|calculate.*(journey|route)|plan.*(journey|route))/i.test(q)) {
    if (actions && typeof actions.calculateJourney === "function") {
      try {
        actions.calculateJourney();
        const msg = isHindi
          ? "मैं याविका, आपकी यात्रा का रूट और बजट कैलकुलेट कर रही हूँ।"
          : "I am Yavika, calculating your journey route and budget.";

        eccMemory.addTurn({ query, response: msg, topic: "action_calculate", action: "CALCULATE_JOURNEY" });
        return {
          executed: true,
          actionType: "CALCULATE_JOURNEY",
          text: msg
        };
      } catch (e) {
        console.warn("Yavika calculateJourney error:", e);
      }
    }
  }

  // 3. TOOL: CLEAR ALL STOPS / RESET CIRCUIT (ACTION_CLEAR_ALL)
  if (/(सारे स्टॉप्स हटाओ|स्टॉप्स हटा दो|रीसेट करो|क्लियर करो|clear.*(all|stops|circuit)|reset.*journey)/i.test(q)) {
    if (actions && typeof actions.clearAll === "function") {
      try {
        actions.clearAll();
        eccMemory.clear();
        const msg = isHindi
          ? "मैं याविका, आपके सभी स्टॉप्स हटा दिए हैं। अब आप नए सिरे से यात्रा प्लान कर सकते हैं।"
          : "I am Yavika, all stops cleared. You can plan fresh.";

        return {
          executed: true,
          actionType: "CLEAR_CIRCUIT",
          text: msg
        };
      } catch (e) {
        console.warn("Yavika clearAll error:", e);
      }
    }
  }

  // 4. TOOL: SWITCH BUDGET TIER (ACTION_SET_BUDGET_TIER)
  if (/(बजट.*(सस्ता|इकोनॉमी|कम्फर्टेबल|मिड)|(economy|comfortable|cheapest).*budget|switch.*tier)/i.test(q)) {
    let targetTier = "comfortable";
    if (/सस्ता|इकोनॉमी|cheapest|economy/.test(q)) targetTier = "cheapest";
    else if (/मिड|बैलेंस्ड|कम्फर्टेबल|middle|comfortable/.test(q)) targetTier = "mid_budget";

    if (actions && typeof actions.setBudgetTier === "function") {
      try {
        actions.setBudgetTier(targetTier);
        const tierName = targetTier === "cheapest" ? (isHindi ? "इकोनॉमी" : "Economy") : (isHindi ? "कम्फर्टेबल" : "Comfortable");
        const msg = isHindi
          ? `मैं याविका, बजट प्लान को ${tierName} पर सेट कर दिया है।`
          : `I am Yavika, switched budget plan to ${tierName}.`;

        return {
          executed: true,
          actionType: "SET_BUDGET_TIER",
          text: msg
        };
      } catch (e) {
        console.warn("Yavika setBudgetTier error:", e);
      }
    }
  }

  // 5. TOOL: INSPECT DESTINATION ON SCREEN (ACTION_INSPECT)
  if (/(डिटेल दिखाओ|जानकारी खोलो|स्क्रीन पर दिखाओ|विस्तार दिखाओ|show.*details|inspect)/i.test(q)) {
    const target = resolveEntityFromText(q, currentFocus);
    if (target && actions && typeof actions.inspectDestination === "function") {
      try {
        actions.inspectDestination(target);
        const name = isHindi ? (target.resolvedHindiName || target.name) : target.name;
        const msg = isHindi
          ? `मैं याविका, ${name} का विस्तृत विवरण स्क्रीन पर खोल दिया है।`
          : `I am Yavika, displaying full information for ${name} on screen.`;

        return {
          executed: true,
          actionType: "INSPECT_DESTINATION",
          text: msg
        };
      } catch (e) {
        console.warn("Yavika inspect error:", e);
      }
    }
  }

  // Not an action command
  return { executed: false };
}

/**
 * Master OpenJarvis + ECC Conversational Engine
 * Combines Tool Calling, Episodic Memory, and Live Google Maps Intelligence.
 */
export async function processOpenJarvisEccQuery({
  query = "",
  actions = null,
  language = "hi-IN",
  selectedStops = [],
  activeDestination = null,
  journeyOrigin = null,
  journeyRouteResult = null,
  activeBudget = null,
  lastSpokenText = ""
}) {
  const isHindi = language.startsWith("hi");
  const q = (query || "").trim();

  // 1. Check if query is an OpenJarvis Tool Action (Add stop, calculate, clear, switch tier)
  const actionResult = await executeOpenJarvisAction({
    query: q,
    actions,
    language,
    selectedStops,
    activeDestination
  });

  if (actionResult.executed) {
    return {
      topic: "jarvis_action",
      text: actionResult.text,
      isAction: true,
      actionType: actionResult.actionType,
      targetName: actionResult.targetName || null
    };
  }

  // 2. Resolve entity from ECC memory if pronouns are used ("वहाँ खाना कहाँ मिलेगा?")
  let contextualTarget = activeDestination;
  const rememberedFocus = eccMemory.getFocusEntity();
  if (/वहाँ|यहाँ|इसको|इसे|इस जगह|वहां|it|there|that place/.test(q.toLowerCase()) && rememberedFocus) {
    contextualTarget = rememberedFocus;
  }

  // 3. Dispatch to ECC Skill Router via voiceGuideAiService (powered by live Google Maps Places API)
  const aiAnswer = await resolveDynamicVoiceAnswer({
    query: q,
    language,
    selectedStops,
    activeDestination: contextualTarget,
    journeyOrigin,
    journeyRouteResult,
    activeBudget,
    lastSpokenText
  });

  // 4. Update ECC Episodic Memory with this turn
  const resolvedEntity = resolveEntityFromText(q, contextualTarget || (selectedStops && selectedStops[0]));
  if (resolvedEntity) {
    eccMemory.setFocusEntity(resolvedEntity);
  }

  eccMemory.addTurn({
    query: q,
    response: aiAnswer.text,
    topic: aiAnswer.topic,
    places: aiAnswer.places || []
  });

  return {
    ...aiAnswer,
    focusEntity: eccMemory.getFocusEntity()
  };
}

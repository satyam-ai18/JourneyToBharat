/**
 * VoiceStudio Integration Service (debpalash/VoiceStudio)
 * Multi-Engine Architecture:
 * 1. VoiceStudio Local REST API (http://localhost:3900)
 * 2. Guaranteed HD Human Audio Stream (Natural pronunciation in Hindi & English)
 * 3. Browser-Native Web Speech API (Offline fallback)
 */

const VOICE_STUDIO_HOST = "http://localhost:3900";

let activeAudioElement = null;
let activeAudioQueue = [];
let isPlayingQueue = false;
let activeRecognition = null;
if (typeof window !== "undefined") {
  window.__jbActiveRecognition = null;
}
let isVoiceStudioAvailable = false;
let hasCheckedBackend = false;

/**
 * Check if local VoiceStudio desktop service is active
 */
export async function checkVoiceStudioHealth() {
  if (typeof window === "undefined" || (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")) {
    isVoiceStudioAvailable = false;
    hasCheckedBackend = true;
    return false;
  }
  if (hasCheckedBackend) return isVoiceStudioAvailable;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`${VOICE_STUDIO_HOST}/health`, {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });
    clearTimeout(timer);
    isVoiceStudioAvailable = res.ok;
  } catch {
    isVoiceStudioAvailable = false;
  } finally {
    hasCheckedBackend = true;
  }
  return isVoiceStudioAvailable;
}

// Cached Voices Management
let cachedVoices = [];

function updateVoices() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
    }
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

async function getReadyVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices && cachedVoices.length > 0) return cachedVoices;
  updateVoices();
  if (cachedVoices.length > 0) return cachedVoices;

  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        updateVoices();
        resolve(cachedVoices);
      }
    }, 250);

    const handler = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        updateVoices();
        resolve(cachedVoices);
      }
    };
    try {
      window.speechSynthesis.addEventListener("voiceschanged", handler, { once: true });
    } catch {
      window.speechSynthesis.onvoiceschanged = handler;
    }
  });
}

/**
 * Pick highest quality voice: Natural/Neural Hindi for Edge/Chrome,
 * or Indian English if no Hindi voice is installed.
 */
function pickBestVoice(voices, lang = "hi-IN", text = "") {
  if (!voices || voices.length === 0) return null;
  const isHindi = (lang && lang.startsWith("hi")) || /[\u0900-\u097F]/.test(text);

  if (isHindi) {
    // 1. Natural / Neural Hindi voices (Edge Microsoft Swara/Madhur/Hemant, Chrome Google हिन्दी)
    const naturalHindi = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      const isHi = vLang.startsWith("hi") || vName.includes("hindi") || (v.name && v.name.includes("हिन्दी"));
      return isHi && (vName.includes("natural") || vName.includes("online") || vName.includes("neural") || vName.includes("swara") || vName.includes("madhur") || vName.includes("google"));
    });
    if (naturalHindi) return naturalHindi;

    // 2. Any Hindi voice (Kalpana, Android hi-in, iOS Lekha)
    const anyHindi = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return vLang.startsWith("hi") || vLang.includes("hi-in") || vName.includes("hindi") || (v.name && v.name.includes("हिन्दी"));
    });
    if (anyHindi) return anyHindi;

    // 3. Natural Indian English (Neerja, Prabhat, Google Indian English)
    const naturalIndianEn = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return (vLang.includes("en-in") || vName.includes("india")) && (vName.includes("natural") || vName.includes("online") || vName.includes("neerja") || vName.includes("prabhat") || vName.includes("google"));
    });
    if (naturalIndianEn) return naturalIndianEn;

    // 4. Any Indian English
    const anyIndianEn = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return vLang.includes("en-in") || vName.includes("india");
    });
    if (anyIndianEn) return anyIndianEn;

    // 5. Natural English
    const naturalEn = voices.find((v) => (v.name || "").toLowerCase().includes("natural") || (v.name || "").toLowerCase().includes("online"));
    if (naturalEn) return naturalEn;

    return voices[0];
  } else {
    // English target: prefer Indian English Natural
    const naturalIndianEn = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return (vLang.includes("en-in") || vName.includes("india")) && (vName.includes("natural") || vName.includes("online") || vName.includes("neerja") || vName.includes("prabhat") || vName.includes("google"));
    });
    if (naturalIndianEn) return naturalIndianEn;

    const anyIndianEn = voices.find((v) => {
      const vLang = (v.lang || "").toLowerCase();
      const vName = (v.name || "").toLowerCase();
      return vLang.includes("en-in") || vName.includes("india");
    });
    if (anyIndianEn) return anyIndianEn;

    const naturalEn = voices.find((v) => (v.name || "").toLowerCase().includes("natural") || (v.name || "").toLowerCase().includes("online"));
    if (naturalEn) return naturalEn;

    return voices[0];
  }
}

// Phonetic fallback mapping if OS has zero Hindi voices installed
const DEVA_MAP = {
  '\u0905':'a','\u0906':'aa','\u0907':'i','\u0908':'ee','\u0909':'u','\u090A':'oo','\u090B':'ri',
  '\u090F':'e','\u0910':'ai','\u0913':'o','\u0914':'au',
  '\u0915':'k','\u0916':'kh','\u0917':'g','\u0918':'gh','\u0919':'ng',
  '\u091A':'ch','\u091B':'chh','\u091C':'j','\u091D':'jh','\u091E':'ny',
  '\u091F':'t','\u0920':'th','\u0921':'d','\u0922':'dh','\u0923':'n',
  '\u0924':'t','\u0925':'th','\u0926':'d','\u0927':'dh','\u0928':'n',
  '\u092A':'p','\u092B':'ph','\u092C':'b','\u092D':'bh','\u092E':'m',
  '\u092F':'y','\u0930':'r','\u0932':'l','\u0935':'v','\u0936':'sh','\u0937':'sh','\u0938':'s','\u0939':'h',
  '\u093E':'aa','\u093F':'i','\u0940':'ee','\u0941':'u','\u0942':'oo','\u0943':'ri',
  '\u0947':'e','\u0948':'ai','\u094B':'o','\u094C':'au','\u0902':'n','\u0901':'n','\u094D':'','\u0964':'.'
};

function transliterateForNonHindiVoice(text) {
  if (!text) return "";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);
    if (code >= 0x0915 && code <= 0x0939) {
      const next = text[i + 1];
      const nextCode = next ? next.charCodeAt(0) : 0;
      const isMatra = (nextCode >= 0x093E && nextCode <= 0x094C) || nextCode === 0x094D;
      out += DEVA_MAP[ch] || ch;
      if (!isMatra) {
        out += "a";
      }
    } else {
      out += DEVA_MAP[ch] !== undefined ? DEVA_MAP[ch] : ch;
    }
  }
  return out;
}

/**
 * Split text into safe, bite-sized clause chunks (max 75 characters)
 * Android Chrome has a hard buffer / ~15-second cutoff per SpeechSynthesisUtterance.
 * Keeping chunks <= 75 chars (~3 to 4 seconds each) completely eliminates Android midway cutoff bugs.
 */
function splitIntoSafeChunks(text, maxLen = 75) {
  if (!text || typeof text !== "string") return [];
  const rawParts = text.match(/[^।!?,.;:\n]+[।!?,.;:\n]+|[^।!?,.;:\n]+$/g) || [text];
  const chunks = [];
  let current = "";

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (!current) {
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        const words = trimmed.split(/\s+/);
        let sub = "";
        for (const w of words) {
          if (!sub) {
            sub = w;
          } else if ((sub + " " + w).length <= maxLen) {
            sub += " " + w;
          } else {
            chunks.push(sub);
            sub = w;
          }
        }
        if (sub) current = sub;
      }
    } else {
      if ((current + " " + trimmed).length <= maxLen) {
        current += " " + trimmed;
      } else {
        chunks.push(current);
        if (trimmed.length <= maxLen) {
          current = trimmed;
        } else {
          const words = trimmed.split(/\s+/);
          let sub = "";
          for (const w of words) {
            if (!sub) {
              sub = w;
            } else if ((sub + " " + w).length <= maxLen) {
              sub += " " + w;
            } else {
              chunks.push(sub);
              sub = w;
            }
          }
          current = sub;
        }
      }
    }
  }

  if (current) chunks.push(current);
  return chunks.filter(Boolean);
}

// Detect mobile device
const isMobileDevice = typeof navigator !== "undefined" && 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Active utterance pool to prevent V8 garbage collection sweeps on mobile & desktop
if (typeof window !== "undefined") {
  window.__activeUtterancePool = new Set();
}

/**
 * Mobile-Safe & Desktop-Safe High-Definition Web Speech Narrator
 * Uses sequential clause chaining with watchdog timer to guarantee continuous full playback.
 */
async function speakNativeWebSpeechSequence(text, options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (options.onError) options.onError(new Error("Speech synthesis not supported"));
    return;
  }

  stopSpeech();
  const sessionId = ++currentSpeechSession;

  // Tiny 50ms pause gives Chromium internal audio queue time to flush cancel()
  await new Promise((r) => setTimeout(r, 50));
  if (sessionId !== currentSpeechSession) return;

  const voices = await getReadyVoices();
  if (sessionId !== currentSpeechSession) return;

  const isHindi = (options.lang && options.lang.startsWith("hi")) || /[\u0900-\u097F]/.test(text);
  const voice = pickBestVoice(voices, options.lang || (isHindi ? "hi-IN" : "en-IN"), text);

  const isNonHindiVoice = isHindi && voice &&
    !(voice.lang || "").toLowerCase().startsWith("hi") &&
    !(voice.name || "").toLowerCase().includes("hindi") &&
    !(voice.name || "").includes("हिन्दी");

  const cleanText = isNonHindiVoice ? transliterateForNonHindiVoice(text) : text;

  // Split into short, natural clauses under 75 characters
  const chunks = splitIntoSafeChunks(cleanText, 75);

  if (chunks.length === 0) {
    if (options.onEnd) options.onEnd();
    return;
  }

  const rate = options.rate || 1.15; // Natural crisp conversational tempo
  const pitch = options.pitch || 1.0;
  const volume = options.volume !== undefined ? options.volume : 1.0;

  if (options.onStart) options.onStart();

  for (let i = 0; i < chunks.length; i++) {
    if (sessionId !== currentSpeechSession) return;
    const chunkText = chunks[i];

    await new Promise((resolve) => {
      if (sessionId !== currentSpeechSession) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);

      // Retain in window & Set to prevent V8 garbage collection mid-speech
      window.__activeUtterance = utterance;
      if (typeof window !== "undefined" && window.__activeUtterancePool) {
        window.__activeUtterancePool.add(utterance);
      }

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || (isHindi ? "hi-IN" : "en-IN");
      } else {
        utterance.lang = isHindi ? "hi-IN" : "en-IN";
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      let settled = false;
      let watchdogTimer = null;

      const finishChunk = () => {
        if (settled) return;
        settled = true;
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
        if (typeof window !== "undefined" && window.__activeUtterancePool) {
          window.__activeUtterancePool.delete(utterance);
        }
        resolve();
      };

      utterance.onend = finishChunk;
      utterance.onerror = (err) => {
        console.warn("[WebSpeech] Chunk event:", err?.error || err);
        finishChunk();
      };

      // Watchdog fallback: If Android Chrome misses onend or audio stalls,
      // force advance so the queue NEVER freezes!
      const timeoutMs = Math.max(5000, Math.ceil(chunkText.length * 130));
      watchdogTimer = setTimeout(finishChunk, timeoutMs);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("[WebSpeech] speak failed:", e);
        finishChunk();
      }
    });
  }

  if (sessionId === currentSpeechSession) {
    window.__activeUtterance = null;
    if (options.onEnd) options.onEnd();
  }
}

/**
 * Master Speech Dispatcher:
 * Tries VoiceStudio -> Guaranteed HD Human Audio Stream -> Web Speech API
 * @param {string} text - Text to speak
 * @param {object} options - { onStart, onEnd, onError, rate, pitch, voiceName, lang }
 */
export async function speakText(text, options = {}) {
  if (!text || typeof text !== "string") return;
  stopSpeech();

  const isHindi = (options.lang && options.lang.startsWith("hi")) || /[\u0900-\u097F]/.test(text);
  const isLocalhost = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  // On localhost only: Check if local VoiceStudio desktop service is active
  if (isLocalhost && isVoiceStudioAvailable) {
    try {
      if (options.onStart) options.onStart();
      const res = await fetch(`${VOICE_STUDIO_HOST}/v1/audio/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "tts-1",
          voice: options.voiceName || (isHindi ? "alloy" : "nova"),
          input: text,
          response_format: "mp3"
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        activeAudioElement = new Audio(audioUrl);
        activeAudioElement.playbackRate = options.rate || 1.15;
        activeAudioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          if (options.onEnd) options.onEnd();
        };
        activeAudioElement.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          speakNativeWebSpeechSequence(text, {
            rate: 1.15,
            ...options
          });
        };
        await activeAudioElement.play();
        return;
      }
    } catch {
      // Fallback
    }
  }

  // Instant high-definition sequence for GitHub Pages & modern browsers (Edge Swara/Madhur, Chrome Google Hindi)
  return speakNativeWebSpeechSequence(text, {
    rate: 1.15,
    ...options
  });
}

/**
 * Stop any running voice narration
 */
export function stopSpeech() {
  currentSpeechSession++;
  isPlayingQueue = false;
  activeAudioQueue = [];
  if (typeof window !== "undefined" && window.__activeUtterancePool) {
    window.__activeUtterancePool.clear();
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {}
    activeAudioElement = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    window.__activeUtterance = null;
  }
}

/**
 * Pause active speech
 */
export function pauseSpeech() {
  if (activeAudioElement && !activeAudioElement.paused) {
    try {
      activeAudioElement.pause();
      return true;
    } catch {}
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      // Android Chrome treats pause() as cancel(), so mobile stops cleanly
      if (isMobileDevice) {
        stopSpeech();
        return false;
      }
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        return true;
      }
    } catch {}
  }
  return false;
}

/**
 * Resume paused speech
 */
export function resumeSpeech() {
  if (activeAudioElement && activeAudioElement.paused) {
    try {
      activeAudioElement.play();
      return true;
    } catch {}
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        return true;
      }
    } catch {}
  }
  return false;
}

/**
 * Generate sacred audio guide narrative for a destination
 * @param {object} dest - Destination object
 * @returns {string} - Narration script
 */
export function buildDestinationAudioGuide(dest) {
  if (!dest) return "";
  const name = dest.name || "पवित्र तीर्थ";
  const state = dest.state || dest.city || "भारत";
  const desc = dest.description || dest.significance || "यह भारत का अत्यंत प्राचीन और पावन तीर्थ स्थल है।";
  const deity = dest.deity ? `मुख्य आराध्य देव: ${dest.deity}। ` : "";
  const bestTime = dest.best_time_to_visit ? `दर्शन का उत्तम समय: ${dest.best_time_to_visit}। ` : "";
  const tip = dest.travel_tips ? `यात्रा सुझाव: ${dest.travel_tips}। ` : "";

  return `प्रणाम। यात्रा टू भारत पवित्र ऑडियो गाइड में आपका स्वागत है। ` +
         `आज हम दर्शन कर रहे हैं ${name}, जो ${state} में स्थित है। ` +
         `${deity}` +
         `${desc} ` +
         `${bestTime}` +
         `${tip}` +
         `यहाँ दर्शन कर श्रद्धालु परम शांति और आध्यात्मिक ऊर्जा प्राप्त करते हैं।`;
}

/**
 * Generate audio route briefing narrative for a planned journey
 * @param {object} routeSummary - { distanceKm, durationText, stops, budgetTier }
 * @returns {string} - Route narrative
 */
export function buildRouteAudioBriefing(routeSummary) {
  if (!routeSummary) return "";
  const dist = routeSummary.distanceKm ? `${routeSummary.distanceKm} किलोमीटर` : "";
  const time = routeSummary.durationText || "";
  const stops = Array.isArray(routeSummary.stops) ? routeSummary.stops.join(" से होकर ") : "चुने गए तीर्थ";
  const budget = routeSummary.totalBudget ? `अनुमानित यात्रा व्यय लगभग ₹${routeSummary.totalBudget} है।` : "";

  return `जय श्री राम। आपकी तीर्थ यात्रा का मार्ग विवरण इस प्रकार है: ` +
         `कुल यात्रा दूरी ${dist}, अनुमानित यात्रा समय ${time} है। ` +
         `यह यात्रा मार्ग ${stops} को जोड़ता है। ` +
         `${budget} ` +
         `यात्रा के दौरान सुरक्षित रहें और अपनी यात्रा का आनंद लें। शुभ यात्रा!`;
}

/**
 * Start hands-free voice search using Speech Recognition
 * Resilient multi-browser implementation with interim live feedback and mic permission check.
 * @param {object} callbacks - { onResult(transcript), onInterim(liveText), onError(err), onEnd() }
 * @returns {Promise<boolean>} - Whether voice recognition started
 */
export async function startVoiceSearch({ onResult, onInterim, onError, onEnd, lang = "hi-IN" } = {}) {
  const SpeechRecognition = typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!SpeechRecognition) {
    if (onError) {
      onError({
        code: "unsupported",
        message: "इस ब्राउज़र में स्पीच रिकॉग्निशन उपलब्ध नहीं है। कृपया नीचे सवाल लिखें या बटन दबाएँ।"
      });
    }
    return false;
  }

  // Request mic permission explicitly if available
  if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately so SpeechRecognition can take over
      stream.getTracks().forEach(track => track.stop());
    } catch (permErr) {
      console.warn("[VoiceSearch] Mic permission denied:", permErr);
      if (onError) {
        onError({
          code: "permission-denied",
          message: "माइक्रोफ़ोन अनुमति नहीं मिली। कृपया ब्राउज़र में Mic Allow करें या नीचे सवाल टाइप करें।"
        });
      }
      return false;
    }
  }

  try {
    stopVoiceSearch();

    const recognition = new SpeechRecognition();
    activeRecognition = recognition;
    if (typeof window !== "undefined") {
      window.__jbActiveRecognition = recognition;
    }

    recognition.lang = lang; // Defaults to hi-IN, also recognizes English spoken naturally
    recognition.continuous = true; // Keep listening so user has time to finish sentence
    recognition.interimResults = true; // Real-time live transcript

    let finalTranscript = "";
    let silenceTimer = null;
    let liveLatestText = "";

    const resetSilenceTimer = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        // User finished speaking for 1.2s -> finalize and stop
        if (finalTranscript.trim() || liveLatestText.trim()) {
          try {
            recognition.stop();
          } catch {}
        }
      }, 1200);
    };

    recognition.onstart = () => {
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript + " ";
        } else {
          interim += item[0].transcript;
        }
      }
      finalTranscript = final.trim();
      liveLatestText = (final + interim).trim();
      if (onInterim && liveLatestText) {
        onInterim(liveLatestText);
      }
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        // Harmless silence event, ignore and keep waiting
        return;
      }
      console.warn("[VoiceSearch] Recognition error:", event.error);
      if (silenceTimer) clearTimeout(silenceTimer);

      const isNetwork = event.error === "network";
      const isNotAllowed = event.error === "not-allowed";
      const userFriendlyMsg = isNetwork
        ? "ब्राउज़र ने Google Speech सर्विस को ब्लॉक किया है (Brave)। नीचे सवाल लिखकर पूछें या बटन दबाएँ।"
        : (isNotAllowed ? "माइक्रोफ़ोन अनुमति ब्लॉक है। कृपया Address bar से Mic allow करें।" : `आवाज़ पहचानने में समस्या आई (${event.error})`);

      if (onError) {
        onError({
          code: event.error,
          message: userFriendlyMsg
        });
      }
    };

    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      activeRecognition = null;
      if (typeof window !== "undefined") {
        window.__jbActiveRecognition = null;
      }
      const resultText = (finalTranscript.trim() || liveLatestText.trim());
      if (resultText && onResult) {
        onResult(resultText);
      } else if (onEnd) {
        onEnd();
      }
    };

    recognition.start();
    return true;
  } catch (err) {
    if (onError) {
      onError({
        code: "exception",
        message: err?.message || "वॉइस पहचान शुरू नहीं हो सकी"
      });
    }
    return false;
  }
}

/**
 * Stop active voice search
 */
export function stopVoiceSearch() {
  try {
    if (typeof activeRecognition !== "undefined" && activeRecognition) {
      try {
        activeRecognition.abort();
      } catch {}
      activeRecognition = null;
    }
  } catch {}
  if (typeof window !== "undefined" && window.__jbActiveRecognition) {
    try {
      window.__jbActiveRecognition.abort();
    } catch {}
    window.__jbActiveRecognition = null;
  }
}


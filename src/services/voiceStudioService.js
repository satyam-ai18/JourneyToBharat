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
  if (hasCheckedBackend) return isVoiceStudioAvailable;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 600);
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

/**
 * Split narrative into natural 140-160 char chunks for smooth audio buffering
 */
function splitTextIntoChunks(text, maxLen = 150) {
  if (!text || text.length <= maxLen) return [text || ""];
  const sentences = text.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [text];
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).trim().length <= maxLen) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length > maxLen) {
        const words = trimmed.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub + " " + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) current = sub;
        else current = "";
      } else {
        current = trimmed;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter(Boolean);
}

/**
 * Browser Native Web Speech fallback (offline or fallback)
 */
function speakNativeWebSpeech(text, options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (options.onError) options.onError(new Error("Speech synthesis not supported"));
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(text);
  window.__activeUtterance = utterance; // Prevent garbage collection in Chromium

  const lang = options.lang || (text.match(/[\u0900-\u097F]/) ? "hi-IN" : "en-IN");
  utterance.lang = lang;
  utterance.rate = options.rate || 1.03; // Crisp, clear, natural conversational tempo
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = 1.0; // Full volume clarity

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    let matchedVoice = null;
    if (lang.startsWith("hi")) {
      // Prioritize natural/neural human Hindi voices
      matchedVoice = voices.find(v => (v.lang === "hi-IN" || v.lang.startsWith("hi")) && 
        (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Swara") || v.name.includes("Madhur") || v.name.includes("Online"))) ||
        voices.find(v => v.lang === "hi-IN" || v.lang.startsWith("hi"));
    } else {
      // Prioritize natural Indian English or warm neural English voices
      matchedVoice = voices.find(v => (v.lang === "en-IN" || v.name.includes("India")) && 
        (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Neerja") || v.name.includes("Prabhat") || v.name.includes("Online"))) ||
        voices.find(v => v.lang === "en-IN" || v.name.includes("India")) ||
        voices.find(v => (v.lang.startsWith("en-GB") || v.lang.startsWith("en-US")) && (v.name.includes("Natural") || v.name.includes("Google"))) ||
        voices.find(v => v.lang.startsWith("en-GB") || v.lang.startsWith("en-US") || v.lang.startsWith("en"));
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onstart = () => {
    if (options.onStart) options.onStart();
  };

  utterance.onend = () => {
    window.__activeUtterance = null;
    if (options.onEnd) options.onEnd();
  };

  utterance.onerror = (err) => {
    window.__activeUtterance = null;
    console.warn("[WebSpeech] Synthesizer error:", err);
    if (options.onError) options.onError(err);
  };

  // Chromium resume bug fix
  setTimeout(() => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("[WebSpeech] Speak failed:", e);
      if (options.onError) options.onError(e);
    }
  }, 10);
}

/**
 * Sequential HD Audio Player
 */
function playAudioQueue(chunks, langCode, options = {}) {
  stopSpeech();
  activeAudioQueue = [...chunks];
  isPlayingQueue = true;

  if (options.onStart) options.onStart();

  function playNext() {
    if (!isPlayingQueue || activeAudioQueue.length === 0) {
      isPlayingQueue = false;
      if (options.onEnd) options.onEnd();
      return;
    }

    const chunk = activeAudioQueue.shift();
    const url = `/api/tts?lang=${encodeURIComponent(langCode)}&text=${encodeURIComponent(chunk)}`;
    const audio = new Audio(url);
    activeAudioElement = audio;
    audio.playbackRate = options.rate || 1.03;
    audio.volume = 1.0; // High, crisp volume

    audio.onended = () => {
      // Natural breath pause between sentences
      setTimeout(() => {
        playNext();
      }, 60);
    };

    let hasHandledError = false;
    const handleAudioFailure = (err) => {
      if (hasHandledError) return;
      hasHandledError = true;
      console.warn("[VoiceStudio] Local audio endpoint fallback to Web Speech:", err);
      isPlayingQueue = false;
      speakNativeWebSpeech(chunk, options);
    };

    audio.onerror = handleAudioFailure;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(handleAudioFailure);
    }
  }

  playNext();
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
  const langCode = isHindi ? "hi" : "en";

  // Check if VoiceStudio desktop service is active
  if (isVoiceStudioAvailable) {
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
        activeAudioElement.playbackRate = options.rate || 1.0;
        activeAudioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          if (options.onEnd) options.onEnd();
        };
        activeAudioElement.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          const chunks = splitTextIntoChunks(text, 150);
          playAudioQueue(chunks, langCode, options);
        };
        await activeAudioElement.play();
        return;
      }
    } catch {
      // Fallback
    }
  }

  // Primary Guaranteed HD Audio Engine (Crystal-clear human voice, works on Brave, Chrome, Safari, Firefox)
  const chunks = splitTextIntoChunks(text, 150);
  try {
    playAudioQueue(chunks, langCode, {
      ...options,
      lang: isHindi ? "hi-IN" : "en-IN"
    });
  } catch (err) {
    console.warn("[VoiceStudio] Audio queue init failed, using Web Speech:", err);
    speakNativeWebSpeech(text, {
      ...options,
      lang: isHindi ? "hi-IN" : "en-IN"
    });
  }
}

/**
 * Stop any running voice narration
 */
export function stopSpeech() {
  isPlayingQueue = false;
  activeAudioQueue = [];
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
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += " " + event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      liveLatestText = (finalTranscript + " " + interim).trim();
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


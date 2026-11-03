import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Compass,
  Navigation,
  Train,
  Clock,
  Car,
  Footprints,
  Bike,
  Route as RouteIcon,
  Filter,
  Check,
  Plus,
  Trash2,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Info,
  Sparkles,
  Heart,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Share2,
  Copy,
  CornerDownRight,
  Flag,
  Radio,
  Zap,
  CheckCircle2,
  Globe,
  Star,
  Bookmark,
  BookmarkCheck,
  Phone,
  Building2,
  Wallet,
  Users,
  BedDouble,
  Utensils,
  Mic,
  MicOff,
  Volume2,
  Square,
  User,
  Smile,
  ShieldCheck
} from "lucide-react";

import { sanitizeUrl } from "../utils/securityUtils.js";
import {
  speakText,
  stopSpeech,
  buildDestinationAudioGuide,
  startVoiceSearch,
  stopVoiceSearch
} from "../services/voiceStudioService.js";

import { resolveDestinationQuery } from "../services/destinationSearchService.js";
import { discoverNearbyForDestination } from "../services/smartNearbyDiscoveryService.js";
import {
  calculateSmartRoute,
  calculateBearing,
  decodeGooglePolyline
} from "../services/smartRoutePlannerService.js";
import { calculateHaversineKm } from "../services/distanceService.js";
import {
  MASTER_EXPLORER_DESTINATIONS,
  searchSavedDestinationsDatabase
} from "../data/masterExplorerData.js";
import { VARANASI_ORIGIN } from "../data/varanasiData.js";
import { findNearbyRailwayStationsForDestination } from "../services/railwayStationService.js";
import {
  searchUniversalDestinations,
  fetchGooglePlaceDetails,
  saveCustomDestination,
  removeCustomDestination,
  getCustomSavedDestinations
} from "../services/universalDestinationService.js";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK } from "../utils/imageFallback";
import {
  generateAiTravelPlan,
  calculateRailwayFaresByDistance,
  calculateBusOptionsByDistance,
  detectLocationCostTier,
  LOCATION_COST_INDEX,
  analyzeLegTransit,
  calculateRequiredRooms
} from "../services/aiTravelPlannerService.js";
import IntegratedRouteBudgetDashboard from "./IntegratedRouteBudgetDashboard";

// Fix default leaflet marker icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Category Pin Icons for Leaflet with subtle pulse and highlight animations
const createLeafletPin = (type, isOrigin = false, stopNumber = null, isHighlighted = false, isNextTarget = false, isGoogleDiscovered = false) => {
  const highlightClass = isHighlighted ? " highlighted-leaflet-pin" : "";
  const pulseClass = isNextTarget ? " pulse-next-marker" : "";

  if (isOrigin) {
    return L.divIcon({
      className: `origin-star-pin${highlightClass}${pulseClass}`,
      html: `
        <div style="
          background: linear-gradient(135deg, #d4af37 0%, #996515 100%);
          color: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 19px;
          line-height: 1;
          border: 3px solid #ffffff;
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.95), 0 4px 12px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          ★
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -22]
    });
  }

  if (stopNumber !== null) {
    const bgGradient = isGoogleDiscovered
      ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
      : "linear-gradient(135deg, #059669 0%, #064e3b 100%)";

    return L.divIcon({
      className: `numbered-stop-pin${highlightClass}${pulseClass}`,
      html: `
        <div style="
          background: ${bgGradient};
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        ">
          ${stopNumber}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  // Category based regular pins (Professional Vector SVGs)
  let color = isGoogleDiscovered ? "#0284c7" : "#059669";
  let iconSvg = isGoogleDiscovered
    ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
    : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

  if (type === "temples" || type === "temple" || type === "jyotirlingas" || type === "chardham" || type === "hindu_temple") {
    color = "#b45309";
    iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><path d="M12 2v20M2 12h20M7 7l10 10M17 7 7 17"/></svg>`;
  } else if (type === "historical" || type === "historical_landmark") {
    color = "#991b1b";
    iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m12 2 8 5H4z"/><line x1="6" y1="10" x2="6" y2="21"/><line x1="10" y1="10" x2="10" y2="21"/><line x1="14" y1="10" x2="14" y2="21"/><line x1="18" y1="10" x2="18" y2="21"/></svg>`;
  } else if (type === "nature" || type === "park" || type === "natural_feature") {
    color = "#15803d";
    iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;
  } else if (type === "museums" || type === "museum") {
    color = "#6b21a8";
    iconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2"><path d="m19 11-8-8-8 8"/><path d="M5 21V11"/><path d="M19 21V11"/></svg>`;
  }

  return L.divIcon({
    className: `category-leaflet-pin${highlightClass}`,
    html: `
      <div style="
        background: ${color};
        color: #ffffff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        cursor: pointer;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        ${iconSvg}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

// Shortest-path angular interpolation for vehicle heading rotation (Zero Jitter)
const lerpAngle = (start, end, factor) => {
  let diff = ((end - start) % 360 + 540) % 360 - 180;
  return (start + diff * factor + 360) % 360;
};

// High-Definition Animated Vehicle GPS Beacon Marker (Professional Vector SVG)
const createVehicleIcon = (heading = 0, travelMode = "DRIVE") => {
  let vehicleSvg = "";
  if (travelMode === "TWO_WHEELER") {
    vehicleSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fef3c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
  } else if (travelMode === "WALK") {
    vehicleSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fef3c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="m9 20 3-6 3 6"/><path d="m6 10 6 2 6-2"/></svg>`;
  } else if (travelMode === "TRAIN") {
    vehicleSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fef3c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`;
  } else {
    vehicleSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fef3c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
  }

  return L.divIcon({
    className: "animated-vehicle-leaflet-marker",
    html: `
      <div class="nav-vehicle-beacon">
        <div class="nav-vehicle-radar-pulse"></div>
        <div class="nav-vehicle-rotator" style="transform: rotate(${heading}deg);">
          <div class="nav-vehicle-pointer"></div>
          <div class="nav-vehicle-core">
            ${vehicleSvg}
          </div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
};

export default function SmartNearbyExplorer({
  initialDestination = null,
  onOpenDetail = null,
  onToggleFavorite = null,
  savedFavorites = [],
  onUpdateNarratorContext = null
}) {
  // Navigation State
  const [journeyOrigin, setJourneyOrigin] = useState(VARANASI_ORIGIN);
  const [journeySearchInput, setJourneySearchInput] = useState("");
  const [universalSearchResults, setUniversalSearchResults] = useState([]);
  const [isSearchingUniversal, setIsSearchingUniversal] = useState(false);
  const [selectedJourneyStops, setSelectedJourneyStops] = useState([]);

  // VoiceStudio AI Voice & Speech Recognition State
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [isPlayingAudioGuide, setIsPlayingAudioGuide] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
      stopVoiceSearch();
    };
  }, []);

  const handleToggleVoiceSearch = () => {
    if (isListeningVoice) {
      stopVoiceSearch();
      setIsListeningVoice(false);
    } else {
      setIsListeningVoice(true);
      showToast("VoiceStudio Listening... Speak destination name (e.g. Kedarnath, Chitrakoot, Kashi)");
      const started = startVoiceSearch({
        onResult: (transcript) => {
          setJourneySearchInput(transcript);
          setIsListeningVoice(false);
          showToast(`VoiceStudio Recognized: "${transcript}"`);
        },
        onError: (err) => {
          setIsListeningVoice(false);
          showToast(`VoiceStudio: ${err.message || err}`, "error");
        },
        onEnd: () => {
          setIsListeningVoice(false);
        }
      });
      if (!started) {
        setIsListeningVoice(false);
        showToast("Voice recognition not supported in this browser. Please use Chrome/Edge.", "error");
      }
    }
  };

  const handleToggleAudioGuide = (dest) => {
    if (isPlayingAudioGuide) {
      stopSpeech();
      setIsPlayingAudioGuide(false);
      showToast("Stopped VoiceStudio Audio Guide");
    } else {
      const text = buildDestinationAudioGuide(dest);
      setIsPlayingAudioGuide(true);
      showToast(`Playing VoiceStudio Audio Guide for ${dest.name}...`);
      speakText(text, {
        onStart: () => setIsPlayingAudioGuide(true),
        onEnd: () => setIsPlayingAudioGuide(false),
        onError: () => setIsPlayingAudioGuide(false)
      });
    }
  };

  // Travel Mode: DRIVE | TWO_WHEELER | WALK | TRAIN
  const [journeyTravelMode, setJourneyTravelMode] = useState("DRIVE");
  const [journeyRouteResult, setJourneyRouteResult] = useState(null);
  const [isCalculatingJourney, setIsCalculatingJourney] = useState(false);
  const [journeyOptimizeOrder, setJourneyOptimizeOrder] = useState(false);

  // Map controls
  const [showAllIndiaMarkers, setShowAllIndiaMarkers] = useState(false);
  const [focusedJourneyStopId, setFocusedJourneyStopId] = useState(null);
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);
  const [activeBaseLayer, setActiveBaseLayer] = useState("roadmap");
  const [expandedLegIndex, setExpandedLegIndex] = useState(0);

  // Custom Saved Places List
  const [customSavedList, setCustomSavedList] = useState(() => getCustomSavedDestinations());

  // Animation Engine State
  const [animState, setAnimState] = useState("idle");
  const [animProgressPercent, setAnimProgressPercent] = useState(0);
  const [animSpeed, setAnimSpeed] = useState(2);
  const [animCurrentIndex, setAnimCurrentIndex] = useState(0);
  const [activeLegNumber, setActiveLegNumber] = useState(1);
  const [nextTargetStop, setNextTargetStop] = useState(null);

  // Integrated Universal Budget Engine States (Accurate Group & Passenger Multipliers)
  const [groupType, setGroupType] = useState("couple"); // 'solo', 'friends', 'girls', 'couple', 'family', 'group'
  const [budgetAdults, setBudgetAdults] = useState(2);
  const [budgetChildren, setBudgetChildren] = useState(0);
  const [budgetInfants, setBudgetInfants] = useState(0);
  const [roomCountOverride, setRoomCountOverride] = useState(null);
  const [budgetDurationDays, setBudgetDurationDays] = useState(3);
  const [budgetStartDate, setBudgetStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [budgetTier, setBudgetTier] = useState("comfortable"); // 'cheapest', 'comfortable' (Recommended), 'mid_budget', 'custom'
  const [customBudgetPreferences, setCustomBudgetPreferences] = useState({
    accommodation: "comfortable",
    food: "comfortable",
    localTransport: "comfortable",
    intercity: "comfortable"
  });
  const [isCustomBudgetOpen, setIsCustomBudgetOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Total passengers helper
  const budgetTravellers = budgetAdults + budgetChildren + budgetInfants;

  const handleGroupTypeChange = (newType) => {
    setGroupType(newType);
    setRoomCountOverride(null);
    if (newType === "solo") {
      setBudgetAdults(1);
      setBudgetChildren(0);
      setBudgetInfants(0);
    } else if (newType === "couple") {
      setBudgetAdults(2);
      setBudgetChildren(0);
      setBudgetInfants(0);
    } else if (newType === "family") {
      setBudgetAdults(2);
      if (budgetChildren === 0) setBudgetChildren(2);
      setBudgetInfants(0);
    } else if (newType === "friends" || newType === "girls") {
      if (budgetAdults < 2) setBudgetAdults(2);
      setBudgetChildren(0);
      setBudgetInfants(0);
    } else if (newType === "group") {
      if (budgetAdults < 4) setBudgetAdults(4);
    }
  };

  // Auto-sync duration with stops count if not customized
  useEffect(() => {
    if (selectedJourneyStops.length > 0) {
      setBudgetDurationDays(Math.max(2, selectedJourneyStops.length + 1));
    }
  }, [selectedJourneyStops.length]);

  // Integrated Budget Memo (Single Source of Truth from Route Geometry)
  const integratedBudget = useMemo(() => {
    if (!selectedJourneyStops || selectedJourneyStops.length === 0) return null;
    try {
      const resolvedTier = budgetTier === "cheapest" || budgetTier === "economy"
        ? "economy"
        : budgetTier === "mid_budget" || budgetTier === "middle"
        ? "middle"
        : "comfortable";

      return generateAiTravelPlan({
        origin: journeyOrigin,
        destinations: selectedJourneyStops,
        travellers: budgetAdults + budgetChildren + budgetInfants,
        adults: budgetAdults,
        children: budgetChildren,
        infants: budgetInfants,
        groupType,
        roomCountOverride,
        durationDays: budgetDurationDays,
        preferredTier: resolvedTier,
        budgetCategory: budgetTier,
        customPreferences: budgetTier === "custom" ? customBudgetPreferences : null,
        startDate: budgetStartDate,
        travelDate: budgetStartDate,
        actualRoadKm: journeyRouteResult?.totalRoadKm || null,
        actualRouteLegs: journeyRouteResult?.legs || null
      });
    } catch (err) {
      console.error("Error generating integrated route budget:", err);
      return null;
    }
  }, [
    selectedJourneyStops,
    journeyOrigin,
    journeyRouteResult,
    budgetAdults,
    budgetChildren,
    budgetInfants,
    groupType,
    roomCountOverride,
    budgetDurationDays,
    budgetTier,
    customBudgetPreferences,
    budgetStartDate
  ]);

  // Parallel 3-tier budgets for card comparison
  const tierBudgets = useMemo(() => {
    if (!selectedJourneyStops || selectedJourneyStops.length === 0) return null;
    try {
      const commonArgs = {
        origin: journeyOrigin,
        destinations: selectedJourneyStops,
        travellers: budgetAdults + budgetChildren + budgetInfants,
        adults: budgetAdults,
        children: budgetChildren,
        infants: budgetInfants,
        groupType,
        roomCountOverride,
        durationDays: budgetDurationDays,
        startDate: budgetStartDate,
        travelDate: budgetStartDate,
        actualRoadKm: journeyRouteResult?.totalRoadKm || null,
        actualRouteLegs: journeyRouteResult?.legs || null
      };
      const cheapest = generateAiTravelPlan({
        ...commonArgs,
        preferredTier: "economy",
        budgetCategory: "cheapest"
      });
      const comfortable = generateAiTravelPlan({
        ...commonArgs,
        preferredTier: "comfortable",
        budgetCategory: "comfortable"
      });
      const midBudget = generateAiTravelPlan({
        ...commonArgs,
        preferredTier: "middle",
        budgetCategory: "mid_budget"
      });
      return { cheapest, comfortable, midBudget };
    } catch (err) {
      console.error("Error calculating tier budgets:", err);
      return null;
    }
  }, [
    selectedJourneyStops,
    journeyOrigin,
    journeyRouteResult,
    budgetAdults,
    budgetChildren,
    budgetInfants,
    groupType,
    roomCountOverride,
    budgetDurationDays,
    budgetStartDate
  ]);

  // Sync state & OpenJarvis action executor to global Live AI Screen Narrator
  useEffect(() => {
    if (typeof onUpdateNarratorContext === "function") {
      onUpdateNarratorContext({
        selectedStops: selectedJourneyStops,
        journeyOrigin,
        journeyRouteResult,
        activeBudget: integratedBudget,
        activeDestination: selectedDestinationDetail || initialDestination || null,
        actions: {
          addStop: handleAddStopToJourney,
          removeStop: handleRemoveStopFromJourney,
          calculateJourney: handlePlanMyJourney,
          clearAll: handleClearAllJourneyStops,
          setBudgetTier: setBudgetTier,
          inspectDestination: handleInspectDestination
        }
      });
    }
  }, [
    selectedJourneyStops,
    journeyOrigin,
    journeyRouteResult,
    integratedBudget,
    selectedDestinationDetail,
    initialDestination,
    onUpdateNarratorContext
  ]);

  const handleCopyBudgetSummary = () => {
    if (!integratedBudget || !integratedBudget.plans) return;
    const tierKey =
      budgetTier === "cheapest" || budgetTier === "economy"
        ? "economy"
        : budgetTier === "mid_budget" || budgetTier === "middle"
        ? "middle"
        : budgetTier === "custom"
        ? "custom"
        : "comfortable";
    const plan = integratedBudget.plans[tierKey] || integratedBudget.plans.comfortable;
    const b = plan.breakdown || {};
    const text = `JOURNEY TO BHARAT — COMPLETE ROUTE & TRAVEL BUDGET
Route: ${journeyOrigin.name} ➔ ${selectedJourneyStops.map((s) => s.name).join(" ➔ ")}
Total Distance: ${journeyRouteResult?.totalRoadKm || integratedBudget.roadKm} km (${journeyRouteResult?.totalDurationText || integratedBudget.travelTimeFormatted})
Travellers: ${budgetTravellers} | Duration: ${budgetDurationDays} Days
Budget Tier: ${plan.title}

TOTAL TRIP ESTIMATE: ₹${plan.totalCost.toLocaleString("en-IN")}
Per Person: ₹${plan.perPersonCost.toLocaleString("en-IN")} (₹${plan.perDayCost.toLocaleString("en-IN")}/day)

Expense Breakdown:
• Accommodation: ₹${(b.accommodation || 0).toLocaleString("en-IN")}
• Food & Meals: ₹${(b.food || 0).toLocaleString("en-IN")}
• Local Transport: ₹${(b.localTransport || 0).toLocaleString("en-IN")}
• Intercity Travel: ₹${(b.intercityTransport || 0).toLocaleString("en-IN")}
• Spends & Darshan: ₹${(b.darshanAndSightseeing || 0).toLocaleString("en-IN")}
• Tolls & Buffer: ₹${((b.tollsAndMisc || 0) + (b.emergencyBuffer || 0)).toLocaleString("en-IN")}

Planned with Journey to Bharat — Smart Pilgrimage Navigator`;

    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handlePrintBudget = () => {
    window.print();
  };

  // High-Performance Smooth Animation Engine Refs (Zero Flicker & Throttled UI)
  const animFrameRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const traveledPolylineRef = useRef(null);
  const animProgressRef = useRef(0);
  const animLastHeadingRef = useRef(0);
  const animLastStateUpdateRef = useRef(0);
  const animLastPanRef = useRef(0);
  const animSegmentsRef = useRef(null);
  const animSpeedRef = useRef(2);
  const animActiveLegRef = useRef(1);
  const animTargetStopIdRef = useRef(null);
  const progressBarFillRef = useRef(null);
  const progressTextRef = useRef(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3400);
  };

  // Universal Live Search: Combines Source A (Saved Registry) & Source B (Google Maps Discovery)
  useEffect(() => {
    if (!journeySearchInput || !journeySearchInput.trim()) {
      setUniversalSearchResults([]);
      setIsSearchingUniversal(false);
      return;
    }

    let isMounted = true;
    setIsSearchingUniversal(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchUniversalDestinations(journeySearchInput, MASTER_EXPLORER_DESTINATIONS);
        if (isMounted) {
          setUniversalSearchResults(results.slice(0, 16));
          setIsSearchingUniversal(false);
        }
      } catch (e) {
        if (isMounted) setIsSearchingUniversal(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [journeySearchInput]);

  // Inspect Complete Place Details (New)
  const handleInspectDestination = async (dest) => {
    setSelectedDestinationDetail(dest);
    setFocusedJourneyStopId(dest.id);

    // If it's a Google Maps place, fetch complete Place Details
    if (dest.googlePlaceId && (!dest.phone || !dest.website)) {
      setIsLoadingDetails(true);
      const fullDetails = await fetchGooglePlaceDetails(dest.googlePlaceId);
      setIsLoadingDetails(false);
      if (fullDetails) {
        setSelectedDestinationDetail((prev) => ({ ...prev, ...fullDetails }));
      }
    }
  };

  // Add stop to journey circuit
  const handleAddStopToJourney = async (dest) => {
    if (!dest) return;
    const exists = selectedJourneyStops.some((s) => s.id === dest.id || (s.googlePlaceId && s.googlePlaceId === dest.googlePlaceId));
    if (exists) {
      showToast(`"${dest.name}" is already in your journey stops.`);
      return;
    }

    // If destination is from Google Maps and needs details, fetch coordinates if missing
    let targetStop = { ...dest };
    if (!targetStop.lat || !targetStop.lng) {
      if (targetStop.googlePlaceId) {
        const details = await fetchGooglePlaceDetails(targetStop.googlePlaceId);
        if (details && details.lat && details.lng) {
          targetStop = { ...targetStop, ...details };
        }
      }
    }

    if (!targetStop.lat || !targetStop.lng) {
      showToast("Could not resolve verified coordinates for this place. Please try a more specific search.");
      return;
    }

    const updated = [...selectedJourneyStops, targetStop];
    setSelectedJourneyStops(updated);
    // Keep search query and results visible so user can select multiple places from the same state/region
    showToast(`Added "${targetStop.name}" (${targetStop.source === "GOOGLE_MAPS" ? "Google Maps" : "Saved"}) as Stop ${updated.length}.`);

    if (journeyRouteResult) {
      triggerJourneyCalculation(updated, journeyTravelMode, journeyOptimizeOrder);
    }
  };

  // Save Discovered Place to "My Destinations"
  const handleSaveDiscoveredPlace = (place) => {
    const success = saveCustomDestination(place);
    if (success) {
      setCustomSavedList(getCustomSavedDestinations());
      showToast(`Saved "${place.name}" to My Destinations!`);
    }
  };

  // Remove stop
  const handleRemoveStopFromJourney = (stopId) => {
    const updated = selectedJourneyStops.filter((s) => s.id !== stopId);
    setSelectedJourneyStops(updated);
    stopAnimation();

    if (updated.length === 0) {
      setJourneyRouteResult(null);
    } else if (journeyRouteResult) {
      triggerJourneyCalculation(updated, journeyTravelMode, journeyOptimizeOrder);
    }
  };

  // Move stop sequence (▲ / ▼)
  const handleMoveJourneyStop = (index, direction) => {
    const copy = [...selectedJourneyStops];
    const target = index + direction;
    if (target < 0 || target >= copy.length) return;
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSelectedJourneyStops(copy);
    stopAnimation();

    if (journeyRouteResult) {
      triggerJourneyCalculation(copy, journeyTravelMode, false);
    }
  };

  // Clear all stops
  const handleClearAllJourneyStops = () => {
    setSelectedJourneyStops([]);
    setJourneyRouteResult(null);
    setFocusedJourneyStopId(null);
    setSelectedDestinationDetail(null);
    stopAnimation();
    showToast("Cleared all stops. Ready for a new journey.");
  };

  // Reset origin to Varanasi
  const handleResetToVaranasi = () => {
    setJourneyOrigin(VARANASI_ORIGIN);
    setSelectedJourneyStops([]);
    setJourneyRouteResult(null);
    setJourneySearchInput("");
    setUniversalSearchResults([]);
    setFocusedJourneyStopId(null);
    setSelectedDestinationDetail(null);
    stopAnimation();
    showToast("Reset journey origin to Varanasi (Kashi), Uttar Pradesh.");
  };

  // Execute Route Calculation
  const triggerJourneyCalculation = async (stopsList, mode = journeyTravelMode, optimize = journeyOptimizeOrder) => {
    if (!stopsList || stopsList.length === 0) return;

    setIsCalculatingJourney(true);
    stopAnimation();

    try {
      const res = await calculateSmartRoute({
        origin: journeyOrigin,
        selectedStops: stopsList,
        travelMode: mode === "TRAIN" ? "DRIVE" : mode,
        optimizeOrder: optimize
      });

      setIsCalculatingJourney(false);
      if (res && res.success) {
        setJourneyRouteResult(res);
        setNextTargetStop(stopsList[0] || null);
        setActiveLegNumber(1);
      }
    } catch (err) {
      console.error("Error calculating smart journey route:", err);
      setIsCalculatingJourney(false);
    }
  };

  const handlePlanMyJourney = () => {
    if (selectedJourneyStops.length === 0) {
      showToast("Please add at least one destination to plan.");
      return;
    }
    triggerJourneyCalculation(selectedJourneyStops, journeyTravelMode, journeyOptimizeOrder);
  };

  // Quick 1-Click Load: Exact required test journey
  const handleLoadExactTestJourney = () => {
    const khatu = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "khatu_shyam_ji");
    const jeen = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "jeen_mata_temple_sikar");
    const hawa = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "hawa_mahal_jaipur");
    const vrindavan = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "banke_bihari_vrindavan");

    const testStops = [khatu, jeen, hawa, vrindavan].filter(Boolean);
    setSelectedJourneyStops(testStops);
    showToast("Loaded 5-Point Pilgrimage Circuit: Varanasi → Khatu Shyam → Jeen Mata → Hawa Mahal → Vrindavan.");
    triggerJourneyCalculation(testStops, "DRIVE", false);
  };

  // Quick 1-Click Load: Mixed Saved + Google Discovered Journey
  const handleLoadMixedJourney = () => {
    const mahakal = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "mahakaleshwar_ujjain");
    const somnath = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === "somnath_temple");

    const guptGodavari = {
      id: "google_ChIJLaWLqSqnhDkRH_jjR73qGOg",
      googlePlaceId: "ChIJLaWLqSqnhDkRH_jjR73qGOg",
      name: "Gupt Godavari Chitrakoot",
      address: "Chitrakoot, Tendhee Patmaniya, Madhya Pradesh 210202",
      city: "Chitrakoot",
      state: "Madhya Pradesh",
      lat: 25.0982,
      lng: 80.7687,
      rating: 4.4,
      category: "hindu_temple",
      badge: "Hindu Temple • Google Maps",
      source: "GOOGLE_MAPS",
      sourceLabel: "Discovered on Google Maps"
    };

    const dhuandharFalls = {
      id: "google_dhuandhar_falls_jabalpur",
      googlePlaceId: "ChIJ6XN6H1Z_1DkRz5i-kH4Jk-g",
      name: "Dhuandhar Falls (Bhedaghat)",
      address: "Bhedaghat, Jabalpur, Madhya Pradesh 483053",
      city: "Jabalpur",
      state: "Madhya Pradesh",
      lat: 23.1311,
      lng: 79.8055,
      rating: 4.6,
      category: "waterfall",
      badge: "Waterfall • Google Maps",
      source: "GOOGLE_MAPS",
      sourceLabel: "Discovered on Google Maps"
    };

    const mixed = [mahakal, guptGodavari, somnath, dhuandharFalls];
    setSelectedJourneyStops(mixed);
    showToast("Loaded Mixed Circuit: Varanasi → Mahakal (Saved) → Gupt Godavari (Google Maps) → Somnath (Saved) → Dhuandhar Falls (Google Maps).");
    triggerJourneyCalculation(mixed, "DRIVE", false);
  };

  // Travel mode switch
  const handleChangeTravelMode = (mode) => {
    setJourneyTravelMode(mode);
    if (selectedJourneyStops.length > 0) {
      triggerJourneyCalculation(selectedJourneyStops, mode, journeyOptimizeOrder);
    }
  };

  // Speed handler to sync ref and state instantaneously
  const handleSetAnimSpeed = (spd) => {
    setAnimSpeed(spd);
    animSpeedRef.current = spd;
  };

  // Precalculate road geometry segments with cumulative distances and bearings
  const prepareRouteSegments = (points) => {
    if (!points || points.length < 2) return { segments: [], totalDist: 0 };
    const segments = [];
    let cumDist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const pA = points[i];
      const pB = points[i + 1];
      const dist = calculateHaversineKm(pA[0], pA[1], pB[0], pB[1]);
      const bearing = calculateBearing(pA[0], pA[1], pB[0], pB[1]);
      segments.push({
        index: i,
        pA,
        pB,
        dist: dist > 0 ? dist : 0.001,
        cumDist,
        bearing
      });
      cumDist += dist;
    }
    return { segments, totalDist: Math.max(0.1, cumDist) };
  };

  // Animation Engine Controls — 100% Stable, Smooth GPS Animation (Zero Flicker)
  const stopAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    animProgressRef.current = 0;
    setAnimState("idle");
    setAnimProgressPercent(0);
    setAnimCurrentIndex(0);
    animActiveLegRef.current = 1;
    setActiveLegNumber(1);

    if (progressBarFillRef.current) progressBarFillRef.current.style.width = "0%";
    if (progressTextRef.current) progressTextRef.current.innerText = "0%";

    if (traveledPolylineRef.current) {
      traveledPolylineRef.current.setLatLngs([]);
    }

    if (journeyRouteResult?.polylinePoints?.length && vehicleMarkerRef.current) {
      const startPt = journeyRouteResult.polylinePoints[0];
      vehicleMarkerRef.current.setLatLng(startPt);
      const rot = vehicleMarkerRef.current.getElement()?.querySelector(".nav-vehicle-rotator");
      if (rot) rot.style.transform = `rotate(${animLastHeadingRef.current || 0}deg)`;
    }

    // Clear marker pulse highlight
    if (animTargetStopIdRef.current) {
      const oldMarker = markersMapRef.current.get(animTargetStopIdRef.current);
      if (oldMarker && oldMarker.getElement()) {
        oldMarker.getElement().classList.remove("pulse-next-marker");
      }
      animTargetStopIdRef.current = null;
    }
  };

  const pauseAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAnimState("paused");
  };

  const startOrResumeAnimation = () => {
    if (!journeyRouteResult || !journeyRouteResult.polylinePoints || journeyRouteResult.polylinePoints.length < 2) {
      showToast("Please calculate route first before animating.");
      return;
    }

    const points = journeyRouteResult.polylinePoints;
    const { segments, totalDist } = prepareRouteSegments(points);
    animSegmentsRef.current = { segments, totalDist };

    setAnimState("playing");

    let progress = animProgressRef.current || 0;
    if (progress >= 1.0) {
      progress = 0;
      animProgressRef.current = 0;
    }

    // Adaptive duration in seconds based on distance (approx 18s - 32s scaled by animSpeed)
    const baseDurationSec = Math.max(16, Math.min(32, totalDist / 22));
    let lastTime = performance.now();

    const step = (now) => {
      const dtSec = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      const currentSpeed = animSpeedRef.current || animSpeed;
      const speedFactor = currentSpeed === 4 ? 4 : currentSpeed === 2 ? 2 : 1;
      const progressDelta = (dtSec / baseDurationSec) * speedFactor;
      progress += progressDelta;

      if (progress >= 1.0) {
        progress = 1.0;
        animProgressRef.current = 1.0;
        setAnimProgressPercent(100);
        setAnimState("completed");

        if (progressBarFillRef.current) progressBarFillRef.current.style.width = "100%";
        if (progressTextRef.current) progressTextRef.current.innerText = "100%";

        const finalPt = points[points.length - 1];
        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setLatLng(finalPt);
        }
        if (traveledPolylineRef.current) {
          traveledPolylineRef.current.setLatLngs(points);
        }
        animFrameRef.current = null;
        return;
      }

      animProgressRef.current = progress;

      // 1. Calculate current distance along road & find matching geometry segment
      const targetDist = progress * totalDist;
      let segIdx = 0;
      while (segIdx < segments.length - 1 && segments[segIdx + 1].cumDist <= targetDist) {
        segIdx++;
      }
      const seg = segments[segIdx];
      const t = seg.dist > 0.0001 ? Math.max(0, Math.min(1, (targetDist - seg.cumDist) / seg.dist)) : 0;

      // Smooth fractional position (Sub-pixel continuous gliding)
      const currentLat = seg.pA[0] + (seg.pB[0] - seg.pA[0]) * t;
      const currentLng = seg.pA[1] + (seg.pB[1] - seg.pA[1]) * t;
      const currentPt = [currentLat, currentLng];

      // Smooth angular bearing (Natural rotation into bends)
      const smoothHeading = lerpAngle(animLastHeadingRef.current, seg.bearing, 0.22);
      animLastHeadingRef.current = smoothHeading;

      // 2. Update Vehicle Marker (Zero DOM recreation - purely GPU transforms)
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLatLng(currentPt);
        const el = vehicleMarkerRef.current.getElement();
        if (el) {
          const rotator = el.querySelector(".nav-vehicle-rotator");
          if (rotator) {
            rotator.style.transform = `rotate(${Math.round(smoothHeading * 10) / 10}deg)`;
          }
        }
      }

      // 3. Update Traveled Route Polyline (Green Trail)
      if (traveledPolylineRef.current) {
        const traveledPts = points.slice(0, segIdx + 1);
        traveledPts.push(currentPt);
        traveledPolylineRef.current.setLatLngs(traveledPts);
      }

      // 4. Gentle Auto-Pan Camera (Only when vehicle nears screen boundary)
      if (mapInstanceRef.current && (now - animLastPanRef.current > 750)) {
        const map = mapInstanceRef.current;
        const bounds = map.getBounds();
        if (bounds.isValid() && !bounds.pad(-0.2).contains(currentPt)) {
          animLastPanRef.current = now;
          map.panTo(currentPt, { animate: true, duration: 0.9, easeLinearity: 0.25 });
        }
      }

      // 5. Update Ribbon Progress Bar (Immediate DOM update, 60fps without React re-render lag)
      const currentPct = Math.min(100, Math.round(progress * 100));
      if (progressBarFillRef.current) {
        progressBarFillRef.current.style.width = `${currentPct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${currentPct}%`;
      }

      // 6. Throttled React state update (every 220ms)
      if (now - animLastStateUpdateRef.current > 220) {
        animLastStateUpdateRef.current = now;
        setAnimProgressPercent(currentPct);
      }

      // 7. Leg Index & Next Target Stop Tracking (Direct DOM marker highlight)
      if (journeyRouteResult.legs && journeyRouteResult.legs.length > 0) {
        const legCount = journeyRouteResult.legs.length;
        const currentLegIdx = Math.min(Math.floor(progress * legCount), legCount - 1);
        const newLegNum = currentLegIdx + 1;

        if (newLegNum !== animActiveLegRef.current) {
          animActiveLegRef.current = newLegNum;
          setActiveLegNumber(newLegNum);

          const nextStop = journeyRouteResult.orderedStops[currentLegIdx + 1] || null;
          setNextTargetStop(nextStop);

          if (animTargetStopIdRef.current) {
            const oldMarker = markersMapRef.current.get(animTargetStopIdRef.current);
            if (oldMarker && oldMarker.getElement()) {
              oldMarker.getElement().classList.remove("pulse-next-marker");
            }
          }
          if (nextStop?.id) {
            animTargetStopIdRef.current = nextStop.id;
            const newMarker = markersMapRef.current.get(nextStop.id);
            if (newMarker && newMarker.getElement()) {
              newMarker.getElement().classList.add("pulse-next-marker");
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const restartAnimation = () => {
    stopAnimation();
    setTimeout(() => {
      startOrResumeAnimation();
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Leaflet Map Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routePolylineLayerRef = useRef(null);
  const allDestinationsLayerRef = useRef(null);
  const markersMapRef = useRef(new Map());

  const TILE_SERVERS = {
    roadmap: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    satellite: "https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    terrain: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [journeyOrigin.lat, journeyOrigin.lng],
        zoom: 6,
        zoomControl: false
      });

      tileLayerRef.current = L.tileLayer(TILE_SERVERS[activeBaseLayer], {
        attribution: "&copy; Google Maps Platform",
        maxZoom: 20
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      allDestinationsLayerRef.current = L.layerGroup().addTo(map);
      routePolylineLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      traveledPolylineRef.current = L.polyline([], {
        color: "#10b981",
        weight: 6,
        opacity: 0.95,
        className: "ty-traveled-route-line"
      }).addTo(map);

      vehicleMarkerRef.current = L.marker([journeyOrigin.lat, journeyOrigin.lng], {
        icon: createVehicleIcon(0, "DRIVE"),
        zIndexOffset: 1000
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Base layer update
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_SERVERS[activeBaseLayer]);
  }, [activeBaseLayer]);

  // Resize invalidate on fullscreen
  useEffect(() => {
    let timer = null;
    if (mapInstanceRef.current) {
      timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFullScreenMap]);

  // Update Map Markers & Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersLayerRef.current) markersLayerRef.current.clearLayers();
    if (routePolylineLayerRef.current) routePolylineLayerRef.current.clearLayers();
    if (allDestinationsLayerRef.current) allDestinationsLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    const bounds = L.latLngBounds([]);

    // 1. Origin Marker
    const isOriginHighlighted = focusedJourneyStopId === journeyOrigin.id;
    const originPin = createLeafletPin("origin", true, null, isOriginHighlighted, false);
    const originMarker = L.marker([journeyOrigin.lat, journeyOrigin.lng], { icon: originPin })
      .addTo(markersLayerRef.current)
      .bindPopup(`
        <div style="font-family: serif; min-width: 220px; padding: 4px;">
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; background: #fef3c7; color: #92400e; font-weight: 800; padding: 2px 6px; border-radius: 4px;">FIXED JOURNEY ORIGIN</span>
          <h4 style="margin: 3px 0 4px 0; font-size: 14px; font-weight: 700; color: #1c2e26;">${journeyOrigin.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #4b5563;">Varanasi, Uttar Pradesh • 25.3176° N, 82.9739° E</p>
        </div>
      `);

    originMarker.on("click", () => {
      handleInspectDestination(journeyOrigin);
    });

    markersMapRef.current.set(journeyOrigin.id, originMarker);
    bounds.extend([journeyOrigin.lat, journeyOrigin.lng]);

    // 2. Numbered Destination Pins
    selectedJourneyStops.forEach((stop, idx) => {
      if (!stop.lat || !stop.lng) return;

      const isGoogleDiscovered = stop.source === "GOOGLE_MAPS";
      const isStopHighlighted = focusedJourneyStopId === stop.id;
      const stopPin = createLeafletPin(stop.category, false, idx + 1, isStopHighlighted, false, isGoogleDiscovered);

      const marker = L.marker([stop.lat, stop.lng], { icon: stopPin })
        .addTo(markersLayerRef.current)
        .bindPopup(`
          <div style="font-family: serif; min-width: 210px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 9px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; background: ${isGoogleDiscovered ? "rgba(2, 132, 199, 0.12)" : "rgba(212, 175, 55, 0.18)"}; color: ${isGoogleDiscovered ? "#0284c7" : "#854d0e"}; padding: 2px 7px; border-radius: 4px;">
                ${isGoogleDiscovered ? "Live Discovery" : "Sacred Stop"} • ${idx + 1}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #047857;">${stop.state || ""}</span>
            </div>
            <h4 style="margin: 2px 0 4px 0; font-size: 13px; font-weight: 700; color: #1c2e26;">${stop.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #666;">${stop.address || stop.city || ""}</p>
            ${stop.rating ? `<div style="font-size: 10px; color: #b45309; margin-top: 3px;">★ ${stop.rating} (${stop.userRatingCount || 0} reviews)</div>` : ""}
          </div>
        `);

      marker.on("click", () => {
        handleInspectDestination(stop);
      });

      markersMapRef.current.set(stop.id, marker);
      bounds.extend([stop.lat, stop.lng]);
    });

    // 3. Render Route Polyline & Initialize Vehicle
    if (journeyRouteResult && journeyRouteResult.polylinePoints && journeyRouteResult.polylinePoints.length > 1) {
      const polyline = L.polyline(journeyRouteResult.polylinePoints, {
        color: "#f59e0b",
        weight: 5,
        opacity: 0.9,
        className: "ty-upcoming-route-line",
        lineJoin: "round"
      }).addTo(routePolylineLayerRef.current);

      map.fitBounds(polyline.getBounds(), { padding: [55, 55], maxZoom: 15 });

      if (vehicleMarkerRef.current) {
        if (!map.hasLayer(vehicleMarkerRef.current)) {
          vehicleMarkerRef.current.addTo(map);
        }
        vehicleMarkerRef.current.setLatLng(journeyRouteResult.polylinePoints[0]);
        const rot = vehicleMarkerRef.current.getElement()?.querySelector(".nav-vehicle-rotator");
        if (rot) rot.style.transform = "rotate(0deg)";
      }
    } else {
      if (vehicleMarkerRef.current && map.hasLayer(vehicleMarkerRef.current)) {
        map.removeLayer(vehicleMarkerRef.current);
      }
      if (traveledPolylineRef.current) {
        traveledPolylineRef.current.setLatLngs([]);
      }
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: selectedJourneyStops.length === 0 ? 10 : 13 });
      }
    }

    // 4. Show All India Destinations
    if (showAllIndiaMarkers) {
      MASTER_EXPLORER_DESTINATIONS.forEach((dest) => {
        if (!dest.lat || !dest.lng) return;
        if (dest.id === journeyOrigin.id || selectedJourneyStops.some((s) => s.id === dest.id)) return;

        const mutedPin = createLeafletPin("all_dest_muted", false, null, false);
        L.marker([dest.lat, dest.lng], { icon: mutedPin })
          .addTo(allDestinationsLayerRef.current)
          .bindPopup(`
            <div style="font-family: serif; min-width: 170px;">
              <h5 style="margin: 0 0 3px 0; font-size: 12px; font-weight: 700;">${dest.name}</h5>
              <div style="font-size: 10px; color: #666; margin-bottom: 6px;">${dest.city || ""}, ${dest.state}</div>
              <button
                id="add-btn-${dest.id}"
                style="background: #064e3b; color: #ffffff; border: none; border-radius: 4px; padding: 3px 8px; font-size: 10px; font-weight: 700; cursor: pointer;"
              >
                + Add Stop
              </button>
            </div>
          `)
          .on("popupopen", () => {
            const btn = document.getElementById(`add-btn-${dest.id}`);
            if (btn) {
              btn.onclick = () => {
                handleAddStopToJourney(dest);
                map.closePopup();
              };
            }
          });
      });
    }
  }, [
    journeyOrigin,
    selectedJourneyStops,
    journeyRouteResult,
    showAllIndiaMarkers,
    focusedJourneyStopId
  ]);

  // Update vehicle icon when travel mode changes (DRIVE, TWO_WHEELER, WALK, TRAIN)
  useEffect(() => {
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setIcon(createVehicleIcon(animLastHeadingRef.current || 0, journeyTravelMode));
    }
  }, [journeyTravelMode]);

  // Pan map on item click
  const handleFocusStopOnMap = (item) => {
    if (!item) return;
    setFocusedJourneyStopId(item.id);
    handleInspectDestination(item);
    if (mapInstanceRef.current && item.lat && item.lng) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], Math.max(mapInstanceRef.current.getZoom(), 12), {
        duration: 0.8,
        easeLinearity: 0.25
      });
      const marker = markersMapRef.current.get(item.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Google Maps Navigation Action
  const handleOpenNextDestinationInGoogleMaps = () => {
    if (!journeyRouteResult || selectedJourneyStops.length === 0) return;
    const nextStop = journeyRouteResult.orderedStops[activeLegNumber] || selectedJourneyStops[0];
    const prevStop = journeyRouteResult.orderedStops[activeLegNumber - 1] || journeyOrigin;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${prevStop.lat},${prevStop.lng}&destination=${nextStop.lat},${nextStop.lng}`;
    window.open(url, "_blank");
  };

  // Share Journey Action
  const handleShareJourney = () => {
    if (!journeyRouteResult) return;
    const text = `Check out my journey from ${journeyOrigin.name} across Bharat (${journeyRouteResult.totalRoadKm} km, ${journeyRouteResult.totalDurationText})!`;
    const shareUrl = journeyRouteResult.googleMapsDirectionsUrl;

    if (navigator.share) {
      navigator.share({ title: "Journey to Bharat Route", text, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      showToast("Route directions copied to clipboard!");
    }
  };

  // Nearby stations for active destination detail drawer
  const activeStations = useMemo(() => {
    if (!selectedDestinationDetail) return [];
    return findNearbyRailwayStationsForDestination(selectedDestinationDetail);
  }, [selectedDestinationDetail]);

  const isDetailSaved = useMemo(() => {
    if (!selectedDestinationDetail) return false;
    return (
      selectedDestinationDetail.isSaved ||
      customSavedList.some(
        (p) => p.id === selectedDestinationDetail.id || (p.googlePlaceId && p.googlePlaceId === selectedDestinationDetail.googlePlaceId)
      )
    );
  }, [selectedDestinationDetail, customSavedList]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="ty-smart-travel-navigation"
      style={{ background: "#fcfbf7", minHeight: "100vh" }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed",
              top: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background: "#091712",
              color: "#fef3c7",
              border: "1px solid #d4af37",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              padding: "10px 24px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          TOP COMPACT NAVIGATION BAR (DARK FOREST GREEN)
          ========================================================================= */}
      <div
        style={{
          background: "linear-gradient(180deg, #091712 0%, #102a20 100%)",
          color: "#ffffff",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(212, 175, 55, 0.3)"
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          {/* Title & Engine info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                color: "#e8c872",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: "20px",
                border: "1px solid rgba(212, 175, 55, 0.4)"
              }}
            >
              Universal Destination Discovery
            </span>
            <span style={{ color: "#d1d5db", fontSize: "13px", fontWeight: "600" }}>
              Origin: <strong style={{ color: "#fef3c7" }}>Varanasi (Kashi)</strong> • Saved Places + Google Maps Live Search
            </span>
          </div>

          {/* Top Quick Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleLoadMixedJourney}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)"
              }}
            >
              <Globe size={13} />
              <span>Mixed Circuit (Saved + Google Maps)</span>
            </button>

            <button
              onClick={handleLoadExactTestJourney}
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #b45309 100%)",
                color: "#091712",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "11px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 8px rgba(212, 175, 55, 0.35)"
              }}
            >
              <Zap size={13} />
              <span>5-Stop Circuit</span>
            </button>

            <button
              onClick={handleResetToVaranasi}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: "6px",
                color: "#fef3c7",
                padding: "6px 10px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN SIDE-BY-SIDE SPLIT WORKSPACE: SIDEBAR (LEFT) & MAP (RIGHT)
          ========================================================================= */}
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isFullScreenMap ? "1fr" : "minmax(400px, 460px) 1fr",
            gap: "20px",
            alignItems: "start"
          }}
        >
          {/* =====================================================================
              LEFT SIDEBAR: UNIVERSAL SEARCH & ITINERARY
              ===================================================================== */}
          {!isFullScreenMap && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
                paddingRight: "4px"
              }}
            >
              {/* Card 1: Transit Mode Selector */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e5dec9",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#1c2e26" }}>Transit:</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { id: "DRIVE", label: "Car Highway", icon: <Car size={13} /> },
                    { id: "TWO_WHEELER", label: "Motorcycle", icon: <Bike size={13} /> },
                    { id: "WALK", label: "Walking", icon: <Footprints size={13} /> },
                    { id: "TRAIN", label: "Train & Rail", icon: <Train size={13} /> }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleChangeTravelMode(mode.id)}
                      style={{
                        background: journeyTravelMode === mode.id ? "#064e3b" : "#f1f5f9",
                        color: journeyTravelMode === mode.id ? "#fef3c7" : "#334155",
                        border: journeyTravelMode === mode.id ? "1px solid #059669" : "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {mode.icon}
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Universal Destination Search (Source A + Source B) */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e5dec9",
                  padding: "14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#1c2e26" }}>
                    Search Any Place in Bharat (Saved or Google Maps):
                  </label>
                  <span style={{ fontSize: "10px", color: "#0369a1", fontWeight: "600" }}>Google Places Live</span>
                </div>

                <div
                  style={{
                    position: "relative",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 10px"
                  }}
                >
                  {isSearchingUniversal ? (
                    <RefreshCw size={16} className="text-amber-700 animate-spin" style={{ flexShrink: 0 }} />
                  ) : (
                    <Search size={16} className="text-amber-700" style={{ flexShrink: 0 }} />
                  )}

                  <input
                    type="text"
                    placeholder="Search ANY place (e.g., Chitrakoot Gupt Godavari, Dhuandhar Falls, Kashi)..."
                    value={journeySearchInput}
                    onChange={(e) => setJourneySearchInput(e.target.value)}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: "6px 8px",
                      fontSize: "13px",
                      color: "#1c2e26",
                      fontWeight: "500"
                    }}
                  />
                  {journeySearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setJourneySearchInput("");
                        setUniversalSearchResults([]);
                      }}
                      title="Clear search"
                      style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", padding: "2px" }}
                    >
                      <X size={14} />
                    </button>
                  )}

                  {/* VoiceStudio Voice Search Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceSearch}
                    title={isListeningVoice ? "Stop VoiceStudio Voice Recognition" : "VoiceStudio: Speak destination name (e.g. Kedarnath, Kashi, Chitrakoot)"}
                    style={{
                      background: isListeningVoice ? "#fef2f2" : "#f1f5f9",
                      border: isListeningVoice ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "3px 6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      color: isListeningVoice ? "#dc2626" : "#0f766e",
                      cursor: "pointer",
                      marginLeft: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isListeningVoice ? (
                      <>
                        <MicOff size={13} className="animate-pulse text-red-600" />
                        <span style={{ fontSize: "10px", color: "#dc2626" }}>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic size={13} />
                        <span style={{ fontSize: "10px" }}>Voice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Universal Suggestions Dropdown with Source Badges */}
                <AnimatePresence>
                  {universalSearchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      style={{
                        marginTop: "8px",
                        border: "1px solid #e5dec9",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#fcfbf7",
                        maxHeight: "360px",
                        overflowY: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 11px",
                          background: "#f8f6f0",
                          borderBottom: "1px solid #e5dec9",
                          fontSize: "10.5px",
                          color: "#6b7280",
                          fontWeight: "600",
                          position: "sticky",
                          top: 0,
                          zIndex: 2
                        }}
                      >
                        <span>
                          {universalSearchResults.length} places found for "{journeySearchInput}"
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setJourneySearchInput("");
                            setUniversalSearchResults([]);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#b45309",
                            cursor: "pointer",
                            fontSize: "10.5px",
                            fontWeight: "700"
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      {universalSearchResults.map((sug) => {
                        const isAlreadySelected = selectedJourneyStops.some((s) => s.id === sug.id || (s.googlePlaceId && s.googlePlaceId === sug.googlePlaceId));
                        const isSaved = sug.source === "SAVED" || sug.source === "CUSTOM_SAVED";

                        return (
                          <div
                            key={sug.id || sug.googlePlaceId}
                            style={{
                              padding: "9px 11px",
                              borderBottom: "1px solid #f0ece1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: isAlreadySelected ? "#f0fdf4" : "#ffffff"
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                                <span
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "700",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    background: isSaved ? "rgba(212, 175, 55, 0.15)" : "rgba(2, 132, 199, 0.12)",
                                    color: isSaved ? "#854d0e" : "#0284c7",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px"
                                  }}
                                >
                                  {isSaved ? (
                                    <>
                                      <BookmarkCheck size={10} className="text-amber-600" />
                                      <span>Sacred Registry</span>
                                    </>
                                  ) : (
                                    <>
                                      <Globe size={10} className="text-sky-600" />
                                      <span>Google Places Live</span>
                                    </>
                                  )}
                                </span>
                                {sug.rating && (
                                  <span style={{ fontSize: "9px", color: "#b45309", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                                    <Star size={9} fill="#b45309" />
                                    <span>{sug.rating}</span>
                                  </span>
                                )}
                              </div>

                              <div style={{ fontSize: "12px", fontWeight: "700", color: "#1c2e26", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {sug.name}
                              </div>
                              <div style={{ fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {sug.address || sug.location || sug.city || ""}
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <button
                                onClick={() => handleInspectDestination(sug)}
                                title="Inspect Details"
                                style={{
                                  background: "#f1f5f9",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "4px",
                                  padding: "4px 7px",
                                  fontSize: "10px",
                                  color: "#334155",
                                  cursor: "pointer"
                                }}
                              >
                                Info
                              </button>

                              <button
                                onClick={() => handleAddStopToJourney(sug)}
                                disabled={isAlreadySelected}
                                style={{
                                  background: isAlreadySelected ? "#e2e8f0" : "#064e3b",
                                  color: isAlreadySelected ? "#64748b" : "#fef3c7",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "4px 9px",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  cursor: isAlreadySelected ? "default" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px"
                                }}
                              >
                                {isAlreadySelected ? <Check size={11} /> : <Plus size={11} />}
                                <span>{isAlreadySelected ? "Added" : "+ Add"}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Examples across Saved & Discovered */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", marginTop: "10px" }}>
                  <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>Try Searching:</span>
                  {[
                    "Chitrakoot Gupt Godavari",
                    "Dhuandhar Falls",
                    "Khatu Shyam Ji",
                    "Mahakaleshwar",
                    "Somnath"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setJourneySearchInput(chip)}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "10px",
                        color: "#334155",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: Selected Circuit List (Mixed Saved + Discovered) */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e5dec9",
                  padding: "14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1c2e26" }}>
                      Selected Circuit ({selectedJourneyStops.length + 1} Points)
                    </h3>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>
                      Origin: Varanasi (Kashi) + {selectedJourneyStops.length} stops
                    </span>
                  </div>

                  {selectedJourneyStops.length > 0 && (
                    <button
                      onClick={handleClearAllJourneyStops}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#dc2626",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {/* Stop 1: Fixed Varanasi Origin */}
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1.5px solid #d4af37",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        background: "#d4af37",
                        color: "#ffffff",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "900"
                      }}
                    >
                      ★
                    </span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#1c2e26" }}>
                        Origin: {journeyOrigin.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#92400e" }}>
                        Varanasi, Uttar Pradesh • 25.3176° N, 82.9739° E
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "9px", background: "#d4af37", color: "#ffffff", padding: "1px 6px", borderRadius: "3px", fontWeight: "800" }}>
                    ORIGIN
                  </span>
                </div>

                {/* Numbered Stops List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedJourneyStops.map((stop, idx) => {
                    const isGoogleDiscovered = stop.source === "GOOGLE_MAPS";
                    return (
                      <div
                        key={stop.id || idx}
                        onClick={() => handleFocusStopOnMap(stop)}
                        style={{
                          background: focusedJourneyStopId === stop.id ? "#fffbeb" : "#ffffff",
                          border: focusedJourneyStopId === stop.id ? "1.5px solid #d4af37" : "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "7px 10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                          <span
                            style={{
                              background: isGoogleDiscovered ? "#0284c7" : "#059669",
                              color: "#ffffff",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              fontWeight: "800",
                              flexShrink: 0
                            }}
                          >
                            {idx + 1}
                          </span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#1c2e26", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {stop.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#64748b" }}>
                              <span style={{ color: isGoogleDiscovered ? "#0284c7" : "#047857", fontWeight: "600" }}>
                                {isGoogleDiscovered ? "[Google Maps]" : "[Saved]"}
                              </span>{" "}
                              {stop.city || stop.state || stop.address?.slice(0, 30) || ""}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveJourneyStop(idx, -1);
                            }}
                            disabled={idx === 0}
                            title="Move Up"
                            style={{ background: "transparent", border: "none", color: idx === 0 ? "#cbd5e1" : "#475569", cursor: idx === 0 ? "default" : "pointer", padding: "2px" }}
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveJourneyStop(idx, 1);
                            }}
                            disabled={idx === selectedJourneyStops.length - 1}
                            title="Move Down"
                            style={{ background: "transparent", border: "none", color: idx === selectedJourneyStops.length - 1 ? "#cbd5e1" : "#475569", cursor: idx === selectedJourneyStops.length - 1 ? "default" : "pointer", padding: "2px" }}
                          >
                            ▼
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveStopFromJourney(stop.id);
                            }}
                            title="Remove Stop"
                            style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px", marginLeft: "2px" }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Plan My Journey Action Button */}
                <div style={{ marginTop: "12px" }}>
                  <motion.button
                    whileHover={selectedJourneyStops.length > 0 ? { scale: 1.02 } : {}}
                    whileTap={selectedJourneyStops.length > 0 ? { scale: 0.97 } : {}}
                    onClick={handlePlanMyJourney}
                    disabled={selectedJourneyStops.length === 0 || isCalculatingJourney}
                    style={{
                      width: "100%",
                      background: selectedJourneyStops.length === 0 ? "#e2e8f0" : "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                      color: selectedJourneyStops.length === 0 ? "#94a3b8" : "#fef3c7",
                      border: selectedJourneyStops.length === 0 ? "none" : "1.5px solid #d4af37",
                      borderRadius: "8px",
                      padding: "11px 16px",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: selectedJourneyStops.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    {isCalculatingJourney ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Calculating Mixed Road Geometry...</span>
                      </>
                    ) : (
                      <>
                        <RouteIcon size={16} />
                        <span>Calculate & Plan My Journey</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Instant Estimated Budget Preview for Selected Places (Before Route Calculation) */}
                {!journeyRouteResult && selectedJourneyStops.length > 0 && integratedBudget && integratedBudget.plans && (
                  <div
                    style={{
                      marginTop: "12px",
                      background: "linear-gradient(135deg, #091712 0%, #173829 100%)",
                      border: "1.5px solid #d4af37",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#ffffff"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Wallet size={13} className="text-amber-400" />
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#fef3c7" }}>
                          Instant Budget Estimate ({selectedJourneyStops.length} Places)
                        </span>
                      </div>
                      <span style={{ fontSize: "9px", background: "rgba(212,175,55,0.2)", color: "#fef3c7", padding: "1px 6px", borderRadius: "3px" }}>
                        {budgetTravellers} pax • {budgetDurationDays} days
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", marginTop: "6px" }}>
                      {[
                        { label: "Economy", cost: integratedBudget.plans.economy.totalCost },
                        { label: "Balanced", cost: integratedBudget.plans.comfortable.totalCost },
                        { label: "Mid Budget", cost: integratedBudget.plans.middle.totalCost }
                      ].map((tier, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(212,175,55,0.25)",
                            borderRadius: "5px",
                            padding: "5px 4px",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "8px", textTransform: "uppercase", color: "#cbd5e1" }}>{tier.label}</div>
                          <div style={{ fontSize: "11px", fontWeight: "900", color: "#fef3c7" }}>
                            ₹{tier.cost.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card 4: Summary & Metrics */}
              {journeyRouteResult && (
                <div
                  className="magic-border-beam"
                  style={{
                    background: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e5dec9",
                    padding: "14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Sparkles size={14} className="text-amber-600" />
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#1c2e26" }}>
                        Complete Journey Summary
                      </span>
                    </div>
                    <span style={{ fontSize: "9px", background: "#e0f2fe", color: "#0369a1", fontWeight: "800", padding: "1px 6px", borderRadius: "3px" }}>
                      {journeyRouteResult.source}
                    </span>
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      color: "#ffffff",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "10px"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "9px", color: "#e8c872", textTransform: "uppercase", fontWeight: "700" }}>Total Distance</div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#fef3c7" }}>{journeyRouteResult.totalRoadKm} km</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "9px", color: "#e8c872", textTransform: "uppercase", fontWeight: "700" }}>Estimated Time</div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#fef3c7" }}>{journeyRouteResult.totalDurationText}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "9px", color: "#e8c872", textTransform: "uppercase", fontWeight: "700" }}>Destinations</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>{selectedJourneyStops.length} Selected</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "9px", color: "#e8c872", textTransform: "uppercase", fontWeight: "700" }}>Route Legs</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>{journeyRouteResult.legs.length} Legs</div>
                    </div>

                    {/* Integrated Route Budget in Main Metric Grid */}
                    {integratedBudget?.plans && (() => {
                      const tierKey = budgetTier === "cheapest" || budgetTier === "economy"
                        ? "economy"
                        : budgetTier === "mid_budget" || budgetTier === "middle"
                        ? "middle"
                        : "comfortable";
                      const plan = integratedBudget.plans[tierKey] || integratedBudget.plans.comfortable;
                      return (
                        <div
                          style={{
                            gridColumn: "span 2",
                            borderTop: "1px solid rgba(212, 175, 55, 0.35)",
                            paddingTop: "8px",
                            marginTop: "2px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "9px", color: "#e8c872", textTransform: "uppercase", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Wallet size={12} className="text-amber-400" />
                              <span>Estimated Route Budget ({plan.title?.split(" ")[0]})</span>
                            </div>
                            <div style={{ fontSize: "19px", fontWeight: "900", color: "#34d399", letterSpacing: "0.2px" }}>
                              ₹{plan.totalCost.toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "11px", color: "#fef3c7", fontWeight: "800" }}>
                              ₹{plan.perPersonCost.toLocaleString("en-IN")}/person
                            </div>
                            <div style={{ fontSize: "9px", color: "#94a3b8" }}>
                              {budgetTravellers} pax • {budgetDurationDays} days
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{ fontSize: "10px", color: "#78350f", background: "#fffbeb", padding: "8px 10px", borderRadius: "6px", lineHeight: "1.4" }}>
                    Total distance ({journeyRouteResult.totalRoadKm} km) equals the sum of route legs ({journeyRouteResult.legs.map((l) => `${l.roadKm}km`).join(" + ")}).
                  </div>

                  {/* =========================================================================
                      WHO IS TRAVELLING? & PASSENGER MULTIPLIER CONTROLS
                      Section 1 & 2: Asks group type, passenger breakdown, and room count
                      ========================================================================= */}
                  <div
                    style={{
                      marginTop: "12px",
                      background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                      border: "1.5px solid #d4af37",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      color: "#ffffff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Users size={15} className="text-amber-400" />
                        <span style={{ fontSize: "12px", fontWeight: "900", color: "#fef3c7" }}>
                          Who Is Travelling?
                        </span>
                      </div>
                      <span style={{ fontSize: "9px", color: "#e8c872", background: "rgba(212,175,55,0.2)", padding: "1px 6px", borderRadius: "3px", fontWeight: "800" }}>
                        {budgetTravellers} Pax • {roomCountOverride !== null ? roomCountOverride : (integratedBudget?.numRooms || 1)} Room(s)
                      </span>
                    </div>

                    {/* Group Type Buttons (Professional Vector SVGs) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", marginBottom: "10px" }}>
                      {[
                        { id: "couple", label: "Couple", Icon: Heart },
                        { id: "family", label: "Family", Icon: Users },
                        { id: "friends", label: "Friends", Icon: Smile },
                        { id: "solo", label: "Solo", Icon: User },
                        { id: "girls", label: "Girls Group", Icon: Sparkles },
                        { id: "group", label: "Group", Icon: Layers }
                      ].map((gt) => {
                        const isSel = groupType === gt.id;
                        const IconComp = gt.Icon;
                        return (
                          <button
                            key={gt.id}
                            type="button"
                            onClick={() => handleGroupTypeChange(gt.id)}
                            style={{
                              background: isSel ? "linear-gradient(135deg, #d4af37 0%, #b45309 100%)" : "rgba(255, 255, 255, 0.08)",
                              color: isSel ? "#091712" : "#e2e8f0",
                              border: isSel ? "1.5px solid #ffffff" : "1px solid rgba(212, 175, 55, 0.25)",
                              borderRadius: "6px",
                              padding: "5px 4px",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: "700",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                              transition: "opacity 0.15s ease, transform 0.15s ease"
                            }}
                          >
                            <IconComp size={11} />
                            <span>{gt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Steppers Grid: Adults, Children, Infants, Rooms, Days */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px", background: "rgba(0,0,0,0.35)", borderRadius: "6px", padding: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {/* Adults */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "#cbd5e1" }}>Adults:</span>
                        <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                          <button
                            type="button"
                            onClick={() => setBudgetAdults((p) => Math.max(1, p - 1))}
                            disabled={budgetAdults <= 1}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >-</button>
                          <span style={{ fontSize: "11px", fontWeight: "800", minWidth: "16px", textAlign: "center", color: "#ffffff" }}>{budgetAdults}</span>
                          <button
                            type="button"
                            onClick={() => setBudgetAdults((p) => Math.min(25, p + 1))}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >+</button>
                        </div>
                      </div>

                      {/* Children */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "#cbd5e1" }} title="Ages 5-11 (50% train/food)">Kids (5-11):</span>
                        <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                          <button
                            type="button"
                            onClick={() => setBudgetChildren((p) => Math.max(0, p - 1))}
                            disabled={budgetChildren <= 0}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >-</button>
                          <span style={{ fontSize: "11px", fontWeight: "800", minWidth: "16px", textAlign: "center", color: "#ffffff" }}>{budgetChildren}</span>
                          <button
                            type="button"
                            onClick={() => setBudgetChildren((p) => Math.min(15, p + 1))}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >+</button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "#cbd5e1" }}>Rooms:</span>
                        <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                          <button
                            type="button"
                            onClick={() => setRoomCountOverride((p) => Math.max(1, (p !== null ? p : (integratedBudget?.numRooms || 1)) - 1))}
                            disabled={(roomCountOverride || integratedBudget?.numRooms || 1) <= 1}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >-</button>
                          <span style={{ fontSize: "11px", fontWeight: "800", minWidth: "16px", textAlign: "center", color: "#ffffff" }}>
                            {roomCountOverride !== null ? roomCountOverride : (integratedBudget?.numRooms || 1)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setRoomCountOverride((p) => Math.min(15, (p !== null ? p : (integratedBudget?.numRooms || 1)) + 1))}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >+</button>
                        </div>
                      </div>

                      {/* Duration */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", color: "#cbd5e1" }}>Duration:</span>
                        <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                          <button
                            type="button"
                            onClick={() => setBudgetDurationDays((p) => Math.max(1, p - 1))}
                            disabled={budgetDurationDays <= 1}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >-</button>
                          <span style={{ fontSize: "11px", fontWeight: "800", minWidth: "20px", textAlign: "center", color: "#ffffff" }}>{budgetDurationDays}d</span>
                          <button
                            type="button"
                            onClick={() => setBudgetDurationDays((p) => Math.min(30, p + 1))}
                            style={{ background: "transparent", color: "#e8c872", border: "none", padding: "1px 6px", cursor: "pointer", fontWeight: "900", fontSize: "11px" }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =========================================================================
                      TOTAL TRIP BUDGET — PROMINENT COMPARISON SECTION
                      Section 6: Mandatory comparison cards and side-by-side table at the top
                      ========================================================================= */}
                  {integratedBudget && integratedBudget.plans && (
                    <div
                      style={{
                        marginTop: "12px",
                        background: "#ffffff",
                        border: "2px solid #d4af37",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.08)"
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                          padding: "10px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Wallet size={16} className="text-amber-400" />
                          <span style={{ fontSize: "12px", fontWeight: "900", color: "#fef3c7", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            TOTAL TRIP BUDGET
                          </span>
                        </div>
                        <span style={{ fontSize: "9px", background: "rgba(212,175,55,0.25)", color: "#fef3c7", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>
                          3 Options Compared
                        </span>
                      </div>

                      {/* 3 Prominent Comparison Cards */}
                      <div style={{ padding: "10px", display: "grid", gridTemplateColumns: "1fr", gap: "8px", background: "#fcfbf7" }}>
                        {[
                          {
                            id: "economy",
                            label: "CHEAPEST / ECONOMY",
                            plan: integratedBudget.plans.economy,
                            badgeColor: "#047857",
                            badgeBg: "#d1fae5",
                            borderColor: "#10b981",
                            highlight: "Sleeper Class (SL) & Dharamshala Priority"
                          },
                          {
                            id: "comfortable",
                            label: "BALANCED / COMFORTABLE",
                            plan: integratedBudget.plans.comfortable,
                            badgeColor: "#92400e",
                            badgeBg: "#fef3c7",
                            borderColor: "#d4af37",
                            isRecommended: true,
                            highlight: "Recommended: 3AC / AC Bus & Standard Hotel"
                          },
                          {
                            id: "middle",
                            label: "MID BUDGET",
                            plan: integratedBudget.plans.middle,
                            badgeColor: "#0369a1",
                            badgeBg: "#e0f2fe",
                            borderColor: "#0284c7",
                            highlight: "2AC / Private Cab & Quality 3-Star Hotel"
                          }
                        ].map((opt) => {
                          const isSel = (budgetTier === "cheapest" && opt.id === "economy") ||
                                        (budgetTier === "mid_budget" && opt.id === "middle") ||
                                        budgetTier === opt.id;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => setBudgetTier(opt.id === "economy" ? "cheapest" : opt.id === "middle" ? "mid_budget" : "comfortable")}
                              style={{
                                border: isSel ? `2px solid ${opt.borderColor}` : "1px solid #e2e8f0",
                                background: isSel ? "#ffffff" : "#f8fafc",
                                borderRadius: "6px",
                                padding: "8px 10px",
                                cursor: "pointer",
                                boxShadow: isSel ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
                                transition: "all 0.15s ease"
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontSize: "10px", fontWeight: "800", color: opt.badgeColor, background: opt.badgeBg, padding: "2px 6px", borderRadius: "3px" }}>
                                  {opt.label}
                                </span>
                                {isSel ? (
                                  <span style={{ fontSize: "10px", color: opt.borderColor, fontWeight: "800", display: "flex", alignItems: "center", gap: "2px" }}>
                                    <Check size={12} /> Active Plan
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "9.5px", color: "#64748b", fontWeight: "700" }}>Tap to select</span>
                                )}
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "4px 0" }}>
                                <div>
                                  <span style={{ fontSize: "17px", fontWeight: "900", color: "#1e293b" }}>
                                    ₹{opt.plan.totalCost.toLocaleString("en-IN")}
                                  </span>
                                  <span style={{ fontSize: "9.5px", color: "#64748b", marginLeft: "4px" }}>Total Group</span>
                                </div>
                                <div style={{ fontSize: "11px", fontWeight: "800", color: "#b45309" }}>
                                  ₹{opt.plan.perPersonCost.toLocaleString("en-IN")} <span style={{ fontSize: "9px", fontWeight: "600", color: "#64748b" }}>/pax</span>
                                </div>
                              </div>

                              <div style={{ fontSize: "9.5px", color: "#475569", lineHeight: "1.3" }}>
                                {opt.highlight}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Side-by-Side Comparison Table (Section 6 Specification) */}
                      {integratedBudget.comparisonTable && (
                        <div style={{ padding: "8px 10px", background: "#ffffff", borderTop: "1px solid #e5dec9" }}>
                          <div style={{ fontSize: "10px", fontWeight: "800", color: "#1c2e26", marginBottom: "6px" }}>
                            Side-by-Side Category Comparison:
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5px" }}>
                              <thead>
                                <tr style={{ background: "#f1f5f9", color: "#334155" }}>
                                  <th style={{ textAlign: "left", padding: "4px 6px", borderBottom: "1.5px solid #cbd5e1" }}>Expense</th>
                                  <th style={{ textAlign: "right", padding: "4px 6px", borderBottom: "1.5px solid #cbd5e1" }}>Economy</th>
                                  <th style={{ textAlign: "right", padding: "4px 6px", borderBottom: "1.5px solid #cbd5e1", background: "#fef3c7" }}>Balanced (Recommended)</th>
                                  <th style={{ textAlign: "right", padding: "4px 6px", borderBottom: "1.5px solid #cbd5e1" }}>Mid Budget</th>
                                </tr>
                              </thead>
                              <tbody>
                                {integratedBudget.comparisonTable.map((row, rIdx) => {
                                  const isTotal = row.isTotal;
                                  const isPerPerson = row.isPerPerson;
                                  return (
                                    <tr
                                      key={rIdx}
                                      style={{
                                        borderBottom: isTotal ? "2px solid #091712" : "1px solid #f1f5f9",
                                        background: isTotal ? "#fef3c7" : isPerPerson ? "#ecfdf5" : "transparent",
                                        fontWeight: isTotal || isPerPerson ? "900" : "500",
                                        color: isTotal ? "#78350f" : isPerPerson ? "#065f46" : "#334155"
                                      }}
                                    >
                                      <td style={{ padding: "4px 6px" }}>{row.category}</td>
                                      <td style={{ textAlign: "right", padding: "4px 6px" }}>₹{row.economy.toLocaleString("en-IN")}</td>
                                      <td style={{ textAlign: "right", padding: "4px 6px", background: isTotal ? "#fde68a" : "#fffbeb" }}>
                                        ₹{row.comfortable.toLocaleString("en-IN")}
                                      </td>
                                      <td style={{ textAlign: "right", padding: "4px 6px" }}>₹{row.middle.toLocaleString("en-IN")}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Quick Share / Full details link */}
                          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                            <button
                              type="button"
                              onClick={handleCopyBudgetSummary}
                              style={{
                                flex: 1,
                                background: copyFeedback ? "#10b981" : "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "5px 8px",
                                fontSize: "10px",
                                fontWeight: "800",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px"
                              }}
                            >
                              {copyFeedback ? <Check size={12} /> : <Share2 size={12} />}
                              <span>{copyFeedback ? "Copied!" : "WhatsApp Share"}</span>
                            </button>

                            <a
                              href="#integrated-route-budget"
                              style={{
                                flex: 1,
                                background: "#f1f5f9",
                                color: "#0f766e",
                                border: "1px solid #cbd5e1",
                                borderRadius: "4px",
                                padding: "5px 8px",
                                fontSize: "10px",
                                fontWeight: "800",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px"
                              }}
                            >
                              <span>Full Breakdown ↓</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Turn-by-Turn Leg Accordion */}
                  <div style={{ marginTop: "12px", borderTop: "1px solid #e5dec9", paddingTop: "10px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#1c2e26", marginBottom: "8px" }}>
                      Turn-by-Turn Guidance ({journeyRouteResult.legs.length} Legs):
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {journeyRouteResult.legs.map((leg, lIdx) => {
                        const isExpanded = expandedLegIndex === lIdx;
                        return (
                          <div
                            key={leg.legNumber}
                            style={{
                              border: isExpanded ? "1.5px solid #d4af37" : "1px solid #e2e8f0",
                              borderRadius: "6px",
                              overflow: "hidden",
                              background: "#ffffff"
                            }}
                          >
                            <div
                              onClick={() => setExpandedLegIndex(isExpanded ? null : lIdx)}
                              style={{
                                background: isExpanded ? "#091712" : "#fcfbf7",
                                color: isExpanded ? "#ffffff" : "#1c2e26",
                                padding: "8px 10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontSize: "11px"
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: "700", color: isExpanded ? "#e8c872" : "#064e3b" }}>
                                  Leg {leg.legNumber}: {leg.from.name} → {leg.to.name}
                                </div>
                                <div style={{ fontSize: "10px", color: isExpanded ? "#d1d5db" : "#64748b" }}>
                                  {leg.roadKm} km • {leg.durationFormatted} ({leg.steps?.length || 0} maneuvers)
                                </div>
                                {/* Independent Leg Transit Recommendation & Expense Suite */}
                                {(() => {
                                  const transit = leg.transitAnalysis || analyzeLegTransit({
                                    legDistanceKm: leg.roadKm,
                                    isGhat: leg.isGhat,
                                    fromName: leg.from?.name,
                                    toName: leg.to?.name,
                                    adults: budgetAdults,
                                    children: budgetChildren,
                                    infants: budgetInfants
                                  });
                                  const destTier = detectLocationCostTier(leg.to);
                                  const mult = (LOCATION_COST_INDEX[destTier] || { index: 1.0 }).index;

                                  const activeTierKey = budgetTier === "cheapest" || budgetTier === "economy"
                                    ? "economy"
                                    : budgetTier === "mid_budget" || budgetTier === "middle"
                                    ? "middle"
                                    : "comfortable";

                                  const rec = transit.recommended[activeTierKey] || transit.recommended.comfortable;

                                  const stayEst = budgetTier === "cheapest"
                                    ? `Dharamshala ~₹${Math.round(500 * mult)}/night`
                                    : budgetTier === "mid_budget"
                                    ? `3-Star Hotel ~₹${Math.round(3400 * mult)}/night`
                                    : `Standard AC Hotel ~₹${Math.round(1650 * mult)}/night`;

                                  const foodEst = budgetTier === "cheapest"
                                    ? `Langar/Thali (~₹${Math.round(235 * mult)}/day/adult)`
                                    : budgetTier === "mid_budget"
                                    ? `Multi-cuisine (~₹${Math.round(980 * mult)}/day/adult)`
                                    : `Pure Veg Thali (~₹${Math.round(490 * mult)}/day/adult)`;

                                  return (
                                    <div style={{ marginTop: "6px", background: isExpanded ? "rgba(0,0,0,0.35)" : "#f1f5f9", borderRadius: "6px", padding: "6px 8px", border: "1px solid " + (isExpanded ? "rgba(212,175,55,0.3)" : "#e2e8f0") }}>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "9.5px", color: isExpanded ? "#cbd5e1" : "#334155" }}>
                                        {/* Smart Leg Transit (Professional Vector Icons) */}
                                        <div style={{ fontWeight: "700", color: isExpanded ? "#fef3c7" : "#0f766e", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                                          {transit.isLocalHop ? (
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                              <Car size={11} className="text-teal-400" />
                                              <span>Local Transit:</span>
                                            </span>
                                          ) : (
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                              <Train size={11} className="text-sky-400" />
                                              <span>Intercity Travel:</span>
                                            </span>
                                          )}
                                          <span style={{ fontWeight: "800", color: isExpanded ? "#34d399" : "#047857", marginLeft: "4px" }}>
                                            {rec.summary}
                                          </span>
                                        </div>
                                        {transit.isLocalHop && (
                                          <span style={{ display: "block", fontSize: "8.5px", color: isExpanded ? "#94a3b8" : "#64748b", fontWeight: "500", marginTop: "1px" }}>
                                            {transit.transitAdvice}
                                          </span>
                                        )}

                                        {/* Stay + Food Breakdown */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                                          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                            <BedDouble size={11} className="text-amber-500" />
                                            <span><strong>Stay:</strong> {stayEst}</span>
                                          </div>
                                          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                            <Utensils size={11} className="text-emerald-500" />
                                            <span><strong>Food:</strong> {foodEst}</span>
                                          </div>
                                        </div>

                                        {/* Alternatives Bar */}
                                        <div style={{ borderTop: "1px dashed " + (isExpanded ? "rgba(255,255,255,0.15)" : "#cbd5e1"), paddingTop: "3px", fontSize: "8.5px", color: isExpanded ? "#94a3b8" : "#64748b" }}>
                                          {transit.isLocalHop ? (
                                            <span>Reserved Cab: ~₹{transit.cabFares.commercialCab} • City Bus: ~₹{transit.busFares.ordinary}/pax</span>
                                          ) : (
                                            <span>
                                              SL Train: ₹{transit.railFares.SL} • 3A: ₹{transit.railFares["3A"]} • Bus: ₹{transit.busFares.ordinary} • Cab: ~₹{transit.cabFares.commercialCab}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>

                            {isExpanded && (
                              <div style={{ padding: "8px 10px", background: "#fcfbf7", maxHeight: "200px", overflowY: "auto" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                  {leg.steps?.map((st) => (
                                    <div
                                      key={st.stepIndex}
                                      style={{
                                        background: "#ffffff",
                                        border: "1px solid #e5dec9",
                                        borderRadius: "4px",
                                        padding: "6px 8px",
                                        fontSize: "11px",
                                        display: "flex",
                                        gap: "8px"
                                      }}
                                    >
                                      <span style={{ fontWeight: "800", color: "#b45309" }}>{st.stepIndex}.</span>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ color: "#1e293b", fontWeight: "600" }}>{st.instruction}</div>
                                        <div style={{ fontSize: "9px", color: "#64748b" }}>{st.distanceFormatted} • ~{st.durationFormatted}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              RIGHT SIDE: LARGE INTERACTIVE MAP (720px Height)
              ===================================================================== */}
          <div style={{ position: "relative" }}>
            <div
              className="ty-nav-map-viewport"
              style={{
                height: isFullScreenMap ? "92vh" : "720px",
                position: "relative"
              }}
            >
              {/* Leaflet DOM container */}
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

              {/* Floating Top Control Bar */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  right: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 1000,
                  pointerEvents: "none",
                  gap: "8px"
                }}
              >
                {/* Status Indicator */}
                <div
                  style={{
                    background: "rgba(9, 23, 18, 0.9)",
                    backdropFilter: "blur(6px)",
                    color: "#ffffff",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    pointerEvents: "auto",
                    border: "1px solid rgba(212, 175, 55, 0.4)"
                  }}
                >
                  <span style={{ color: "#e8c872", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    <MapPin size={11} className="text-amber-400" />
                    <span>Varanasi Origin</span>
                  </span>
                  {nextTargetStop && (
                    <span style={{ color: "#6ee7b7", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <Navigation size={11} className="text-emerald-400" />
                      <span>Target: {nextTargetStop.name}</span>
                    </span>
                  )}
                  {integratedBudget?.plans && (() => {
                    const tierKey = budgetTier === "cheapest" || budgetTier === "economy"
                      ? "economy"
                      : budgetTier === "mid_budget" || budgetTier === "middle"
                      ? "middle"
                      : "comfortable";
                    const plan = integratedBudget.plans[tierKey] || integratedBudget.plans.comfortable;
                    return (
                      <span style={{ color: "#34d399", fontWeight: "700", borderLeft: "1px solid rgba(212,175,55,0.4)", paddingLeft: "10px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Wallet size={12} className="text-amber-400" />
                        <span>Route Budget: <strong className="tabular-nums">₹{plan.totalCost.toLocaleString("en-IN")}</strong></span>
                      </span>
                    );
                  })()}
                </div>

                {/* Baselayer & Fullscreen Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", pointerEvents: "auto" }}>
                  <div
                    style={{
                      background: "rgba(9, 23, 18, 0.9)",
                      borderRadius: "6px",
                      padding: "2px",
                      display: "flex",
                      border: "1px solid rgba(212, 175, 55, 0.3)"
                    }}
                  >
                    {["roadmap", "satellite", "terrain"].map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setActiveBaseLayer(layer)}
                        style={{
                          background: activeBaseLayer === layer ? "#d4af37" : "transparent",
                          color: activeBaseLayer === layer ? "#091712" : "#d1d5db",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "10px",
                          fontWeight: "700",
                          cursor: "pointer",
                          textTransform: "capitalize"
                        }}
                      >
                        {layer}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAllIndiaMarkers(!showAllIndiaMarkers)}
                    style={{
                      background: showAllIndiaMarkers ? "#d4af37" : "rgba(9, 23, 18, 0.9)",
                      color: showAllIndiaMarkers ? "#091712" : "#fef3c7",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {showAllIndiaMarkers ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showAllIndiaMarkers ? "Clean" : "All Places"}</span>
                  </button>

                  <button
                    onClick={() => setIsFullScreenMap(!isFullScreenMap)}
                    style={{
                      background: "rgba(9, 23, 18, 0.9)",
                      color: "#fef3c7",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {isFullScreenMap ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                </div>
              </div>

              {/* Floating Bottom Animation Controller Ribbon */}
              {journeyRouteResult && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "14px",
                    right: "14px",
                    background: "rgba(9, 23, 18, 0.94)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    zIndex: 1000,
                    border: "1.5px solid #d4af37",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.5)",
                    color: "#ffffff"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    {/* Playback Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {animState === "playing" ? (
                        <button
                          onClick={pauseAnimation}
                          style={{
                            background: "#f59e0b",
                            color: "#091712",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Pause size={14} />
                          <span>Pause Drive</span>
                        </button>
                      ) : (
                        <button
                          onClick={startOrResumeAnimation}
                          style={{
                            background: "linear-gradient(135deg, #d4af37 0%, #b45309 100%)",
                            color: "#091712",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 16px",
                            fontSize: "12px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Play size={14} />
                          <span>{animState === "paused" ? "Resume" : "Drive Simulation"}</span>
                        </button>
                      )}

                      <button
                        onClick={restartAnimation}
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(212, 175, 55, 0.4)",
                          borderRadius: "6px",
                          color: "#fef3c7",
                          padding: "6px 10px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px"
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>Restart</span>
                      </button>

                      {/* Speed */}
                      <div style={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "4px" }}>
                        {[1, 2, 4].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => handleSetAnimSpeed(spd)}
                            style={{
                              background: animSpeed === spd ? "#d4af37" : "rgba(255,255,255,0.1)",
                              color: animSpeed === spd ? "#091712" : "#fef3c7",
                              border: "none",
                              borderRadius: "4px",
                              padding: "3px 7px",
                              fontSize: "10px",
                              fontWeight: "800",
                              cursor: "pointer"
                            }}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ flex: 1, minWidth: "180px", maxWidth: "380px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "3px", color: "#e8c872" }}>
                        <span>Leg {activeLegNumber} Active</span>
                        <span><strong ref={progressTextRef}>{animProgressPercent}%</strong> Traveled</span>
                      </div>
                      <div style={{ height: "5px", background: "rgba(255,255,255,0.15)", borderRadius: "3px", overflow: "hidden" }}>
                        <div
                          ref={progressBarFillRef}
                          style={{
                            height: "100%",
                            width: `${animProgressPercent}%`,
                            background: "linear-gradient(90deg, #d4af37, #10b981)",
                            transition: "width 0.05s linear"
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={handleOpenNextDestinationInGoogleMaps}
                        style={{
                          background: "#0284c7",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span>Navigate Leg</span>
                        <ExternalLink size={11} />
                      </button>

                      <button
                        onClick={handleShareJourney}
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(212, 175, 55, 0.4)",
                          borderRadius: "6px",
                          color: "#fef3c7",
                          padding: "6px 10px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Share2 size={12} />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Place Details (New) Inspection Slide-Over Panel */}
            <AnimatePresence>
              {selectedDestinationDetail && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  style={{
                    position: "absolute",
                    top: "60px",
                    left: "20px",
                    width: "380px",
                    maxHeight: "600px",
                    overflowY: "auto",
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "12px",
                    border: "1.5px solid #d4af37",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                    padding: "16px",
                    zIndex: 1100
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "800",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: selectedDestinationDetail.source === "GOOGLE_MAPS" ? "#e0f2fe" : "#fef3c7",
                        color: selectedDestinationDetail.source === "GOOGLE_MAPS" ? "#0369a1" : "#92400e"
                      }}
                    >
                      {selectedDestinationDetail.sourceLabel || (selectedDestinationDetail.source === "GOOGLE_MAPS" ? "Discovered on Google Maps" : "Saved Destination")}
                    </span>

                    <button
                      onClick={() => setSelectedDestinationDetail(null)}
                      style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Header info */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "10px" }}>
                    <img
                      src={selectedDestinationDetail.photoUrl || selectedDestinationDetail.image || DEFAULT_TEMPLE_FALLBACK}
                      alt={selectedDestinationDetail.name}
                      onError={handleImgError}
                      style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", border: "2px solid #d4af37", flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", fontSize: "15px", fontWeight: "700", color: "#1c2e26" }}>
                        {selectedDestinationDetail.name}
                      </h4>
                      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.3" }}>
                        {selectedDestinationDetail.address || `${selectedDestinationDetail.city || ""}, ${selectedDestinationDetail.state || ""}`}
                      </div>
                      {selectedDestinationDetail.rating && (
                        <div style={{ fontSize: "11px", color: "#b45309", fontWeight: "700", marginTop: "3px" }}>
                          ★ {selectedDestinationDetail.rating} ({selectedDestinationDetail.userRatingCount || 0} reviews)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verified Metadata List */}
                  <div style={{ background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "10px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
                    <div>• <strong>Type:</strong> {selectedDestinationDetail.badge || selectedDestinationDetail.category}</div>
                    <div>• <strong>Coordinates:</strong> {selectedDestinationDetail.lat?.toFixed(4)}° N, {selectedDestinationDetail.lng?.toFixed(4)}° E</div>
                    {selectedDestinationDetail.phone && (
                      <div>• <strong>Phone:</strong> {selectedDestinationDetail.phone}</div>
                    )}
                    {selectedDestinationDetail.website && sanitizeUrl(selectedDestinationDetail.website) && (
                      <div>
                        • <strong>Official Website:</strong>{" "}
                        <a href={sanitizeUrl(selectedDestinationDetail.website)} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7" }}>
                          Visit Link
                        </a>
                      </div>
                    )}
                    {selectedDestinationDetail.photoAttribution && (
                      <div style={{ fontSize: "9px", color: "#94a3b8" }}>Photo © {selectedDestinationDetail.photoAttribution}</div>
                    )}
                  </div>

                  {/* Action Buttons: Add to Journey, VoiceStudio Audio Guide & Save to My Destinations */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button
                      onClick={() => handleAddStopToJourney(selectedDestinationDetail)}
                      style={{
                        flex: 1,
                        background: "#064e3b",
                        color: "#fef3c7",
                        border: "none",
                        borderRadius: "6px",
                        padding: "7px 10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      <Plus size={13} />
                      <span>Add to Journey</span>
                    </button>

                    {/* VoiceStudio Sacred Audio Guide Button */}
                    <button
                      onClick={() => handleToggleAudioGuide(selectedDestinationDetail)}
                      style={{
                        flex: 1,
                        background: isPlayingAudioGuide ? "#fef2f2" : "#f0fdf4",
                        color: isPlayingAudioGuide ? "#dc2626" : "#15803d",
                        border: isPlayingAudioGuide ? "1.5px solid #ef4444" : "1px solid #86efac",
                        borderRadius: "6px",
                        padding: "7px 10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                      title="VoiceStudio Audio Guide: Listen to sacred history and darshan guidance"
                    >
                      {isPlayingAudioGuide ? <Square size={13} fill="#dc2626" /> : <Volume2 size={13} />}
                      <span>{isPlayingAudioGuide ? "Stop Guide" : "Audio Guide"}</span>
                    </button>

                    {/* Optional: Add to My Destinations */}
                    <button
                      onClick={() => handleSaveDiscoveredPlace(selectedDestinationDetail)}
                      disabled={isDetailSaved}
                      style={{
                        flex: 1,
                        background: isDetailSaved ? "#f1f5f9" : "#ffffff",
                        color: isDetailSaved ? "#059669" : "#1c2e26",
                        border: isDetailSaved ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "7px 10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: isDetailSaved ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      {isDetailSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                      <span>{isDetailSaved ? "Saved" : "Save Place"}</span>
                    </button>
                  </div>

                  {/* Verified Railway Stations for this destination */}
                  <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "10px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#0369a1", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Train size={13} />
                      <span>Nearby Railway Stations ({activeStations.length}):</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {activeStations.slice(0, 3).map((stn) => (
                        <div
                          key={stn.code}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "6px 8px",
                            fontSize: "11px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: "700", color: "#1e293b" }}>{stn.name} ({stn.code})</div>
                            <div style={{ fontSize: "10px", color: "#64748b" }}>
                              Road: <strong>{stn.roadKm} km</strong> (~{stn.duration}) • Straight: {stn.straightKm} km
                            </div>
                          </div>
                          <a
                            href={stn.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0284c7", textDecoration: "none", fontWeight: "700", fontSize: "10px" }}
                          >
                            Map
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTEGRATED ROUTE BUDGET & EXPENSE INTELLIGENCE DASHBOARD
          Automatically displayed alongside/below the planned route map
          ========================================================================= */}
      {selectedJourneyStops.length > 0 && integratedBudget && (
        <div style={{ maxWidth: "1600px", margin: "10px auto 40px", padding: "0 20px" }}>
          <IntegratedRouteBudgetDashboard
            integratedBudget={integratedBudget}
            tierBudgets={tierBudgets}
            budgetTier={budgetTier}
            onSelectTier={(tier) => setBudgetTier(tier)}
            groupType={groupType}
            onSelectGroupType={handleGroupTypeChange}
            budgetAdults={budgetAdults}
            onChangeAdults={(delta) => setBudgetAdults((prev) => Math.max(1, Math.min(25, prev + delta)))}
            budgetChildren={budgetChildren}
            onChangeChildren={(delta) => setBudgetChildren((prev) => Math.max(0, Math.min(15, prev + delta)))}
            budgetInfants={budgetInfants}
            onChangeInfants={(delta) => setBudgetInfants((prev) => Math.max(0, Math.min(10, prev + delta)))}
            roomCountOverride={roomCountOverride}
            onChangeRoomCount={(delta) =>
              setRoomCountOverride((prev) => Math.max(1, (prev !== null ? prev : (integratedBudget?.numRooms || 1)) + delta))
            }
            budgetTravellers={budgetTravellers}
            budgetDurationDays={budgetDurationDays}
            onChangeDurationDays={(delta) => setBudgetDurationDays((prev) => Math.max(1, Math.min(30, prev + delta)))}
            budgetStartDate={budgetStartDate}
            onChangeStartDate={(date) => setBudgetStartDate(date)}
            customBudgetPreferences={customBudgetPreferences}
            onChangeCustomPreference={(category, tier) =>
              setCustomBudgetPreferences((prev) => ({ ...prev, [category]: tier }))
            }
            isCustomBudgetOpen={isCustomBudgetOpen}
            onToggleCustomBudget={() => setIsCustomBudgetOpen((prev) => !prev)}
            selectedJourneyStops={selectedJourneyStops}
            journeyOrigin={journeyOrigin}
            journeyRouteResult={journeyRouteResult}
            onCopyBudgetSummary={handleCopyBudgetSummary}
            copyFeedback={copyFeedback}
            onPrintBudget={handlePrintBudget}
          />
        </div>
      )}
    </motion.div>
  );
}

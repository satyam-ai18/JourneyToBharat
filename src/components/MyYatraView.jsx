import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
  MapPin,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  Car,
  Navigation,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Layers,
  RefreshCw,
  Route,
  Award,
  Flame,
  Check,
  X,
  ShieldCheck,
  Building2,
  BookOpen,
  Mountain,
  Landmark,
  PenLine
} from "lucide-react";
import { calculateHaversineKm, computeTopographicalRoadKm, formatDuration, isGhatOrHillTerrain } from "../services/distanceService";
import { FLAGSHIP_DESTINATIONS } from "../data/tirthData";
import { SHAKTIPEETHS_52 } from "../data/shaktipeethData";
import { VARANASI_ORIGIN, VARANASI_SACRED_PLACES } from "../data/varanasiData";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK } from "../utils/imageFallback";

export default function MyYatraView({
  savedFavorites = [],
  onRemoveFavorite,
  onSelectDestination,
  onExploreOnMap,
  onNavigateHome,
  startingLocation,
  onOpenLocationSelector,
  onUpdateFavorites,
  onOpenAiPlanner
}) {
  // Tabs: 'itinerary' | 'completed' | 'favourites' | 'checklist'
  const [activeTab, setActiveTab] = useState("itinerary");
  const [itineraryStops, setItineraryStops] = useState(savedFavorites);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [selectedStopToAdd, setSelectedStopToAdd] = useState("");

  // Completed Yatras / Visited Shrines State (Local Storage)
  const [completedYatras, setCompletedYatras] = useState(() => {
    try {
      const stored = localStorage.getItem("ty_completed_yatras");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load completed yatras", e);
    }
    // Seed default common visits
    return [
      {
        id: "kashi_vishwanath",
        name: "Shri Kashi Vishwanath Temple",
        city: "Varanasi",
        state: "Uttar Pradesh",
        date: "2024",
        badge: "12 Jyotirlinga",
        image: "/images/destinations/kashi_vishwanath.jpg"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("ty_completed_yatras", JSON.stringify(completedYatras));
    } catch (e) {
      console.warn("Could not save completed yatras", e);
    }
  }, [completedYatras]);

  // Master Comprehensive Places Catalogue for Itinerary & Completed Diary
  const allAvailablePlaces = useMemo(() => {
    const map = new Map();
    [...VARANASI_SACRED_PLACES, ...FLAGSHIP_DESTINATIONS, ...SHAKTIPEETHS_52].forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, []);

  // State for "Mark as Completed" in Completed Tab
  const [selectedCompletedToAdd, setSelectedCompletedToAdd] = useState("");
  const [completedVisitDate, setCompletedVisitDate] = useState("2024");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTempleName, setCustomTempleName] = useState("");
  const [customTempleCity, setCustomTempleCity] = useState("");
  const [darshanToast, setDarshanToast] = useState(null);

  const showToast = (msg) => {
    setDarshanToast(msg);
    setTimeout(() => setDarshanToast(null), 3500);
  };

  // Toggle or Mark Any Place as Completed
  const toggleCompleted = (place, customDate = null) => {
    if (!place) return;
    const exists = completedYatras.some((c) => c.id === place.id);
    if (exists) {
      setCompletedYatras((prev) => prev.filter((c) => c.id !== place.id));
      showToast(`Removed "${place.name}" from completed darshans.`);
    } else {
      const newItem = {
        id: place.id,
        name: place.name,
        city: place.city || place.location || "",
        state: place.state || "",
        date: customDate || completedVisitDate || new Date().getFullYear().toString(),
        badge: place.badge || place.categoryLabel || "Sacred Shrine",
        image: place.image || "/images/destinations/kashi_vishwanath.jpg"
      };
      setCompletedYatras((prev) => [newItem, ...prev]);
      showToast(`Darshan recorded for "${place.name}"! Milestones updated.`);
    }
  };

  const handleAddCompletedCustom = () => {
    if (!selectedCompletedToAdd) return;
    const found = allAvailablePlaces.find((p) => p.id === selectedCompletedToAdd);
    if (found) {
      toggleCompleted(found, completedVisitDate || "Visited");
      setSelectedCompletedToAdd("");
    }
  };

  const handleAddCustomTempleEntry = (e) => {
    if (e) e.preventDefault();
    if (!customTempleName.trim()) return;
    const newItem = {
      id: `custom_${Date.now()}`,
      name: customTempleName.trim(),
      city: customTempleCity.trim() || "India",
      state: "",
      date: completedVisitDate || new Date().getFullYear().toString(),
      badge: "Completed Darshan",
      image: "/images/destinations/kashi_vishwanath.jpg"
    };
    setCompletedYatras((prev) => [newItem, ...prev]);
    showToast(`Recorded darshan for "${customTempleName.trim()}"!`);
    setCustomTempleName("");
    setCustomTempleCity("");
  };

  // Milestone Calculations
  const milestones = useMemo(() => {
    const completedIds = new Set(completedYatras.map((c) => c.id));

    // 12 Jyotirlingas list
    const jyotirlingaIds = [
      "somnath_temple", "mallikarjuna_temple", "mahakaleshwar_ujjain", "omkareshwar_temple",
      "kedarnath_temple", "bhimashankar_temple", "kashi_vishwanath", "trimbakeshwar_temple",
      "baidyanath_temple", "nageshwar_temple", "dhanushkodi_rameshwaram", "grishneshwar_temple"
    ];
    const jyotirlingaDone = jyotirlingaIds.filter((id) => completedIds.has(id)).length;

    // Char Dham list
    const chardhamIds = [
      "badrinath_temple", "dwarkadhish_temple", "jagannath_puri", "dhanushkodi_rameshwaram",
      "yamunotri_dham", "gangotri_dham", "kedarnath_temple"
    ];
    const chardhamDone = chardhamIds.filter((id) => completedIds.has(id)).length;

    // 52 Shaktipeeths list
    const shaktiDone = SHAKTIPEETHS_52.filter((p) => completedIds.has(p.id)).length;

    return {
      jyotirlinga: { done: jyotirlingaDone, total: 12, pct: Math.round((jyotirlingaDone / 12) * 100) },
      chardham: { done: Math.min(chardhamDone, 4), total: 4, pct: Math.round((Math.min(chardhamDone, 4) / 4) * 100) },
      shaktipeeth: { done: shaktiDone, total: 52, pct: Math.round((shaktiDone / 52) * 100) },
      totalVisited: completedYatras.length
    };
  }, [completedYatras]);

  // Fast-Add Chips of Popular Sacred Places
  const quickCompletedSuggestions = useMemo(() => {
    const completedIds = new Set(completedYatras.map((c) => c.id));
    return [
      { id: "vaishno_devi", name: "Mata Vaishno Devi", badge: "Trikuta Hills" },
      { id: "mahakaleshwar_ujjain", name: "Mahakaleshwar Jyotirlinga", badge: "Ujjain" },
      { id: "tirupati_balaji", name: "Tirupati Balaji", badge: "Tirumala" },
      { id: "banke_bihari_temple", name: "Banke Bihari Mandir", badge: "Vrindavan" },
      { id: "somnath_temple", name: "Somnath Jyotirlinga", badge: "Gujarat" },
      { id: "kedarnath_temple", name: "Kedarnath Temple", badge: "Himalayas" },
      { id: "badrinath_temple", name: "Badrinath Dham", badge: "Garhwal" },
      { id: "golden_temple", name: "Golden Temple", badge: "Amritsar" },
      { id: "jagannath_puri", name: "Jagannath Puri", badge: "Odisha" },
      { id: "kamakhya_devi", name: "Maa Kamakhya", badge: "Guwahati" },
      { id: "harsiddhi_temple", name: "Harsiddhi Mata", badge: "Ujjain" },
      { id: "ayodhya_ram_mandir", name: "Shri Ram Janmabhoomi", badge: "Ayodhya" }
    ].filter((s) => !completedIds.has(s.id));
  }, [completedYatras]);

  // Add stop to Itinerary
  const handleAddCustomStop = () => {
    if (!selectedStopToAdd) return;
    const found = allAvailablePlaces.find((d) => d.id === selectedStopToAdd);
    if (!found) return;

    if (itineraryStops.some((s) => s.id === found.id)) return;

    const updated = [...itineraryStops, found];
    setItineraryStops(updated);
    if (onUpdateFavorites) onUpdateFavorites(updated);
    setSelectedStopToAdd("");
  };

  // Default Travel Checklist
  const defaultChecklist = [
    { id: 1, text: "Mandatory Yatra Registration & e-Pass / Bio-Metric Slip", done: true },
    { id: 2, text: "Medical Fitness Certificate (Required for High-Altitude Yatra)", done: true },
    { id: 3, text: "Government Photo ID Proof (Aadhaar / Passport / Voter ID)", done: true },
    { id: 4, text: "Warm Thermal Inners, Windproof Jacket & Rain Poncho", done: false },
    { id: 5, text: "Sturdy Waterproof Trekking Shoes with Good Ankle Grip", done: false },
    { id: 6, text: "First Aid Kit, Diamox (Altitude sickness), Pain Relievers & ORS", done: false },
    { id: 7, text: "Physical Indian Rupee Cash (Remote mountain ATMs frequently offline)", done: false },
    { id: 8, text: "High-Capacity 20,000mAh Power Bank & Offline Maps Downloaded", done: false },
    { id: 9, text: "Pre-booked VIP Darshan / Maha Abhishek Puja Tokens", done: false }
  ];

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("ty_yatra_checklist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultChecklist;
      }
    }
    return defaultChecklist;
  });

  useEffect(() => {
    localStorage.setItem("ty_yatra_checklist", JSON.stringify(checklist));
  }, [checklist]);

  // Keep itinerary stops in sync with saved favorites
  useEffect(() => {
    setItineraryStops(savedFavorites);
  }, [savedFavorites]);

  // Reordering functions
  const moveStopUp = (index) => {
    if (index <= 0) return;
    const next = [...itineraryStops];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setItineraryStops(next);
    if (onUpdateFavorites) onUpdateFavorites(next);
  };

  const moveStopDown = (index) => {
    if (index >= itineraryStops.length - 1) return;
    const next = [...itineraryStops];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setItineraryStops(next);
    if (onUpdateFavorites) onUpdateFavorites(next);
  };

  const removeStop = (id) => {
    onRemoveFavorite(id);
  };

  // Pre-configured Pilgrimage Circuit templates
  const canonicalCircuits = [
    {
      id: "varanasi_triangle",
      title: "Varanasi – Prayagraj – Ayodhya",
      tag: "Purvanchal Holy Trinity",
      distance: "~425 km",
      stopsCount: "4 Sanctuaries",
      image: "/images/destinations/hanuman_garhi_ayodhya.jpg",
      stopIds: ["kashi_vishwanath", "vindhyavasini_temple", "ayodhya_ram_mandir"]
    },
    {
      id: "chardham",
      title: "Uttarakhand Char Dham Yatra",
      tag: "4 Sacred Himalayan Dhams",
      distance: "~1,180 km",
      stopsCount: "4 Dhams",
      image: "/images/hero_kedarnath.jpg",
      stopIds: ["yamunotri_dham", "gangotri_dham", "kedarnath_temple", "badrinath_temple"]
    },
    {
      id: "jyotirlingas",
      title: "12 Jyotirlingas Highlights",
      tag: "Pavitra Mahadev Corridor",
      distance: "~2,450 km",
      stopsCount: "5 Jyotirlingas",
      image: "/images/destinations/mahakaleshwar_ujjain.jpg",
      stopIds: ["somnath_temple", "mahakaleshwar_ujjain", "kashi_vishwanath", "kedarnath_temple"]
    },
    {
      id: "panchkroshi",
      title: "Kashi Panch Kroshi Circuit",
      tag: "Cosmic Banaras Parikrama",
      distance: "~85 km",
      stopsCount: "5 Holy Shrines",
      image: "/images/destinations/kashi_vishwanath.jpg",
      stopIds: ["kashi_vishwanath", "manikarnika_ghat", "sankat_mochan", "assi_ghat"]
    }
  ];

  const loadCircuitTemplate = (type) => {
    const circuit = canonicalCircuits.find((c) => c.id === type);
    if (!circuit) return;

    const matched = circuit.stopIds
      .map((id) => allAvailablePlaces.find((d) => d.id === id))
      .filter(Boolean);

    setItineraryStops(matched);
    if (onUpdateFavorites) onUpdateFavorites(matched);
  };

  // Calculate consecutive leg distances and total cumulative route metrics
  const itineraryMetrics = useMemo(() => {
    if (!itineraryStops || itineraryStops.length === 0) {
      return { totalKm: 0, totalDurationFormatted: "0 mins", legs: [] };
    }

    const legs = [];
    let totalKm = 0;

    // Origin to Stop 1
    if (startingLocation?.lat && itineraryStops[0]?.lat) {
      const straight = calculateHaversineKm(
        startingLocation.lat,
        startingLocation.lng,
        itineraryStops[0].lat,
        itineraryStops[0].lng
      );
      const isGhat = isGhatOrHillTerrain(itineraryStops[0].lat, itineraryStops[0].lng);
      const roadKm = computeTopographicalRoadKm(straight, isGhat);
      const speed = isGhat ? 32 : roadKm > 400 ? 60 : 50;
      const mins = Math.round((roadKm / speed) * 60);

      legs.push({
        from: startingLocation.name || "Varanasi Origin",
        to: itineraryStops[0].name,
        km: roadKm,
        duration: formatDuration(mins)
      });
      totalKm += roadKm;
    }

    // Between consecutive stops
    for (let i = 0; i < itineraryStops.length - 1; i++) {
      const a = itineraryStops[i];
      const b = itineraryStops[i + 1];
      const straight = calculateHaversineKm(a.lat, a.lng, b.lat, b.lng);
      const isGhat = isGhatOrHillTerrain(b.lat, b.lng);
      const roadKm = computeTopographicalRoadKm(straight, isGhat);
      const speed = isGhat ? 32 : roadKm > 400 ? 60 : 50;
      const mins = Math.round((roadKm / speed) * 60);

      legs.push({
        from: a.name,
        to: b.name,
        km: roadKm,
        duration: formatDuration(mins)
      });
      totalKm += roadKm;
    }

    const roundedKm = Math.round(totalKm * 10) / 10;
    const totalMinutes = Math.round((roundedKm / 50) * 60);
    return {
      totalKm: roundedKm,
      totalDurationFormatted: `${Math.floor(totalMinutes / 60)} hrs ${totalMinutes % 60} mins`,
      legs
    };
  }, [itineraryStops, startingLocation]);

  // Google Multi-stop Navigation URL
  const googleMultiStopUrl = useMemo(() => {
    if (!itineraryStops || itineraryStops.length === 0) return "#";
    const originStr = startingLocation
      ? `${startingLocation.lat},${startingLocation.lng}`
      : `${itineraryStops[0].lat},${itineraryStops[0].lng}`;

    const destStop = itineraryStops[itineraryStops.length - 1];
    const destStr = `${destStop.lat},${destStop.lng}`;

    const waypoints = itineraryStops
      .slice(0, itineraryStops.length - 1)
      .map((s) => `${s.lat},${s.lng}`);

    if (waypoints.length > 0) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destStr)}&waypoints=${encodeURIComponent(waypoints.join("|"))}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destStr)}`;
  }, [itineraryStops, startingLocation]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const addChecklistItem = (e) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      setChecklist((prev) => [
        ...prev,
        { id: Date.now(), text: newChecklistText.trim(), done: false }
      ]);
      setNewChecklistText("");
    }
  };

  const removeChecklistItem = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = checklist.filter((c) => c.done).length;

  return (
    <div className="ty-my-yatra-view" style={{ position: "relative", zIndex: 1 }}>
      <div className="ty-container">
        {/* Luxury Glass Card Container */}
        <div className="ty-my-yatra-card">
          {/* Header Banner */}
          <div className="ty-my-yatra-header">
            <div>
              <div className="ty-yatra-eyebrow">
                <Sparkles size={13} className="text-amber-400" />
                <span>PILGRIMAGE PLANNER & EXPEDITION BUILDER</span>
              </div>
              <h1 className="ty-yatra-title">My Yatra</h1>
              <p className="ty-yatra-subtitle">
                Plan your multi-stop pilgrimage across sacred Bharat, record completed darshans, and track travel milestones
              </p>
            </div>

            {/* 4 Navigation Tabs: Itinerary / Completed / Saved / Checklist */}
            <div className="ty-yatra-tabs-ribbon">
              <button
                className={`ty-yatra-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
                onClick={() => setActiveTab("itinerary")}
                style={{ position: "relative" }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>Itinerary Plan</span>
                <span className="ty-yatra-tab-count" style={{ position: "relative", zIndex: 2 }}>
                  ({itineraryStops.length})
                </span>
                {activeTab === "itinerary" && (
                  <motion.span
                    layoutId="yatraActiveTabIndicator"
                    className="ty-yatra-tab-pill-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              <button
                className={`ty-yatra-tab-btn ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
                style={{ position: "relative" }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>✓ Completed Darshan</span>
                <span className="ty-yatra-tab-count text-emerald-400" style={{ position: "relative", zIndex: 2 }}>
                  ({completedYatras.length})
                </span>
                {activeTab === "completed" && (
                  <motion.span
                    layoutId="yatraActiveTabIndicator"
                    className="ty-yatra-tab-pill-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              <button
                className={`ty-yatra-tab-btn ${activeTab === "favourites" ? "active" : ""}`}
                onClick={() => setActiveTab("favourites")}
                style={{ position: "relative" }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>Saved Places</span>
                <span className="ty-yatra-tab-count" style={{ position: "relative", zIndex: 2 }}>
                  ({savedFavorites.length})
                </span>
                {activeTab === "favourites" && (
                  <motion.span
                    layoutId="yatraActiveTabIndicator"
                    className="ty-yatra-tab-pill-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              <button
                className={`ty-yatra-tab-btn ${activeTab === "checklist" ? "active" : ""}`}
                onClick={() => setActiveTab("checklist")}
                style={{ position: "relative" }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>Checklist</span>
                <span className="ty-yatra-tab-count" style={{ position: "relative", zIndex: 2 }}>
                  ({completedCount}/{checklist.length})
                </span>
                {activeTab === "checklist" && (
                  <motion.span
                    layoutId="yatraActiveTabIndicator"
                    className="ty-yatra-tab-pill-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* =========================================================================
              TAB 1: ITINERARY PLANNER
              ========================================================================= */}
          {activeTab === "itinerary" && (
            <div className="ty-yatra-tab-panel">
              {/* Origin Banner */}
              <div className="ty-itinerary-origin-strip">
                <div className="ty-itin-origin-left">
                  <div className="ty-itin-origin-pin">
                    <Navigation size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="ty-itin-origin-sub">EXPEDITION STARTING POINT</span>
                    <strong className="ty-itin-origin-name">
                      {startingLocation?.name || VARANASI_ORIGIN.name}
                    </strong>
                    {startingLocation?.isGpsVerified && (
                      <span className="ml-2 text-xs text-emerald-400 font-semibold">(Live GPS)</span>
                    )}
                  </div>
                </div>
                <button
                  className="ty-itin-change-btn"
                  onClick={onOpenLocationSelector}
                  title="Change your starting point"
                >
                  Change Origin
                </button>
              </div>

              {/* Add Custom Destination Dropdown */}
              <div className="ty-add-stop-row">
                <select
                  className="ty-add-stop-select"
                  value={selectedStopToAdd}
                  onChange={(e) => setSelectedStopToAdd(e.target.value)}
                  aria-label="Select sacred destination to add to itinerary"
                >
                  <option value="">＋ Add a sacred destination to your route...</option>
                  {allAvailablePlaces.map((d) => {
                    const isAlreadyAdded = itineraryStops.some((s) => s.id === d.id);
                    return (
                      <option key={d.id} value={d.id} disabled={isAlreadyAdded}>
                        {d.name} ({d.state}) • {d.badge} {isAlreadyAdded ? "✓ Added" : ""}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="ty-add-stop-btn"
                  onClick={handleAddCustomStop}
                  disabled={!selectedStopToAdd}
                  type="button"
                >
                  <Plus size={15} />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Cumulative Route Metrics Bar */}
              {itineraryStops.length > 0 && (
                <div className="ty-itinerary-summary-bar">
                  <div className="ty-itin-summary-stat">
                    <span className="lbl">Total Stops</span>
                    <strong className="val">{itineraryStops.length} Sacred Sanctuaries</strong>
                  </div>
                  <div className="ty-itin-summary-stat">
                    <span className="lbl">Cumulative Road Mileage</span>
                    <strong className="val text-amber-400">~{itineraryMetrics.totalKm} km</strong>
                  </div>
                  <div className="ty-itin-summary-stat">
                    <span className="lbl">Est. Total Driving Time</span>
                    <strong className="val">~{itineraryMetrics.totalDurationFormatted}</strong>
                  </div>

                  <div className="ty-itin-summary-actions">
                    <a
                      href={googleMultiStopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ty-itin-directions-btn"
                      title="Open full sequential multi-stop turn-by-turn route on Google Maps"
                    >
                      <Navigation size={14} />
                      <span>Open in Google Maps</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      className="ty-itin-map-btn"
                      onClick={() => onExploreOnMap()}
                      title="View all places on Interactive Map"
                    >
                      <Compass size={14} />
                      <span>View on Map</span>
                    </button>

                    {onOpenAiPlanner && (
                      <button
                        className="ty-itin-map-btn"
                        onClick={() => onOpenAiPlanner(itineraryStops[0])}
                        style={{
                          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)",
                          color: "#ffd978",
                          borderColor: "#d4af37"
                        }}
                        title="Calculate full train, hotel, local auto & food budget with AI"
                      >
                        <Sparkles size={14} />
                        <span>AI Trip & Budget Plan</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Stops Timeline OR Beautiful Interactive Empty State */}
              {itineraryStops.length === 0 ? (
                <div className="ty-yatra-vibrant-empty-state">
                  <div className="ty-empty-header-glow">
                    <Compass size={40} className="text-amber-400 mb-2" />
                    <h3 className="ty-empty-title">Start Planning Your Sacred Yatra</h3>
                    <p className="ty-empty-desc">
                      Select one of our canonical pilgrimage circuits below to instantly load road routes, driving times, and turn-by-turn directions:
                    </p>
                  </div>

                  {/* 4 Rich Visual Circuit Cards */}
                  <div className="ty-empty-circuits-grid">
                    {canonicalCircuits.map((circ) => (
                      <motion.div
                        key={circ.id}
                        className="ty-empty-circuit-card"
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => loadCircuitTemplate(circ.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="ty-circuit-card-thumb-wrap">
                          <img
                            src={circ.image}
                            alt={circ.title}
                            className="ty-circuit-card-thumb"
                            onError={(e) => handleImgError(e, "/images/destinations/kashi_vishwanath.jpg")}
                          />
                          <span className="ty-circuit-card-badge">{circ.tag}</span>
                        </div>
                        <div className="ty-circuit-card-body">
                          <h4 className="ty-circuit-card-title">{circ.title}</h4>
                          <div className="ty-circuit-card-metrics">
                            <span className="inline-flex items-center gap-1"><Route size={12} className="text-amber-400" /> {circ.distance}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1"><Building2 size={12} className="text-amber-400" /> {circ.stopsCount}</span>
                          </div>
                          <button className="ty-circuit-load-btn">
                            <Plus size={14} />
                            <span>Load Circuit Itinerary</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="ty-empty-footer-action">
                    <button
                      className="ty-explore-catalog-btn"
                      onClick={() => onNavigateHome()}
                    >
                      <span>Explore All Sacred Gems on Home</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ty-itinerary-timeline">
                  {/* Leg 0 Connector from Starting Point */}
                  {itineraryMetrics.legs[0] && (
                    <div className="ty-leg-connector first">
                      <div className="ty-leg-line" />
                      <div className="ty-leg-badge">
                        <Car size={13} className="text-amber-400" />
                        <span>Leg 1: {startingLocation?.city || "Origin"} ➔ {itineraryStops[0]?.name}: <strong>{itineraryMetrics.legs[0].km} km</strong> ({itineraryMetrics.legs[0].duration})</span>
                      </div>
                    </div>
                  )}

                  {itineraryStops.map((stop, idx) => {
                    const nextLeg = itineraryMetrics.legs[idx + 1];
                    const isVisited = completedYatras.some((c) => c.id === stop.id);

                    return (
                      <React.Fragment key={stop.id}>
                        <div className="ty-itinerary-step">
                          <div className="ty-step-number">{idx + 1}</div>

                          <div className="ty-step-card">
                            <div className="ty-step-thumb-wrap">
                              <img
                                src={stop.image}
                                alt={stop.name}
                                className="ty-step-thumb"
                                onError={handleImgError}
                              />
                            </div>

                            <div className="ty-step-body">
                              <div className="ty-step-header-row">
                                <h3 className="ty-step-title">{stop.name}</h3>
                                <span className="ty-step-badge">{stop.badge}</span>
                              </div>

                              <div className="ty-step-meta-row">
                                <span className="ty-step-loc">
                                  <MapPin size={13} className="text-amber-500 inline mr-1" />
                                  {stop.location}
                                </span>
                                {stop.altitude && (
                                  <span className="ty-step-alt">• {stop.altitude}</span>
                                )}
                              </div>

                              <p className="ty-step-deity">
                                <strong>Sanctum:</strong> {stop.deity || stop.name}
                              </p>

                              {/* Darshan Completed Toggle Directly on Card */}
                              <div className="ty-step-darshan-row">
                                <button
                                  className={`ty-step-darshan-toggle ${isVisited ? "completed" : ""}`}
                                  onClick={() => toggleCompleted(stop)}
                                  title={isVisited ? "Click to unmark" : "Mark this temple as visited"}
                                >
                                  {isVisited ? (
                                    <>
                                      <CheckCircle2 size={14} className="text-emerald-400" />
                                      <span>Darshan Completed (दर्शन संपन्न ✓)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check size={14} />
                                      <span>Mark as Visited (दर्शन संपन्न)</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Reorder and Delete Controls */}
                            <div className="ty-step-controls">
                              <button
                                className="ty-reorder-btn"
                                onClick={() => moveStopUp(idx)}
                                disabled={idx === 0}
                                title="Move up in itinerary sequence"
                              >
                                <ChevronUp size={16} />
                              </button>
                              <button
                                className="ty-reorder-btn"
                                onClick={() => moveStopDown(idx)}
                                disabled={idx === itineraryStops.length - 1}
                                title="Move down in itinerary sequence"
                              >
                                <ChevronDown size={16} />
                              </button>
                              <button
                                className="ty-delete-stop-btn"
                                onClick={() => removeStop(stop.id)}
                                title="Remove stop from itinerary"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Leg connector to next stop */}
                        {nextLeg && (
                          <div className="ty-leg-connector">
                            <div className="ty-leg-line" />
                            <div className="ty-leg-badge">
                              <Car size={13} className="text-amber-400" />
                              <span>Leg {idx + 2}: {stop.name} ➔ {itineraryStops[idx + 1]?.name}: <strong>{nextLeg.km} km</strong> ({nextLeg.duration})</span>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: COMPLETED YATRAS & DARSHAN TRACKER (दर्शन संपन्न)
              ========================================================================= */}
          {activeTab === "completed" && (
            <div className="ty-yatra-tab-panel">
              {/* Milestone Progress Cards */}
              <div className="ty-completed-milestones-grid">
                <div className="ty-milestone-card">
                  <div className="ty-milestone-header">
                    <span className="ty-milestone-title flex items-center gap-1.5"><Flame size={14} className="text-amber-400" /> 12 Jyotirlingas</span>
                    <strong className="ty-milestone-val text-amber-400">{milestones.jyotirlinga.done}/12</strong>
                  </div>
                  <div className="ty-progress-bar-track">
                    <motion.div
                      className="ty-progress-bar-fill gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${milestones.jyotirlinga.pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="ty-milestone-pct">{milestones.jyotirlinga.pct}% Completed</span>
                </div>

                <div className="ty-milestone-card">
                  <div className="ty-milestone-header">
                    <span className="ty-milestone-title flex items-center gap-1.5"><Mountain size={14} className="text-emerald-400" /> Char Dham</span>
                    <strong className="ty-milestone-val text-emerald-400">{milestones.chardham.done}/4</strong>
                  </div>
                  <div className="ty-progress-bar-track">
                    <motion.div
                      className="ty-progress-bar-fill emerald"
                      initial={{ width: 0 }}
                      animate={{ width: `${milestones.chardham.pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="ty-milestone-pct">{milestones.chardham.pct}% Completed</span>
                </div>

                <div className="ty-milestone-card">
                  <div className="ty-milestone-header">
                    <span className="ty-milestone-title flex items-center gap-1.5"><Sparkles size={14} className="text-rose-400" /> 52 Shaktipeeths</span>
                    <strong className="ty-milestone-val text-rose-400">{milestones.shaktipeeth.done}/52</strong>
                  </div>
                  <div className="ty-progress-bar-track">
                    <motion.div
                      className="ty-progress-bar-fill rose"
                      initial={{ width: 0 }}
                      animate={{ width: `${milestones.shaktipeeth.pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="ty-milestone-pct">{milestones.shaktipeeth.pct}% Completed</span>
                </div>

                <div className="ty-milestone-card total">
                  <div className="ty-milestone-header">
                    <span className="ty-milestone-title flex items-center gap-1.5"><Compass size={14} className="text-yellow-300" /> Bharat Darshan</span>
                    <strong className="ty-milestone-val text-yellow-300">{milestones.totalVisited} Visited</strong>
                  </div>
                  <span className="text-xs text-stone-400 mt-2 block">
                    Recorded in your personal sacred pilgrimage diary
                  </span>
                </div>
              </div>

              {/* Add Visited Shrine Input */}
              <div className="ty-add-completed-section">
                <h3 className="ty-section-subhead">
                  <Plus size={16} className="text-amber-400" />
                  <span>Record a Sacred Shrine You Have Already Visited (दर्शन दर्ज करें)</span>
                </h3>

                {/* Mode Selector Toggle: Choose from Shrines vs Enter Custom */}
                <div className="ty-mode-switch-row">
                  <button
                    type="button"
                    className={`ty-mode-switch-btn ${!isCustomMode ? "active" : ""}`}
                    onClick={() => setIsCustomMode(false)}
                  >
                    <Building2 size={13} className="text-amber-400 mr-1.5 inline" />
                    <span>Select from 150+ Shrines</span>
                  </button>
                  <button
                    type="button"
                    className={`ty-mode-switch-btn ${isCustomMode ? "active" : ""}`}
                    onClick={() => setIsCustomMode(true)}
                  >
                    <PenLine size={13} className="text-amber-400 mr-1.5 inline" />
                    <span>Enter Custom Shrine</span>
                  </button>
                </div>

                {!isCustomMode ? (
                  <div className="ty-add-completed-controls">
                    <select
                      className="ty-add-stop-select flex-1"
                      value={selectedCompletedToAdd}
                      onChange={(e) => setSelectedCompletedToAdd(e.target.value)}
                      aria-label="Select completed pilgrimage"
                    >
                      <option value="">Choose a temple or shrine you have visited...</option>
                      {allAvailablePlaces.map((p) => {
                        const isDone = completedYatras.some((c) => c.id === p.id);
                        return (
                          <option key={p.id} value={p.id} disabled={isDone}>
                            {p.name} ({p.state || p.location}) • {p.badge} {isDone ? "✓ Recorded" : ""}
                          </option>
                        );
                      })}
                    </select>

                    <input
                      type="text"
                      placeholder="Year / Month (e.g., 2024)"
                      value={completedVisitDate}
                      onChange={(e) => setCompletedVisitDate(e.target.value)}
                      className="ty-visit-year-input"
                    />

                    <button
                      className="ty-add-completed-btn"
                      onClick={handleAddCompletedCustom}
                      disabled={!selectedCompletedToAdd}
                      type="button"
                    >
                      <CheckCircle2 size={15} />
                      <span>Record Darshan ✓</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddCustomTempleEntry} className="ty-add-completed-controls">
                    <input
                      type="text"
                      placeholder="Temple / Shrine Name (e.g., Khatu Shyam Ji, Mehandipur Balaji)..."
                      value={customTempleName}
                      onChange={(e) => setCustomTempleName(e.target.value)}
                      className="ty-custom-input flex-1"
                      required
                    />

                    <input
                      type="text"
                      placeholder="City / State (e.g., Sikar, Rajasthan)"
                      value={customTempleCity}
                      onChange={(e) => setCustomTempleCity(e.target.value)}
                      className="ty-custom-input"
                      style={{ width: "220px" }}
                    />

                    <input
                      type="text"
                      placeholder="Year (e.g., 2023)"
                      value={completedVisitDate}
                      onChange={(e) => setCompletedVisitDate(e.target.value)}
                      className="ty-visit-year-input"
                    />

                    <button
                      className="ty-add-completed-btn"
                      type="submit"
                      disabled={!customTempleName.trim()}
                    >
                      <CheckCircle2 size={15} />
                      <span>Record Custom Darshan ✓</span>
                    </button>
                  </form>
                )}

                {/* 1-Click Quick Check Chips */}
                {quickCompletedSuggestions.length > 0 && (
                  <div className="ty-quick-check-container">
                    <span className="ty-quick-check-lbl">Quick Tap to Mark as Visited:</span>
                    <div className="ty-quick-chips-row">
                      {quickCompletedSuggestions.map((s) => (
                        <button
                          key={s.id}
                          className="ty-quick-check-chip"
                          onClick={() => {
                            const found = allAvailablePlaces.find((p) => p.id === s.id);
                            if (found) toggleCompleted(found);
                          }}
                        >
                          <Plus size={12} className="text-amber-400" />
                          <span>{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Completed Shrines Grid */}
              <div className="ty-completed-grid-section">
                <div className="ty-completed-header-bar">
                  <h4>Your Completed Pilgrimage Diary ({completedYatras.length})</h4>
                  <button
                    className="ty-itin-map-btn"
                    onClick={() => onExploreOnMap()}
                  >
                    <Compass size={13} />
                    <span>View on Bharat Map</span>
                  </button>
                </div>

                {completedYatras.length === 0 ? (
                  <div className="ty-yatra-empty-state">
                    <Award size={36} className="text-amber-500 mb-2" />
                    <p>No completed darshans recorded yet.</p>
                    <span className="text-xs text-stone-400">
                      Use the quick-tap buttons above to mark temples you have already visited!
                    </span>
                  </div>
                ) : (
                  <div className="ty-completed-cards-grid">
                    {completedYatras.map((item) => (
                      <motion.div
                        key={item.id}
                        className="ty-completed-item-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="ty-completed-thumb-wrap">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="ty-completed-thumb"
                            onError={(e) => handleImgError(e, "/images/destinations/kashi_vishwanath.jpg")}
                          />
                          <span className="ty-completed-badge-pill">✓ दर्शन संपन्न</span>
                        </div>
                        <div className="ty-completed-body">
                          <h4 className="ty-completed-name">{item.name}</h4>
                          <span className="ty-completed-loc">
                            <MapPin size={12} className="inline mr-1 text-amber-400" />
                            {item.city ? `${item.city}, ${item.state}` : item.state}
                          </span>
                          <div className="ty-completed-meta">
                            <span className="ty-visit-date">Visited: {item.date}</span>
                            <button
                              className="ty-remove-completed-btn"
                              onClick={() => toggleCompleted(item)}
                              title="Remove from completed list"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SAVED FAVOURITES
              ========================================================================= */}
          {activeTab === "favourites" && (
            <div className="ty-yatra-tab-panel">
              <div className="ty-yatra-panel-top">
                <span className="ty-panel-label">
                  Your Bookmarked Sacred Destinations ({savedFavorites.length})
                </span>
                <button
                  className="ty-gold-outline-btn"
                  onClick={() => onNavigateHome()}
                >
                  <Plus size={14} />
                  <span>Discover More Gems</span>
                </button>
              </div>

              {savedFavorites.length === 0 ? (
                <div className="ty-yatra-empty-state">
                  <Heart size={32} className="text-stone-500 mb-2" />
                  <p>You have not saved any destinations yet.</p>
                  <button
                    className="ty-empty-cta-btn"
                    onClick={() => onNavigateHome()}
                  >
                    Browse Sacred Gems
                  </button>
                </div>
              ) : (
                <div className="ty-yatra-favs-list">
                  {savedFavorites.map((item) => (
                    <div key={item.id} className="ty-yatra-fav-row">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="ty-fav-thumb"
                        onError={handleImgError}
                      />
                      <div className="ty-fav-info">
                        <strong className="ty-fav-title">{item.name}</strong>
                        <span className="ty-fav-loc">
                          <MapPin size={12} className="inline mr-1 text-amber-500" />
                          {item.location}
                        </span>
                        <span className="ty-fav-badge">{item.badge}</span>
                      </div>
                      <div className="ty-fav-actions">
                        <button
                          className="ty-fav-add-itin-btn"
                          onClick={() => {
                            if (!itineraryStops.some((s) => s.id === item.id)) {
                              const updated = [...itineraryStops, item];
                              setItineraryStops(updated);
                              if (onUpdateFavorites) onUpdateFavorites(updated);
                            }
                            setActiveTab("itinerary");
                          }}
                        >
                          <Plus size={13} />
                          <span>Add to Route</span>
                        </button>
                        <button
                          className="ty-fav-remove-btn"
                          onClick={() => onRemoveFavorite(item.id)}
                          title="Remove from favorites"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: TRAVEL CHECKLIST
              ========================================================================= */}
          {activeTab === "checklist" && (
            <div className="ty-yatra-tab-panel">
              <div className="ty-checklist-top-bar">
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-300">
                    Sacred Pilgrimage Essentials Checklist
                  </h3>
                  <p className="text-xs text-stone-400">
                    Tick off your preparation items before embarking on high-altitude or long-distance yatra
                  </p>
                </div>
                <div className="ty-checklist-badge">
                  {completedCount} of {checklist.length} Completed
                </div>
              </div>

              {/* Add Custom Checklist Item */}
              <form onSubmit={addChecklistItem} className="ty-checklist-form">
                <input
                  type="text"
                  placeholder="＋ Add custom gear or task to your checklist..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  className="ty-checklist-input"
                />
                <button type="submit" className="ty-checklist-add-btn">
                  <Plus size={15} />
                  <span>Add Item</span>
                </button>
              </form>

              {/* Checklist Items */}
              <div className="ty-checklist-items-list">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`ty-checklist-item-row ${item.done ? "done" : ""}`}
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    <div className="ty-check-box">
                      {item.done && <Check size={14} className="text-emerald-400" />}
                    </div>
                    <span className="ty-check-text">{item.text}</span>
                    <button
                      type="button"
                      className="ty-check-del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChecklistItem(item.id);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Darshan Notification Toast */}
      <AnimatePresence>
        {darshanToast && (
          <motion.div
            className="ty-darshan-toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{darshanToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

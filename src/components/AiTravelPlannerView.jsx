import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Clock,
  Compass,
  Train,
  Bus,
  Car,
  Home,
  Utensils,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Printer,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Minus,
  ArrowRight,
  HelpCircle,
  Heart,
  Navigation,
  Sliders,
  Settings2,
  Mountain,
  Layers,
  X,
  BedDouble,
  Landmark,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  AlertTriangle,
  UserCheck
} from "lucide-react";

import {
  generateAiTravelPlan,
  LOCATION_COST_INDEX,
  detectLocationCostTier,
  estimateUniversalAccommodation,
  estimateUniversalFood,
  estimateUniversalLocalTransport,
  calculateMultiDestinationRouteLegs
} from "../services/aiTravelPlannerService";
import { FLAGSHIP_DESTINATIONS } from "../data/tirthData";
import { VARANASI_ORIGIN } from "../data/varanasiData";
import { SHAKTIPEETHS_52 } from "../data/shaktipeethData";
import { handleImgError } from "../utils/imageFallback";

export default function AiTravelPlannerView({
  startingLocation,
  onOpenLocationSelector,
  savedFavorites = [],
  onSaveToMyYatra,
  onExploreOnMap,
  initialTargetDestination = null
}) {
  // All combined sacred destinations for auto-suggest
  const allDestinations = useMemo(() => {
    const map = new Map();
    [...FLAGSHIP_DESTINATIONS, ...SHAKTIPEETHS_52].forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  // Multi-Destination State: Supports single or multiple consecutive stops
  const [selectedDestinations, setSelectedDestinations] = useState(() => {
    if (initialTargetDestination) return [initialTargetDestination];
    return [FLAGSHIP_DESTINATIONS[0]];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Travel Dates
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [startDate, setStartDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });

  const [travellers, setTravellers] = useState(2);
  const [durationDays, setDurationDays] = useState(3);

  // Active Tier: 'economy' | 'comfortable' | 'middle' | 'custom'
  const [activeTier, setActiveTier] = useState("comfortable");

  // Custom Category Overrides for Independent Switching
  const [customPreferences, setCustomPreferences] = useState({
    transport: "comfortable",
    accommodation: "comfortable",
    food: "comfortable",
    localTransport: "comfortable",
    darshan: "comfortable"
  });

  const [isCustomPanelOpen, setIsCustomPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary"); // 'itinerary' | 'transport' | 'local' | 'stay' | 'food' | 'darshan'
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Filtered search suggestions
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return allDestinations.slice(0, 10);
    const q = searchQuery.toLowerCase().trim();
    return allDestinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.city && d.city.toLowerCase().includes(q)) ||
          (d.state && d.state.toLowerCase().includes(q)) ||
          (d.location && d.location.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [searchQuery, allDestinations]);

  // Master AI Travel Plan Calculation (Reactive & Instantaneous)
  const travelPlan = useMemo(() => {
    return generateAiTravelPlan({
      origin: startingLocation || VARANASI_ORIGIN,
      destinations: selectedDestinations,
      startDate,
      travellers,
      durationDays,
      preferredTier: activeTier,
      customPreferences
    });
  }, [startingLocation, selectedDestinations, startDate, travellers, durationDays, activeTier, customPreferences]);

  const activePlan = travelPlan.plans[activeTier] || travelPlan.plans.comfortable;

  // Add stop to multi-destination circuit
  const handleAddStop = (dest) => {
    if (!dest) return;
    if (selectedDestinations.some((d) => d.id === dest.id)) return;
    setSelectedDestinations((prev) => [...prev, dest]);
  };

  // Remove stop from circuit
  const handleRemoveStop = (destId) => {
    if (selectedDestinations.length <= 1) return;
    setSelectedDestinations((prev) => prev.filter((d) => d.id !== destId));
  };

  // Pre-configured Sacred Pilgrimage Circuits for 1-Click Planning
  const quickCircuits = [
    {
      name: "Purvanchal Triangle",
      stops: ["kashi_vishwanath", "ayodhya", "prayagraj"],
      duration: 4
    },
    {
      name: "Braj Mandala",
      stops: ["katyayani_vrindavan", "mathura"],
      duration: 3
    },
    {
      name: "Malwa Jyotirlinga",
      stops: ["mahakaleshwar_ujjain", "harsiddhi_ujjain"],
      duration: 3
    }
  ];

  const handleLoadCircuitPreset = (circuit) => {
    const matched = [];
    circuit.stops.forEach((sId) => {
      const found = allDestinations.find((d) => d.id === sId || d.city?.toLowerCase().includes(sId));
      if (found) matched.push(found);
    });
    if (matched.length > 0) {
      setSelectedDestinations(matched);
      setDurationDays(circuit.duration);
    }
  };

  // Update single custom preference
  const updateCustomPreference = (category, value) => {
    setCustomPreferences((prev) => ({ ...prev, [category]: value }));
    setActiveTier("custom");
  };

  // Quick Origins
  const quickOrigins = [
    { name: "Varanasi (Kashi)", lat: 25.3176, lng: 82.9739, city: "Varanasi", state: "Uttar Pradesh" },
    { name: "New Delhi (NDLS)", lat: 28.6139, lng: 77.209, city: "New Delhi", state: "Delhi" },
    { name: "Lucknow (LKO)", lat: 26.8467, lng: 80.9462, city: "Lucknow", state: "Uttar Pradesh" },
    { name: "Mumbai (CSMT)", lat: 18.9401, lng: 72.8347, city: "Mumbai", state: "Maharashtra" },
    { name: "Kolkata (HWH)", lat: 22.5726, lng: 88.3639, city: "Kolkata", state: "West Bengal" },
    { name: "Bengaluru (SBC)", lat: 12.9716, lng: 77.5946, city: "Bengaluru", state: "Karnataka" }
  ];

  // Copy WhatsApp summary handler
  const handleCopySummary = () => {
    const lines = [
      `JOURNEY TO BHARAT — COMPLETE TRAVEL PLAN & BUDGET`,
      `Route: ${startingLocation?.city || "Varanasi"} ➔ ${selectedDestinations.map((d) => d.name).join(" ➔ ")}`,
      `Location Tier: ${travelPlan.tierMeta.label} (${travelPlan.tierMeta.index}x Cost Index)`,
      `Date: ${startDate} (${durationDays} Days / ${travelPlan.numNights} Nights)`,
      `Travellers: ${travellers} Person(s) | Rooms: ${travelPlan.numRooms}`,
      `Selected Plan: ${activePlan.title} (${activePlan.badge})`,
      `---------------------------------------`,
      `Total Estimated Budget: ₹${activePlan.totalCost.toLocaleString("en-IN")}`,
      `Cost Per Person: ₹${activePlan.perPersonCost.toLocaleString("en-IN")}`,
      `Cost Per Day: ₹${activePlan.perDayCost.toLocaleString("en-IN")}`,
      `---------------------------------------`,
      `Itemized Breakdown:`,
      `• Intercity Travel: ₹${activePlan.breakdown.intercityTransport.toLocaleString("en-IN")} (${activePlan.details.transportMode})`,
      `• Accommodation: ₹${activePlan.breakdown.accommodation.toLocaleString("en-IN")} (${activePlan.details.stayType} @ ₹${activePlan.details.stayRatePerNight}/room/night)`,
      `• Local Transport: ₹${activePlan.breakdown.localTransport.toLocaleString("en-IN")} (${activePlan.details.localTransitStyle})`,
      `• Food & Meals: ₹${activePlan.breakdown.food.toLocaleString("en-IN")} (${activePlan.details.foodStyle})`,
      `• Darshan & Entry: ₹${activePlan.breakdown.darshanAndSightseeing.toLocaleString("en-IN")}`,
      `• Emergency Reserve (Buffer): ₹${activePlan.breakdown.emergencyBuffer.toLocaleString("en-IN")}`,
      `---------------------------------------`,
      `Generated by Journey to Bharat Universal Smart Budget Engine`
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="ty-ai-planner-view">
      <div className="ty-container">
        {/* Master AI Header */}
        <div className="ty-ai-planner-header">
          <div className="ty-ai-badge">
            <Sparkles size={13} className="text-amber-400" />
            <span>UNIVERSAL LOCATION-BASED SMART BUDGET ENGINE</span>
          </div>
          <h1 className="ty-ai-title">AI Automatic Travel & Budget Calculation System</h1>
          <p className="ty-ai-subtitle">
            Zero manual research needed. Journey to Bharat automatically calculates realistic local costs
            across Indian Railways, State RTC buses, accommodations, local auto-rickshaws, and pure veg dining.
          </p>
        </div>

        {/* =========================================================================
            SECTION 1: CONFIGURATION & MULTI-STOP ROUTE BUILDER
            ========================================================================= */}
        <div className="ty-ai-config-card">
          <div className="ty-ai-config-grid">
            {/* Field 1: Starting Location */}
            <div className="ty-config-field">
              <label className="ty-field-label">
                <Navigation size={13} className="text-emerald-400" />
                <span>Starting Origin:</span>
              </label>
              <div className="ty-field-value-row">
                <span className="ty-field-main-val">
                  {startingLocation?.name || VARANASI_ORIGIN.name}
                </span>
                <button
                  type="button"
                  className="ty-change-origin-pill"
                  onClick={onOpenLocationSelector}
                  title="Change your starting city"
                >
                  Change
                </button>
              </div>

              {/* Quick Origin Chips */}
              <div className="ty-quick-origin-chips">
                <span className="text-[10px] text-stone-400 block mb-1">Quick Origins:</span>
                <div className="flex flex-wrap gap-1">
                  {quickOrigins.map((orig) => (
                    <button
                      key={orig.name}
                      type="button"
                      className={`ty-quick-orig-chip ${(startingLocation?.city || "Varanasi") === orig.city ? "active" : ""
                        }`}
                      onClick={() => onOpenLocationSelector && onOpenLocationSelector(orig)}
                    >
                      {orig.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 2: Multi-Destination Route Circuit */}
            <div className="ty-config-field" style={{ position: "relative" }}>
              <label className="ty-field-label">
                <MapPin size={13} className="text-amber-400" />
                <span>Selected Destination(s):</span>
              </label>

              {/* Active Stops Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedDestinations.map((dest, idx) => (
                  <span key={dest.id || idx} className="ty-selected-stop-chip">
                    <span className="idx">{idx + 1}</span>
                    <span className="name">{dest.name}</span>
                    {selectedDestinations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(dest.id)}
                        className="remove-btn"
                        title="Remove stop"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <input
                type="text"
                className="ty-config-input"
                placeholder="＋ Add another stop (e.g. Ayodhya, Prayagraj, Ujjain)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && filteredDestinations.length > 0 && (
                <div className="ty-autocomplete-dropdown">
                  {filteredDestinations.map((d) => {
                    const isAdded = selectedDestinations.some((s) => s.id === d.id);
                    return (
                      <div
                        key={d.id}
                        className={`ty-autocomplete-item ${isAdded ? "opacity-60 pointer-events-none" : ""}`}
                        onClick={() => handleAddStop(d)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <div>
                          <div className="font-semibold text-white text-xs">{d.name}</div>
                          <div className="text-[11px] text-stone-400">
                            {d.city || d.location}, {d.state} • {d.badge}
                          </div>
                        </div>
                        {isAdded ? (
                          <span className="text-[10px] text-emerald-400 font-bold">✓ Added</span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold">+ Add</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Circuit Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-stone-400">Sample Circuits:</span>
                {quickCircuits.map((circ) => (
                  <button
                    key={circ.name}
                    type="button"
                    onClick={() => handleLoadCircuitPreset(circ)}
                    className="ty-quick-circuit-chip"
                  >
                    + {circ.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Travel Dates */}
            <div className="ty-config-field">
              <label className="ty-field-label">
                <Calendar size={13} className="text-blue-400" />
                <span>Departure Date:</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ty-config-input"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                Season: {travelPlan.destination.bestTime ? travelPlan.destination.bestTime.slice(0, 32) : "All-season pilgrimage"}
              </span>
            </div>

            {/* Field 4: Number of Travellers */}
            <div className="ty-config-field">
              <label className="ty-field-label">
                <Users size={13} className="text-purple-400" />
                <span>Travellers:</span>
              </label>
              <div className="ty-stepper-row">
                <button
                  type="button"
                  className="ty-stepper-btn"
                  onClick={() => setTravellers((prev) => Math.max(1, prev - 1))}
                  disabled={travellers <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="ty-stepper-val">{travellers} {travellers === 1 ? "Person" : "Persons"}</span>
                <button
                  type="button"
                  className="ty-stepper-btn"
                  onClick={() => setTravellers((prev) => Math.min(12, prev + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                Allocating {travelPlan.numRooms} Room(s) (2 guests/room)
              </span>
            </div>

            {/* Field 5: Trip Duration (Days) */}
            <div className="ty-config-field">
              <label className="ty-field-label">
                <Clock size={13} className="text-amber-400" />
                <span>Trip Duration:</span>
              </label>
              <div className="ty-stepper-row">
                <button
                  type="button"
                  className="ty-stepper-btn"
                  onClick={() => setDurationDays((prev) => Math.max(1, prev - 1))}
                  disabled={durationDays <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="ty-stepper-val">{durationDays} {durationDays === 1 ? "Day" : "Days"}</span>
                <button
                  type="button"
                  className="ty-stepper-btn"
                  onClick={() => setDurationDays((prev) => Math.min(14, prev + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">
                {travelPlan.numNights} Night(s) Stay Scheduled
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: LOCATION COST-OF-LIVING TIER & TERRAIN NOTICES
            ========================================================================= */}
        <div className="ty-tier-banner">
          <div className="ty-tier-info-left">
            <span className="ty-tier-pill inline-flex items-center gap-1.5"><MapPin size={11} className="text-amber-400" /> Location Tier: {travelPlan.tierMeta.label}</span>
            <span className="ty-tier-multiplier">Cost Index: <strong>{travelPlan.tierMeta.index}x</strong></span>
            {travelPlan.accommodationEst.dharamshalaAvailable ? (
              <span className="ty-tier-dharamshala-ok">Trust Dharamshalas Available</span>
            ) : (
              <span className="ty-tier-dharamshala-no inline-flex items-center gap-1.5"><AlertTriangle size={11} className="text-amber-400" /> {travelPlan.tierMeta.dharamshalaNote}</span>
            )}
          </div>

          {travelPlan.localTransitEst.isHimalayan && (
            <div className="ty-himalayan-alert">
              <Mountain size={14} className="text-amber-400 shrink-0" />
              <span>
                <strong>Himalayan Mountain Notice:</strong> Regular auto-rickshaws do NOT operate. Local transit includes walking pilgrimage trek, shared mountain sumos, registered ponies, or heli-shuttles.
              </span>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 3: THREE UNIVERSAL BUDGET CATEGORIES + CUSTOM MIX
            ========================================================================= */}
        <div className="ty-ai-section-heading">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="ty-section-num">1</span>
              <h2 className="text-lg font-serif font-bold text-white">
                Three Universal Budget Categories
              </h2>
            </div>

            {/* Independent Category Switcher Trigger */}
            <button
              type="button"
              className={`ty-custom-switch-toggle ${activeTier === "custom" || isCustomPanelOpen ? "active" : ""}`}
              onClick={() => setIsCustomPanelOpen(!isCustomPanelOpen)}
            >
              <Settings2 size={14} />
              <span>Customize Categories Independently (Mix & Match)</span>
              <ChevronDown size={14} className={`transform transition-transform ${isCustomPanelOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Choose one category for the entire journey, or customize each expense type independently below.
          </p>
        </div>

        {/* Independent Customization Switcher Panel */}
        <AnimatePresence>
          {isCustomPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="ty-custom-switcher-panel"
            >
              <div className="ty-custom-switcher-title">
                <Sliders size={15} className="text-amber-400" />
                <span>Independent Category Customizer (Mix & Match Categories):</span>
              </div>

              <div className="ty-custom-dropdowns-grid">
                {/* 1. Intercity Transport */}
                <div className="ty-custom-field">
                  <label className="flex items-center gap-1.5"><Train size={13} className="text-amber-400" /> Intercity Travel:</label>
                  <select
                    value={customPreferences.transport}
                    onChange={(e) => updateCustomPreference("transport", e.target.value)}
                  >
                    <option value="economy">Cheapest: Sleeper Train / Ordinary Bus</option>
                    <option value="comfortable">Balanced: 3rd AC (3A) / AC Bus</option>
                    <option value="middle">Mid Budget: 2nd AC (2A) / Private Cab</option>
                  </select>
                </div>

                {/* 2. Accommodation */}
                <div className="ty-custom-field">
                  <label className="flex items-center gap-1.5"><BedDouble size={13} className="text-amber-400" /> Accommodation:</label>
                  <select
                    value={customPreferences.accommodation}
                    onChange={(e) => updateCustomPreference("accommodation", e.target.value)}
                  >
                    <option value="economy">Cheapest: Dharamshala / Pilgrim Bhawan (~₹{travelPlan.accommodationEst.tariffs.economy}/N)</option>
                    <option value="comfortable">Balanced: Standard Budget Hotel (~₹{travelPlan.accommodationEst.tariffs.comfortable}/N)</option>
                    <option value="middle">Mid Budget: 3-Star Deluxe Hotel (~₹{travelPlan.accommodationEst.tariffs.middle}/N)</option>
                  </select>
                </div>

                {/* 3. Food */}
                <div className="ty-custom-field">
                  <label className="flex items-center gap-1.5"><Utensils size={13} className="text-amber-400" /> Food & Meals:</label>
                  <select
                    value={customPreferences.food}
                    onChange={(e) => updateCustomPreference("food", e.target.value)}
                  >
                    <option value="economy">Cheapest: Temple Langar & Simple Thalis (~₹{travelPlan.foodEst.mealBreakdown.economy.totalDayPerPerson}/day)</option>
                    <option value="comfortable">Balanced: AC Pure Veg Restaurant (~₹{travelPlan.foodEst.mealBreakdown.comfortable.totalDayPerPerson}/day)</option>
                    <option value="middle">Mid Budget: Premium Dining & Hotel Buffet (~₹{travelPlan.foodEst.mealBreakdown.middle.totalDayPerPerson}/day)</option>
                  </select>
                </div>

                {/* 4. Local Transport */}
                <div className="ty-custom-field">
                  <label className="flex items-center gap-1.5"><Car size={13} className="text-amber-400" /> Local Transport:</label>
                  <select
                    value={customPreferences.localTransport}
                    onChange={(e) => updateCustomPreference("localTransport", e.target.value)}
                  >
                    <option value="economy">Cheapest: Shared E-Rickshaws & Walking</option>
                    <option value="comfortable">Balanced: Private Auto & Half-Day Package</option>
                    <option value="middle">Mid Budget: Private AC Cab at Disposal</option>
                  </select>
                </div>

                {/* 5. Darshan */}
                <div className="ty-custom-field">
                  <label className="flex items-center gap-1.5"><Landmark size={13} className="text-amber-400" /> Darshan & Entry:</label>
                  <select
                    value={customPreferences.darshan}
                    onChange={(e) => updateCustomPreference("darshan", e.target.value)}
                  >
                    <option value="economy">Cheapest: Free General Darshan Queue (₹0)</option>
                    <option value="comfortable">Balanced: Sugam / Priority Token</option>
                    <option value="middle">Mid Budget: VIP Pass + Special Archana</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3 Universal Preset Cards + Custom Mix */}
        <div className="ty-plans-grid">
          {/* Plan A: Economy / Cheapest */}
          <div
            className={`ty-plan-card ${activeTier === "economy" ? "active" : ""}`}
            onClick={() => setActiveTier("economy")}
            role="button"
            tabIndex={0}
          >
            <div className="ty-plan-header">
              <span className="ty-plan-pill green">{travelPlan.plans.economy.badge}</span>
              <h3 className="ty-plan-title">{travelPlan.plans.economy.title}</h3>
              <p className="ty-plan-tagline">{travelPlan.plans.economy.tagline}</p>
            </div>

            <div className="ty-plan-price-block">
              <div className="ty-plan-price-main">
                <span className="text-sm font-sans">₹</span>
                {travelPlan.plans.economy.totalCost.toLocaleString("en-IN")}
              </div>
              <div className="ty-plan-price-sub">
                ₹{travelPlan.plans.economy.perPersonCost.toLocaleString("en-IN")} / person • ₹{travelPlan.plans.economy.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <div className="ty-plan-features-list">
              <div className="ty-plan-feature-item">
                <Train size={13} className="text-emerald-400" />
                <span>{travelPlan.plans.economy.details.transportMode}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Home size={13} className="text-emerald-400" />
                <span>{travelPlan.plans.economy.details.stayType}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Utensils size={13} className="text-emerald-400" />
                <span>{travelPlan.plans.economy.details.foodStyle}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Compass size={13} className="text-emerald-400" />
                <span>{travelPlan.plans.economy.details.localTransitStyle}</span>
              </div>
            </div>

            <button className="ty-select-plan-btn">
              {activeTier === "economy" ? "✓ Active Plan" : "Select Cheapest Plan"}
            </button>
          </div>

          {/* Plan B: Balanced / Comfortable (Recommended) */}
          <div
            className={`ty-plan-card recommended ${activeTier === "comfortable" ? "active" : ""}`}
            onClick={() => setActiveTier("comfortable")}
            role="button"
            tabIndex={0}
          >
            <div className="ty-recommended-ribbon">RECOMMENDED BALANCED VALUE</div>

            <div className="ty-plan-header">
              <span className="ty-plan-pill gold">{travelPlan.plans.comfortable.badge}</span>
              <h3 className="ty-plan-title">{travelPlan.plans.comfortable.title}</h3>
              <p className="ty-plan-tagline">{travelPlan.plans.comfortable.tagline}</p>
            </div>

            <div className="ty-plan-price-block">
              <div className="ty-plan-price-main text-amber-400">
                <span className="text-sm font-sans">₹</span>
                {travelPlan.plans.comfortable.totalCost.toLocaleString("en-IN")}
              </div>
              <div className="ty-plan-price-sub">
                ₹{travelPlan.plans.comfortable.perPersonCost.toLocaleString("en-IN")} / person • ₹{travelPlan.plans.comfortable.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <div className="ty-plan-features-list">
              <div className="ty-plan-feature-item">
                <Train size={13} className="text-amber-400" />
                <span>{travelPlan.plans.comfortable.details.transportMode}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Home size={13} className="text-amber-400" />
                <span>{travelPlan.plans.comfortable.details.stayType}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Utensils size={13} className="text-amber-400" />
                <span>{travelPlan.plans.comfortable.details.foodStyle}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Compass size={13} className="text-amber-400" />
                <span>{travelPlan.plans.comfortable.details.localTransitStyle}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Ticket size={13} className="text-amber-400" />
                <span>{travelPlan.plans.comfortable.details.darshanType}</span>
              </div>
            </div>

            <button className="ty-select-plan-btn recommended">
              {activeTier === "comfortable" ? "✓ Recommended Active" : "Select Balanced Plan"}
            </button>
          </div>

          {/* Plan C: Mid Budget */}
          <div
            className={`ty-plan-card ${activeTier === "middle" ? "active" : ""}`}
            onClick={() => setActiveTier("middle")}
            role="button"
            tabIndex={0}
          >
            <div className="ty-plan-header">
              <span className="ty-plan-pill purple">{travelPlan.plans.middle.badge}</span>
              <h3 className="ty-plan-title">{travelPlan.plans.middle.title}</h3>
              <p className="ty-plan-tagline">{travelPlan.plans.middle.tagline}</p>
            </div>

            <div className="ty-plan-price-block">
              <div className="ty-plan-price-main text-purple-300">
                <span className="text-sm font-sans">₹</span>
                {travelPlan.plans.middle.totalCost.toLocaleString("en-IN")}
              </div>
              <div className="ty-plan-price-sub">
                ₹{travelPlan.plans.middle.perPersonCost.toLocaleString("en-IN")} / person • ₹{travelPlan.plans.middle.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <div className="ty-plan-features-list">
              <div className="ty-plan-feature-item">
                <Car size={13} className="text-purple-400" />
                <span>{travelPlan.plans.middle.details.transportMode}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Home size={13} className="text-purple-400" />
                <span>{travelPlan.plans.middle.details.stayType}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Utensils size={13} className="text-purple-400" />
                <span>{travelPlan.plans.middle.details.foodStyle}</span>
              </div>
              <div className="ty-plan-feature-item">
                <Compass size={13} className="text-purple-400" />
                <span>{travelPlan.plans.middle.details.localTransitStyle}</span>
              </div>
            </div>

            <button className="ty-select-plan-btn">
              {activeTier === "middle" ? "✓ Active Plan" : "Select Mid Budget Plan"}
            </button>
          </div>

          {/* Plan D: Custom Mixed Plan (When active) */}
          {activeTier === "custom" && (
            <div className="ty-plan-card custom-active">
              <div className="ty-plan-header">
                <span className="ty-plan-pill blue">{travelPlan.plans.custom.badge}</span>
                <h3 className="ty-plan-title">{travelPlan.plans.custom.title}</h3>
                <p className="ty-plan-tagline">{travelPlan.plans.custom.tagline}</p>
              </div>

              <div className="ty-plan-price-block">
                <div className="ty-plan-price-main text-blue-300">
                  <span className="text-sm font-sans">₹</span>
                  {travelPlan.plans.custom.totalCost.toLocaleString("en-IN")}
                </div>
                <div className="ty-plan-price-sub">
                  ₹{travelPlan.plans.custom.perPersonCost.toLocaleString("en-IN")} / person • ₹{travelPlan.plans.custom.perDayCost.toLocaleString("en-IN")} / day
                </div>
              </div>

              <div className="ty-plan-features-list">
                <div className="ty-plan-feature-item">
                  <Train size={13} className="text-blue-400" />
                  <span>Transport: <strong>{customPreferences.transport}</strong></span>
                </div>
                <div className="ty-plan-feature-item">
                  <Home size={13} className="text-blue-400" />
                  <span>Stay: <strong>{customPreferences.accommodation}</strong></span>
                </div>
                <div className="ty-plan-feature-item">
                  <Utensils size={13} className="text-blue-400" />
                  <span>Food: <strong>{customPreferences.food}</strong></span>
                </div>
                <div className="ty-plan-feature-item">
                  <Compass size={13} className="text-blue-400" />
                  <span>Local: <strong>{customPreferences.localTransport}</strong></span>
                </div>
              </div>

              <button className="ty-select-plan-btn" style={{ borderColor: "#38bdf8", color: "#38bdf8" }}>
                ✓ Custom Mix Active
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 4: COST BREAKDOWN PROGRESS BAR
            ========================================================================= */}
        <div className="ty-cost-breakdown-card">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Itemized Cost Distribution ({activePlan.title})
            </h4>
            <span className="text-xs text-stone-400">
              Total: <strong>₹{activePlan.totalCost.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          {/* Proportional Multi-Color Progress Bar */}
          <div className="ty-multi-progress-track">
            <div
              className="ty-progress-seg blue"
              style={{
                width: `${(activePlan.breakdown.intercityTransport / activePlan.totalCost) * 100}%`
              }}
              title={`Intercity Transit: ₹${activePlan.breakdown.intercityTransport}`}
            />
            <div
              className="ty-progress-seg purple"
              style={{
                width: `${(activePlan.breakdown.accommodation / activePlan.totalCost) * 100}%`
              }}
              title={`Accommodation: ₹${activePlan.breakdown.accommodation}`}
            />
            <div
              className="ty-progress-seg teal"
              style={{
                width: `${(activePlan.breakdown.localTransport / activePlan.totalCost) * 100}%`
              }}
              title={`Local Transit: ₹${activePlan.breakdown.localTransport}`}
            />
            <div
              className="ty-progress-seg rose"
              style={{
                width: `${(activePlan.breakdown.food / activePlan.totalCost) * 100}%`
              }}
              title={`Food: ₹${activePlan.breakdown.food}`}
            />
            <div
              className="ty-progress-seg gold"
              style={{
                width: `${(activePlan.breakdown.darshanAndSightseeing / activePlan.totalCost) * 100}%`
              }}
              title={`Darshan: ₹${activePlan.breakdown.darshanAndSightseeing}`}
            />
            <div
              className="ty-progress-seg gray"
              style={{
                width: `${(activePlan.breakdown.emergencyBuffer / activePlan.totalCost) * 100}%`
              }}
              title={`Emergency Buffer: ₹${activePlan.breakdown.emergencyBuffer}`}
            />
          </div>

          {/* Breakdown Pills */}
          <div className="ty-breakdown-pills-row">
            <span className="ty-bd-pill">
              <span className="dot blue" /> Intercity Travel: ₹{activePlan.breakdown.intercityTransport.toLocaleString("en-IN")}
            </span>
            <span className="ty-bd-pill">
              <span className="dot purple" /> Stay: ₹{activePlan.breakdown.accommodation.toLocaleString("en-IN")}
            </span>
            <span className="ty-bd-pill">
              <span className="dot teal" /> Local Transit: ₹{activePlan.breakdown.localTransport.toLocaleString("en-IN")}
            </span>
            <span className="ty-bd-pill">
              <span className="dot rose" /> Food: ₹{activePlan.breakdown.food.toLocaleString("en-IN")}
            </span>
            <span className="ty-bd-pill">
              <span className="dot gold" /> Darshan/Entry: ₹{activePlan.breakdown.darshanAndSightseeing.toLocaleString("en-IN")}
            </span>
            <span className="ty-bd-pill">
              <span className="dot gray" /> Emergency Buffer: ₹{activePlan.breakdown.emergencyBuffer.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: IN-DEPTH DETAIL TABS
            ========================================================================= */}
        <div className="ty-detail-tabs-wrapper">
          <div className="ty-detail-tabs-bar">
            <button
              className={`ty-detail-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
              onClick={() => setActiveTab("itinerary")}
            >
              <Calendar size={14} />
              <span>Day-Wise Plan ({travelPlan.itineraryDays.length} Days)</span>
            </button>

            <button
              className={`ty-detail-tab-btn ${activeTab === "transport" ? "active" : ""}`}
              onClick={() => setActiveTab("transport")}
            >
              <Train size={14} />
              <span>Intercity Route Matrix ({travelPlan.routeLegs.length} Legs)</span>
            </button>

            <button
              className={`ty-detail-tab-btn ${activeTab === "stay" ? "active" : ""}`}
              onClick={() => setActiveTab("stay")}
            >
              <Home size={14} />
              <span>Universal Accommodation ({travelPlan.numRooms} Rooms)</span>
            </button>

            <button
              className={`ty-detail-tab-btn ${activeTab === "food" ? "active" : ""}`}
              onClick={() => setActiveTab("food")}
            >
              <Utensils size={14} />
              <span>Itemized Food Budget (Breakfast, Lunch, Dinner)</span>
            </button>

            <button
              className={`ty-detail-tab-btn ${activeTab === "local" ? "active" : ""}`}
              onClick={() => setActiveTab("local")}
            >
              <Compass size={14} />
              <span>Local Transit & Shrines</span>
            </button>

            <button
              className={`ty-detail-tab-btn ${activeTab === "darshan" ? "active" : ""}`}
              onClick={() => setActiveTab("darshan")}
            >
              <Ticket size={14} />
              <span>Darshan & Sanctum Details</span>
            </button>
          </div>

          <div className="ty-detail-tab-content">
            {/* TAB 1: DAY-WISE ITINERARY */}
            {activeTab === "itinerary" && (
              <div className="ty-itinerary-tab-panel">
                <div className="ty-itin-header-info">
                  <h3 className="text-base font-serif font-bold text-white">
                    Day-Wise Practical Pilgrimage Schedule
                  </h3>
                  <p className="text-xs text-stone-400">
                    Paced specifically around {travelPlan.destProfile.sanctumName} opening hours,
                    aarti timings, and transit logistics.
                  </p>
                </div>

                <div className="ty-days-accordion-list">
                  {travelPlan.itineraryDays.map((dayItem) => (
                    <div key={dayItem.dayNumber} className="ty-day-card">
                      <div className="ty-day-card-header">
                        <span className="ty-day-badge">DAY {dayItem.dayNumber}</span>
                        <h4 className="ty-day-title">{dayItem.title}</h4>
                        <span className="ty-day-date">{dayItem.dateFormatted}</span>
                      </div>

                      <div className="ty-day-slots-grid">
                        {/* Morning */}
                        <div className="ty-slot-block morning">
                          <span className="ty-slot-tag inline-flex items-center gap-1"><Sunrise size={11} className="text-amber-400" /> MORNING ({dayItem.morning.time})</span>
                          <strong className="ty-slot-title">{dayItem.morning.title}</strong>
                          <p className="ty-slot-desc">{dayItem.morning.description}</p>
                          <div className="ty-slot-meta">
                            <span className="inline-flex items-center gap-1"><Car size={11} className="text-amber-400" /> {dayItem.morning.localTransitMode}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              Est: ₹{dayItem.morning.estimatedCost}
                            </span>
                          </div>
                        </div>

                        {/* Afternoon */}
                        <div className="ty-slot-block afternoon">
                          <span className="ty-slot-tag inline-flex items-center gap-1"><Sun size={11} className="text-amber-400" /> AFTERNOON ({dayItem.afternoon.time})</span>
                          <strong className="ty-slot-title">{dayItem.afternoon.title}</strong>
                          <p className="ty-slot-desc">{dayItem.afternoon.description}</p>
                          <div className="ty-slot-meta">
                            <span className="inline-flex items-center gap-1"><Car size={11} className="text-amber-400" /> {dayItem.afternoon.localTransitMode}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              Est: ₹{dayItem.afternoon.estimatedCost}
                            </span>
                          </div>
                        </div>

                        {/* Evening */}
                        <div className="ty-slot-block evening">
                          <span className="ty-slot-tag inline-flex items-center gap-1"><Sunset size={11} className="text-amber-400" /> EVENING ({dayItem.evening.time})</span>
                          <strong className="ty-slot-title">{dayItem.evening.title}</strong>
                          <p className="ty-slot-desc">{dayItem.evening.description}</p>
                          <div className="ty-slot-meta">
                            <span className="inline-flex items-center gap-1"><Car size={11} className="text-amber-400" /> {dayItem.evening.localTransitMode}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              Est: ₹{dayItem.evening.estimatedCost}
                            </span>
                          </div>
                        </div>

                        {/* Night */}
                        <div className="ty-slot-block night">
                          <span className="ty-slot-tag inline-flex items-center gap-1"><Moon size={11} className="text-amber-400" /> NIGHT ({dayItem.night.time})</span>
                          <strong className="ty-slot-title">{dayItem.night.title}</strong>
                          <p className="ty-slot-desc">{dayItem.night.description}</p>
                          <div className="ty-slot-meta">
                            <span className="text-emerald-400 font-semibold">
                              Est: ₹{dayItem.night.estimatedCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: INTERCITY TRANSPORT MATRIX */}
            {activeTab === "transport" && (
              <div className="ty-transport-tab-panel">
                {/* Route-Wise Intercity Table for all consecutive legs */}
                <div className="mb-4">
                  <h3 className="text-base font-serif font-bold text-white">
                    Leg-by-Leg Intercity Route Comparison
                  </h3>
                  <p className="text-xs text-stone-400">
                    Comparing official Indian Railways telescopic rates, State RTC buses, and private road travel across {travelPlan.routeLegs.length} route leg(s).
                  </p>
                </div>

                <div className="ty-route-legs-table-wrap">
                  <table className="ty-route-legs-table">
                    <thead>
                      <tr>
                        <th>Leg</th>
                        <th>From ➔ To</th>
                        <th>Distance</th>
                        <th>Train Sleeper</th>
                        <th>Train 3AC</th>
                        <th>Train 2AC</th>
                        <th>Ordinary Bus</th>
                        <th>AC Bus</th>
                        <th>Cab Fuel & Toll</th>
                      </tr>
                    </thead>
                    <tbody>
                      {travelPlan.routeLegs.map((leg) => (
                        <tr key={leg.legIndex}>
                          <td><strong>Leg {leg.legIndex}</strong></td>
                          <td>{leg.from} ➔ {leg.to}</td>
                          <td>{leg.roadKm} km (~{leg.duration})</td>
                          <td className="text-emerald-400 font-semibold">₹{leg.trainFares.SL}</td>
                          <td className="text-amber-400 font-semibold">₹{leg.trainFares["3A"]}</td>
                          <td className="text-purple-300 font-semibold">₹{leg.trainFares["2A"]}</td>
                          <td>₹{leg.busFares.ordinary}</td>
                          <td>₹{leg.busFares.acSeater}</td>
                          <td>₹{leg.drivingCab.fuelAndToll}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Direct Train Highlight */}
                {travelPlan.matchingTrain && (
                  <div className="bg-blue-950/30 p-3.5 rounded-lg border border-blue-500/30 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                      <Train size={16} />
                      <span>Direct Express Connection: {travelPlan.matchingTrain.trainName} ({travelPlan.matchingTrain.trainNumber})</span>
                    </div>
                    <div className="text-xs text-stone-300 mt-1">
                      Departs {travelPlan.matchingTrain.fromCode} at {travelPlan.matchingTrain.departureTime} ➔ Arrives {travelPlan.matchingTrain.toCode} ({travelPlan.matchingTrain.travelTime})
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: UNIVERSAL ACCOMMODATION (No Hotel Search Needed) */}
            {activeTab === "stay" && (
              <div className="ty-stay-tab-panel">
                <div className="mb-4">
                  <h3 className="text-base font-serif font-bold text-white">
                    Universal Location-Based Accommodation Estimator
                  </h3>
                  <p className="text-xs text-stone-400">
                    Calculated automatically from local average tariffs without requiring individual hotel search.
                    Formula: {travelPlan.numRooms} Room(s) × {travelPlan.numNights} Night(s) × Average Room Tariff.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Economy Tier Stay */}
                  <div className="ty-stay-category-col">
                    <span className="ty-stay-col-title green">Cheapest / Economy Stay</span>
                    <div className="ty-stay-formula-card">
                      <div className="ty-formula-head">
                        <strong>{travelPlan.accommodationEst.labels.economy}</strong>
                      </div>
                      <div className="ty-formula-math">
                        ₹{travelPlan.accommodationEst.tariffs.economy} / room / night
                      </div>
                      <div className="ty-formula-details">
                        {travelPlan.numRooms} room(s) × {travelPlan.numNights} night(s)
                      </div>
                      <div className="ty-formula-total text-emerald-400">
                        Total: ₹{travelPlan.accommodationEst.totals.economy.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-2">
                        {travelPlan.accommodationEst.dharamshalaAvailable
                          ? "Verified temple trust dharamshalas & ashrams available in this sacred hub."
                          : travelPlan.accommodationEst.dharamshalaNote}
                      </div>
                    </div>
                  </div>

                  {/* Comfortable Tier Stay */}
                  <div className="ty-stay-category-col">
                    <span className="ty-stay-col-title gold">Balanced / Comfortable Stay</span>
                    <div className="ty-stay-formula-card highlight">
                      <div className="ty-formula-head">
                        <strong>{travelPlan.accommodationEst.labels.comfortable}</strong>
                      </div>
                      <div className="ty-formula-math text-amber-400">
                        ₹{travelPlan.accommodationEst.tariffs.comfortable} / room / night
                      </div>
                      <div className="ty-formula-details">
                        {travelPlan.numRooms} room(s) × {travelPlan.numNights} night(s)
                      </div>
                      <div className="ty-formula-total text-amber-300">
                        Total: ₹{travelPlan.accommodationEst.totals.comfortable.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-stone-300 mt-2">
                        Private AC room with attached modern bath, hot water, Wi-Fi, and convenient temple walking distance.
                      </div>
                    </div>
                  </div>

                  {/* Mid Budget Tier Stay */}
                  <div className="ty-stay-category-col">
                    <span className="ty-stay-col-title purple">Mid Budget Stay</span>
                    <div className="ty-stay-formula-card">
                      <div className="ty-formula-head">
                        <strong>{travelPlan.accommodationEst.labels.middle}</strong>
                      </div>
                      <div className="ty-formula-math text-purple-300">
                        ₹{travelPlan.accommodationEst.tariffs.middle} / room / night
                      </div>
                      <div className="ty-formula-details">
                        {travelPlan.numRooms} room(s) × {travelPlan.numNights} night(s)
                      </div>
                      <div className="ty-formula-total text-purple-300">
                        Total: ₹{travelPlan.accommodationEst.totals.middle.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-2">
                        Comfortable 3-star rated hotel with elevator, room service, buffet breakfast, and spacious family rooms.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ITEMIZED FOOD BUDGET (No Restaurant Search Needed) */}
            {activeTab === "food" && (
              <div className="ty-food-tab-panel">
                <div className="mb-4">
                  <h3 className="text-base font-serif font-bold text-white">
                    Itemized Food Budget (No Restaurant Search Needed)
                  </h3>
                  <p className="text-xs text-stone-400">
                    Automatically itemized for Breakfast, Lunch, and Dinner per person per day, adjusted by local cost index ({travelPlan.tierMeta.index}x).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Economy Meals */}
                  <div className="ty-food-card">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">
                      Cheapest: Temple & Local Bhojanalaya
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Breakfast (Poha/Idli/Chai)</span>
                        <strong className="text-white">₹{travelPlan.foodEst.mealBreakdown.economy.breakfast} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Lunch (Temple Annakshetra / Thali)</span>
                        <strong className="text-white">₹{travelPlan.foodEst.mealBreakdown.economy.lunch} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Dinner (Dal-Roti Bhojanalaya)</span>
                        <strong className="text-white">₹{travelPlan.foodEst.mealBreakdown.economy.dinner} / person</strong>
                      </div>
                      <div className="p-2 bg-emerald-950/30 rounded border border-emerald-500/30 font-bold text-emerald-400">
                        Daily per Person: ₹{travelPlan.foodEst.mealBreakdown.economy.totalDayPerPerson}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Group Total ({travellers} pax, {durationDays} days): <strong>₹{travelPlan.foodEst.totals.economy.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Comfortable Meals */}
                  <div className="ty-food-card highlight">
                    <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">
                      Balanced: Quality Pure Veg Restaurant
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Breakfast (AC Restaurant Breakfast)</span>
                        <strong className="text-amber-300">₹{travelPlan.foodEst.mealBreakdown.comfortable.breakfast} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Lunch (Unlimited Pure Veg Thali)</span>
                        <strong className="text-amber-300">₹{travelPlan.foodEst.mealBreakdown.comfortable.lunch} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Dinner (Pure Veg Dinner with Sweets)</span>
                        <strong className="text-amber-300">₹{travelPlan.foodEst.mealBreakdown.comfortable.dinner} / person</strong>
                      </div>
                      <div className="p-2 bg-amber-950/30 rounded border border-amber-500/30 font-bold text-amber-400">
                        Daily per Person: ₹{travelPlan.foodEst.mealBreakdown.comfortable.totalDayPerPerson}
                      </div>
                      <div className="text-[11px] text-stone-300">
                        Group Total ({travellers} pax, {durationDays} days): <strong>₹{travelPlan.foodEst.totals.comfortable.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Mid Budget Meals */}
                  <div className="ty-food-card">
                    <h4 className="text-xs font-bold text-purple-300 uppercase mb-2">
                      Mid Budget: Premium Dining & Buffet
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Breakfast (Buffet Breakfast at Hotel)</span>
                        <strong className="text-purple-300">₹{travelPlan.foodEst.mealBreakdown.middle.breakfast} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Lunch (Multi-Cuisine Quality Dining)</span>
                        <strong className="text-purple-300">₹{travelPlan.foodEst.mealBreakdown.middle.lunch} / person</strong>
                      </div>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                        <span>Dinner (Chef Specialties & Desserts)</span>
                        <strong className="text-purple-300">₹{travelPlan.foodEst.mealBreakdown.middle.dinner} / person</strong>
                      </div>
                      <div className="p-2 bg-purple-950/30 rounded border border-purple-500/30 font-bold text-purple-300">
                        Daily per Person: ₹{travelPlan.foodEst.mealBreakdown.middle.totalDayPerPerson}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Group Total ({travellers} pax, {durationDays} days): <strong>₹{travelPlan.foodEst.totals.middle.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: LOCAL TRANSIT & SIGHTSEEING */}
            {activeTab === "local" && (
              <div className="ty-local-tab-panel">
                <div className="mb-4">
                  <h3 className="text-base font-serif font-bold text-white">
                    Terrain-Aware Local Transportation & Transfers
                  </h3>
                  <p className="text-xs text-stone-400">
                    Covers: (1) Station to stay, (2) Stay to sanctum, (3) Associated guardian shrines, (4) Return transfer.
                  </p>
                </div>

                {travelPlan.localTransitEst.isHimalayan ? (
                  <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Mountain size={18} />
                      <span>Himalayan Mountain Shrine Transit Modes:</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {travelPlan.localTransitEst.terrainNotice}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-black/30 p-3 rounded">
                        <strong className="text-emerald-400 block mb-1">Cheapest Mode</strong>
                        <span>{travelPlan.localTransitEst.modes.economy.style}</span>
                        <div className="mt-2 text-white font-bold">Total: ₹{travelPlan.localTransitEst.modes.economy.total}</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded border border-amber-500/30">
                        <strong className="text-amber-400 block mb-1">Balanced Mode</strong>
                        <span>{travelPlan.localTransitEst.modes.comfortable.style}</span>
                        <div className="mt-2 text-amber-300 font-bold">Total: ₹{travelPlan.localTransitEst.modes.comfortable.total}</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded">
                        <strong className="text-purple-300 block mb-1">Mid Budget Mode</strong>
                        <span>{travelPlan.localTransitEst.modes.middle.style}</span>
                        <div className="mt-2 text-purple-300 font-bold">Total: ₹{travelPlan.localTransitEst.modes.middle.total}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="ty-local-card">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">
                        Cheapest: Shared E-Rickshaws
                      </h4>
                      <p className="text-xs text-stone-300 mb-2">
                        {travelPlan.localTransitEst.modes.economy.note}
                      </p>
                      <div className="text-xs text-emerald-400 font-bold">
                        Group Total: ₹{travelPlan.localTransitEst.modes.economy.total.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="ty-local-card highlight">
                      <h4 className="text-xs font-bold text-amber-300 uppercase mb-2">
                        Balanced: Prepaid Private Autos
                      </h4>
                      <p className="text-xs text-stone-300 mb-2">
                        {travelPlan.localTransitEst.modes.comfortable.note}
                      </p>
                      <div className="text-xs text-amber-400 font-bold">
                        Group Total: ₹{travelPlan.localTransitEst.modes.comfortable.total.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="ty-local-card">
                      <h4 className="text-xs font-bold text-purple-300 uppercase mb-2">
                        Mid Budget: Private AC Cab
                      </h4>
                      <p className="text-xs text-stone-300 mb-2">
                        {travelPlan.localTransitEst.modes.middle.note}
                      </p>
                      <div className="text-xs text-purple-300 font-bold">
                        Group Total: ₹{travelPlan.localTransitEst.modes.middle.total.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: DARSHAN & SANCTUM */}
            {activeTab === "darshan" && (
              <div className="ty-darshan-tab-panel">
                <div className="mb-4">
                  <h3 className="text-base font-serif font-bold text-white">
                    Sanctum Darshan & Sightseeing Guide
                  </h3>
                  <p className="text-xs text-stone-400">
                    Official temple guidelines, sanctum timings, dress codes, and verified attractions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="ty-darshan-card">
                    <h4 className="text-xs font-bold text-amber-300 uppercase mb-2 flex items-center gap-1.5">
                      <Landmark size={13} className="text-amber-400" /> Primary Sanctum: {travelPlan.destProfile.sanctumName}
                    </h4>
                    <div className="space-y-2 text-xs text-stone-300">
                      <div className="flex items-center gap-1.5"><Clock size={12} className="text-amber-400" /> <strong>Sanctum Hours:</strong> {travelPlan.destProfile.sanctumTimings}</div>
                      <div className="flex items-center gap-1.5"><UserCheck size={12} className="text-amber-400" /> <strong>Dress Code:</strong> {travelPlan.destination.dressCode || "Traditional & Modest (Dhoti/Kurta for Men, Saree/Salwar for Women)"}</div>
                      <div className="flex items-center gap-1.5"><Ticket size={12} className="text-amber-400" /> <strong>General Queue:</strong> {travelPlan.destProfile.freeDarshanAvailable ? "Free (₹0) open queue available for all devotees" : "Token required"}</div>
                      <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-amber-400" /> <strong>Sugam / VIP Entry:</strong> {travelPlan.destProfile.darshanPassCost > 0 ? `₹${travelPlan.destProfile.darshanPassCost}/person token available via trust portal` : "Not required / Free"}</div>
                    </div>
                  </div>

                  <div className="ty-darshan-card">
                    <h4 className="text-xs font-bold text-amber-300 uppercase mb-2 flex items-center gap-1.5">
                      <MapPin size={13} className="text-amber-400" /> Top Nearby Pilgrimage Attractions:
                    </h4>
                    <div className="space-y-2 text-xs">
                      {travelPlan.destProfile.sightseeingHighlights.map((sh, i) => (
                        <div key={i} className="bg-black/20 p-2 rounded">
                          <div className="font-semibold text-white">{sh.name}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {sh.note} • Duration: {sh.duration} • Entry: {sh.cost === 0 ? "FREE" : `₹${sh.cost}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: ACTION STRIP & SAVING
            ========================================================================= */}
        <div className="ty-ai-actions-strip">
          <div className="ty-actions-left">
            <button
              type="button"
              className="ty-action-btn primary"
              onClick={handleCopySummary}
            >
              {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedSummary ? "Plan Copied to Clipboard!" : "Copy WhatsApp Plan"}</span>
            </button>

            <button
              type="button"
              className="ty-action-btn"
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print Plan</span>
            </button>

            <button
              type="button"
              className="ty-action-btn"
              onClick={() => {
                if (onSaveToMyYatra) {
                  onSaveToMyYatra(selectedDestinations[0]);
                }
              }}
            >
              <Heart size={14} className="text-rose-400" />
              <span>Save to My Yatra</span>
            </button>

            <button
              type="button"
              className="ty-action-btn"
              onClick={() => onExploreOnMap && onExploreOnMap(selectedDestinations[0])}
            >
              <Compass size={14} className="text-amber-400" />
              <span>View Route on Map</span>
            </button>
          </div>

          <div className="ty-actions-right">
            <span className="text-xs text-stone-400">Total Calculated:</span>
            <strong className="text-lg text-amber-400 font-serif font-bold">
              ₹{activePlan.totalCost.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

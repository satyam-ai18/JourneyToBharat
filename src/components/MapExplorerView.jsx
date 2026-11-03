import React, { useState, useMemo, useEffect, useRef } from "react";
import MapComponent from "./MapComponent";
import { CATEGORIES } from "../data/tirthData";
import { ALL_36_STATES_AND_UTS, ALL_28_STATES, ALL_8_UNION_TERRITORIES } from "../data/allStatesData";
import {
  MASTER_EXPLORER_DESTINATIONS,
  searchSavedDestinationsDatabase,
  interpretNaturalSearchQuery
} from "../data/masterExplorerData";
import { VARANASI_ORIGIN } from "../data/varanasiData";
import {
  Layers,
  MapPin,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Compass,
  X,
  Navigation,
  ExternalLink,
  Route,
  Sparkles,
  RefreshCw,
  Check,
  Train,
  Bookmark,
  Trash2,
  ArrowUpDown,
  Car,
  Clock,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { calculateSmartRoute } from "../services/smartRoutePlannerService";
import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration,
  isGhatOrHillTerrain
} from "../services/distanceService";
import { requestBrowserLocation } from "../services/locationService";

export default function MapExplorerView({
  selectedItem,
  setSelectedItem,
  onOpenDetail,
  activeLayers,
  setActiveLayers,
  selectedTileLayer,
  setSelectedTileLayer,
  destinations = [],
  stations = [],
  attractions = [],
  busTerminals = [],
  rentals = [],
  routeCorridors = {},
  activeRoute = null,
  routeStops = [],
  initialQuery = "",
  initialCategory = "all",
  startingLocation = null,
  onSelectStartingLocation = null,
  onOpenLocationSelector = null,
  onToggleFavorite = null,
  savedFavorites = []
}) {
  // 1. Destination Search & Autocomplete
  const [destinationSearch, setDestinationSearch] = useState(initialQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 2. Sidebar open state (Default: OPEN on desktop)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  // 3. Active Multi-Stop Journey Stops (from Varanasi)
  const [tripStops, setTripStops] = useState(() => {
    try {
      const saved = localStorage.getItem("ty_active_trip_stops");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist trip stops
  useEffect(() => {
    try {
      localStorage.setItem("ty_active_trip_stops", JSON.stringify(tripStops));
    } catch (e) {}
  }, [tripStops]);

  // 4. Route Planning Engine State
  const [journeyRoute, setJourneyRoute] = useState(null);
  const [customRoutePolyline, setCustomRoutePolyline] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeCalculationError, setRouteCalculationError] = useState(null);

  // 5. Origin Feedback & GPS Status
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  // 6. Railway & Train Information Modal State
  const [trainModalPlace, setTrainModalPlace] = useState(null);

  // 7. Optional Category / State Quick Filter Drawer State
  const [showBrowseFilters, setShowBrowseFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState("all");

  const effectiveOrigin = startingLocation || VARANASI_ORIGIN;
  const isCurrentGps = startingLocation?.isGpsVerified || startingLocation?.type === "gps";
  const isVaranasiActive =
    !isCurrentGps &&
    (effectiveOrigin.id === VARANASI_ORIGIN.id ||
      effectiveOrigin.city === "Varanasi" ||
      effectiveOrigin.name?.toLowerCase().includes("varanasi") ||
      effectiveOrigin.name?.toLowerCase().includes("kashi"));

  // Sourced ONLY from saved database: Filter matching suggestions for autocomplete
  const searchSuggestions = useMemo(() => {
    if (!destinationSearch || destinationSearch.trim().length < 2) return [];
    return searchSavedDestinationsDatabase(destinationSearch, MASTER_EXPLORER_DESTINATIONS);
  }, [destinationSearch]);

  // Quick Suggested Pilgrimage Chips for 1-Click adding
  const POPULAR_QUICK_CHIPS = [
    { id: "mahakaleshwar_ujjain", name: "Mahakaleshwar", city: "Ujjain" },
    { id: "kal_bhairav_ujjain", name: "Kal Bhairav", city: "Ujjain" },
    { id: "harsiddhi_mata_ujjain", name: "Harsiddhi Mata", city: "Ujjain" },
    { id: "chintaman_ganesh_ujjain", name: "Chintaman Ganesh", city: "Ujjain" },
    { id: "ram_mandir_ayodhya", name: "Ram Mandir", city: "Ayodhya" },
    { id: "prayagraj_triveni", name: "Triveni Sangam", city: "Prayagraj" },
    { id: "kedarnath_temple", name: "Kedarnath Dham", city: "Kedarnath" },
    { id: "kashi_vishwanath", name: "Kashi Vishwanath", city: "Varanasi" }
  ];

  // Add / Toggle destination selection
  const handleToggleSelectDestination = (place) => {
    setTripStops((prev) => {
      const exists = prev.some((s) => s.id === place.id);
      let updated;
      if (exists) {
        updated = prev.filter((s) => s.id !== place.id);
      } else {
        updated = [...prev, place];
      }
      return updated;
    });

    // Fly map to selected place
    setSelectedItem({
      ...place,
      lat: place.lat,
      lng: place.lng,
      zoom: 14
    });
  };

  // Add destination by ID from quick chips
  const handleAddById = (destId) => {
    const found = MASTER_EXPLORER_DESTINATIONS.find((d) => d.id === destId);
    if (found) {
      handleToggleSelectDestination(found);
    }
  };

  // Reorder stops manually (Up / Down)
  const handleMoveStop = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= tripStops.length) return;
    const copy = [...tripStops];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setTripStops(copy);

    // If route was already calculated, regenerate route smoothly for updated order
    if (journeyRoute) {
      setIsCalculatingRoute(true);
      try {
        const res = await calculateSmartRoute({
          origin: effectiveOrigin,
          selectedStops: copy,
          travelMode: "DRIVE",
          optimizeOrder: false
        });
        if (res.success) {
          setJourneyRoute(res);
          setCustomRoutePolyline(res.polylinePoints);
        }
      } catch (e) {
        console.warn("Could not recalculate route order", e);
      } finally {
        setIsCalculatingRoute(false);
      }
    }
  };

  // Remove a stop
  const handleRemoveStop = async (index) => {
    const copy = tripStops.filter((_, i) => i !== index);
    setTripStops(copy);

    if (copy.length === 0) {
      setJourneyRoute(null);
      setCustomRoutePolyline(null);
      if (setActiveLayers) {
        setActiveLayers((l) => ({ ...l, grandLoop: false }));
      }
    } else if (journeyRoute) {
      setIsCalculatingRoute(true);
      try {
        const res = await calculateSmartRoute({
          origin: effectiveOrigin,
          selectedStops: copy,
          travelMode: "DRIVE",
          optimizeOrder: false
        });
        if (res.success) {
          setJourneyRoute(res);
          setCustomRoutePolyline(res.polylinePoints);
        }
      } catch (e) {
        console.warn("Could not recalculate route after stop removal", e);
      } finally {
        setIsCalculatingRoute(false);
      }
    }
  };

  // Clear all stops
  const handleClearAllStops = () => {
    setTripStops([]);
    setJourneyRoute(null);
    setCustomRoutePolyline(null);
    setDestinationSearch("");
    if (setActiveLayers) {
      setActiveLayers((l) => ({ ...l, grandLoop: false }));
    }
    setLocationStatus("Cleared all selected destinations.");
    setTimeout(() => setLocationStatus(null), 2500);
  };

  // Plan My Journey from Varanasi
  const handlePlanMyJourney = async () => {
    if (tripStops.length === 0) return;
    setIsCalculatingRoute(true);
    setRouteCalculationError(null);

    try {
      const res = await calculateSmartRoute({
        origin: effectiveOrigin,
        selectedStops: tripStops,
        travelMode: "DRIVE",
        optimizeOrder: false
      });

      if (res.success) {
        setJourneyRoute(res);
        setCustomRoutePolyline(res.polylinePoints);
        if (setActiveLayers) {
          setActiveLayers((l) => ({ ...l, grandLoop: true }));
        }
        setLocationStatus(
          `✓ Journey planned from Varanasi: ~${res.totalRoadKm} km (${res.totalDurationText}) across ${tripStops.length} stops.`
        );
        setTimeout(() => setLocationStatus(null), 4000);
      } else {
        setRouteCalculationError(res.error || "Could not calculate journey route.");
      }
    } catch (err) {
      console.error("Route calculation error:", err);
      setRouteCalculationError("Failed to calculate route. Please try again.");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Optimize Route Sequence (TSP Nearest Neighbor)
  const handleOptimizeRoute = async () => {
    if (tripStops.length <= 1) return;
    setIsCalculatingRoute(true);
    setRouteCalculationError(null);

    try {
      const res = await calculateSmartRoute({
        origin: effectiveOrigin,
        selectedStops: tripStops,
        travelMode: "DRIVE",
        optimizeOrder: true
      });

      if (res.success) {
        const reorderedStops = res.orderedStops.filter((s) => !s.isOrigin);
        setTripStops(reorderedStops);
        setJourneyRoute(res);
        setCustomRoutePolyline(res.polylinePoints);
        setLocationStatus(
          `Stop sequence optimized to minimize road backtracking (~${res.totalRoadKm} km total)!`
        );
        setTimeout(() => setLocationStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Google Maps Multi-Stop Directions URL
  const googleMapsNavUrl = useMemo(() => {
    if (journeyRoute?.googleMapsDirectionsUrl) return journeyRoute.googleMapsDirectionsUrl;
    if (tripStops.length === 0) return null;
    const originStr = `${effectiveOrigin.lat},${effectiveOrigin.lng}`;
    const stopsStr = tripStops.map((s) => `${s.lat},${s.lng}`).join("/");
    return `https://www.google.com/maps/dir/${originStr}/${stopsStr}`;
  }, [journeyRoute, tripStops, effectiveOrigin]);

  // Save Itinerary to My Yatra
  const handleSaveTripToMyYatra = () => {
    if (tripStops.length === 0) return;
    try {
      const savedTrips = JSON.parse(localStorage.getItem("my_yatra_saved_itineraries") || "[]");
      const newTrip = {
        id: `trip_${Date.now()}`,
        name: `Yatra from Varanasi (${tripStops.length} Sacred Stops)`,
        origin: effectiveOrigin,
        stops: tripStops,
        totalKm: journeyRoute?.totalRoadKm || 0,
        totalDuration: journeyRoute?.totalDurationText || "",
        savedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      };
      savedTrips.unshift(newTrip);
      localStorage.setItem("my_yatra_saved_itineraries", JSON.stringify(savedTrips));
      setLocationStatus("✓ Journey itinerary saved to My Yatra successfully!");
      setTimeout(() => setLocationStatus(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle "Show All India Destinations" layer
  const handleToggleShowAllDestinations = () => {
    if (setActiveLayers) {
      setActiveLayers((prev) => ({
        ...prev,
        destinations: !prev.destinations
      }));
    }
  };

  // Detect GPS
  const handleDetectGps = async () => {
    setIsLocating(true);
    setLocationStatus("Querying GPS coordinates...");
    const res = await requestBrowserLocation();
    setIsLocating(false);
    if (res.success && res.location) {
      if (onSelectStartingLocation) onSelectStartingLocation(res.location);
      setLocationStatus(`GPS Confirmed: ${res.location.name}`);
      setSelectedItem({
        id: "current_gps",
        name: res.location.name,
        lat: res.location.lat,
        lng: res.location.lng,
        zoom: 12
      });
      setTimeout(() => setLocationStatus(null), 3500);
    } else {
      setLocationStatus(res.message || "GPS unavailable. Setting default origin Varanasi.");
      setTimeout(() => setLocationStatus(null), 3500);
    }
  };

  // Reset to Varanasi Origin
  const handleSetVaranasi = () => {
    if (onSelectStartingLocation) onSelectStartingLocation(VARANASI_ORIGIN);
    setSelectedItem({
      ...VARANASI_ORIGIN,
      zoom: 12
    });
    setLocationStatus("Origin set to Varanasi (Kashi Vishwanath Corridor) • Default Sacred Origin");
    setTimeout(() => setLocationStatus(null), 3000);
  };

  return (
    <div className="ty-map-explorer-layout">
      {/* 1. Master Top Bar Header */}
      <div className="ty-map-topbar">
        <div className="ty-map-topbar-left">
          <div className="ty-map-title-block">
            <h1 className="ty-map-title">Journey to Bharat Explorer</h1>
            <span className="ty-map-subtitle">
              Sacred Pilgrimage Multi-Stop Routing from Varanasi across India
            </span>
          </div>
        </div>

        <div className="ty-map-topbar-controls">
          {/* Default Sacred Origin Pill: Varanasi */}
          <button
            className={`ty-map-origin-pill ${isCurrentGps ? "gps-active" : "sacred-active"}`}
            onClick={onOpenLocationSelector}
            title="Default Journey Origin: Varanasi (Kashi). Click to change if desired."
          >
            {isCurrentGps ? (
              <Navigation size={13} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <Sparkles size={13} className="text-amber-400 flex-shrink-0" />
            )}
            <span className="ty-map-origin-text">
              Origin: <strong>{isVaranasiActive ? "Varanasi (Kashi)" : effectiveOrigin?.name?.split(" ")[0] || "Varanasi"}</strong>
            </span>
            <span className="ty-change-tag">Change</span>
          </button>

          {/* Show All India Destinations Toggle Button */}
          <button
            className={`ty-map-panel-toggle-btn ${activeLayers.destinations ? "active" : ""}`}
            onClick={handleToggleShowAllDestinations}
            title={activeLayers.destinations ? "Hide all India destination markers" : "Show all 358 India destination markers"}
            style={{
              background: activeLayers.destinations ? "#064e3b" : "rgba(255, 255, 255, 0.08)",
              color: activeLayers.destinations ? "#34d399" : "#cbd5e1",
              border: activeLayers.destinations ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">
              {activeLayers.destinations ? "Showing All (358)" : "Show All Destinations"}
            </span>
          </button>

          {/* Map Basemap Switcher */}
          <div className="ty-tile-switch-group">
            <button
              className={`ty-tile-btn ${selectedTileLayer === "googleRoadmap" ? "active" : ""}`}
              onClick={() => setSelectedTileLayer("googleRoadmap")}
            >
              Map
            </button>
            <button
              className={`ty-tile-btn ${selectedTileLayer === "googleHybrid" ? "active" : ""}`}
              onClick={() => setSelectedTileLayer("googleHybrid")}
            >
              Satellite
            </button>
            <button
              className={`ty-tile-btn ${selectedTileLayer === "googleTerrain" ? "active" : ""}`}
              onClick={() => setSelectedTileLayer("googleTerrain")}
            >
              Terrain
            </button>
          </div>

          {/* Toggle Sidebar Button */}
          <button
            className={`ty-map-panel-toggle-btn ${isLeftSidebarOpen ? "active" : ""}`}
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            title="Toggle Destination Selection Sidebar"
          >
            <Route size={14} />
            <span className="hidden sm:inline">
              {isLeftSidebarOpen ? "Close Planner" : `Where to Go (${tripStops.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Status / Alert Toast Row */}
      {locationStatus && (
        <div style={{
          background: "#064e3b",
          color: "#fde68a",
          fontSize: "12px",
          fontWeight: "600",
          padding: "6px 18px",
          borderBottom: "1px solid #10b981",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 99
        }}>
          <Sparkles size={13} className="text-amber-400" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* 2. Main Workspace: Left Destination Selection Sidebar + Right Full Map */}
      <div className="ty-map-body-grid">
        {/* LEFT SIDEBAR: WHERE WOULD YOU LIKE TO GO? */}
        {isLeftSidebarOpen && (
          <aside className="ty-dest-selection-sidebar">
            {/* Header */}
            <div className="ty-dest-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 className="ty-dest-title">Where Would You Like to Go?</h2>
                <button
                  className="ty-sidebar-close-btn"
                  onClick={() => setIsLeftSidebarOpen(false)}
                  title="Close sidebar"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="ty-dest-subtitle">
                Choose the destinations you want to explore. We'll plan your journey from Varanasi.
              </p>
            </div>

            {/* Default Journey Origin Card: Varanasi */}
            <div className="ty-dest-origin-card">
              <div className="ty-dest-origin-left">
                <div className="ty-dest-origin-icon">
                  <Sparkles size={15} />
                </div>
                <div className="ty-dest-origin-meta">
                  <span className="ty-dest-origin-badge">Journey Origin</span>
                  <span className="ty-dest-origin-name">
                    {effectiveOrigin.name || "Varanasi (Kashi)"}
                  </span>
                </div>
              </div>

              {!isVaranasiActive ? (
                <button
                  onClick={handleSetVaranasi}
                  style={{
                    background: "#d4af37",
                    color: "#07140f",
                    border: "none",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    fontSize: "11px",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                  title="Reset origin to Varanasi (Kashi)"
                >
                  Reset to Varanasi
                </button>
              ) : (
                <span style={{ fontSize: "11px", color: "#6ee7b7", fontWeight: "700" }}>
                  Sacred Hub
                </span>
              )}
            </div>

            {/* Search Destination Input */}
            <div className="ty-dest-search-wrap">
              <div className="ty-dest-search-box">
                <Search size={16} className="text-amber-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search destination, city, or temple..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="ty-dest-search-input"
                />
                {destinationSearch && (
                  <button
                    onClick={() => setDestinationSearch("")}
                    style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Search Suggestions Dropdown (Sourced ONLY from saved database) */}
              {destinationSearch.trim().length >= 2 && (
                <div className="ty-dest-suggestions-panel">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((place) => {
                      const isSelected = tripStops.some((s) => s.id === place.id);
                      return (
                        <div
                          key={place.id}
                          className={`ty-dest-suggestion-card ${isSelected ? "selected" : ""}`}
                          onClick={() => handleToggleSelectDestination(place)}
                        >
                          <img
                            src={place.image || "/images/spiritual_ghat_evening.jpg"}
                            alt={place.name}
                            className="ty-dest-suggestion-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/spiritual_ghat_evening.jpg";
                            }}
                          />
                          <div className="ty-dest-suggestion-info">
                            <span className="ty-dest-suggestion-name">{place.name}</span>
                            <span className="ty-dest-suggestion-loc">
                              {place.city ? `${place.city}, ` : ""}{place.state}
                            </span>
                            <span className="ty-dest-suggestion-badge">
                              {place.badge || place.categoryLabel || place.category}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`ty-dest-add-btn ${isSelected ? "added" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSelectDestination(place);
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check size={12} />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus size={12} />
                                <span>Add Stop</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
                      No matching saved destinations for "{destinationSearch}".
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                        Search by sanctum name (e.g. Mahakaleshwar, Kal Bhairav), city (Ujjain, Varanasi, Ayodhya), or deity.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Destinations Section */}
            <div className="ty-selected-stops-section">
              <div className="ty-selected-stops-header">
                <div className="ty-selected-stops-title">
                  <span>Selected Destinations</span>
                  <span className="ty-selected-stops-count">{tripStops.length}</span>
                </div>

                {tripStops.length > 0 && (
                  <button
                    onClick={handleClearAllStops}
                    className="ty-clear-all-btn"
                    title="Clear all selected stops"
                  >
                    <Trash2 size={13} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* List of Selected Stops */}
              {tripStops.length > 0 ? (
                <div className="ty-stops-list">
                  {tripStops.map((stop, index) => {
                    const isCardActive = selectedItem?.id === stop.id;
                    return (
                      <div
                        key={stop.id}
                        className={`ty-stop-item-card ${isCardActive ? "active" : ""}`}
                        onClick={() => setSelectedItem({ ...stop, zoom: 14 })}
                        title={`Click to focus ${stop.name} on map`}
                      >
                        <div className="ty-stop-item-left">
                          <span className="ty-stop-item-badge">{index + 1}</span>
                          <div className="ty-stop-item-info">
                            <span className="ty-stop-item-name">{stop.name}</span>
                            <span className="ty-stop-item-meta">
                              {stop.city ? `${stop.city}, ` : ""}{stop.state}
                            </span>
                          </div>
                        </div>

                        {/* Controls: Reorder Up / Down & Remove */}
                        <div className="ty-stop-item-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="ty-stop-ctrl-btn"
                            disabled={index === 0}
                            onClick={() => handleMoveStop(index, -1)}
                            title="Move stop up in route"
                          >
                            <ChevronUp size={15} />
                          </button>
                          <button
                            className="ty-stop-ctrl-btn"
                            disabled={index === tripStops.length - 1}
                            onClick={() => handleMoveStop(index, 1)}
                            title="Move stop down in route"
                          >
                            <ChevronDown size={15} />
                          </button>
                          <button
                            className="ty-stop-remove-btn"
                            onClick={() => handleRemoveStop(index)}
                            title="Remove destination"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State with 1-Click Popular Destination Chips */
                <div className="ty-quick-chips-wrap">
                  <div className="ty-quick-chips-title">
                    Quick Add Destinations from Varanasi
                  </div>
                  <div className="ty-quick-chips-list">
                    {POPULAR_QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className="ty-quick-chip-btn"
                        onClick={() => handleAddById(chip.id)}
                      >
                        + {chip.name} ({chip.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Plan My Journey Action Button */}
            <button
              className="ty-plan-journey-cta-btn"
              disabled={tripStops.length === 0 || isCalculatingRoute}
              onClick={handlePlanMyJourney}
            >
              {isCalculatingRoute ? (
                <>
                  <RefreshCw size={16} className="ty-spin" />
                  <span>Calculating Real Route from Varanasi...</span>
                </>
              ) : (
                <>
                  <Car size={16} />
                  <span>
                    Plan My Journey {tripStops.length > 0 ? `(${tripStops.length} Stops)` : ""}
                  </span>
                </>
              )}
            </button>

            {/* Route Planning Error Banner */}
            {routeCalculationError && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#fca5a5",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AlertTriangle size={15} className="text-red-400 flex-shrink-0" />
                <span>{routeCalculationError}</span>
              </div>
            )}

            {/* Route Summary & Leg Breakdown (Appears when route is calculated) */}
            {journeyRoute && journeyRoute.success && (
              <div className="ty-route-results-card">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: "6px"
                }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#6ee7b7", textTransform: "uppercase" }}>
                    ✓ Route from Varanasi
                  </span>
                  <span style={{ fontSize: "11px", color: "#fef3c7", fontWeight: "700" }}>
                    {tripStops.length} Destinations
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="ty-route-metrics-grid">
                  <div className="ty-route-metric-box">
                    <span className="ty-route-metric-label">Total Road Distance</span>
                    <span className="ty-route-metric-val">~{journeyRoute.totalRoadKm} km</span>
                  </div>
                  <div className="ty-route-metric-box">
                    <span className="ty-route-metric-label">Est. Travel Time</span>
                    <span className="ty-route-metric-val">{journeyRoute.totalDurationText}</span>
                  </div>
                </div>

                {/* Actions: Optimize & Navigation */}
                <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
                  {tripStops.length >= 2 && (
                    <button
                      onClick={handleOptimizeRoute}
                      disabled={isCalculatingRoute}
                      style={{
                        flex: 1,
                        background: "rgba(212, 175, 55, 0.15)",
                        border: "1px solid #d4af37",
                        color: "#fef3c7",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        cursor: "pointer"
                      }}
                      title="Reorder stops to minimize total travel distance"
                    >
                      <ArrowUpDown size={12} />
                      <span>Optimize Order</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveTripToMyYatra}
                    style={{
                      flex: 1,
                      background: "#065f46",
                      border: "1px solid #10b981",
                      color: "#ffffff",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      cursor: "pointer"
                    }}
                  >
                    <Bookmark size={12} />
                    <span>Save Itinerary</span>
                  </button>
                </div>

                {/* Google Maps Turnkey Navigation Link */}
                {googleMapsNavUrl && (
                  <a
                    href={googleMapsNavUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#1d4ed8",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "8px 10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      textDecoration: "none"
                    }}
                  >
                    <Navigation size={13} />
                    <span>Turnkey Google Maps Navigation</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                {/* Segment Legs Breakdown */}
                {journeyRoute.legs && journeyRoute.legs.length > 0 && (
                  <div className="ty-legs-breakdown">
                    <span style={{ fontSize: "10.5px", fontWeight: "800", color: "#fde68a", textTransform: "uppercase", marginBottom: "4px" }}>
                      Consecutive Journey Legs:
                    </span>
                    {journeyRoute.legs.map((leg) => (
                      <div key={leg.legNumber} className="ty-leg-item">
                        <span className="ty-leg-names">
                          {leg.from?.name?.split("(")[0]?.trim()} ➔ {leg.to?.name?.split("(")[0]?.trim()}
                        </span>
                        <span className="ty-leg-meta flex items-center gap-1.5">
                          <Car size={11} className="text-amber-400" /> <b>~{leg.roadKm} km</b> • <Clock size={10} className="text-stone-400" /> {leg.durationFormatted}
                        </span>
                        {leg.trekNote && (
                          <span style={{ color: "#f59e0b", fontSize: "9.5px", marginTop: "1px", display: "flex", alignItems: "center", gap: "3px" }}>
                            <AlertTriangle size={10} className="text-amber-400 flex-shrink-0" /> {leg.trekNote}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* RIGHT AREA: INTERACTIVE FULL-BLEED MAP */}
        <main className="ty-map-center-container">
          <MapComponent
            selectedItem={selectedItem}
            onSelectItem={(item) => setSelectedItem(item)}
            activeLayers={activeLayers}
            selectedStationFilter="all"
            selectedTileLayer={selectedTileLayer}
            setSelectedTileLayer={setSelectedTileLayer}
            measureMode={false}
            setMeasureMode={() => {}}
            onMeasureResult={() => {}}
            destinations={MASTER_EXPLORER_DESTINATIONS}
            stations={stations}
            attractions={attractions}
            busTerminals={busTerminals}
            rentals={rentals}
            routeCorridors={routeCorridors}
            activeRoute={activeRoute}
            routeStops={tripStops.map((s, idx) => ({ ...s, stopIndex: idx + 1 }))}
            customRoutePolyline={customRoutePolyline}
            showAllRoutes={false}
            setShowAllRoutes={() => {}}
            startingLocation={effectiveOrigin}
            onToggleTripStop={handleToggleSelectDestination}
            activeTripStops={tripStops}
            onOpenDetail={onOpenDetail}
          />

          {/* Floating Action Strip for Currently Selected Destination on Map */}
          {selectedItem && selectedItem.lat && selectedItem.lng && (
            <div className="ty-map-floating-route-bar">
              <div className="ty-floating-route-main">
                <div className="ty-floating-route-left">
                  <div className="ty-floating-route-icon">
                    <Navigation size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="ty-floating-route-title">
                      {effectiveOrigin.city || "Varanasi"} ➔ {selectedItem.name}
                    </div>
                    <div className="ty-floating-route-meta">
                      {(() => {
                        const straight = calculateHaversineKm(
                          effectiveOrigin.lat,
                          effectiveOrigin.lng,
                          selectedItem.lat,
                          selectedItem.lng
                        );
                        const isGhat = isGhatOrHillTerrain(selectedItem.lat, selectedItem.lng);
                        const roadKm = computeTopographicalRoadKm(straight, isGhat);
                        const speed = isGhat ? 32 : roadKm > 400 ? 60 : 50;
                        const duration = formatDuration(Math.round((roadKm / speed) * 60));
                        return (
                          <span>
                            Road distance: <strong className="text-amber-300">~{roadKm} km</strong> • Est. Drive: <strong>{duration}</strong>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="ty-floating-route-actions">
                  {/* Add / Remove from Trip Button */}
                  <button
                    onClick={() => handleToggleSelectDestination(selectedItem)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background: tripStops.some((s) => s.id === selectedItem.id) ? "#059669" : "#064e3b",
                      color: "#ffffff",
                      border: "1px solid #d4af37",
                      cursor: "pointer"
                    }}
                  >
                    {tripStops.some((s) => s.id === selectedItem.id) ? (
                      <>
                        <Check size={13} />
                        <span>In Trip ({tripStops.findIndex((s) => s.id === selectedItem.id) + 1})</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span>+ Add to Trip</span>
                      </>
                    )}
                  </button>

                  {/* Train Information Trigger */}
                  {selectedItem.nearestStation && (
                    <button
                      onClick={() => setTrainModalPlace(selectedItem)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: "rgba(30, 58, 138, 0.4)",
                        color: "#93c5fd",
                        border: "1px solid #3b82f6",
                        cursor: "pointer"
                      }}
                      title="View nearest railway stations & IRCTC train link"
                    >
                      <Train size={13} />
                      <span>Train Info</span>
                    </button>
                  )}

                  {/* Sacred Details Button */}
                  {onOpenDetail && (
                    <button
                      className="ty-floating-details-btn"
                      onClick={() => onOpenDetail(selectedItem)}
                      title="View full sacred history, timings, and rituals"
                    >
                      <Compass size={13} />
                      <span>Sacred Details</span>
                    </button>
                  )}

                  {/* Dismiss route bar */}
                  <button
                    className="ty-floating-close-btn"
                    onClick={() => setSelectedItem(null)}
                    title="Dismiss route bar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Railway Station & Train Information Modal */}
      {trainModalPlace && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div style={{
            background: "#091712",
            border: "1px solid #d4af37",
            borderRadius: "10px",
            maxWidth: "520px",
            width: "100%",
            padding: "20px",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Train size={18} className="text-amber-400" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#fff9e6" }}>
                  Railway & Train Connections: {trainModalPlace.name}
                </h3>
              </div>
              <button
                onClick={() => setTrainModalPlace(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {trainModalPlace.nearestStation && (
              <div style={{
                background: "rgba(30, 58, 138, 0.2)",
                border: "1px solid #3b82f6",
                borderRadius: "8px",
                padding: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                  <span style={{
                    background: "#2563eb",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    fontSize: "12px"
                  }}>
                    {trainModalPlace.nearestStation.code}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#93c5fd" }}>
                    {trainModalPlace.nearestStation.name}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Car size={12} className="text-amber-400" /> <b>Road transfer to sanctum:</b> ~{trainModalPlace.nearestStation.distanceKm} km
                </div>
                {trainModalPlace.nearestStation.transferOptions && (
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    {trainModalPlace.nearestStation.transferOptions}
                  </div>
                )}
              </div>
            )}

            <a
              href={`https://www.irctc.co.in/nget/train-search`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#065f46",
                color: "#fff",
                border: "1px solid #10b981",
                borderRadius: "6px",
                padding: "9px 14px",
                fontSize: "12px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                textDecoration: "none"
              }}
            >
              <span>Book Trains on IRCTC Official Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

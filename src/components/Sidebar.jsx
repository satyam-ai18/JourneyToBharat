import React, { useState, useMemo } from "react";
import { geocodeWithGoogle } from "../services/googleMapsService";
import { ROUTES_REGISTRY, GRANULAR_STOPS } from "../data/multiRoutes.js";
import {
  Search,
  Train,
  Bus,
  Car,
  Compass,
  MapPin,
  ChevronDown,
  ChevronRight,
  Calculator,
  Ruler,
  ShieldCheck,
  Layers,
  Sparkles,
  CalendarX,
  X,
  Filter,
  Route,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  RefreshCw,
  Zap
} from "lucide-react";

export default function Sidebar({
  selectedItem,
  onSelectItem,
  selectedStationFilter = "all",
  setSelectedStationFilter,
  activeLayers = {},
  setActiveLayers,
  selectedTileLayer = "googleRoadmap",
  setSelectedTileLayer,
  onOpenBudget,
  onOpenComparator,
  onOpenVerification,
  measureMode,
  setMeasureMode,
  isOpen,
  setIsOpen,
  destinations = [],
  stations = [],
  attractions = [],
  busTerminals = [],
  rentals = [],
  trains = [],
  buses = [],
  // 8 Multi-Route System Props
  activeRouteId = "route_g",
  setActiveRouteId,
  activeRoute,
  routeStops = [],
  routeMetrics = null,
  isEfficientOrder = false,
  setIsEfficientOrder,
  customStopIds = [],
  setCustomStopIds,
  showAllRoutes = false,
  setShowAllRoutes,
  onOpenLegModal,
  onOpenApiModal,
  showDetoursOnly = false,
  setShowDetoursOnly
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // Tabs: "route" (Active Multi-Route Stops) | "places" (All 45+ places tree) | "layers" | "search"
  const [activeTab, setActiveTab] = useState("route");

  // Expanded destination cards
  const [expandedDestinations, setExpandedDestinations] = useState({
    varanasi: true,
    prayagraj: true,
    ujjain: true,
    mathura_vrindavan: true
  });

  // Expanded stops in route view
  const [expandedRouteStops, setExpandedRouteStops] = useState({});

  // Category filter: "all" | "temples" | "nature" | "heritage" | "stations" | "busTerminals"
  const [categoryFilter, setCategoryFilter] = useState("all");

  // State filter for "places" tab: "all" | "Uttar Pradesh" | ...
  const [selectedState, setSelectedState] = useState("all");

  // Custom route add stop dropdown selector state
  const [selectedAddStopId, setSelectedAddStopId] = useState("");

  const toggleDestination = (destId) => {
    setExpandedDestinations((prev) => ({
      ...prev,
      [destId]: !prev[destId]
    }));
  };

  const toggleRouteStop = (stopId, index) => {
    const key = `${stopId}_${index}`;
    setExpandedRouteStops((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // List of all 8 registered routes
  const routeList = useMemo(() => {
    return Object.values(ROUTES_REGISTRY);
  }, []);

  // Available unique States derived from destinations
  const availableStates = useMemo(() => {
    const set = new Set();
    destinations.forEach((d) => {
      if (d.state) {
        set.add(d.state.split("/")[0].trim());
      }
    });
    return ["all", ...Array.from(set)];
  }, [destinations]);

  // Filtered Destinations by State & Detour flag for "places" tab
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      if (selectedState !== "all" && !d.state.includes(selectedState)) return false;
      if (showDetoursOnly && !d.isDetour) return false;
      return true;
    });
  }, [destinations, selectedState, showDetoursOnly]);

  // Group destinations by State
  const destinationsByState = useMemo(() => {
    const map = {};
    filteredDestinations.forEach((dest) => {
      const primaryState = dest.state.split("/")[0].trim();
      if (!map[primaryState]) map[primaryState] = [];
      map[primaryState].push(dest);
    });
    return map;
  }, [filteredDestinations]);

  // Search Results across all datasets
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matchedStations = stations
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.destinationName && s.destinationName.toLowerCase().includes(q))
      )
      .map((s) => ({ ...s, itemType: "station" }));

    const matchedAttractions = attractions
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.destinationName && a.destinationName.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q))
      )
      .map((a) => ({ ...a, itemType: "attraction" }));

    const matchedBusTerminals = busTerminals
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.destinationName.toLowerCase().includes(q) ||
          (b.operator && b.operator.toLowerCase().includes(q))
      )
      .map((b) => ({ ...b, itemType: "bus" }));

    const matchedDestinations = destinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          (d.role && d.role.toLowerCase().includes(q))
      )
      .map((d) => ({ ...d, itemType: "destination" }));

    const matchedTrains = (trains || [])
      .filter(
        (t) =>
          (t.trainName && t.trainName.toLowerCase().includes(q)) ||
          (t.trainNumber && t.trainNumber.toLowerCase().includes(q)) ||
          (t.corridor && t.corridor.toLowerCase().includes(q))
      )
      .map((t) => ({ ...t, itemType: "train" }));

    return [
      ...matchedDestinations,
      ...matchedStations,
      ...matchedAttractions,
      ...matchedBusTerminals,
      ...matchedTrains
    ];
  }, [searchQuery, destinations, stations, attractions, busTerminals, trains]);

  // Custom Route Handlers (Route H)
  const handleAddCustomStop = () => {
    if (!selectedAddStopId || !setCustomStopIds) return;
    if (!customStopIds.includes(selectedAddStopId)) {
      setCustomStopIds([...customStopIds, selectedAddStopId]);
      setSelectedAddStopId("");
    }
  };

  const handleRemoveCustomStop = (indexToRemove) => {
    if (!setCustomStopIds) return;
    const updated = customStopIds.filter((_, idx) => idx !== indexToRemove);
    setCustomStopIds(updated);
  };

  const handleMoveCustomStop = (index, direction) => {
    if (!setCustomStopIds) return;
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= customStopIds.length) return;
    const copy = [...customStopIds];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setCustomStopIds(copy);
  };

  const handleResetCustomRoute = () => {
    if (!setCustomStopIds) return;
    setCustomStopIds(ROUTES_REGISTRY.route_h.stopIds);
  };

  return (
    <aside className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="app-branding">
          <div className="brand-icon">
            <Compass size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="brand-title">PAN-BHARAT TRAVEL ATLAS</h1>
            <p className="brand-subtitle">8 Regional Circuits & Complete Subcontinental Loop</p>
          </div>
        </div>

        {/* 8-Route Quick Switcher Pills (Route A - H) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "4px",
            background: "rgba(0, 0, 0, 0.45)",
            padding: "4px",
            borderRadius: "8px",
            marginBottom: "8px",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          {routeList.map((r) => {
            const isSelected = activeRouteId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  if (setActiveRouteId) setActiveRouteId(r.id);
                  setActiveTab("route");
                }}
                style={{
                  padding: "5px 2px",
                  borderRadius: "5px",
                  border: isSelected ? `1px solid ${r.color}` : "1px solid transparent",
                  fontSize: "10.5px",
                  fontWeight: isSelected ? "800" : "500",
                  background: isSelected ? `${r.color}25` : "rgba(255, 255, 255, 0.03)",
                  color: isSelected ? (r.color || "#fbbf24") : "#94a3b8",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
                title={r.name}
              >
                <b>{r.key}.</b> {r.shortName.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* Global Action Buttons */}
        <div className="action-buttons-row">
          <button
            onClick={onOpenLegModal}
            className="action-pill"
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#fbbf24",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              fontWeight: "700"
            }}
            title="View Turn-by-Turn Consecutive Leg Distances, Driving Times & Rail Connectivity"
          >
            <Car size={13} />
            <span>Leg Distances</span>
          </button>

          <button
            onClick={onOpenComparator}
            className={`action-pill ${measureMode ? "active-ruler" : ""}`}
            title="Compare 8 Regional Circuits side-by-side or measure between any two places"
          >
            <Ruler size={13} />
            <span>Compare</span>
          </button>

          <button
            onClick={onOpenBudget}
            className="action-pill budget-pill"
            title="Open Editable Travel Budget Calculator (₹25,000 base)"
          >
            <Calculator size={13} />
            <span>Budget</span>
          </button>

          <button
            onClick={onOpenVerification}
            className="action-pill verify-pill"
            title="Official IRCTC & Government Sources"
          >
            <ShieldCheck size={13} />
            <span>Sources</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search all temples, stations (code), ghats..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveTab("search");
              else setActiveTab("route");
            }}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("route");
              }}
              className="clear-search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="sidebar-tabs">
          <button
            onClick={() => setActiveTab("route")}
            className={`tab-btn ${activeTab === "route" ? "active" : ""}`}
          >
            <Route size={13} />
            <span>
              {activeRoute?.shortName ? activeRoute.shortName.slice(0, 16) : "Active Route"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("places")}
            className={`tab-btn ${activeTab === "places" ? "active" : ""}`}
          >
            <MapPin size={13} />
            <span>All Places ({destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("layers")}
            className={`tab-btn ${activeTab === "layers" ? "active" : ""}`}
          >
            <Layers size={13} />
            <span>Map Overlays</span>
          </button>

          {searchQuery && (
            <button
              onClick={() => setActiveTab("search")}
              className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
            >
              <Search size={13} />
              <span>Results ({searchResults.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Content Area */}
      <div className="sidebar-content">
        {/* ================================================================= */}
        {/* TAB 1: ACTIVE MULTI-ROUTE (Numbered Stops & Consecutive Distances) */}
        {/* ================================================================= */}
        {activeTab === "route" && activeRoute && (
          <div className="route-tree-view">
            {/* Active Route Header Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))",
                borderBottom: `2px solid ${activeRoute.color || "#f59e0b"}`,
                padding: "12px 14px",
                marginBottom: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span
                  style={{
                    background: activeRoute.color || "#f59e0b",
                    color: "#0f172a",
                    fontWeight: "800",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    textTransform: "uppercase"
                  }}
                >
                  {activeRoute.badge || `ROUTE ${activeRoute.key}`}
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                  {activeRoute.region}
                </span>
              </div>

              <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc", margin: "4px 0" }}>
                {activeRoute.name}
              </h2>

              <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.35", marginBottom: "8px" }}>
                {activeRoute.overview}
              </p>

              {/* Transport-Specific Separated Metrics Ribbon */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                  background: "rgba(0, 0, 0, 0.35)",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.06)"
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px", fontWeight: "700" }}>
                    <Car size={12} /> Road Highway
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>
                    {routeMetrics?.totalRoadKm || 0} km
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                    Est. {routeMetrics?.formattedDuration || "N/A"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "10px", color: "#38bdf8", display: "flex", alignItems: "center", gap: "4px", fontWeight: "700" }}>
                    <Train size={12} /> Rail (Verified)
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff" }}>
                    {routeMetrics?.totalRailKm || 0} km
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                    {routeMetrics?.verifiedRailSegments || 0} verified legs
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Banner */}
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <button
                  onClick={onOpenLegModal}
                  style={{
                    flex: 1,
                    background: "rgba(245, 158, 11, 0.2)",
                    color: "#fbbf24",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    borderRadius: "5px",
                    padding: "6px 8px",
                    fontSize: "11px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    cursor: "pointer"
                  }}
                >
                  <Car size={13} />
                  <span>Turn-by-Turn Distances</span>
                </button>

                {setShowAllRoutes && (
                  <button
                    onClick={() => setShowAllRoutes(!showAllRoutes)}
                    style={{
                      background: showAllRoutes ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      color: showAllRoutes ? "#34d399" : "#94a3b8",
                      border: showAllRoutes ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "5px",
                      padding: "6px 8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer"
                    }}
                    title="Toggle subdued map lines for all 8 routes simultaneously"
                  >
                    <span>{showAllRoutes ? "All Routes Active" : "Overview (All 8)"}</span>
                  </button>
                )}
              </div>

              {/* Special Route G: Geographically Efficient vs Manual Order Toggle */}
              {activeRouteId === "route_g" && (
                <div
                  style={{
                    marginTop: "10px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "6px",
                    padding: "8px 10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Zap size={14} className="text-emerald-400" />
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399" }}>
                        Subcontinental Optimization
                      </span>
                    </div>
                    <span style={{ fontSize: "10px", color: "#a7f3d0" }}>
                      {isEfficientOrder ? "Saves 1,513 km" : "Sequential"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    <button
                      onClick={() => setIsEfficientOrder && setIsEfficientOrder(true)}
                      style={{
                        flex: 1,
                        background: isEfficientOrder ? "#10b981" : "rgba(255, 255, 255, 0.05)",
                        color: isEfficientOrder ? "#000000" : "#94a3b8",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 6px",
                        fontSize: "10.5px",
                        fontWeight: isEfficientOrder ? "800" : "500",
                        cursor: "pointer"
                      }}
                    >
                      <Zap size={11} className="inline mr-1" /> Efficient Order (8,678 km)
                    </button>
                    <button
                      onClick={() => setIsEfficientOrder && setIsEfficientOrder(false)}
                      style={{
                        flex: 1,
                        background: !isEfficientOrder ? "#f59e0b" : "rgba(255, 255, 255, 0.05)",
                        color: !isEfficientOrder ? "#000000" : "#94a3b8",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 6px",
                        fontSize: "10.5px",
                        fontWeight: !isEfficientOrder ? "800" : "500",
                        cursor: "pointer"
                      }}
                    >
                      Manual Order (10,192 km)
                    </button>
                  </div>
                </div>
              )}

              {/* Special Route H: Custom Route Architect Controls */}
              {activeRouteId === "route_h" && (
                <div
                  style={{
                    marginTop: "10px",
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "6px",
                    padding: "8px 10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#c4b5fd" }}>
                      Custom Route Architect
                    </span>
                    <button
                      onClick={handleResetCustomRoute}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        fontSize: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                      }}
                    >
                      <RefreshCw size={10} /> Reset
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    <select
                      value={selectedAddStopId}
                      onChange={(e) => setSelectedAddStopId(e.target.value)}
                      style={{
                        flex: 1,
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "#f8fafc",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "11px"
                      }}
                    >
                      <option value="">-- Add Destination to Custom Route --</option>
                      {Object.values(GRANULAR_STOPS).map((stop) => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} ({stop.state})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAddCustomStop}
                      style={{
                        background: "#8b5cf6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stops Count & Detour Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 14px",
                background: "rgba(0, 0, 0, 0.2)",
                fontSize: "11px",
                color: "#94a3b8"
              }}
            >
              <span>
                <b>{routeStops.length}</b> Numbered Stops in Sequence
              </span>

              <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showDetoursOnly}
                  onChange={(e) => setShowDetoursOnly && setShowDetoursOnly(e.target.checked)}
                />
                <span>Detours Only</span>
              </label>
            </div>

            {/* NUMBERED STOPS & CONNECTING LEGS LIST */}
            <div className="destinations-list" style={{ padding: "8px 10px" }}>
              {routeStops.map((stop, index) => {
                const leg = routeMetrics?.legs?.[index];
                const isExpanded = expandedRouteStops[`${stop.id}_${index}`];
                const isReturn = stop.isReturnStop;
                const pinColor = isReturn
                  ? "#10b981"
                  : stop.isDetour
                  ? "#ec4899"
                  : (activeRoute?.color || "#f59e0b");

                // If "Detours Only" is enabled, only show detours and their connecting legs
                if (showDetoursOnly && !stop.isDetour) return null;

                return (
                  <div key={`${stop.id}_${index}`} style={{ marginBottom: "6px" }}>
                    {/* STOP CARD */}
                    <div
                      className="destination-card"
                      style={{
                        borderLeft: `3px solid ${pinColor}`,
                        background: "rgba(18, 24, 38, 0.85)"
                      }}
                    >
                      <div
                        className="destination-header"
                        onClick={() => {
                          toggleRouteStop(stop.id, index);
                          onSelectItem({ ...stop, itemType: "destination" });
                        }}
                      >
                        <div className="dest-title-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: pinColor,
                              color: "#ffffff",
                              fontSize: "11px",
                              fontWeight: "800",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.4)"
                            }}
                          >
                            {stop.stopIndex || index + 1}
                          </span>

                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                              {stop.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                              {stop.state}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {stop.isDetour && (
                            <span
                              style={{
                                background: "rgba(236, 72, 153, 0.15)",
                                color: "#f472b6",
                                fontSize: "9px",
                                fontWeight: "800",
                                padding: "1px 5px",
                                border: "1px solid rgba(236, 72, 153, 0.3)",
                                borderRadius: "4px"
                              }}
                            >
                              DETOUR
                            </span>
                          )}

                          {isReturn && (
                            <span
                              style={{
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#34d399",
                                fontSize: "9px",
                                fontWeight: "800",
                                padding: "1px 5px",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                borderRadius: "4px"
                              }}
                            >
                              RETURN LOOP
                            </span>
                          )}

                          {/* Route H reordering controls */}
                          {activeRouteId === "route_h" && (
                            <div style={{ display: "flex", gap: "2px" }} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleMoveCustomStop(index, -1)}
                                disabled={index === 0}
                                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "1px" }}
                                title="Move stop up"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                onClick={() => handleMoveCustomStop(index, 1)}
                                disabled={index === routeStops.length - 1}
                                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "1px" }}
                                title="Move stop down"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                onClick={() => handleRemoveCustomStop(index)}
                                style={{ background: "transparent", border: "none", color: "#f43f5e", cursor: "pointer", padding: "1px" }}
                                title="Remove stop"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}

                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </div>
                      </div>

                      {/* Expanded Accordion: Station, Bus Stand, Sights */}
                      {isExpanded && (
                        <div className="destination-subitems" style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <p style={{ fontSize: "11px", color: "#cbd5e1", marginBottom: "8px", lineHeight: "1.4" }}>
                            {stop.subtitle || stop.overview}
                          </p>

                          {/* Practical Railhead */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "6px", fontSize: "11px" }}>
                            <Train size={13} className="text-blue-400" style={{ marginTop: "1px", flexShrink: 0 }} />
                            <div>
                              <span style={{ color: "#94a3b8" }}>Nearest Practical Railhead: </span>
                              <span style={{ color: "#60a5fa", fontWeight: "600" }}>{stop.nearestRailhead || "Verified Station"}</span>
                            </div>
                          </div>

                          {/* Useful Bus Terminal */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "8px", fontSize: "11px" }}>
                            <Bus size={13} className="text-rose-400" style={{ marginTop: "1px", flexShrink: 0 }} />
                            <div>
                              <span style={{ color: "#94a3b8" }}>Useful Bus Terminal: </span>
                              <span style={{ color: "#fb7185", fontWeight: "600" }}>{stop.nearestBusTerminal || "Local Bus Stand"}</span>
                            </div>
                          </div>

                          {/* Key Attractions */}
                          {stop.keyAttractions && stop.keyAttractions.length > 0 && (
                            <div>
                              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#f59e0b", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Sparkles size={11} /> Top Sacred Sights & Attractions:
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {stop.keyAttractions.map((attName, aIdx) => (
                                  <span
                                    key={aIdx}
                                    style={{
                                      background: "rgba(255, 255, 255, 0.05)",
                                      border: "1px solid rgba(255, 255, 255, 0.1)",
                                      color: "#e2e8f0",
                                      fontSize: "10px",
                                      padding: "2px 6px",
                                      borderRadius: "4px"
                                    }}
                                  >
                                    {attName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CONNECTING LEG CARD (Between stop i and stop i + 1) */}
                    {leg && index < routeStops.length - 1 && (
                      <div
                        style={{
                          margin: "4px 0 4px 16px",
                          padding: "6px 10px",
                          background: "rgba(15, 23, 42, 0.75)",
                          borderLeft: "2px dashed rgba(245, 158, 11, 0.4)",
                          borderRadius: "0 6px 6px 0",
                          fontSize: "10.5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "3px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
                          <ArrowRight size={11} className="text-amber-400" />
                          <span style={{ fontWeight: "600", color: "#f8fafc" }}>
                            {stop.name} ➔ {leg.toName}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ color: "#fbbf24", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Car size={11} /> Road: {leg.roadKm} km ({leg.durationText})
                          </span>

                          <span style={{ color: leg.railData?.available ? "#38bdf8" : "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Train size={11} /> Rail: {leg.railData?.available ? `${leg.railData.km} km (${leg.railData.via})` : "Not direct"}
                          </span>

                          <span style={{ color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Ruler size={11} /> Straight: {leg.straightKm} km
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ALL PLACES & DESTINATION CLUSTERS (Full Repository)       */}
        {/* ================================================================= */}
        {activeTab === "places" && (
          <div className="route-tree-view">
            {/* State Filter Pills */}
            <div style={{ display: "flex", gap: "4px", padding: "6px 12px", overflowX: "auto" }}>
              {availableStates.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  style={{
                    fontSize: "10px",
                    fontWeight: selectedState === st ? "700" : "500",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    border: selectedState === st ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectedState === st ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.03)",
                    color: selectedState === st ? "#fbbf24" : "#94a3b8",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {st === "all" ? `All (${destinations.length})` : st}
                </button>
              ))}
            </div>

            {/* Quick Category Filter Bar */}
            <div className="category-filter-chips">
              <button
                className={`filter-chip ${categoryFilter === "all" ? "active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-chip ${categoryFilter === "temples" ? "active" : ""}`}
                onClick={() => setCategoryFilter("temples")}
              >
                <Sparkles size={12} /> Temples
              </button>
              <button
                className={`filter-chip ${categoryFilter === "nature" ? "active" : ""}`}
                onClick={() => setCategoryFilter("nature")}
              >
                <Compass size={12} /> Nature
              </button>
              <button
                className={`filter-chip ${categoryFilter === "heritage" ? "active" : ""}`}
                onClick={() => setCategoryFilter("heritage")}
              >
                <ShieldCheck size={12} /> Heritage
              </button>
              <button
                className={`filter-chip ${categoryFilter === "stations" ? "active" : ""}`}
                onClick={() => setCategoryFilter("stations")}
              >
                <Train size={12} /> Stations
              </button>
              <button
                className={`filter-chip ${categoryFilter === "busTerminals" ? "active" : ""}`}
                onClick={() => setCategoryFilter("busTerminals")}
              >
                <Bus size={12} /> Bus Stands
              </button>
            </div>

            {/* Station Radius Filter Card */}
            <div className="radius-filter-card">
              <div className="radius-label">
                <Train size={13} />
                <span>Station Radius Filter:</span>
              </div>
              <select
                value={selectedStationFilter}
                onChange={(e) => setSelectedStationFilter(e.target.value)}
                className="radius-select"
              >
                <option value="all">All Verified Stations</option>
                <option value="5">Within 5 km radius</option>
                <option value="10">Within 10 km radius</option>
                <option value="25">Within 25 km radius</option>
                <option value="50">Within 50 km radius</option>
              </select>
            </div>

            {/* State & Destination Tree */}
            {Object.entries(destinationsByState).map(([state, dests]) => (
              <div key={state} className="state-group">
                <div className="state-header">
                  <span className="state-name">{state}</span>
                  <span className="state-count">{dests.length} clusters</span>
                </div>

                <div className="destinations-list">
                  {dests.map((dest) => {
                    const isExpanded = expandedDestinations[dest.id];
                    const destStations = stations.filter((s) => s.destinationId === dest.id);
                    const destAttractions = attractions.filter((a) => a.destinationId === dest.id);
                    const destBusTerminals = busTerminals.filter((b) => b.destinationId === dest.id);

                    const filteredAttractions = destAttractions.filter((a) => {
                      if (categoryFilter === "temples") {
                        return a.category === "temple" || a.category?.includes("Jyotirlinga") || a.category?.includes("Shaktipeeth");
                      }
                      if (categoryFilter === "nature") {
                        return a.category === "nature" || a.category === "waterfall" || a.category === "ghat";
                      }
                      if (categoryFilter === "heritage") {
                        return a.category === "heritage" || a.category?.includes("Fort");
                      }
                      return true;
                    });

                    return (
                      <div key={dest.id} className="destination-card">
                        <div
                          className="destination-header"
                          onClick={() => {
                            toggleDestination(dest.id);
                            onSelectItem({ ...dest, itemType: "destination" });
                          }}
                        >
                          <div className="dest-title-wrap">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="dest-name">{dest.name}</span>
                          </div>
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            {dest.isDetour && (
                              <span
                                style={{
                                  background: "rgba(236, 72, 153, 0.15)",
                                  color: "#f472b6",
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  padding: "1px 5px",
                                  border: "1px solid rgba(236, 72, 153, 0.3)",
                                  borderRadius: "4px"
                                }}
                              >
                                DETOUR
                              </span>
                            )}
                            <span className="dest-role-badge">{dest.role ? dest.role.split(" ")[0] : "Hub"}</span>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="destination-subitems">
                            <p className="dest-overview-text">{dest.overview}</p>

                            {/* Railway Stations Sub-section */}
                            {(categoryFilter === "all" || categoryFilter === "stations") && destStations.length > 0 && (
                              <div className="subitem-block">
                                <div className="subitem-heading">
                                  <Train size={12} className="text-blue-400" />
                                  <span>Verified Stations ({destStations.length})</span>
                                </div>
                                {destStations.map((station) => (
                                  <div
                                    key={station.id}
                                    onClick={() => onSelectItem({ ...station, itemType: "station" })}
                                    className={`station-item ${selectedItem?.id === station.id ? "selected" : ""}`}
                                  >
                                    <div className="station-code-badge">{station.code}</div>
                                    <div className="station-info">
                                      <div className="station-title">{station.name}</div>
                                      <div className="station-meta">
                                        <span>Dist: {station.distanceFromCenterKm} km</span> •{" "}
                                        <span>{station.category?.split(" ")[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Attractions Sub-section */}
                            {(categoryFilter === "all" ||
                              categoryFilter === "temples" ||
                              categoryFilter === "nature" ||
                              categoryFilter === "heritage") &&
                              filteredAttractions.length > 0 && (
                                <div className="subitem-block">
                                  <div className="subitem-heading">
                                    <Sparkles size={12} className="text-amber-400" />
                                    <span>Temples & Sights ({filteredAttractions.length})</span>
                                  </div>
                                  {filteredAttractions.map((att) => (
                                    <div
                                      key={att.id}
                                      onClick={() => onSelectItem({ ...att, itemType: "attraction" })}
                                      className={`attraction-item ${selectedItem?.id === att.id ? "selected" : ""}`}
                                    >
                                      <div className={`attraction-tag ${att.category}`}>
                                        {att.category === "temple"
                                          ? "Mandir"
                                          : att.category === "waterfall"
                                          ? "Falls"
                                          : att.category === "heritage"
                                          ? "Fort"
                                          : att.category}
                                      </div>
                                      <div className="attraction-title">{att.name}</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Bus Terminals Sub-section */}
                            {(categoryFilter === "all" || categoryFilter === "busTerminals") &&
                              destBusTerminals.length > 0 && (
                                <div className="subitem-block">
                                  <div className="subitem-heading">
                                    <Bus size={12} className="text-rose-400" />
                                    <span>Bus Terminals ({destBusTerminals.length})</span>
                                  </div>
                                  {destBusTerminals.map((bt) => (
                                    <div
                                      key={bt.id}
                                      onClick={() => onSelectItem({ ...bt, itemType: "bus" })}
                                      className={`station-item ${selectedItem?.id === bt.id ? "selected" : ""}`}
                                    >
                                      <div className="station-code-badge" style={{ background: "#e11d48" }}>
                                        BUS
                                      </div>
                                      <div className="station-info">
                                        <div className="station-title">{bt.name}</div>
                                        <div className="station-meta">
                                          <span>{bt.operator}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MAP LAYERS & OVERLAYS                                     */}
        {/* ================================================================= */}
        {activeTab === "layers" && (
          <div className="layers-panel" style={{ padding: "14px 16px" }}>
            <h3 className="section-title">Basemap Provider</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "14px" }}>
              {[
                { id: "googleRoadmap", label: "Google Roadmap" },
                { id: "googleHybrid", label: "Google Hybrid" },
                { id: "googleTerrain", label: "Google Terrain" },
                { id: "googleSatellite", label: "Google Satellite" },
                { id: "osm", label: "OpenStreetMap" }
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedTileLayer && setSelectedTileLayer(layer.id)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: selectedTileLayer === layer.id ? "700" : "500",
                    background: selectedTileLayer === layer.id ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    color: selectedTileLayer === layer.id ? "#fbbf24" : "#94a3b8",
                    border: selectedTileLayer === layer.id ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer"
                  }}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            <h3 className="section-title">Interactive Map Overlays</h3>
            <div className="layer-toggles-list">
              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.grandLoop)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, grandLoop: e.target.checked })}
                />
                <span className="layer-line highway-line" />
                <span>Active Highway Corridor ({activeRoute?.shortName})</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(showAllRoutes)}
                  onChange={(e) => setShowAllRoutes && setShowAllRoutes(e.target.checked)}
                />
                <span className="layer-line" style={{ borderBottom: "2px dashed #94a3b8" }} />
                <span>Show All 8 Routes Simultaneously (Subdued)</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.railCorridors)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, railCorridors: e.target.checked })}
                />
                <span className="layer-line rail-line" style={{ borderBottom: "2px dashed #38bdf8" }} />
                <span>Verified Railway Mainlines (Cyan Dashed)</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.destinations)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, destinations: e.target.checked })}
                />
                <span className="layer-badge dest-dot" />
                <span>Destination Clusters</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.stations)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, stations: e.target.checked })}
                />
                <span className="layer-badge station-dot" />
                <span>Railway Stations (Zoom-aware)</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.attractions)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, attractions: e.target.checked })}
                />
                <span className="layer-badge attraction-dot" />
                <span>Temples, Sights & Ghats</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.busCorridors)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, busCorridors: e.target.checked })}
                />
                <span className="layer-badge bus-dot" />
                <span>Bus Terminals & Stands</span>
              </label>

              <label className="layer-checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(activeLayers.scenicRoads)}
                  onChange={(e) => setActiveLayers({ ...activeLayers, scenicRoads: e.target.checked })}
                />
                <span className="layer-line scenic-line" style={{ background: "#ec4899" }} />
                <span>Optional Detours (Pink)</span>
              </label>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SEARCH RESULTS                                             */}
        {/* ================================================================= */}
        {activeTab === "search" && (
          <div className="search-results-list">
            <div className="results-count-banner">
              Found <b>{searchResults.length}</b> matches across India
            </div>

            {searchResults.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onSelectItem(item)}
                className="search-result-card"
              >
                <div className="result-type-badge">
                  {item.itemType === "destination" && "Destination Cluster"}
                  {item.itemType === "station" && `Railway Station [${item.code}]`}
                  {item.itemType === "attraction" && (item.category || "Sight")}
                  {item.itemType === "bus" && "Bus Terminal"}
                  {item.itemType === "train" && `Train [${item.trainNumber}]`}
                </div>
                <div className="result-title">{item.name || item.trainName}</div>
                <div className="result-subtitle">
                  {item.state || item.destinationName || item.corridor}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

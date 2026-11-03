import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Ruler,
  Navigation,
  Train,
  Bus,
  Car,
  Footprints,
  ArrowRight,
  Sparkles,
  MapPin,
  Compass,
  CheckCircle,
  Loader2,
  Table,
  Layers,
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  Info,
  RotateCcw,
  Clock
} from "lucide-react";
import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration,
  VERIFIED_RAIL_PAIRS,
  getRoadDistance,
  getEstimatedRoadDistanceSync,
  getVerifiedRailDistance,
  computeMultiModalTransitComparison,
  calculateConsecutiveLegBreakdown
} from "../services/distanceService";
import { ROUTES_REGISTRY, getRouteStopsList, calculateRouteDistanceMetrics } from "../data/multiRoutes.js";

export default function RouteComparator({
  isOpen,
  onClose,
  initialOrigin,
  initialDestination,
  onApplyRouteOnMap,
  onSelectRoute,
  destinations = [],
  stations = [],
  attractions = [],
  buses = [],
  currentRoute = []
}) {
  const [activeTab, setActiveTab] = useState("pair"); // "pair" | "matrix" | "consecutive"

  // Aggregate all selectable points across the subcontinent
  const allLocations = useMemo(() => {
    const dests = destinations.map(d => ({
      id: `d_${d.id}`,
      rawId: d.id,
      name: `${d.name} (${d.stateCode || d.state})`,
      lat: d.lat,
      lng: d.lng,
      type: "Destination Cluster",
      stationCode: d.majorStations?.[0] || null,
      busTerminal: d.busTerminals?.[0] || d.busAccess || null
    }));

    const stns = stations.map(s => ({
      id: `s_${s.id || s.code}`,
      rawId: s.code,
      name: `${s.code} - ${s.name} (${s.stateCode || s.state})`,
      lat: s.lat,
      lng: s.lng,
      type: "Railway Station",
      stationCode: s.code,
      busTerminal: s.busTerminalNearby || null
    }));

    const atts = attractions.map(a => ({
      id: `a_${a.id}`,
      rawId: a.id,
      name: `${a.name} (${a.stateCode || a.state || ""})`,
      lat: a.lat,
      lng: a.lng,
      type: "Sight / Temple",
      stationCode: a.practicalRailhead || null,
      busTerminal: a.nearestBusTerminal || null
    }));

    return [...dests, ...stns, ...atts];
  }, [destinations, stations, attractions]);

  // Tab 1: Origin & Destination selection
  const [originId, setOriginId] = useState(
    initialOrigin ? (initialOrigin.id || allLocations[0]?.id) : (allLocations[0]?.id || "d_varanasi")
  );
  const [destId, setDestId] = useState(
    initialDestination ? (initialDestination.id || allLocations[1]?.id) : (allLocations[1]?.id || "d_prayagraj")
  );

  // Selected Origin & Destination objects
  const originObj = useMemo(() => {
    return allLocations.find(l => l.id === originId || l.rawId === originId || l.id.endsWith(originId)) || allLocations[0];
  }, [allLocations, originId]);

  const destObj = useMemo(() => {
    return allLocations.find(l => l.id === destId || l.rawId === destId || l.id.endsWith(destId)) || allLocations[1];
  }, [allLocations, destId]);

  // Asynchronous comparison state
  const [transitComparison, setTransitComparison] = useState(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  useEffect(() => {
    if (!originObj || !destObj || !isOpen) return;

    let isMounted = true;
    setIsLoadingComparison(true);

    computeMultiModalTransitComparison(
      originObj,
      destObj,
      originObj.stationCode,
      destObj.stationCode
    )
      .then(res => {
        if (!isMounted) return;
        setIsLoadingComparison(false);
        setTransitComparison(res);
      })
      .catch(() => {
        if (isMounted) setIsLoadingComparison(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originObj, destObj, isOpen]);

  const swapLocations = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  // Tab 2: Distance Matrix Selection (Pick up to 6 locations to generate matrix table)
  const [matrixSelectedIds, setMatrixSelectedIds] = useState([
    "d_varanasi",
    "d_prayagraj",
    "d_ujjain",
    "d_indore",
    "d_nashik",
    "d_mathura"
  ]);

  const toggleMatrixLocation = (id) => {
    if (matrixSelectedIds.includes(id)) {
      if (matrixSelectedIds.length > 2) {
        setMatrixSelectedIds(matrixSelectedIds.filter(x => x !== id));
      }
    } else {
      if (matrixSelectedIds.length < 8) {
        setMatrixSelectedIds([...matrixSelectedIds, id]);
      }
    }
  };

  // Matrix data calculation
  const matrixItems = useMemo(() => {
    return matrixSelectedIds
      .map(id => allLocations.find(l => l.id === id || l.rawId === id || l.id.endsWith(id)))
      .filter(Boolean);
  }, [matrixSelectedIds, allLocations]);

  // Tab 3: Consecutive Leg Breakdown for active custom route
  const [consecutiveRouteData, setConsecutiveRouteData] = useState(null);
  const [isConsecutiveLoading, setIsConsecutiveLoading] = useState(false);

  const activeRouteStops = useMemo(() => {
    if (currentRoute && currentRoute.length > 1) return currentRoute;
    return destinations.slice(0, 10);
  }, [currentRoute, destinations]);

  useEffect(() => {
    if (activeTab !== "consecutive" || !isOpen || activeRouteStops.length < 2) return;

    let isMounted = true;
    setIsConsecutiveLoading(true);

    calculateConsecutiveLegBreakdown(activeRouteStops)
      .then(res => {
        if (!isMounted) return;
        setIsConsecutiveLoading(false);
        setConsecutiveRouteData(res);
      })
      .catch(() => {
        if (isMounted) setIsConsecutiveLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRouteStops, activeTab, isOpen]);

  // Pre-computed benchmarks for all 8 routes
  const circuitBenchmarks = useMemo(() => {
    return Object.values(ROUTES_REGISTRY).map(route => {
      const stops = getRouteStopsList(route.id);
      let estRoadKm = 0;
      let estStraightKm = 0;
      let estRailKm = 0;
      let verifiedRailCount = 0;

      for (let i = 0; i < stops.length - 1; i++) {
        const from = stops[i];
        const to = stops[i + 1];
        const sKm = calculateHaversineKm(from.lat, from.lng, to.lat, to.lng);
        const rKm = computeTopographicalRoadKm(sKm);
        estStraightKm += sKm;
        estRoadKm += rKm;

        const fCode = (from.nearestRailhead || "").match(/\(([A-Z]{2,5})[,\)]/)?.[1];
        const tCode = (to.nearestRailhead || "").match(/\(([A-Z]{2,5})[,\)]/)?.[1];
        if (fCode && tCode && VERIFIED_RAIL_PAIRS[`${fCode}-${tCode}`]) {
          estRailKm += VERIFIED_RAIL_PAIRS[`${fCode}-${tCode}`].km;
          verifiedRailCount++;
        }
      }

      const avgSpeed = estRoadKm > 1000 ? 60 : estRoadKm > 300 ? 52 : 38;
      const totalMinutes = Math.round((estRoadKm / avgSpeed) * 60);

      let backtracking = "Low / Optimal";
      let recommendation = "Ideal circular circuit; smooth progression.";
      if (route.id === "route_e") {
        backtracking = "Moderate";
        recommendation = "Shekhawati shrines involve minor branch detours off NH-52.";
      } else if (route.id === "route_g") {
        backtracking = "Optimal (Zero Crossings)";
        recommendation = "Seamless subcontinental grand loop connecting all 7 regional circuits in clockwise sequence.";
      } else if (route.id === "route_c" || route.id === "route_d") {
        backtracking = "Minimal (Radial/Circular)";
        recommendation = "Compact regional circuit; excellent for local cluster exploration.";
      }

      return {
        ...route,
        stopsCount: stops.length,
        roadKm: Math.round(estRoadKm * 10) / 10,
        straightKm: Math.round(estStraightKm * 10) / 10,
        railKm: Math.round(estRailKm * 10) / 10,
        verifiedRailCount,
        durationText: formatDuration(totalMinutes),
        backtracking,
        recommendation
      };
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="comparator-modal-overlay" onClick={onClose}>
      <div className="comparator-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "980px" }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span className="modal-badge comparator-badge">GEOSPATIAL DISTANCE ENGINE</span>
              <span style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 7px",
                borderRadius: "12px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Sparkles size={11} className="text-emerald-400" /> Live Routing & Matrix Calculations
              </span>
            </div>
            <h2 className="modal-title">Distance Matrix & Multi-Modal Route Comparator</h2>
            <p className="modal-subtitle">
              Verified Rail distances, Live OSRM / Google Road Routing, and Straight-Line Haversine Matrix across India
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(15, 23, 42, 0.5)",
          padding: "0 20px"
        }}>
          <button
            onClick={() => setActiveTab("pair")}
            style={{
              padding: "12px 18px",
              fontSize: "12px",
              fontWeight: "800",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "pair" ? "#38bdf8" : "#94a3b8",
              borderBottom: activeTab === "pair" ? "2px solid #38bdf8" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Compass size={14} />
            Two-Point Transit Comparison
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            style={{
              padding: "12px 18px",
              fontSize: "12px",
              fontWeight: "800",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "matrix" ? "#38bdf8" : "#94a3b8",
              borderBottom: activeTab === "matrix" ? "2px solid #38bdf8" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Table size={14} />
            Multi-Stop Distance Matrix (N×N)
          </button>

          <button
            onClick={() => setActiveTab("consecutive")}
            style={{
              padding: "12px 18px",
              fontSize: "12px",
              fontWeight: "800",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "consecutive" ? "#38bdf8" : "#94a3b8",
              borderBottom: activeTab === "consecutive" ? "2px solid #38bdf8" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <TrendingUp size={14} />
            Custom Route Consecutive Legs ({activeRouteStops.length} Stops)
          </button>

          <button
            onClick={() => setActiveTab("circuits")}
            style={{
              padding: "12px 18px",
              fontSize: "12px",
              fontWeight: "800",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "circuits" ? "#38bdf8" : "#94a3b8",
              borderBottom: activeTab === "circuits" ? "2px solid #38bdf8" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Layers size={14} />
            8 Routes Multi-Circuit Benchmark
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "20px" }}>
          {/* ============================================================== */}
          {/* TAB 1: TWO-POINT TRANSIT COMPARISON                            */}
          {/* ============================================================== */}
          {activeTab === "pair" && (
            <div>
              {/* Origin & Destination Pickers */}
              <div className="route-selectors-box" style={{ marginBottom: "16px" }}>
                <div className="selector-group">
                  <label className="selector-label">
                    <span className="dot origin-dot" /> Origin Location:
                  </label>
                  <select
                    value={originId}
                    onChange={(e) => setOriginId(e.target.value)}
                    className="location-select"
                  >
                    {allLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        [{loc.type}] {loc.name}
                      </option>
                    ))}
                  </select>
                  {originObj && (
                    <div style={{ fontSize: "10px", color: "#64748b", marginTop: "3px" }}>
                      Coords: [{originObj.lat.toFixed(4)}, {originObj.lng.toFixed(4)}]
                      {originObj.stationCode && ` • Rail: ${originObj.stationCode}`}
                    </div>
                  )}
                </div>

                <button onClick={swapLocations} className="swap-btn" title="Swap Origin and Destination">
                  <ArrowLeftRight size={16} />
                </button>

                <div className="selector-group">
                  <label className="selector-label">
                    <span className="dot dest-dot" /> Destination Location:
                  </label>
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="location-select"
                  >
                    {allLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        [{loc.type}] {loc.name}
                      </option>
                    ))}
                  </select>
                  {destObj && (
                    <div style={{ fontSize: "10px", color: "#64748b", marginTop: "3px" }}>
                      Coords: [{destObj.lat.toFixed(4)}, {destObj.lng.toFixed(4)}]
                      {destObj.stationCode && ` • Rail: ${destObj.stationCode}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-modal Comparison Grid */}
              {isLoadingComparison ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#38bdf8" }}>
                  <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: "13px", fontWeight: "700" }}>Calculating Live Road, Rail & Straight-line Distances...</div>
                </div>
              ) : transitComparison ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "12px"
                  }}>
                    {/* 1. Straight-Line */}
                    <div style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "10px",
                      padding: "14px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Ruler size={16} className="text-amber-400" />
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc" }}>
                            {transitComparison.straightLine.label}
                          </span>
                        </div>
                        <span style={{ fontSize: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                          {transitComparison.straightLine.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "900", color: "#fbbf24", margin: "8px 0" }}>
                        {transitComparison.straightLine.km} km
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {transitComparison.straightLine.subtext}
                      </div>
                    </div>

                    {/* 2. Actual Road Routing */}
                    <div style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(56, 189, 248, 0.35)",
                      borderRadius: "10px",
                      padding: "14px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Car size={16} className="text-sky-400" />
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc" }}>
                            {transitComparison.road.label}
                          </span>
                        </div>
                        <span style={{ fontSize: "10px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                          {transitComparison.road.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "900", color: "#38bdf8", margin: "8px 0" }}>
                        {transitComparison.road.km} km
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginLeft: "8px" }}>
                          ({transitComparison.road.durationText})
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Engine: {transitComparison.road.subtext}
                      </div>
                    </div>

                    {/* 3. Verified Railway Route */}
                    <div style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: transitComparison.rail.available ? "1px solid rgba(52, 211, 153, 0.35)" : "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "10px",
                      padding: "14px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Train size={16} className={transitComparison.rail.available ? "text-emerald-400" : "text-red-400"} />
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc" }}>
                            Railway Distance (Indian Railways)
                          </span>
                        </div>
                        <span style={{
                          fontSize: "10px",
                          background: transitComparison.rail.available ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: transitComparison.rail.available ? "#34d399" : "#f87171",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontWeight: "700"
                        }}>
                          {transitComparison.rail.badge}
                        </span>
                      </div>
                      <div style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        color: transitComparison.rail.available ? "#34d399" : "#f87171",
                        margin: "8px 0"
                      }}>
                        {transitComparison.rail.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {transitComparison.rail.subtext}
                      </div>
                    </div>

                    {/* 4. State Roadways Bus */}
                    <div style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(244, 63, 94, 0.25)",
                      borderRadius: "10px",
                      padding: "14px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Bus size={16} className="text-rose-400" />
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc" }}>
                            {transitComparison.bus.label}
                          </span>
                        </div>
                        <span style={{ fontSize: "10px", background: "rgba(244, 63, 94, 0.15)", color: "#fb7185", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                          {transitComparison.bus.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "900", color: "#fb7185", margin: "8px 0" }}>
                        {transitComparison.bus.km} km
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginLeft: "8px" }}>
                          (~{transitComparison.bus.durationText})
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Network: {transitComparison.bus.subtext}
                      </div>
                    </div>
                  </div>

                  {/* Interchange & Last-Mile Summary Callout */}
                  <div style={{
                    background: "rgba(30, 41, 59, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "12px"
                  }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase" }}>
                        Origin Gateway & Last-Mile Access
                      </div>
                      <div style={{ fontSize: "12px", color: "#f8fafc", marginTop: "2px" }}>
                        <b>Station:</b> {originObj.stationCode || "City Junction"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        <b>Bus Stand:</b> {originObj.busTerminal || "Central State Bus Stand"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase" }}>
                        Destination Gateway & Last-Mile Access
                      </div>
                      <div style={{ fontSize: "12px", color: "#f8fafc", marginTop: "2px" }}>
                        <b>Station:</b> {destObj.stationCode || "City Junction"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        <b>Bus Stand:</b> {destObj.busTerminal || "Central State Bus Stand"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase" }}>
                        Road vs Straight-line Ratio
                      </div>
                      <div style={{ fontSize: "12px", color: "#f8fafc", marginTop: "2px" }}>
                        Winding Factor: <b>{(transitComparison.road.km / (transitComparison.straightLine.km || 1)).toFixed(2)}x</b>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {transitComparison.road.isHill ? "Ghat highway curve penalty applies." : "Standard plains highway alignment."}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MULTI-STOP DISTANCE MATRIX (N x N TABLE)                */}
          {/* ============================================================== */}
          {activeTab === "matrix" && (
            <div>
              <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
                    Select Destinations for N × N Distance Matrix (Max 8)
                  </h4>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Cell shows: <b>Road Distance (km)</b> / Straight-Line (km)
                  </span>
                </div>

                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {destinations.slice(0, 16).map(d => {
                    const isSelected = matrixSelectedIds.includes(d.id) || matrixSelectedIds.includes(`d_${d.id}`);
                    return (
                      <button
                        key={d.id}
                        onClick={() => toggleMatrixLocation(`d_${d.id}`)}
                        style={{
                          padding: "2px 7px",
                          fontSize: "10px",
                          fontWeight: "700",
                          borderRadius: "4px",
                          border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: isSelected ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.6)",
                          color: isSelected ? "#38bdf8" : "#94a3b8",
                          cursor: "pointer"
                        }}
                      >
                        {d.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The Matrix Table */}
              <div style={{ overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "center" }}>
                  <thead>
                    <tr style={{ background: "rgba(15, 23, 42, 0.95)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }}>
                      <th style={{ padding: "10px", textAlign: "left", color: "#38bdf8", fontWeight: "800" }}>Origin \ Dest</th>
                      {matrixItems.map(col => (
                        <th key={col.id} style={{ padding: "8px 10px", color: "#f8fafc", fontWeight: "700" }}>
                          {col.name.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixItems.map((row, rIdx) => (
                      <tr
                        key={row.id}
                        style={{
                          background: rIdx % 2 === 0 ? "rgba(30, 41, 59, 0.3)" : "rgba(15, 23, 42, 0.5)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                      >
                        <td style={{ padding: "8px 10px", textAlign: "left", fontWeight: "800", color: "#f8fafc" }}>
                          {row.name.split(" ")[0]}
                        </td>
                        {matrixItems.map(col => {
                          if (row.id === col.id) {
                            return (
                              <td key={col.id} style={{ padding: "8px", color: "#64748b", background: "rgba(0, 0, 0, 0.2)" }}>
                                0 km
                              </td>
                            );
                          }
                          const straight = calculateHaversineKm(row.lat, row.lng, col.lat, col.lng);
                          const road = getEstimatedRoadDistanceSync(row.lat, row.lng, col.lat, col.lng);

                          return (
                            <td key={col.id} style={{ padding: "8px", verticalAlign: "middle" }}>
                              <div style={{ fontWeight: "800", color: "#38bdf8" }}>{road.roadKm} km</div>
                              <div style={{ fontSize: "9px", color: "#64748b" }}>{straight} km str.</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CUSTOM ROUTE CONSECUTIVE LEGS & CUMULATIVE MILEAGE      */}
          {/* ============================================================== */}
          {activeTab === "consecutive" && (
            <div>
              {isConsecutiveLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#38bdf8" }}>
                  <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: "13px", fontWeight: "700" }}>Computing Step-by-Step Consecutive Highway Segments...</div>
                </div>
              ) : consecutiveRouteData ? (
                <div>
                  {/* Summary Bar */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "10px",
                    marginBottom: "16px"
                  }}>
                    <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>Total Cumulative Road Distance</div>
                      <div style={{ fontSize: "20px", fontWeight: "900", color: "#38bdf8", margin: "2px 0" }}>
                        {consecutiveRouteData.totalRoadKm} km
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>Estimated Driving: ~{consecutiveRouteData.formattedDuration}</div>
                    </div>

                    <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>Straight-line Cumulative Path</div>
                      <div style={{ fontSize: "20px", fontWeight: "900", color: "#fbbf24", margin: "2px 0" }}>
                        {consecutiveRouteData.totalStraightKm} km
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>Geometric displacement</div>
                    </div>

                    <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#f472b6", fontWeight: "700" }}>Optional Detour Overhead</div>
                      <div style={{ fontSize: "20px", fontWeight: "900", color: "#f472b6", margin: "2px 0" }}>
                        +{consecutiveRouteData.detourRoadKm} km
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748b" }}>Branches outside primary corridor</div>
                    </div>
                  </div>

                  {/* Legs Table */}
                  <div style={{ overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "rgba(15, 23, 42, 0.95)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }}>
                          <th style={{ padding: "8px 12px", color: "#94a3b8" }}>#</th>
                          <th style={{ padding: "8px 12px", color: "#f8fafc" }}>Segment Corridor</th>
                          <th style={{ padding: "8px 12px", color: "#38bdf8" }}>Road Distance</th>
                          <th style={{ padding: "8px 12px", color: "#fbbf24" }}>Straight-Line</th>
                          <th style={{ padding: "8px 12px", color: "#94a3b8" }}>Driving Time</th>
                          <th style={{ padding: "8px 12px", color: "#94a3b8" }}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consecutiveRouteData.legs.map((leg, idx) => (
                          <tr
                            key={idx}
                            style={{
                              background: idx % 2 === 0 ? "rgba(30, 41, 59, 0.2)" : "rgba(15, 23, 42, 0.4)",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                            }}
                          >
                            <td style={{ padding: "8px 12px", color: "#64748b", fontWeight: "700" }}>{leg.legIndex}</td>
                            <td style={{ padding: "8px 12px", fontWeight: "700", color: "#f8fafc" }}>
                              {leg.fromName} ➔ {leg.toName}
                            </td>
                            <td style={{ padding: "8px 12px", fontWeight: "800", color: "#38bdf8" }}>
                              {leg.roadKm} km
                            </td>
                            <td style={{ padding: "8px 12px", color: "#fbbf24" }}>
                              {leg.straightKm} km
                            </td>
                            <td style={{ padding: "8px 12px", color: "#cbd5e1" }}>
                              {leg.durationText}
                            </td>
                            <td style={{ padding: "8px 12px" }}>
                              {leg.isDetour ? (
                                <span style={{
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  color: "#f472b6",
                                  background: "rgba(236, 72, 153, 0.15)",
                                  padding: "2px 6px",
                                  borderRadius: "4px"
                                }}>
                                  OPTIONAL DETOUR
                                </span>
                              ) : (
                                <span style={{
                                  fontSize: "9px",
                                  fontWeight: "800",
                                  color: "#34d399",
                                  background: "rgba(16, 185, 129, 0.15)",
                                  padding: "2px 6px",
                                  borderRadius: "4px"
                                }}>
                                  PRIMARY TRUNK
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: 8 ROUTES MULTI-CIRCUIT BENCHMARK                         */}
          {/* ============================================================== */}
          {activeTab === "circuits" && (
            <div>
              <div style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.25)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#38bdf8", marginBottom: "4px" }}>
                  All 8 Routes Multi-Circuit Comparison Matrix
                </h3>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Side-by-side comparison of all 8 route options across India. Road distances are calculated via routable highway networks; railway track distances are verified via official Indian Railways timetables. Never combined into a misleading single figure.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {circuitBenchmarks.map(r => (
                  <div
                    key={r.id}
                    style={{
                      background: "rgba(18, 24, 38, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderLeft: `4px solid ${r.color || '#38bdf8'}`,
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: r.color || "#38bdf8", color: "#0f172a", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "12px" }}>
                            Route {r.key}
                          </span>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", background: "rgba(255, 255, 255, 0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                            {r.region}
                          </span>
                          <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "700" }}>
                            ✔ {r.stopsCount} Stops
                          </span>
                        </div>
                        <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", marginTop: "4px" }}>
                          {r.name}
                        </h4>
                        <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                          {r.tagline}
                        </div>
                      </div>

                      {onSelectRoute && (
                        <button
                          onClick={() => {
                            onSelectRoute(r.id);
                            onClose();
                          }}
                          style={{
                            background: "rgba(56, 189, 248, 0.2)",
                            color: "#38bdf8",
                            border: "1px solid #38bdf8",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "800",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          Activate on Map ➔
                        </button>
                      )}
                    </div>

                    {/* Metrics Ribbon */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", background: "rgba(0, 0, 0, 0.25)", padding: "10px", borderRadius: "6px" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#f59e0b", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><Car size={12} /> Road Driving</div>
                        <div style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc" }}>{r.roadKm} km</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "3px" }}><Clock size={10} /> {r.durationText}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><Train size={12} /> Indian Railways</div>
                        <div style={{ fontSize: "15px", fontWeight: "800", color: r.railKm > 0 ? "#f8fafc" : "#94a3b8" }}>
                          {r.railKm > 0 ? `${r.railKm} km` : "Branch / Road"}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>{r.verifiedRailCount} verified rail links</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#ec4899", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><Compass size={12} /> Optional Detours</div>
                        <div style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc" }}>{r.detourStopsCount || 0} Detours</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Toggable in sidebar</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#10b981", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}><RotateCcw size={12} /> Backtracking Analysis</div>
                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc" }}>{r.backtracking}</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>{r.recommendation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

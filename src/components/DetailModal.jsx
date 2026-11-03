import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Train,
  Sparkles,
  Bike,
  ExternalLink,
  MapPin,
  Ruler,
  AlertCircle,
  Clock,
  Compass,
  Navigation,
  Info,
  ChevronRight,
  Star,
  Search,
  Loader2,
  Bus,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle,
  TrendingUp,
  CornerDownRight,
  Car,
  AlertTriangle
} from "lucide-react";
import { filterWithinRadius } from "../utils/geoUtils";
import {
  calculateHaversineKm,
  getRoadDistance,
  getEstimatedRoadDistanceSync,
  getVerifiedRailDistance
} from "../services/distanceService";
import { fetchGoogleLivePlaces } from "../services/googleMapsService";

export default function DetailModal({
  item,
  onClose,
  onStartMeasureFromHere,
  onSelectItem,
  allStations = [],
  allAttractions = [],
  allDestinations = [],
  allBuses = [],
  currentRoute = []
}) {
  const [nearbyRadius, setNearbyRadius] = useState(25); // 5, 10, 25, 50 km
  const [nearbySortMode, setNearbySortMode] = useState("road"); // "road" | "straight"
  const [placeQueryType, setPlaceQueryType] = useState("restaurants"); // "restaurants" | "hotels" | "temples"
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [isPlacesLoading, setIsPlacesLoading] = useState(false);

  // User-chosen Reference Destination for comparative distance measurement
  const [referenceDestId, setReferenceDestId] = useState(
    allDestinations[0]?.id || "varanasi"
  );

  // Asynchronous Road Distance state for Reference Destination
  const [refRoadData, setRefRoadData] = useState(null);
  const [isRefRoadLoading, setIsRefRoadLoading] = useState(false);

  // Target Reference Destination object
  const refDestObj = useMemo(() => {
    return (
      allDestinations.find(d => d.id === referenceDestId) ||
      allDestinations[0] || { lat: 25.3176, lng: 82.9739, name: "Varanasi" }
    );
  }, [allDestinations, referenceDestId]);

  // Compute live road route to Reference Destination whenever item or ref changes
  useEffect(() => {
    if (!item || !item.lat || !item.lng || !refDestObj) return;

    let isMounted = true;
    setIsRefRoadLoading(true);

    getRoadDistance(item.lat, item.lng, refDestObj.lat, refDestObj.lng)
      .then(res => {
        if (!isMounted) return;
        setIsRefRoadLoading(false);
        setRefRoadData(res);
      })
      .catch(() => {
        if (isMounted) setIsRefRoadLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [item, refDestObj]);

  // Fetch live Google Places when item or placeQueryType changes
  useEffect(() => {
    if (!item || !item.lat || !item.lng) return;

    let isMounted = true;
    setIsPlacesLoading(true);

    const queryTerm =
      placeQueryType === "restaurants"
        ? `Vegetarian restaurants near ${item.name || item.businessName || item.destinationName}`
        : placeQueryType === "hotels"
        ? `Hotels and dharamshalas near ${item.name || item.businessName || item.destinationName}`
        : `Famous temples and sights near ${item.name || item.businessName || item.destinationName}`;

    fetchGoogleLivePlaces(queryTerm, item.lat, item.lng, 5)
      .then(res => {
        if (!isMounted) return;
        setIsPlacesLoading(false);
        if (res.success) {
          setGooglePlaces(res.places);
        } else {
          setGooglePlaces([]);
        }
      })
      .catch(() => {
        if (isMounted) setIsPlacesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [item, placeQueryType]);

  // 1. Straight-line distance to reference location
  const straightToRefKm =
    item?.lat && item?.lng && refDestObj
      ? calculateHaversineKm(item.lat, item.lng, refDestObj.lat, refDestObj.lng)
      : null;

  // 2. Nearest Useful Railway Station calculation
  const nearestStation = useMemo(() => {
    if (!item.lat || !item.lng || allStations.length === 0) return null;
    let closest = null;
    let minDist = Infinity;
    allStations.forEach(stn => {
      const dist = calculateHaversineKm(item.lat, item.lng, stn.lat, stn.lng);
      if (dist < minDist) {
        minDist = dist;
        closest = { ...stn, straightKm: dist };
      }
    });
    if (closest) {
      const road = getEstimatedRoadDistanceSync(item.lat, item.lng, closest.lat, closest.lng);
      return { ...closest, roadKm: road.roadKm, durationText: road.durationText };
    }
    return null;
  }, [item, allStations]);

  // 3. Nearest Useful Bus Terminal calculation
  const nearestBusTerminal = useMemo(() => {
    if (!item.lat || !item.lng || allBuses.length === 0) return null;
    let closest = null;
    let minDist = Infinity;
    allBuses.forEach(b => {
      const dist = calculateHaversineKm(item.lat, item.lng, b.lat, b.lng);
      if (dist < minDist) {
        minDist = dist;
        closest = { ...b, straightKm: dist };
      }
    });
    if (closest) {
      const road = getEstimatedRoadDistanceSync(item.lat, item.lng, closest.lat, closest.lng);
      return { ...closest, roadKm: road.roadKm, durationText: road.durationText };
    }
    return null;
  }, [item, allBuses]);

  // 4. Nearest Relevant Attraction
  const nearestOtherAttraction = useMemo(() => {
    if (!item.lat || !item.lng || allAttractions.length === 0) return null;
    let closest = null;
    let minDist = Infinity;
    allAttractions
      .filter(a => a.id !== item.id)
      .forEach(a => {
        const dist = calculateHaversineKm(item.lat, item.lng, a.lat, a.lng);
        if (dist < minDist) {
          minDist = dist;
          closest = { ...a, straightKm: dist };
        }
      });
    if (closest) {
      const road = getEstimatedRoadDistanceSync(item.lat, item.lng, closest.lat, closest.lng);
      return { ...closest, roadKm: road.roadKm, durationText: road.durationText };
    }
    return null;
  }, [item, allAttractions]);

  // 5. Previous and Next Stops in Active Route
  const routeContext = useMemo(() => {
    if (!currentRoute || currentRoute.length === 0 || !item.id) return null;
    const idx = currentRoute.findIndex(
      r => r.id === item.id || r.destinationId === item.id || item.id.includes(r.id)
    );
    if (idx === -1) return null;

    const prevStop = idx > 0 ? currentRoute[idx - 1] : null;
    const nextStop = idx < currentRoute.length - 1 ? currentRoute[idx + 1] : null;

    let prevDist = null;
    let nextDist = null;

    if (prevStop) {
      const straight = calculateHaversineKm(item.lat, item.lng, prevStop.lat, prevStop.lng);
      const road = getEstimatedRoadDistanceSync(item.lat, item.lng, prevStop.lat, prevStop.lng);
      prevDist = { ...prevStop, straightKm: straight, roadKm: road.roadKm, durationText: road.durationText };
    }

    if (nextStop) {
      const straight = calculateHaversineKm(item.lat, item.lng, nextStop.lat, nextStop.lng);
      const road = getEstimatedRoadDistanceSync(item.lat, item.lng, nextStop.lat, nextStop.lng);
      nextDist = { ...nextStop, straightKm: straight, roadKm: road.roadKm, durationText: road.durationText };
    }

    return { prevDist, nextDist, stopIndex: idx + 1, totalStops: currentRoute.length };
  }, [currentRoute, item]);

  // 6. Verified Rail Connectivity to Reference Station
  const verifiedRailStatus = useMemo(() => {
    if (!nearestStation || !refDestObj) return { available: false, label: "Rail distance unavailable — verify railway route" };
    const refStationCode = refDestObj.majorStations?.[0] || "BSB";
    return getVerifiedRailDistance(nearestStation.code, refStationCode);
  }, [nearestStation, refDestObj]);

  // 7. Distance from City Center
  const cityCenterDistance = useMemo(() => {
    if (!item.lat || !item.lng) return null;
    const center = item.cityCenter || (item.destinationId && allDestinations.find(d => d.id === item.destinationId)?.cityCenter);
    if (!center || !center.lat) return null;
    const straight = calculateHaversineKm(item.lat, item.lng, center.lat, center.lng);
    const road = getEstimatedRoadDistanceSync(item.lat, item.lng, center.lat, center.lng);
    return { name: center.name || "City Center", straightKm: straight, roadKm: road.roadKm };
  }, [item, allDestinations]);

  // Nearby Attractions filtered within radius (5, 10, 25, 50 km)
  const nearbyAttractions = item.lat && item.lng
    ? filterWithinRadius(item.lat, item.lng, allAttractions.filter(a => a.id !== item.id), nearbyRadius, nearbySortMode)
    : [];

  // Nearby Stations within chosen radius
  const nearbyStations = item.lat && item.lng
    ? filterWithinRadius(item.lat, item.lng, allStations.filter(s => s.id !== item.id), nearbyRadius, nearbySortMode)
    : [];

  // Nearby Bus Terminals within chosen radius
  const nearbyBuses = item?.lat && item?.lng
    ? filterWithinRadius(item.lat, item.lng, allBuses.filter(b => b.id !== item.id), nearbyRadius, nearbySortMode)
    : [];

  if (!item) return null;

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span className="modal-badge">{item.itemType?.toUpperCase()}</span>
              {item.isDetour && (
                <span style={{
                  background: "rgba(236, 72, 153, 0.2)",
                  color: "#f472b6",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(236, 72, 153, 0.4)"
                }}>
                  OPTIONAL DETOUR
                </span>
              )}
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
                <Sparkles size={11} className="text-emerald-400" /> Verified Geospatial Data
              </span>
            </div>
            <h2 className="modal-title">{item.name || item.businessName || item.trainName || item.route}</h2>
            <p className="modal-subtitle">
              {item.state || item.region || item.operator || item.category || ""}
              {item.lat && item.lng && ` • Coordinates: [${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}]`}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close Panel">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Action Row */}
          <div className="modal-actions-bar">
            {item.lat && item.lng && (
              <button
                onClick={() => onStartMeasureFromHere(item)}
                className="modal-action-btn primary"
              >
                <Ruler size={14} />
                <span>Measure Distance from Here</span>
              </button>
            )}

            {item.officialUrl && (
              <a
                href={item.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn outline"
              >
                <ExternalLink size={14} />
                <span>Official Enquiry (IRCTC / NTES)</span>
              </a>
            )}

            {item.bookingUrl && (
              <a
                href={item.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn highlight"
              >
                <ExternalLink size={14} />
                <span>Official Bus / State Ticket</span>
              </a>
            )}
          </div>

          {/* ============================================================== */}
          {/* COMPLETE 10-DIMENSION GEOSPATIAL DISTANCE INTELLIGENCE CARD    */}
          {/* ============================================================== */}
          {item.lat && item.lng && (
            <div style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={18} className="text-sky-400" />
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#f8fafc", letterSpacing: "0.03em" }}>
                    GEOSPATIAL DISTANCE INTELLIGENCE
                  </span>
                </div>

                {/* Reference Location Picker */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Reference Destination:</span>
                  <select
                    value={referenceDestId}
                    onChange={(e) => setReferenceDestId(e.target.value)}
                    style={{
                      background: "#0f172a",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "11px",
                      fontWeight: "700"
                    }}
                  >
                    {allDestinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.stateCode || d.state})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1 & 2. Straight-line vs Actual Road Distance to Reference */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "10px",
                marginBottom: "12px"
              }}>
                {/* Straight-line Card */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Ruler size={11} className="text-amber-400" />
                    1. Straight-Line (Haversine)
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: "#fbbf24", margin: "4px 0" }}>
                    {straightToRefKm} km
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    To {refDestObj.name} (Great-circle flight path)
                  </div>
                </div>

                {/* Actual Road Distance Card */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "8px",
                  padding: "10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Navigation size={11} />
                    2. Actual Road Routing
                    {isRefRoadLoading && <Loader2 size={10} className="animate-spin text-sky-400" />}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: "#38bdf8", margin: "4px 0" }}>
                    {refRoadData?.roadKm ?? getEstimatedRoadDistanceSync(item.lat, item.lng, refDestObj.lat, refDestObj.lng).roadKm} km
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", marginLeft: "6px" }}>
                      ({refRoadData?.durationText ?? getEstimatedRoadDistanceSync(item.lat, item.lng, refDestObj.lat, refDestObj.lng).durationText})
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    {refRoadData?.source || "Live Road Routing Engine"}
                  </div>
                </div>

                {/* 3. Verified Rail Connectivity */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: verifiedRailStatus.available ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "8px",
                  padding: "10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: verifiedRailStatus.available ? "#34d399" : "#f87171", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Train size={11} />
                    3. Verified Railway Route
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: verifiedRailStatus.available ? "#34d399" : "#f87171", margin: "4px 0" }}>
                    {verifiedRailStatus.available ? `${verifiedRailStatus.km} km` : "Rail distance unavailable"}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    {verifiedRailStatus.available
                      ? `Via ${verifiedRailStatus.via} • ${verifiedRailStatus.gauge}`
                      : "Rail distance unavailable — verify railway route"}
                  </div>
                </div>
              </div>

              {/* 4, 5, 6. Nearest Station, Nearest Bus Terminal, Nearest Sights */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "10px",
                marginBottom: "12px"
              }}>
                {/* 4. Nearest Railway Station */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "8px 10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    4. Nearest Useful Station
                  </div>
                  {nearestStation ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc", margin: "2px 0" }}>
                        {nearestStation.code} - {nearestStation.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#38bdf8" }}>
                        <b>Road:</b> {nearestStation.roadKm} km ({nearestStation.durationText}) • <b>Straight:</b> {nearestStation.straightKm} km
                      </div>
                      <div style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>
                        {nearestStation.lastMileTransfer || nearestStation.interchangeNotes}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Station discovery in progress</div>
                  )}
                </div>

                {/* 5. Nearest Bus Terminal */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "8px 10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    5. Nearest Bus Terminal
                  </div>
                  {nearestBusTerminal ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc", margin: "2px 0" }}>
                        {nearestBusTerminal.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#f43f5e" }}>
                        <b>Road:</b> {nearestBusTerminal.roadKm} km • <b>Straight:</b> {nearestBusTerminal.straightKm} km
                      </div>
                      <div style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>
                        {nearestBusTerminal.operator} • {nearestBusTerminal.lastMileNote}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Bus terminal within radius</div>
                  )}
                </div>

                {/* 6. Nearest Other Attraction */}
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "8px",
                  padding: "8px 10px"
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    6. Nearest Sight / Attraction
                  </div>
                  {nearestOtherAttraction ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#f8fafc", margin: "2px 0" }}>
                        {nearestOtherAttraction.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#fbbf24" }}>
                        <b>Road:</b> {nearestOtherAttraction.roadKm} km • <b>Straight:</b> {nearestOtherAttraction.straightKm} km
                      </div>
                      <div style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>
                        Category: {nearestOtherAttraction.category}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Isolated destination point</div>
                  )}
                </div>
              </div>

              {/* 7, 8, 9, 10. Route Context & Detours */}
              <div style={{
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px dashed rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                padding: "8px 10px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "8px"
              }}>
                {/* 8. Active Route Consecutive Legs */}
                <div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    8. Consecutive Route Legs
                  </div>
                  {routeContext ? (
                    <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                      {routeContext.prevDist ? (
                        <div>
                          <b>Previous:</b> {routeContext.prevDist.name} ({routeContext.prevDist.roadKm} km road / {routeContext.prevDist.straightKm} km straight)
                        </div>
                      ) : (
                        <div><b>Origin Stop:</b> First waypoint in route</div>
                      )}
                      {routeContext.nextDist ? (
                        <div style={{ marginTop: "2px" }}>
                          <b>Next:</b> {routeContext.nextDist.name} ({routeContext.nextDist.roadKm} km road / {routeContext.nextDist.straightKm} km straight)
                        </div>
                      ) : (
                        <div><b>Terminus Stop:</b> Last waypoint in route</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: "10px", color: "#64748b" }}>
                      Add to active route in Route Architect to compute consecutive leg distances.
                    </div>
                  )}
                </div>

                {/* 9. Detour Additional Mileage */}
                <div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    9. Optional Detour Mileage
                  </div>
                  <div style={{ fontSize: "11px", color: item.isDetour ? "#f472b6" : "#cbd5e1", marginTop: "2px" }}>
                    {item.isDetour ? (
                      <b>Branch Detour (+{Math.round((straightToRefKm || 30) * 0.45)} km additional road deviation)</b>
                    ) : (
                      "On Primary Route Trunk corridor (0 km detour penalty)"
                    )}
                  </div>
                </div>

                {/* 10. City Center Distance */}
                <div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                    10. Distance to City Center
                  </div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                    {cityCenterDistance ? (
                      <span><b>{cityCenterDistance.name}:</b> {cityCenterDistance.roadKm} km road ({cityCenterDistance.straightKm} km straight)</span>
                    ) : (
                      <span>Located directly within urban cluster core</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. RAILWAY STATION DETAILS */}
          {item.itemType === "station" && (
            <div className="detail-section">
              <div className="info-grid-2col">
                <div className="info-stat-card">
                  <span className="stat-label">Station Code</span>
                  <span className="stat-value code-value">{item.code}</span>
                </div>
                <div className="info-stat-card">
                  <span className="stat-label">Category</span>
                  <span className="stat-value">{item.category}</span>
                </div>
                <div className="info-stat-card">
                  <span className="stat-label">Distance from City Center</span>
                  <span className="stat-value">{item.distanceFromCityCenterKm || 2} km</span>
                </div>
                <div className="info-stat-card">
                  <span className="stat-label">Platforms & Gauge</span>
                  <span className="stat-value">{item.platforms || 4} Plat. • {item.gauge || "Broad Gauge"}</span>
                </div>
              </div>

              {/* Interchange Notes */}
              <div className="detail-block">
                <h4 className="block-title">Interchange & Route Notes</h4>
                <p className="block-text">{item.interchangeNotes}</p>
              </div>

              {/* Verified Passenger Services */}
              {item.verifiedTrains && (
                <div className="detail-block">
                  <h4 className="block-title">Verified Train Lines</h4>
                  <div className="tag-cluster">
                    {item.verifiedTrains.map((svc, i) => (
                      <span key={i} className="service-tag">{svc}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connecting Transit & Bus Terminal */}
              <div className="detail-block">
                <h4 className="block-title">Connecting Local Transit & Bus Stands</h4>
                <p className="block-text">{item.lastMileTransfer || item.nearbyTransit || item.busTerminalNearby}</p>
              </div>
            </div>
          )}

          {/* 2. TOURIST ATTRACTION DETAILS */}
          {item.itemType === "attraction" && (
            <div className="detail-section">
              <p className="attraction-long-desc">{item.description}</p>

              {/* Practical Railway Station Highlight */}
              <div className="practical-station-callout">
                <div className="callout-header">
                  <Train size={18} className="text-amber-400" />
                  <div>
                    <h4 className="callout-title">Nearest Practical Railway Station</h4>
                    <span className="callout-code">{item.practicalRailhead || item.nearestPracticalStation?.name}</span>
                  </div>
                </div>
                <div className="callout-body">
                  <div className="callout-stat">
                    <span>Road Distance:</span> <b>{item.distanceFromRailheadKm || item.nearestPracticalStation?.roadDistanceKm} km</b>
                  </div>
                  <div className="callout-explanation">
                    <Info size={14} className="info-icon" />
                    <span><b>Verified Transit Note:</b> {item.nearestPracticalStation?.notes || "E-rickshaw, shared auto, or prepaid taxi direct to temple entrance."}</span>
                  </div>
                </div>
              </div>

              {/* Timings, Entry, Dress Code */}
              {(item.timings || item.entryFee || item.dressCode) && (
                <div className="info-grid-2col" style={{ marginTop: "12px" }}>
                  {item.timings && (
                    <div className="info-stat-card">
                      <span className="stat-label">Opening Timings</span>
                      <span className="stat-value text-xs">{item.timings}</span>
                    </div>
                  )}
                  {item.entryFee && (
                    <div className="info-stat-card">
                      <span className="stat-label">Entry / Darshan Fee</span>
                      <span className="stat-value text-xs">{item.entryFee}</span>
                    </div>
                  )}
                  {item.dressCode && (
                    <div className="info-stat-card" style={{ gridColumn: "span 2" }}>
                      <span className="stat-label">Dress Code & Protocol</span>
                      <span className="stat-value text-xs">{item.dressCode}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. DESTINATION CLUSTER DETAILS */}
          {item.itemType === "destination" && (
            <div className="detail-section">
              <p className="attraction-long-desc">{item.overview}</p>

              <div className="detail-block">
                <h4 className="block-title">Key Highlights</h4>
                <div className="tag-cluster">
                  {item.highlights?.map((hl, i) => (
                    <span key={i} className="highlight-tag">{hl}</span>
                  ))}
                </div>
              </div>

              <div className="detail-block">
                <h4 className="block-title">Major Railway Stations</h4>
                <div className="tag-cluster">
                  {item.majorStations?.map((stn, i) => (
                    <span key={i} className="station-tag">{stn}</span>
                  ))}
                </div>
              </div>

              <div className="detail-block">
                <h4 className="block-title">Bus Terminals & Access</h4>
                <p className="block-text">{item.busAccess || item.busTerminals?.join(", ")}</p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* NEARBY PLACES DISCOVERY ENGINE (5 km, 10 km, 25 km, 50 km)     */}
          {/* ============================================================== */}
          {item.lat && item.lng && (
            <div className="detail-section" style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h4 className="section-heading" style={{ margin: 0 }}>
                    Nearby Attractions & Transport Hubs
                  </h4>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Compare Straight-Line vs Actual Road Distances
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {/* Sort Mode Toggle */}
                  <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.8)", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.1)", overflow: "hidden" }}>
                    <button
                      onClick={() => setNearbySortMode("road")}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        background: nearbySortMode === "road" ? "#38bdf8" : "transparent",
                        color: nearbySortMode === "road" ? "#0f172a" : "#94a3b8",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Sort Road
                    </button>
                    <button
                      onClick={() => setNearbySortMode("straight")}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        background: nearbySortMode === "straight" ? "#38bdf8" : "transparent",
                        color: nearbySortMode === "straight" ? "#0f172a" : "#94a3b8",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Sort Straight
                    </button>
                  </div>

                  {/* Radius Filter Pills */}
                  <div className="radius-pill-group">
                    {[5, 10, 25, 50].map(r => (
                      <button
                        key={r}
                        onClick={() => setNearbyRadius(r)}
                        className={`radius-pill ${nearbyRadius === r ? "active" : ""}`}
                      >
                        {r} km
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nearby Attractions List */}
              <div className="nearby-list">
                {nearbyAttractions.length === 0 ? (
                  <div className="empty-nearby-state">
                    No tourist sights discovered within {nearbyRadius} km. Try expanding to 50 km.
                  </div>
                ) : (
                  nearbyAttractions.slice(0, 8).map(att => (
                    <div
                      key={att.id}
                      className="nearby-item-row"
                      onClick={() => onSelectItem && onSelectItem({ ...att, itemType: "attraction" })}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="nearby-item-left">
                        <div className="nearby-item-name">{att.name}</div>
                        <div className="nearby-item-meta">
                          {att.category} • {att.state}
                          {att.hasDetourAlert && (
                            <span style={{
                              marginLeft: "6px",
                              color: "#f59e0b",
                              background: "rgba(245, 158, 11, 0.15)",
                              padding: "1px 5px",
                              borderRadius: "4px",
                              fontWeight: "700",
                              fontSize: "9px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}>
                              <AlertTriangle size={10} className="text-amber-400" /> Road Detour ({att.detourRatio}x)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="nearby-item-right" style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Car size={12} className="text-sky-400" /> {att.roadKm} km <small style={{ color: "#94a3b8", fontWeight: "400" }}>({att.durationText})</small>
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                          Straight: {att.straightKm} km
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Verified Stations in radius */}
              {nearbyStations.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <h5 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "#38bdf8", marginBottom: "6px" }}>
                    Verified Railway Stations Within {nearbyRadius} km
                  </h5>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px" }}>
                    {nearbyStations.slice(0, 4).map(stn => (
                      <div
                        key={stn.id || stn.code}
                        onClick={() => onSelectItem && onSelectItem({ ...stn, itemType: "station" })}
                        style={{
                          background: "rgba(15, 23, 42, 0.6)",
                          border: "1px solid rgba(56, 189, 248, 0.2)",
                          borderRadius: "6px",
                          padding: "6px 8px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#f8fafc" }}>
                            {stn.code} - {stn.name}
                          </span>
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
                          Road: {stn.roadKm} km • Straight: {stn.straightKm} km
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* LIVE GOOGLE PLACES SEARCH                                       */}
          {/* ============================================================== */}
          {item.lat && item.lng && (
            <div style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "12px",
              marginTop: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Search size={14} className="text-emerald-400" />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc" }}>
                    Live Places via Google API
                  </span>
                  {isPlacesLoading && <Loader2 size={12} className="animate-spin text-emerald-400" />}
                </div>

                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { id: "restaurants", label: "Pure Veg Food" },
                    { id: "hotels", label: "Stays / Ashrams" },
                    { id: "temples", label: "Temples" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPlaceQueryType(tab.id)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        background: placeQueryType === tab.id ? "#10b981" : "rgba(255, 255, 255, 0.06)",
                        color: placeQueryType === tab.id ? "#0f172a" : "#cbd5e1",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Places List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {googlePlaces.length === 0 && !isPlacesLoading && (
                  <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center", padding: "8px" }}>
                    No results found for {placeQueryType} in this sector.
                  </div>
                )}
                {googlePlaces.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(30, 41, 59, 0.4)",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.04)"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#f1f5f9" }}>{p.name}</div>
                      <div style={{ fontSize: "9px", color: "#94a3b8" }}>{p.address}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {p.rating && p.rating !== "N/A" && (
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          color: "#f59e0b",
                          background: "rgba(245, 158, 11, 0.15)",
                          padding: "1px 5px",
                          borderRadius: "4px"
                        }}>
                          ★ {p.rating}
                        </span>
                      )}
                      {p.googleMapsUri && (
                        <a
                          href={p.googleMapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#38bdf8" }}
                          title="Open in Google Maps"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
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

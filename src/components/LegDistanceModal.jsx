import React from "react";
import {
  X,
  Car,
  Train,
  Ruler,
  ArrowRight,
  Compass,
  Bus
} from "lucide-react";

export default function LegDistanceModal({
  isOpen,
  onClose,
  route,
  metrics,
  stops = [],
  onSelectStop
}) {
  if (!isOpen || !route) return null;

  const legs = metrics?.legs || [];

  return (
    <div className="detail-modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="detail-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "980px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "16px 20px" }}>
          <div className="modal-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
              <span
                style={{
                  background: route.color || "#f59e0b",
                  color: "#0f172a",
                  fontWeight: "800",
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "20px"
                }}
              >
                {route.badge}
              </span>
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.3)"
                }}
              >
                Consecutive Leg Intelligence
              </span>
            </div>
            <h2 className="modal-title" style={{ fontSize: "20px" }}>{route.name}</h2>
            <p className="modal-subtitle" style={{ fontSize: "12px", color: "#94a3b8" }}>
              Segment-by-segment road distances, driving times, verified railway track distances, and interchange stations.
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Transport Totals Ribbon (Never combines road and rail into a single figure) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            padding: "14px 20px",
            background: "rgba(15, 23, 42, 0.6)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          <div
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              padding: "10px 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#f59e0b", fontWeight: "700" }}>
              <Car size={14} /> Total Road Distance
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
              {metrics?.totalRoadKm || 0} km
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Est. Driving: {metrics?.formattedDuration || "N/A"}
            </div>
          </div>

          <div
            style={{
              background: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "8px",
              padding: "10px 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#38bdf8", fontWeight: "700" }}>
              <Train size={14} /> Verified Rail Track
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
              {metrics?.totalRailKm ? `${metrics.totalRailKm} km` : "N/A"}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              {metrics?.verifiedRailSegments || 0} segments verified by IRCTC/NTES
            </div>
          </div>

          <div
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              padding: "10px 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#c084fc", fontWeight: "700" }}>
              <Ruler size={14} /> Straight-Line (Haversine)
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
              {metrics?.totalStraightKm || 0} km
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Highway Curvature: {metrics?.totalStraightKm ? (metrics.totalRoadKm / metrics.totalStraightKm).toFixed(2) : 1}x
            </div>
          </div>

          <div
            style={{
              background: "rgba(236, 72, 153, 0.1)",
              border: "1px solid rgba(236, 72, 153, 0.3)",
              borderRadius: "8px",
              padding: "10px 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#f472b6", fontWeight: "700" }}>
              <Compass size={14} /> Stops & Detours
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
              {stops.length} Stops
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Detours: {metrics?.detourRoadKm || 0} km added
            </div>
          </div>
        </div>

        {/* Scrollable Legs Table */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {legs.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              No consecutive segments found for this route.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {legs.map((leg) => (
                <div
                  key={`leg_${leg.legIndex}`}
                  style={{
                    background: "rgba(18, 24, 38, 0.8)",
                    border: leg.isDetour ? "1px solid rgba(236, 72, 153, 0.35)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    transition: "all 0.15s ease"
                  }}
                >
                  {/* Leg Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          background: "#0f172a",
                          color: "#f59e0b",
                          fontWeight: "800",
                          fontSize: "12px",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid rgba(245, 158, 11, 0.4)"
                        }}
                      >
                        {leg.legIndex}
                      </span>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{leg.fromName}</span>
                        <ArrowRight size={14} color="#f59e0b" />
                        <span>{leg.toName}</span>
                      </div>
                      {leg.isDetour && (
                        <span style={{ background: "rgba(236, 72, 153, 0.2)", color: "#f472b6", fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>
                          DETOUR
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Cumulative: <b style={{ color: "#f59e0b" }}>{leg.cumulativeRoadKm} km</b>
                    </div>
                  </div>

                  {/* 3-Column Metrics Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                      background: "rgba(0, 0, 0, 0.25)",
                      padding: "10px 12px",
                      borderRadius: "8px"
                    }}
                  >
                    {/* Road Metric */}
                    <div>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#f59e0b", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Car size={12} /> Road Driving
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
                        {leg.roadKm} km
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        ⏱️ {leg.durationText}
                      </div>
                    </div>

                    {/* Rail Metric */}
                    <div>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Train size={12} /> Indian Railways
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: leg.railData?.available ? "#f8fafc" : "#94a3b8", marginTop: "2px" }}>
                        {leg.railData?.available ? `${leg.railData.km} km` : "No Direct Track"}
                      </div>
                      <div style={{ fontSize: "11px", color: leg.railData?.available ? "#38bdf8" : "#64748b" }}>
                        {leg.railData?.available ? `Via ${leg.railData.via}` : "Rail distance unavailable — verify route"}
                      </div>
                    </div>

                    {/* Straight Metric */}
                    <div>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#a855f7", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Ruler size={12} /> Straight-Line
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", marginTop: "2px" }}>
                        {leg.straightKm} km
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Haversine Great Circle
                      </div>
                    </div>
                  </div>

                  {/* Useful Transit Points at Destination */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "10px",
                      paddingTop: "8px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      fontSize: "11px",
                      color: "#94a3b8",
                      flexWrap: "wrap",
                      gap: "8px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Train size={12} color="#38bdf8" /> <b>Nearest Station:</b> {leg.nearestPracticalStation}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Bus size={12} color="#e11d48" /> <b>Nearest Bus Stand:</b> {leg.nearestBusTerminal}
                      </span>
                    </div>

                    {onSelectStop && (
                      <button
                        onClick={() => onSelectStop(stops.find(s => s.id === leg.toId))}
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#60a5fa",
                          border: "1px solid rgba(59, 130, 246, 0.4)",
                          borderRadius: "4px",
                          padding: "3px 8px",
                          fontSize: "10px",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Inspect Stop & Sights
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(13, 18, 31, 0.95)"
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            * Note: Driving distances computed using actual routable highway corridors; rail distances compiled from official IRCTC/NTES records.
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 16px",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

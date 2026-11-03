import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Route,
  MapPin,
  Compass,
  Layers,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import {
  getGoogleMapsKey,
  setGoogleMapsKey,
  testGoogleMapsConnection
} from "../services/googleMapsService";

export default function ApiConnectionModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(getGoogleMapsKey());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGoogleMapsKey());
      // Run quick auto-check if no results yet
      if (!testResults) {
        runTest();
      }
    }
  }, [isOpen]);

  const runTest = async (keyToTest = null) => {
    setIsTesting(true);
    setSavedSuccess(false);
    try {
      const res = await testGoogleMapsConnection(keyToTest || apiKey);
      setTestResults(res);
    } catch (err) {
      setTestResults({
        overallSuccess: false,
        error: err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = () => {
    setGoogleMapsKey(apiKey);
    setSavedSuccess(true);
    runTest(apiKey);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    const defaultKey = "AIzaSyBgHJ4_LbwTiI7dL_UElas8M1wt9csSN-s";
    setApiKey(defaultKey);
    setGoogleMapsKey(defaultKey);
    setSavedSuccess(true);
    runTest(defaultKey);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="comparator-modal-overlay" onClick={onClose}>
      <div
        className="comparator-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span
              className="modal-badge"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}
            >
              GOOGLE MAPS PLATFORM
            </span>
            <h2 className="modal-title">API Connection & Diagnostic Hub</h2>
            <p className="modal-subtitle">
              Verified live connection to Google Routes, Places, Geocoding, and Map Tiles
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Key Management Box */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", display: "flex", alignItems: "center", gap: "6px" }}>
                <Key size={14} className="text-amber-400" />
                Active Google API Key
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showKey ? "Hide" : "Reveal"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#38bdf8",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "600"
                  }}
                >
                  Reset Default
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste AIzaSy... API key"
                className="search-input"
                style={{ flex: 1, fontFamily: "monospace", fontSize: "12px", letterSpacing: showKey ? "0" : "2px" }}
              />
              <button
                onClick={handleSaveKey}
                className="plot-route-btn"
                style={{ whiteSpace: "nowrap", padding: "8px 14px", fontSize: "12px" }}
              >
                Save & Apply
              </button>
            </div>

            {savedSuccess && (
              <div style={{ marginTop: "6px", color: "#34d399", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle size={12} />
                <span>API Key saved to browser storage and activated!</span>
              </div>
            )}
          </div>

          {/* Test Status Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: "8px",
              background: testResults?.overallSuccess
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(245, 158, 11, 0.12)",
              border: `1px solid ${
                testResults?.overallSuccess
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(245, 158, 11, 0.3)"
              }`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isTesting ? (
                <RefreshCw size={18} className="animate-spin text-amber-400" />
              ) : testResults?.overallSuccess ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <AlertCircle size={20} className="text-amber-400" />
              )}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                  {isTesting
                    ? "Testing Google API endpoints..."
                    : testResults?.overallSuccess
                    ? "All Google Maps APIs Connected & Fully Operational"
                    : "Ready to Test Connection"}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Key: {testResults?.keyMasked || (apiKey ? `${apiKey.slice(0, 8)}...` : "None")}
                </div>
              </div>
            </div>

            <button
              onClick={() => runTest()}
              disabled={isTesting}
              className="action-pill"
              style={{
                background: "#10b981",
                color: "#052e16",
                fontWeight: "700",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <RefreshCw size={12} className={isTesting ? "animate-spin" : ""} />
              <span>{isTesting ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>

          {/* Services Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Live Google Cloud Services Status
            </h4>

            {/* Service 1: Routes API */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "10px 12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Route size={16} className="text-emerald-400" />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                    Google Routes API (v2)
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: testResults?.routesApi?.status === "connected" ? "#34d399" : "#fbbf24",
                    background: testResults?.routesApi?.status === "connected" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "10px"
                  }}
                >
                  {testResults?.routesApi?.status === "connected" ? `Connected (${testResults.routesApi.latencyMs}ms)` : "Checking..."}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                {testResults?.routesApi?.message || "Computes real driving routes, traffic-aware durations, highway corridors, and distance comparison."}
              </p>
            </div>

            {/* Service 2: Places API */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "10px 12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={16} className="text-blue-400" />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                    Google Places API (v1 New)
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: testResults?.placesApi?.status === "connected" ? "#34d399" : "#fbbf24",
                    background: testResults?.placesApi?.status === "connected" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "10px"
                  }}
                >
                  {testResults?.placesApi?.status === "connected" ? `Connected (${testResults.placesApi.latencyMs}ms)` : "Checking..."}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                {testResults?.placesApi?.message || "Fetches pure vegetarian eateries, top-rated hotels, temple darshan centers, and user ratings."}
              </p>
            </div>

            {/* Service 3: Geocoding API */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "10px 12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={16} className="text-amber-400" />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                    Google Geocoding API
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: testResults?.geocodingApi?.status === "connected" ? "#34d399" : "#fbbf24",
                    background: testResults?.geocodingApi?.status === "connected" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "10px"
                  }}
                >
                  {testResults?.geocodingApi?.status === "connected" ? `Connected (${testResults.geocodingApi.latencyMs}ms)` : "Checking..."}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                {testResults?.geocodingApi?.message || "Translates any entered address or landmark into precise GPS latitude/longitude."}
              </p>
            </div>

            {/* Service 4: Google Maps Basemap Tiles */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "8px",
                padding: "10px 12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={16} className="text-purple-400" />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                    Google Maps Basemaps & Tiles
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#34d399",
                    background: "rgba(16, 185, 129, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "10px"
                  }}
                >
                  Connected
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                High-resolution Google Roadmap, Satellite Imagery, Hybrid view, and Terrain topography enabled directly on the interactive map.
              </p>
            </div>
          </div>

          {/* Quick instructions */}
          <div
            style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "11px",
              color: "#bfdbfe"
            }}
          >
            <b>How this API is used in South Explorer:</b>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
              <li><b>Floating Tile Switcher:</b> Click the tile buttons (Roadmap, Satellite, Hybrid, Terrain) at the top of the map.</li>
              <li><b>Route Comparator:</b> Automatically queries Google Routes API for real driving distance vs IRCTC train and direct flight.</li>
              <li><b>Destination Drawer:</b> Opens Google Places API to find nearby Pure Veg bhojnalayas, verified dharamshalas, and hotels.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="plot-route-btn" style={{ padding: "8px 20px" }}>
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  MapPin,
  CheckCircle,
  AlertCircle,
  Navigation
} from "lucide-react";

export default function RouteManager({
  isOpen,
  onClose,
  destinations,
  onUpdateDestinations,
  onResetDestinations
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDest, setNewDest] = useState({
    name: "",
    state: "Madhya Pradesh",
    role: "Custom Scenic Stop",
    lat: "",
    lng: "",
    overview: ""
  });
  const [addError, setAddError] = useState("");

  if (!isOpen) return null;

  // Move item up
  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...destinations];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    onUpdateDestinations(newItems);
  };

  // Move item down
  const moveDown = (index) => {
    if (index === destinations.length - 1) return;
    const newItems = [...destinations];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    onUpdateDestinations(newItems);
  };

  // Remove destination
  const removeDestination = (id) => {
    if (destinations.length <= 2) {
      alert("A travel route requires at least 2 destinations (Origin and Destination).");
      return;
    }
    const filtered = destinations.filter(d => d.id !== id);
    onUpdateDestinations(filtered);
  };

  // Toggle detour flag
  const toggleDetour = (index) => {
    const newItems = [...destinations];
    newItems[index] = { ...newItems[index], isDetour: !newItems[index].isDetour };
    onUpdateDestinations(newItems);
  };

  // Add custom destination
  const handleAddDestination = (e) => {
    e.preventDefault();
    if (!newDest.name.trim()) {
      setAddError("Please provide a destination name.");
      return;
    }
    const lat = parseFloat(newDest.lat);
    const lng = parseFloat(newDest.lng);
    if (isNaN(lat) || isNaN(lng) || lat < 5 || lat > 40 || lng < 60 || lng > 100) {
      setAddError("Please provide valid latitude (8 to 36) and longitude (68 to 98) in India.");
      return;
    }

    const created = {
      id: `custom_${Date.now()}`,
      name: newDest.name.trim(),
      state: newDest.state,
      region: "Custom Added Stop",
      lat: lat,
      lng: lng,
      zoom: 13,
      role: newDest.role || "Custom Exploration Point",
      isDetour: true,
      overview: newDest.overview || `User-customized destination stop: ${newDest.name}`,
      highlights: [newDest.name],
      majorStations: ["Nearest local station"],
      busTerminals: ["Local town stand"]
    };

    onUpdateDestinations([...destinations, created]);
    setNewDest({ name: "", state: "Madhya Pradesh", role: "Custom Scenic Stop", lat: "", lng: "", overview: "" });
    setShowAddForm(false);
    setAddError("");
  };

  return (
    <div className="comparator-modal-overlay" onClick={onClose}>
      <div className="comparator-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge comparator-badge">ROUTE ARCHITECT</span>
            <h2 className="modal-title">Customize Route Sequence & Destinations</h2>
            <p className="modal-subtitle">Add, remove, or reorder stops along the Varanasi-MP-Nashik corridor</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto" }}>
          {/* Controls Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Total Waypoints: <b style={{ color: "#f8fafc" }}>{destinations.length} Stops</b>
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="action-pill"
                style={{ background: "#10b981", color: "#000", fontWeight: "700", border: "none" }}
              >
                <Plus size={14} />
                <span>{showAddForm ? "Close Form" : "Add New Stop"}</span>
              </button>

              <button
                onClick={onResetDestinations}
                className="action-pill"
                title="Reset to default 13-destination sequence"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Add Custom Stop Form */}
          {showAddForm && (
            <form onSubmit={handleAddDestination} style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <h4 style={{ fontSize: "12px", fontWeight: "800", color: "#34d399", textTransform: "uppercase" }}>
                Add Custom Travel Destination
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Destination Name (e.g. Burhanpur)"
                  value={newDest.name}
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                  className="search-input"
                  required
                />
                <select
                  value={newDest.state}
                  onChange={(e) => setNewDest({ ...newDest, state: e.target.value })}
                  className="location-select"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude (e.g. 21.3125)"
                  value={newDest.lat}
                  onChange={(e) => setNewDest({ ...newDest, lat: e.target.value })}
                  className="search-input"
                  required
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude (e.g. 76.2255)"
                  value={newDest.lng}
                  onChange={(e) => setNewDest({ ...newDest, lng: e.target.value })}
                  className="search-input"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Brief Overview / Description"
                value={newDest.overview}
                onChange={(e) => setNewDest({ ...newDest, overview: e.target.value })}
                className="search-input"
              />

              {addError && <div style={{ color: "#f87171", fontSize: "11px" }}>{addError}</div>}

              <button
                type="submit"
                className="plot-route-btn"
                style={{ padding: "7px 12px", fontSize: "12px" }}
              >
                Insert Destination into Sequence
              </button>
            </form>
          )}

          {/* Reorderable Destinations List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {destinations.map((dest, index) => (
              <div
                key={dest.id}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: index === 0 ? "#10b981" : index === destinations.length - 1 ? "#ef4444" : "rgba(245, 158, 11, 0.2)",
                    color: index === 0 || index === destinations.length - 1 ? "#ffffff" : "#f59e0b",
                    fontSize: "11px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {index + 1}
                  </span>

                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                      {dest.name} {dest.isDetour && <span style={{ fontSize: "10px", color: "#f59e0b", marginLeft: "4px" }}>[Detour]</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {dest.state} • {dest.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => toggleDetour(index)}
                    style={{
                      background: dest.isDetour ? "rgba(236, 72, 153, 0.2)" : "rgba(255, 255, 255, 0.06)",
                      color: dest.isDetour ? "#f472b6" : "#94a3b8",
                      border: dest.isDetour ? "1px solid rgba(236, 72, 153, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                    title="Toggle whether this stop is an Optional Detour or Primary Route Stop"
                  >
                    {dest.isDetour ? "Detour" : "Primary"}
                  </button>

                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "none",
                      color: index === 0 ? "#475569" : "#f8fafc",
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>

                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === destinations.length - 1}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "none",
                      color: index === destinations.length - 1 ? "#475569" : "#f8fafc",
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      cursor: index === destinations.length - 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>

                  <button
                    onClick={() => removeDestination(dest.id)}
                    style={{
                      background: "rgba(244, 63, 94, 0.15)",
                      border: "none",
                      color: "#fb7185",
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "4px"
                    }}
                    title="Remove from Route"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

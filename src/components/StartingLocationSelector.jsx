import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Search,
  X,
  Check,
  Compass,
  AlertCircle,
  Building,
  Train,
  Plane,
  Sparkles,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Info
} from "lucide-react";
import {
  POPULAR_STARTING_HUBS,
  DEFAULT_STARTING_LOCATION,
  requestBrowserLocation,
  searchStartingLocations,
  setSavedStartingLocation
} from "../services/locationService";
import { VARANASI_ORIGIN } from "../data/varanasiData";

export default function StartingLocationSelector({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelect
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(POPULAR_STARTING_HUBS);
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(POPULAR_STARTING_HUBS);
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleSearch = async (val) => {
    setQuery(val);
    setStatusMessage(null);
    if (!val.trim()) {
      setResults(POPULAR_STARTING_HUBS);
      return;
    }
    const found = await searchStartingLocations(val);
    setResults(found);
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setStatusMessage({
      type: "info",
      text: "Requesting browser location permission... Please click 'Allow' in your browser."
    });

    const res = await requestBrowserLocation();
    setIsLocating(false);

    if (res.success && res.location) {
      setStatusMessage({
        type: "success",
        text: `GPS location verified: ${res.location.name}`
      });
      setSavedStartingLocation(res.location);
      onLocationSelect(res.location);
      setTimeout(() => {
        onClose();
      }, 1100);
    } else {
      setStatusMessage({
        type: "error",
        text: res.message || "Could not retrieve GPS location. You can select Varanasi or search any city manually."
      });
    }
  };

  const handleSelectVaranasi = () => {
    setSavedStartingLocation(VARANASI_ORIGIN);
    onLocationSelect(VARANASI_ORIGIN);
    setStatusMessage({
      type: "success",
      text: "Journey origin set to Varanasi (Kashi Vishwanath Corridor) • Default Sacred Origin"
    });
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleSelect = (loc) => {
    setSavedStartingLocation(loc);
    onLocationSelect(loc);
    onClose();
  };

  if (!isOpen) return null;

  const isCurrentGps = currentLocation?.isGpsVerified || currentLocation?.type === "gps";
  const isVaranasiActive =
    !isCurrentGps &&
    (currentLocation?.id === VARANASI_ORIGIN.id ||
      currentLocation?.city === "Varanasi" ||
      currentLocation?.name?.toLowerCase().includes("varanasi") ||
      currentLocation?.name?.toLowerCase().includes("kashi"));

  return (
    <div className="ty-modal-backdrop" onClick={onClose}>
      <div
        className="ty-starting-location-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-loc-title"
      >
        {/* Header */}
        <div className="ty-start-loc-header">
          <div className="ty-start-loc-header-left">
            <div className="ty-start-loc-icon-wrap">
              <Compass size={22} className="text-amber-500" />
            </div>
            <div>
              <h2 id="start-loc-title" className="ty-start-loc-title">
                Set Journey Starting Location
              </h2>
              <p className="ty-start-loc-sub">
                Road distances, travel times, and pilgrimage directions across Bharat are customized from your origin
              </p>
            </div>
          </div>
          <button
            className="ty-modal-close-btn"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Origin Banner */}
        <div className="ty-active-origin-banner">
          <div className="ty-active-origin-info">
            <span className="ty-active-origin-badge">
              {isCurrentGps
                ? "LIVE GPS DETECTED ORIGIN"
                : isVaranasiActive
                ? "SACRED PILGRIMAGE ORIGIN (DEFAULT)"
                : "SELECTED TRANSIT ORIGIN"}
            </span>
            <div className="ty-active-origin-name-row">
              <MapPin size={16} className={isCurrentGps ? "text-emerald-500" : isVaranasiActive ? "text-amber-500" : "text-sky-500"} />
              <strong className="ty-active-origin-name">
                {currentLocation?.name || VARANASI_ORIGIN.name}
              </strong>
              {currentLocation?.lat && (
                <span className="ty-active-origin-coords">
                  ({currentLocation.lat.toFixed(3)}°N, {currentLocation.lng.toFixed(3)}°E)
                </span>
              )}
            </div>
          </div>
          {!isVaranasiActive && (
            <button
              className="ty-reset-origin-btn"
              onClick={handleSelectVaranasi}
              title="Reset to Varanasi (Default Sacred Origin)"
            >
              <RefreshCw size={13} />
              <span>Reset to Varanasi</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            TWO CORE MODES: DEDICATED HERO CARDS (Detect My Location vs Start from Varanasi)
            ========================================================================= */}
        <div className="ty-two-modes-grid">
          {/* Mode 1: Detect My Current Location */}
          <div
            className={`ty-mode-hero-card ${isCurrentGps ? "mode-active" : ""}`}
            onClick={handleUseCurrentLocation}
            role="button"
            tabIndex={0}
          >
            <div className="ty-mode-hero-icon-col">
              <div className="ty-mode-radar-icon">
                <Navigation size={22} className={isLocating ? "ty-spin text-emerald-400" : "text-emerald-400"} />
              </div>
            </div>

            <div className="ty-mode-hero-content">
              <div className="ty-mode-hero-title-row">
                <h3 className="ty-mode-hero-title">Detect My Current Location</h3>
                {isCurrentGps ? (
                  <span className="ty-mode-status-tag live">
                    <Check size={12} /> Active GPS
                  </span>
                ) : (
                  <span className="ty-mode-status-tag">Near Me</span>
                )}
              </div>
              <p className="ty-mode-hero-desc">
                Uses genuine browser GPS coordinates to find nearby sacred shrines, temples, and calculate actual road distances from your physical position.
              </p>
              <button
                className={`ty-mode-action-btn gps ${isLocating ? "loading" : ""}`}
                disabled={isLocating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseCurrentLocation();
                }}
              >
                {isLocating ? (
                  <>
                    <RefreshCw size={14} className="ty-spin" />
                    <span>Querying GPS...</span>
                  </>
                ) : isCurrentGps ? (
                  <>
                    <Check size={14} />
                    <span>GPS Active: {currentLocation?.city || "My City"}</span>
                  </>
                ) : (
                  <>
                    <Navigation size={14} />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mode 2: Start My Yatra from Varanasi */}
          <div
            className={`ty-mode-hero-card ${isVaranasiActive ? "mode-active sacred" : "sacred"}`}
            onClick={handleSelectVaranasi}
            role="button"
            tabIndex={0}
          >
            <div className="ty-mode-hero-icon-col">
              <div className="ty-mode-varanasi-icon">
                <Landmark size={22} className="text-amber-400" />
              </div>
            </div>

            <div className="ty-mode-hero-content">
              <div className="ty-mode-hero-title-row">
                <h3 className="ty-mode-hero-title">Start My Yatra from Varanasi</h3>
                {isVaranasiActive ? (
                  <span className="ty-mode-status-tag active-gold">
                    <Check size={12} /> Sacred Origin
                  </span>
                ) : (
                  <span className="ty-mode-status-tag gold">Default Origin</span>
                )}
              </div>
              <p className="ty-mode-hero-desc">
                Kashi Vishwanath Corridor, Uttar Pradesh (VNS / BSB) • The eternal spiritual axis of Bharat Darshan, Panch Kroshi Parikrama, and Char Dham routes.
              </p>
              <button
                className="ty-mode-action-btn varanasi"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectVaranasi();
                }}
              >
                <Sparkles size={14} />
                <span>{isVaranasiActive ? "Varanasi Active (Default)" : "Set Varanasi as Starting Point"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clear Truth In Location Note */}
        <div className="ty-truth-location-notice">
          <Info size={14} className="text-amber-500 flex-shrink-0" />
          <span>
            <strong>Location Accuracy Guarantee:</strong> Varanasi is set as the sacred origin for pilgrimage itineraries. Varanasi is <em>never falsely reported as your live GPS coordinates</em> unless browser geolocation confirms you are physically in Kashi.
          </span>
        </div>

        {/* Status Message / Notification */}
        {statusMessage && (
          <div className={`ty-start-loc-alert ${statusMessage.type}`}>
            {statusMessage.type === "error" ? (
              <AlertCircle size={16} className="flex-shrink-0" />
            ) : statusMessage.type === "success" ? (
              <Check size={16} className="flex-shrink-0" />
            ) : (
              <Sparkles size={16} className="flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Manual Search Bar */}
        <div className="ty-start-search-box">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            className="ty-start-search-input"
            placeholder="Type city, railway station (NDLS, BSB, HW, CSTM...), airport, or address..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button
              className="ty-clear-btn"
              onClick={() => handleSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Hubs / Results List */}
        <div className="ty-start-results-scroll">
          <div className="ty-start-section-tag">
            {query.trim() ? "SEARCH RESULTS" : "POPULAR PILGRIM TRANSIT HUBS & AIRPORTS"}
          </div>

          <div className="ty-start-hubs-grid">
            {results.map((hub) => {
              const isSelected =
                !isCurrentGps &&
                (currentLocation?.id === hub.id ||
                  (Math.abs(currentLocation?.lat - hub.lat) < 0.01 &&
                    Math.abs(currentLocation?.lng - hub.lng) < 0.01));

              return (
                <div
                  key={hub.id}
                  className={`ty-hub-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(hub)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ty-hub-top">
                    <div className="ty-hub-badge-row">
                      {hub.code?.includes("BSB") || hub.code?.includes("NDLS") || hub.code?.includes("HW") ? (
                        <Train size={13} className="text-amber-700" />
                      ) : (
                        <Plane size={13} className="text-sky-700" />
                      )}
                      <span className="ty-hub-code">{hub.code}</span>
                    </div>
                    {isSelected && (
                      <span className="ty-hub-check">
                        <Check size={14} /> Active
                      </span>
                    )}
                  </div>

                  <h4 className="ty-hub-name">{hub.name}</h4>
                  <p className="ty-hub-state">{hub.state}</p>
                </div>
              );
            })}
          </div>

          {results.length === 0 && (
            <div className="ty-start-empty">
              <MapPin size={28} className="text-stone-400 mb-2" />
              <p>No locations found matching "{query}"</p>
              <span className="text-xs text-stone-500">
                Try searching by city name (e.g. Pune, Jaipur, Lucknow, Patna, Ayodhya)
              </span>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="ty-start-loc-footer">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs text-stone-400">
              Your location is processed locally in your browser. Manual entry is always supported without GPS permission.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Shield,
  Navigation,
  Heart,
  Plane,
  Train,
  Car,
  Compass,
  CheckCircle,
  ExternalLink,
  Info,
  Route,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { calculateRouteFromOrigin } from "../services/locationService";
import DestinationMiniRouteMap from "./DestinationMiniRouteMap";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK } from "../utils/imageFallback";

export default function DestinationDetailModal({
  destination,
  onClose,
  onExploreOnMap,
  onOpenNearbyExplorer = null,
  onOpenAiPlanner = null,
  isFavorite = false,
  onToggleFavorite,
  startingLocation,
  onOpenLocationSelector
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  // Live Route Calculation state from active starting location
  const [routeData, setRouteData] = useState({
    loading: true,
    distanceKm: null,
    durationText: null,
    source: "Calculating...",
    routeName: "",
    googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${destination?.lat},${destination?.lng}`
  });

  useEffect(() => {
    if (!destination || !startingLocation) return;
    let isCurrent = true;
    setRouteData((prev) => ({ ...prev, loading: true }));

    calculateRouteFromOrigin(startingLocation, destination).then((res) => {
      if (isCurrent && res.success) {
        setRouteData({
          loading: false,
          distanceKm: res.distanceKm,
          durationText: res.durationText,
          source: res.source,
          routeName: res.routeName,
          googleMapsDirectionsUrl: res.googleMapsDirectionsUrl
        });
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [destination, startingLocation]);

  if (!destination) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleFav = () => {
    onToggleFavorite(destination);
    showToast(
      isFavorite
        ? `Removed ${destination.name} from My Yatra`
        : `Added ${destination.name} to My Yatra ✓`
    );
  };

  return (
    <div className="ty-modal-backdrop" onClick={onClose}>
      <div
        className="ty-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="ty-modal-toast">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Media Header matching visual reference */}
        <div className="ty-modal-hero">
          <img
            src={destination.image}
            alt={destination.name}
            className="ty-modal-hero-img"
            onError={handleImgError}
          />
          <div className="ty-modal-hero-overlay" />

          {/* Top Bar inside Hero: Badge and Close Button */}
          <div className="ty-modal-hero-topbar">
            <span className="ty-modal-badge">{destination.badge}</span>
            <div className="ty-modal-hero-actions">
              <button
                className="ty-modal-round-btn"
                onClick={handleToggleFav}
                title={isFavorite ? "Remove from My Yatra" : "Add to My Yatra"}
              >
                <Heart
                  size={16}
                  className={isFavorite ? "fill-amber-400 text-amber-400" : "text-white"}
                />
              </button>
              <button
                className="ty-modal-close-btn"
                onClick={onClose}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Hero Bottom: Title, Location & Altitude */}
          <div className="ty-modal-hero-text">
            <h2 id="detail-title" className="ty-modal-title">
              {destination.name}
            </h2>
            <div className="ty-modal-location-row">
              <MapPin size={14} className="text-amber-400" />
              <span>{destination.location}</span>
              {destination.altitude && (
                <>
                  <span className="bullet">•</span>
                  <span>{destination.altitude}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Journey Origin & Mileage Ribbon */}
        <div className="ty-modal-origin-ribbon">
          <div className="ty-origin-ribbon-left">
            <div className="ty-origin-pin-icon">
              <Navigation size={14} className="text-amber-500" />
            </div>
            <div className="ty-origin-ribbon-text">
              <div className="ty-origin-label-row">
                <span className="ty-origin-sub">JOURNEY ORIGIN</span>
                <button
                  className="ty-origin-change-btn"
                  onClick={onOpenLocationSelector}
                  title="Change your starting city or station"
                >
                  Change
                </button>
              </div>
              <span className="ty-origin-name">
                {startingLocation?.name || "New Delhi"}
              </span>
            </div>
          </div>

          <div className="ty-origin-ribbon-right">
            {routeData.loading ? (
              <span className="ty-route-calculating">
                <RefreshCw size={12} className="ty-spin" /> Calculating route...
              </span>
            ) : (
              <div className="ty-route-metrics-badge">
                <div className="ty-route-metric-item">
                  <span className="metric-val">{routeData.distanceKm} km</span>
                  <span className="metric-lbl">Road Distance</span>
                </div>
                <div className="ty-route-metric-sep" />
                <div className="ty-route-metric-item">
                  <span className="metric-val">{routeData.durationText}</span>
                  <span className="metric-lbl">Est. Driving</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar matching visual reference */}
        <div className="ty-modal-tabs-bar">
          {[
            { id: "overview", label: "Overview" },
            { id: "how_to_reach", label: "How to Reach" },
            { id: "best_time", label: "Best Time" },
            { id: "nearby", label: "Nearby" },
            { id: "gallery", label: "Gallery" },
            { id: "tips", label: "Tips" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`ty-modal-tab-btn ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="ty-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="ty-modal-tab-content">
              {/* Editorial Description */}
              <p className="ty-modal-editorial-desc">{destination.overview}</p>

              {/* Quick Facts Grid matching visual reference */}
              <div className="ty-modal-facts-grid">
                <div className="ty-fact-card">
                  <div className="ty-fact-icon-wrap">
                    <Clock size={16} className="text-amber-700" />
                  </div>
                  <div className="ty-fact-info">
                    <span className="ty-fact-title">Timings</span>
                    <span className="ty-fact-value">{destination.timings}</span>
                  </div>
                </div>

                <div className="ty-fact-card">
                  <div className="ty-fact-icon-wrap">
                    <Calendar size={16} className="text-amber-700" />
                  </div>
                  <div className="ty-fact-info">
                    <span className="ty-fact-title">Festivals</span>
                    <span className="ty-fact-value">{destination.festivals}</span>
                  </div>
                </div>

                <div className="ty-fact-card">
                  <div className="ty-fact-icon-wrap">
                    <Shield size={16} className="text-amber-700" />
                  </div>
                  <div className="ty-fact-info">
                    <span className="ty-fact-title">Dress Code</span>
                    <span className="ty-fact-value">{destination.dressCode}</span>
                  </div>
                </div>

                <div className="ty-fact-card">
                  <div className="ty-fact-icon-wrap">
                    <Compass size={16} className="text-amber-700" />
                  </div>
                  <div className="ty-fact-info">
                    <span className="ty-fact-title">Deity & Sanctum</span>
                    <span className="ty-fact-value">{destination.deity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW TO REACH */}
          {activeTab === "how_to_reach" && (
            <div className="ty-modal-tab-content">
              {/* Live Driving Corridor Summary */}
              <div className="ty-reach-highlight-box">
                <div className="ty-reach-hl-top">
                  <div className="ty-reach-hl-icon">
                    <Route size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="ty-reach-hl-title">
                      Route from {startingLocation?.name || "Your Origin"}
                    </h4>
                    <span className="ty-reach-hl-subtitle">
                      {routeData.routeName || "National Highway Corridor"}
                    </span>
                  </div>
                  <span className="ty-source-tag">
                    {routeData.source}
                  </span>
                </div>

                <div className="ty-reach-stats-row">
                  <div className="ty-reach-stat">
                    <span className="stat-label">Road Distance</span>
                    <strong className="stat-value">{routeData.distanceKm} km</strong>
                  </div>
                  <div className="ty-reach-stat">
                    <span className="stat-label">Est. Driving Duration</span>
                    <strong className="stat-value">{routeData.durationText}</strong>
                  </div>
                  <div className="ty-reach-stat">
                    <span className="stat-label">Coordinates</span>
                    <strong className="stat-value text-xs font-mono">
                      {destination.lat.toFixed(4)}°N, {destination.lng.toFixed(4)}°E
                    </strong>
                  </div>
                </div>
              </div>

              {/* Interactive Route Mini-Map */}
              <DestinationMiniRouteMap
                destination={destination}
                startingLocation={startingLocation}
                routeData={routeData}
                onExpandToFullMap={() => {
                  onClose();
                  onExploreOnMap(destination);
                }}
              />

              {/* Verified Multi-Modal Transit Breakdown */}
              <div className="ty-reach-grid">
                <div className="ty-reach-card">
                  <div className="ty-reach-header">
                    <Plane size={18} className="text-sky-600" />
                    <h4>Nearest Airport</h4>
                    <span className="ty-verified-badge">Verified Hub</span>
                  </div>
                  <p>{destination.howToReach?.byAir}</p>
                </div>

                <div className="ty-reach-card">
                  <div className="ty-reach-header">
                    <Train size={18} className="text-amber-600" />
                    <h4>Nearest Railhead</h4>
                    <span className="ty-verified-badge">Station Code</span>
                  </div>
                  <p>{destination.howToReach?.byRail}</p>
                </div>

                <div className="ty-reach-card">
                  <div className="ty-reach-header">
                    <Car size={18} className="text-emerald-600" />
                    <h4>Road Connectivity & Access</h4>
                    <span className="ty-verified-badge">Highway / Trek</span>
                  </div>
                  <p>{destination.howToReach?.byRoad}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BEST TIME */}
          {activeTab === "best_time" && (
            <div className="ty-modal-tab-content">
              <div className="ty-season-box">
                <Calendar size={20} className="text-amber-700 mb-2" />
                <h4 className="font-semibold text-lg mb-1">Recommended Visiting Period</h4>
                <p className="text-gray-700 mb-3">{destination.bestTime}</p>
                <div className="ty-season-alert">
                  <Info size={16} className="text-amber-800 flex-shrink-0" />
                  <span>
                    Pilgrimage seasons in high-altitude Himalayan shrines usually operate
                    from Akshaya Tritiya (April/May) until Bhai Dooj / Diwali (October/November).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NEARBY PLACES */}
          {activeTab === "nearby" && (
            <div className="ty-modal-tab-content">
              <div className="ty-nearby-list">
                {destination.nearbyPlaces?.map((place, idx) => (
                  <div key={idx} className="ty-nearby-item">
                    <div className="ty-nearby-left">
                      <span className="ty-nearby-name">{place.name}</span>
                      <p className="ty-nearby-desc">{place.desc}</p>
                    </div>
                    <span className="ty-nearby-dist-badge">{place.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === "gallery" && (
            <div className="ty-modal-tab-content">
              <div className="ty-gallery-grid">
                {(destination.gallery || [destination.image]).map((imgUrl, i) => (
                  <div
                    key={i}
                    className="ty-gallery-thumb-wrap"
                    onClick={() => setSelectedGalleryImg(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={`${destination.name} photo ${i + 1}`}
                      className="ty-gallery-thumb"
                      onError={handleImgError}
                    />
                  </div>
                ))}
              </div>

              {selectedGalleryImg && (
                <div
                  className="ty-lightbox-overlay"
                  onClick={() => setSelectedGalleryImg(null)}
                >
                  <img
                    src={selectedGalleryImg}
                    alt="Enlarged view"
                    className="ty-lightbox-img"
                    onError={handleImgError}
                  />
                  <button className="ty-lightbox-close">✕</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TIPS & RITUALS */}
          {activeTab === "tips" && (
            <div className="ty-modal-tab-content">
              <ul className="ty-tips-list">
                {destination.tips?.map((tip, idx) => (
                  <li key={idx} className="ty-tip-item">
                    <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer Actions matching visual reference */}
        <div className="ty-modal-footer">
          <a
            href={routeData.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ty-modal-directions-btn"
            title={`Get turn-by-turn Google Maps navigation from ${startingLocation?.name || "your location"}`}
          >
            <Navigation size={15} />
            <span>Get Directions</span>
          </a>

          {onOpenAiPlanner && (
            <button
              className="ty-modal-map-btn"
              onClick={() => {
                onClose();
                onOpenAiPlanner(destination);
              }}
              style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)",
                color: "#ffd978",
                border: "1px solid #d4af37",
                fontWeight: "700"
              }}
            >
              <Sparkles size={15} />
              <span>Plan Trip with AI</span>
            </button>
          )}

          {onOpenNearbyExplorer && (
            <button
              className="ty-modal-map-btn"
              onClick={() => {
                onClose();
                onOpenNearbyExplorer(destination);
              }}
              style={{
                background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                color: "#e8c872",
                border: "1px solid #c5a059",
                fontWeight: "700"
              }}
            >
              <Compass size={15} />
              <span>Smart Nearby & Route</span>
            </button>
          )}

          <button
            className="ty-modal-map-btn"
            onClick={() => {
              onClose();
              onExploreOnMap(destination);
            }}
          >
            <Compass size={15} />
            <span>View on Map</span>
          </button>

          <button
            className={`ty-modal-save-btn ${isFavorite ? "saved" : ""}`}
            onClick={handleToggleFav}
          >
            <Heart
              size={15}
              className={isFavorite ? "fill-amber-950 text-amber-950" : ""}
            />
            <span>{isFavorite ? "In Your Yatra ✓" : "Add to My Yatra"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

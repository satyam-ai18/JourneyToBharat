import React, { useState, useMemo } from "react";
import {
  ALL_STATES_DATA,
  FLAGSHIP_DESTINATIONS
} from "../data/tirthData";
import { MASTER_EXPLORER_DESTINATIONS } from "../data/masterExplorerData";
import {
  MapPin,
  ChevronRight,
  ArrowLeft,
  Compass,
  Landmark,
  Mountain,
  Heart,
  Navigation,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK, DEFAULT_HERO_FALLBACK } from "../utils/imageFallback";

export default function StatePageView({
  stateData,
  onSelectState,
  onSelectDestination,
  onBackToHome,
  savedFavorites = [],
  onToggleFavorite
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [stateSelectorOpen, setStateSelectorOpen] = useState(false);

  // Fallback to Uttarakhand if none provided
  const currentState = stateData || ALL_STATES_DATA[0];

  // Get all destinations for this state
  const stateDestinations = useMemo(() => {
    // Primary matches from MASTER_EXPLORER_DESTINATIONS with fallback to FLAGSHIP_DESTINATIONS
    const sourcePool = MASTER_EXPLORER_DESTINATIONS && MASTER_EXPLORER_DESTINATIONS.length > 0 
      ? MASTER_EXPLORER_DESTINATIONS 
      : FLAGSHIP_DESTINATIONS;

    let dests = sourcePool.filter(
      (d) => d.stateId === currentState.id || (d.state && d.state.toLowerCase() === currentState.name.toLowerCase())
    );

    // Fallback if none matched directly
    if (dests.length === 0 && currentState.id === "uttarakhand") {
      dests = sourcePool.filter((d) => d.stateId === "uttarakhand");
    }

    return dests;
  }, [currentState]);

  // Tab filtered destinations
  const filteredDestinations = useMemo(() => {
    if (activeTab === "all") return stateDestinations;
    if (activeTab === "temples")
      return stateDestinations.filter(
        (d) => 
          d.category === "jyotirlingas" || d.category === "jyotirlinga" ||
          d.category === "chardham" || d.category === "char_dham" ||
          d.category === "shaktipeeths" || d.category === "shaktipeeth" ||
          d.category === "manyata_temples" || d.category === "manyata" ||
          d.category === "temple" || d.category === "temples" ||
          d.categories?.some(c => ["temple", "temples", "jyotirlinga", "jyotirlingas", "shaktipeeth", "shaktipeeths", "chardham", "char_dham"].includes(c))
      );
    if (activeTab === "tourist")
      return stateDestinations.filter(
        (d) => 
          d.category === "mountains" || d.category === "mountains_nature" ||
          d.category === "lakes_waterfalls" || d.category === "beaches_coastal" ||
          d.category === "heritage_history" || d.category === "wildlife" || d.category === "wildlife_nature" ||
          d.categories?.some(c => ["mountains", "mountains_nature", "lakes_waterfalls", "beaches_coastal", "heritage_history", "wildlife", "wildlife_nature"].includes(c))
      );
    if (activeTab === "jyotirlingas")
      return stateDestinations.filter((d) => 
        d.category === "jyotirlingas" || d.category === "jyotirlinga" ||
        d.categories?.some(c => ["jyotirlinga", "jyotirlingas"].includes(c))
      );
    if (activeTab === "chardham")
      return stateDestinations.filter((d) => 
        d.category === "chardham" || d.category === "char_dham" ||
        d.categories?.some(c => ["chardham", "char_dham"].includes(c))
      );
    if (activeTab === "shaktipeeths")
      return stateDestinations.filter((d) => 
        d.category === "shaktipeeths" || d.category === "shaktipeeth" ||
        d.categories?.some(c => ["shaktipeeth", "shaktipeeths"].includes(c))
      );
    if (activeTab === "manyata")
      return stateDestinations.filter((d) => 
        d.category === "manyata_temples" || d.category === "manyata" ||
        d.categories?.some(c => ["manyata", "manyata_temples"].includes(c))
      );
    return stateDestinations;
  }, [stateDestinations, activeTab]);

  return (
    <div className="ty-state-page-view">
      {/* =========================================================================
          SCENIC EDITORIAL HEADER matching visual reference
          ========================================================================= */}
      <section className="ty-state-hero-banner">
        <div className="ty-state-hero-bg">
          <img
            src={currentState.heroImage || currentState.image}
            alt={`${currentState.name} scenic landscape`}
            className="ty-state-hero-img"
            onError={(e) => handleImgError(e, DEFAULT_HERO_FALLBACK)}
          />
          <div className="ty-state-hero-overlay" />
        </div>

        <div className="ty-state-hero-content">
          {/* Breadcrumb Navigation */}
          <nav className="ty-state-breadcrumbs" aria-label="Breadcrumb">
            <button
              onClick={onBackToHome}
              className="ty-breadcrumb-link"
            >
              Home
            </button>
            <span className="ty-breadcrumb-separator">/</span>
            <button
              onClick={() => setStateSelectorOpen(!stateSelectorOpen)}
              className="ty-breadcrumb-link has-dropdown"
            >
              <span>States</span>
              <ChevronDown size={12} />
            </button>
            <span className="ty-breadcrumb-separator">/</span>
            <span className="ty-breadcrumb-current">{currentState.name}</span>
          </nav>

          {/* Quick State Switcher Dropdown */}
          {stateSelectorOpen && (
            <div className="ty-state-switcher-menu">
              {ALL_STATES_DATA.map((st) => (
                <div
                  key={st.id}
                  className={`ty-state-switcher-item ${
                    st.id === currentState.id ? "active" : ""
                  }`}
                  onClick={() => {
                    onSelectState(st);
                    setStateSelectorOpen(false);
                  }}
                >
                  <span>{st.name}</span>
                  <span className="places-tag">{st.placesCount} places</span>
                </div>
              ))}
            </div>
          )}

          {/* State Title & Subtitle */}
          <h1 className="ty-state-hero-title">{currentState.name}</h1>
          <p className="ty-state-hero-subtitle">{currentState.subtitle}</p>

          {/* Quick Stats Ribbon matching visual reference */}
          <div className="ty-state-stats-row">
            <div className="ty-state-stat-item">
              <span className="stat-count">
                {currentState.categoryCounts?.temples || 12}
              </span>
              <span className="stat-label">Temples</span>
            </div>
            <div className="ty-state-stat-sep" />
            <div className="ty-state-stat-item">
              <span className="stat-count">
                {currentState.categoryCounts?.nature || 8}
              </span>
              <span className="stat-label">Tourist Places</span>
            </div>
            <div className="ty-state-stat-sep" />
            <div className="ty-state-stat-item">
              <span className="stat-count">3</span>
              <span className="stat-label">Routes</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DESTINATIONS EXPLORER WITH CATEGORY TABS matching visual reference
          ========================================================================= */}
      <section className="ty-state-content-section">
        <div className="ty-container">
          {/* Category Tabs Ribbon */}
          <div className="ty-state-tabs-ribbon">
            {[
              { id: "all", label: "All Places" },
              { id: "temples", label: "Temples" },
              { id: "tourist", label: "Tourist Places" },
              { id: "jyotirlingas", label: "Jyotirlingas" },
              { id: "chardham", label: "Char Dham" },
              { id: "shaktipeeths", label: "Shaktipeeths" },
              { id: "manyata", label: "Manyata Temples" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`ty-state-tab-btn ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Organized Destinations Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="ty-empty-state-notice" style={{ padding: "48px 24px", textAlign: "center", background: "#fcfbf7", borderRadius: "12px", border: "1px dashed #d6cbbf", margin: "24px 0" }}>
              <Compass size={36} className="text-amber-700/60" style={{ margin: "0 auto 12px auto", display: "block" }} />
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1c2e26", marginBottom: "6px" }}>
                No {activeTab.replace('_', ' ')} in {currentState.name}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#6e6a64", maxWidth: "420px", margin: "0 auto 16px auto" }}>
                This state does not feature sites in this specific category, but offers rich heritage and sacred destinations across other categories.
              </p>
              <button
                onClick={() => setActiveTab("all")}
                style={{ background: "#0f2b20", color: "#e8c872", padding: "8px 18px", borderRadius: "20px", fontSize: "0.85rem", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                View All Places in {currentState.name}
              </button>
            </div>
          ) : (
            <div className="ty-state-cards-grid">
              {filteredDestinations.map((dest) => {
                const isFav = savedFavorites.some((f) => f.id === dest.id);
                return (
                  <div
                    key={dest.id}
                    className="ty-destination-card"
                    onClick={() => onSelectDestination(dest)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ty-card-media">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="ty-card-img"
                        loading="lazy"
                        onError={handleImgError}
                      />
                      <div className="ty-card-badge-row">
                        <span className="ty-card-category-badge">
                          {dest.badge}
                        </span>
                        <button
                          className={`ty-card-fav-btn ${isFav ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(dest);
                          }}
                          title={isFav ? "Remove from My Yatra" : "Save to My Yatra"}
                        >
                          <Heart
                            size={15}
                            className={isFav ? "fill-amber-400 text-amber-400" : ""}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="ty-card-body">
                      <h3 className="ty-card-title">{dest.name}</h3>
                      <p className="ty-card-meta-line">
                        <span>{dest.categoryLabel || dest.badge}</span>
                        {dest.altitude && (
                          <>
                            <span className="ty-meta-bullet">•</span>
                            <span>{dest.altitude.split(" ")[0]}</span>
                          </>
                        )}
                      </p>

                      <p className="ty-card-description-snippet">
                        {dest.overview.slice(0, 110)}...
                      </p>

                      <div className="ty-card-footer">
                        <span className="ty-card-location-text">
                          <MapPin size={12} className="inline mr-1 text-amber-700" />
                          {dest.location}
                        </span>
                        <span className="ty-card-action">
                          Explore <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* State Cultural & Travel Heritage Overview */}
          <div className="ty-state-editorial-overview">
            <h2 className="ty-state-editorial-title">
              Spiritual Significance of {currentState.name}
            </h2>
            <p className="ty-state-editorial-text">
              {currentState.description} Blessed with sacred river sources, ancient
              rock-hewn sanctums, and centuries of devout pilgrimage corridors,{" "}
              {currentState.name} offers pilgrims and heritage explorers an
              unrivaled communion with Bharat's living spiritual soul.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

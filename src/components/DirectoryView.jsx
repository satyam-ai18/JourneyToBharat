import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicParticles from "./CinematicParticles";
import {
  FLAGSHIP_DESTINATIONS,
  CATEGORIES
} from "../data/tirthData";
import {
  SHAKTIPEETHS_52,
  SHAKTIPEETH_REGIONS
} from "../data/shaktipeethData";
import {
  createTemplePlaceholder
} from "../data/destinationImageRegistry";
import {
  MapPin,
  ChevronRight,
  Heart,
  Compass,
  Filter,
  Search,
  Mountain,
  Flame,
  Sparkles,
  X,
  Flower2
} from "lucide-react";

export default function DirectoryView({
  type = "temples", // "temples" or "mountains"
  onSelectDestination,
  onExploreOnMap,
  savedFavorites = [],
  onToggleFavorite
}) {
  const isTemples = type === "temples";
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [shaktipeethRegion, setShaktipeethRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const heroImage = isTemples
    ? "/images/hero_kedarnath.jpg"
    : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80";

  const title = isTemples
    ? "Sacred Temples & Divine Shrines"
    : "Sacred Mountains, Hill Shrines & Nature";

  const subtitle = isTemples
    ? "The 12 Jyotirlingas, 52 Shaktipeeths, Char Dham and wish-fulfilling Manyata shrines across Bharat"
    : "From high-altitude Himalayan summits of Kedarnath and Tungnath to mist-clad Nilgiris and Western Ghats";

  const tabs = isTemples
    ? [
        { id: "all", label: "All Temples" },
        { id: "jyotirlingas", label: "12 Jyotirlingas" },
        { id: "chardham", label: "Char Dham" },
        { id: "shaktipeeths", label: "52 Shaktipeeths" },
        { id: "manyata_temples", label: "Manyata Temples" }
      ]
    : [
        { id: "all", label: "All Mountains & Nature" },
        { id: "himalayan", label: "Himalayan Shrines" },
        { id: "waterfalls", label: "Lakes & Waterfalls" },
        { id: "coastal", label: "Coastal & Sea Shrines" }
      ];

  const filteredPlaces = useMemo(() => {
    let list = [];

    if (isTemples) {
      if (selectedFilter === "shaktipeeths") {
        list = SHAKTIPEETHS_52;
        if (shaktipeethRegion !== "all") {
          list = list.filter((d) => d.region === shaktipeethRegion);
        }
      } else if (selectedFilter === "all") {
        // Combine flagship destinations with unique shaktipeeths
        const existingIds = new Set(FLAGSHIP_DESTINATIONS.map((d) => d.id));
        const additionalShakti = SHAKTIPEETHS_52.filter((p) => !existingIds.has(p.id));
        list = [...FLAGSHIP_DESTINATIONS, ...additionalShakti].filter((d) =>
          ["jyotirlingas", "chardham", "shaktipeeths", "manyata_temples"].some(
            (c) => d.category === c || d.categories?.includes(c)
          )
        );
      } else {
        list = FLAGSHIP_DESTINATIONS.filter(
          (d) => d.category === selectedFilter || d.categories?.includes(selectedFilter)
        );
      }
    } else {
      list = FLAGSHIP_DESTINATIONS;
      if (selectedFilter === "himalayan") {
        list = list.filter(
          (d) =>
            d.stateId === "uttarakhand" ||
            d.stateId === "jammu_kashmir" ||
            d.stateId === "himachal_pradesh"
        );
      } else if (selectedFilter === "waterfalls") {
        list = list.filter(
          (d) => d.category === "lakes_waterfalls" || d.categories?.includes("lakes_waterfalls")
        );
      } else if (selectedFilter === "coastal") {
        list = list.filter(
          (d) =>
            d.category === "beaches_coastal" ||
            d.categories?.includes("beaches_coastal") ||
            d.location?.toLowerCase().includes("coastal") ||
            d.name?.includes("Rameshwaram") ||
            d.name?.includes("Somnath") ||
            d.name?.includes("Dwarka") ||
            d.name?.includes("Puri")
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.title?.toLowerCase().includes(q) ||
          d.bodyPart?.toLowerCase().includes(q) ||
          d.devi?.toLowerCase().includes(q) ||
          d.bhairava?.toLowerCase().includes(q) ||
          d.location?.toLowerCase().includes(q) ||
          d.deity?.toLowerCase().includes(q) ||
          d.state?.toLowerCase().includes(q) ||
          d.region?.toLowerCase().includes(q) ||
          d.categoryLabel?.toLowerCase().includes(q) ||
          d.badge?.toLowerCase().includes(q) ||
          d.overview?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [isTemples, selectedFilter, shaktipeethRegion, searchQuery]);

  return (
    <div className="ty-directory-view">
      {/* Editorial Banner */}
      <section className="ty-state-hero-banner" style={{ position: "relative", overflow: "hidden" }}>
        <div className="ty-state-hero-bg">
          <motion.img
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: "easeOut" }}
            src={heroImage}
            alt={title}
            className="ty-state-hero-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/hero_kedarnath.jpg";
            }}
          />
          <div className="ty-state-hero-overlay" />
        </div>

        {/* Floating Divine Golden Particles */}
        <CinematicParticles count={18} showMandala={true} />

        <div className="ty-state-hero-content" style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            className="ty-hero-badge mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ty-badge-star">✦</span>
            <span className="ty-badge-text">
              {isTemples ? "Journey to Bharat • Temples of India" : "Nature & Mountain Shrines"}
            </span>
            <span className="ty-badge-star">✦</span>
          </motion.div>
          <motion.h1
            className="ty-state-hero-title"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="ty-state-hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="ty-state-content-section">
        <div className="ty-container">
          {/* Main Filter Bar & Search */}
          <div className="ty-directory-filter-bar">
            <div className="ty-state-tabs-ribbon" role="tablist">
              {tabs.map((tab) => {
                const isActive = selectedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`ty-state-tab-btn ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setSelectedFilter(tab.id);
                      if (tab.id !== "shaktipeeths") setShaktipeethRegion("all");
                    }}
                    style={{ position: "relative" }}
                  >
                    <span style={{ position: "relative", zIndex: 2 }}>{tab.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="directory-active-tab-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "100px",
                          background: "linear-gradient(135deg, #0f261d 0%, #15382b 100%)",
                          border: "1px solid rgba(212, 175, 55, 0.5)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 12px rgba(212, 175, 55, 0.2)",
                          zIndex: 1
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="ty-directory-search">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                placeholder={
                  selectedFilter === "shaktipeeths"
                    ? "Search Shaktipeeth, Anga (relic), Devi, Bhairav, city..."
                    : `Search ${isTemples ? "temples, deities, states..." : "mountains, places..."}`
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ty-directory-search-input"
                aria-label="Search places"
              />
              {searchQuery && (
                <button
                  className="ty-search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                  aria-label="Clear search query"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Dedicated 52 Shaktipeeth Header Card when on Shaktipeeths tab */}
          {isTemples && selectedFilter === "shaktipeeths" && (
            <div className="ty-shaktipeeth-hero-panel">
              <div className="ty-shaktipeeth-panel-header">
                <div className="ty-shaktipeeth-badge-row">
                  <span className="ty-shakti-pill-tag">
                    <Flower2 size={13} className="text-rose-400" /> 52 पवित्र शक्तिपीठ • सम्पूर्ण दर्शन
                  </span>
                  <span className="ty-shakti-mantra-tag">
                    ॥ ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥
                  </span>
                </div>
                <h2 className="ty-shaktipeeth-panel-title">
                  The 52 Sacred Shaktipeeths of Mata Sati
                </h2>
                <p className="ty-shaktipeeth-panel-desc">
                  Holy sanctuaries consecrated where the sacred body parts (अंग) and ornaments of Devi Sati fell during Lord Shiva’s cosmic Tandava. Every Shaktipeeth is eternally presided over by a manifest form of the Divine Mother and protected by its designated Bhairava.
                </p>
              </div>

              {/* Regional Sub-Tabs */}
              <div className="ty-shaktipeeth-region-bar">
                <span className="ty-region-filter-label">Filter by Region:</span>
                <div className="ty-shaktipeeth-region-pills">
                  {SHAKTIPEETH_REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      className={`ty-shakti-region-btn ${
                        shaktipeethRegion === reg.id ? "active" : ""
                      }`}
                      onClick={() => setShaktipeethRegion(reg.id)}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Destination Cards Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="ty-directory-cards-grid">
              {filteredPlaces.map((dest) => {
                const isFav = savedFavorites.some((f) => f.id === dest.id);
                const rawAltitude = dest.altitude ? dest.altitude.trim() : null;
                const formattedAltitude = rawAltitude
                  ? rawAltitude.toLowerCase().includes("m")
                    ? rawAltitude.split("(")[0].trim()
                    : `${rawAltitude} m`
                  : null;

                return (
                  <motion.div
                    key={dest.id}
                    className="ty-destination-card"
                    onClick={() => onSelectDestination(dest)}
                    role="button"
                    tabIndex={0}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -6, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectDestination(dest);
                      }
                    }}
                  >
                    <div className="ty-card-media">
                      <img
                        src={dest.image || createTemplePlaceholder(dest.name)}
                        alt={dest.name}
                        className="ty-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = createTemplePlaceholder(dest.name);
                        }}
                      />
                      <div className="ty-card-badge-row">
                        <span className="ty-card-category-badge">
                          {dest.number ? `#${dest.number} ` : ""}
                          {dest.badge || "Shaktipeeth"}
                        </span>
                        <button
                          className={`ty-card-fav-btn ${isFav ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(dest);
                          }}
                          title={isFav ? "Remove from My Yatra" : "Save to My Yatra"}
                          aria-label={isFav ? "Remove from My Yatra" : "Save to My Yatra"}
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
                        <span className="ty-card-location">{dest.location}</span>
                        {formattedAltitude && (
                          <>
                            <span className="ty-meta-bullet">•</span>
                            <span
                              className="ty-card-altitude-pill"
                              title="Elevation above sea level"
                            >
                              {formattedAltitude}
                            </span>
                          </>
                        )}
                      </p>

                      {/* Sacred Relic / Body Part highlight for Shaktipeeths */}
                      {dest.bodyPart && (
                        <div className="ty-card-relic-badge">
                          <span className="ty-relic-label">पवित्र अंग:</span>{" "}
                          <span className="ty-relic-name">{dest.bodyPart}</span>
                        </div>
                      )}

                      {/* Devi & Bhairava subline for Shaktipeeths */}
                      {dest.devi && dest.bhairava && (
                        <p className="ty-card-devi-bhairav-line">
                          <span className="ty-devi-tag inline-flex items-center gap-1"><Flower2 size={11} className="text-rose-400" /> {dest.devi}</span>
                          <span className="ty-meta-bullet">•</span>
                          <span className="ty-bhairav-tag inline-flex items-center gap-1"><Flame size={11} className="text-amber-400" /> {dest.bhairava}</span>
                        </p>
                      )}

                      <p className="ty-card-description-snippet">
                        {dest.overview ? `${dest.overview.slice(0, 115)}...` : ""}
                      </p>

                      <div className="ty-card-footer">
                        <span
                          className="ty-card-deity-text"
                          title={dest.deity ? `Deity: ${dest.deity}` : ""}
                        >
                          <span className="ty-deity-label">
                            {dest.region ? "Region:" : "Deity:"}
                          </span>{" "}
                          {dest.region
                            ? dest.region
                            : dest.deity
                            ? dest.deity.split("(")[0].trim()
                            : "Lord Shiva"}
                        </span>
                        <span className="ty-card-action">
                          Explore <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="ty-empty-search-state">
              <div className="ty-empty-icon flex justify-center py-2"><Compass size={40} className="text-amber-400/80 stroke-1" /></div>
              <h3>No destinations found</h3>
              <p>
                No sacred shrines matched &ldquo;{searchQuery}&rdquo; in this category.
              </p>
              <button
                className="ty-btn-primary mt-3"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                  setShaktipeethRegion("all");
                }}
              >
                Show All Temples
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

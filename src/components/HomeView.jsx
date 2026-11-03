import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicParticles from "./CinematicParticles";
import {
  Search,
  ArrowRight,
  Flame,
  Sparkles,
  Compass,
  Landmark,
  Mountain,
  Droplets,
  Waves,
  Castle,
  MapPin,
  Heart,
  ChevronRight,
  Calendar,
  Clock,
  Shield,
  Send,
  ExternalLink,
  Info,
  Navigation,
  RefreshCw,
  Check
} from "lucide-react";
import { calculateHaversineKm, computeTopographicalRoadKm } from "../services/distanceService";
import {
  CATEGORIES,
  ALL_STATES_DATA,
  FEATURED_CIRCUITS,
  FLAGSHIP_DESTINATIONS
} from "../data/tirthData";
import {
  VARANASI_ORIGIN,
  VARANASI_SACRED_PLACES,
  VARANASI_CURATED_CIRCUITS
} from "../data/varanasiData";
import { requestBrowserLocation } from "../services/locationService";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK, DEFAULT_GHAT_FALLBACK } from "../utils/imageFallback";

export default function HomeView({
  onSelectDestination,
  onSelectState,
  onSelectCategory,
  onSelectCircuit,
  onExploreMap,
  savedFavorites = [],
  onToggleFavorite,
  startingLocation,
  onSelectStartingLocation,
  onOpenLocationSelector,
  onOpenAiPlanner
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [showAllStates, setShowAllStates] = useState(false);
  const [activeGemTab, setActiveGemTab] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Proximity "Near Me" state
  const [nearbyRadius, setNearbyRadius] = useState("50"); // "10" | "25" | "50" | "100" | "all"
  const [nearbyCategory, setNearbyCategory] = useState("all");
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState(null);

  const isCurrentGps = startingLocation?.isGpsVerified || startingLocation?.type === "gps";
  const isVaranasiActive =
    !isCurrentGps &&
    (startingLocation?.id === VARANASI_ORIGIN.id ||
      startingLocation?.city === "Varanasi" ||
      startingLocation?.name?.toLowerCase().includes("varanasi") ||
      startingLocation?.name?.toLowerCase().includes("kashi"));

  const handleDetectGps = async () => {
    setIsLocatingGps(true);
    setGpsMessage("Requesting browser GPS permission...");
    const res = await requestBrowserLocation();
    setIsLocatingGps(false);
    if (res.success && res.location) {
      if (onSelectStartingLocation) onSelectStartingLocation(res.location);
      setGpsMessage(`GPS Location Verified: ${res.location.name}`);
      setTimeout(() => setGpsMessage(null), 3500);
    } else {
      setGpsMessage(res.message || "GPS unavailable. You can search or choose Varanasi.");
      setTimeout(() => setGpsMessage(null), 4500);
      if (onOpenLocationSelector) onOpenLocationSelector();
    }
  };

  const handleSetVaranasi = () => {
    if (onSelectStartingLocation) {
      onSelectStartingLocation(VARANASI_ORIGIN);
      setGpsMessage("Origin set to Varanasi (Kashi Vishwanath Corridor) • Sacred Default");
      setTimeout(() => setGpsMessage(null), 3000);
    }
  };

  // Combined places candidate list (Varanasi sacred places + flagship destinations)
  const allPilgrimagePlaces = useMemo(() => {
    const map = new Map();
    [...VARANASI_SACRED_PLACES, ...FLAGSHIP_DESTINATIONS].forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, []);

  // Filtered proximity places for "Discover Pilgrimages Near You"
  const nearbyPlacesList = useMemo(() => {
    const oLat = startingLocation?.lat || 25.3176;
    const oLng = startingLocation?.lng || 82.9739;

    let places = allPilgrimagePlaces.map((p) => {
      const straight = calculateHaversineKm(oLat, oLng, p.lat, p.lng);
      const roadKm = computeTopographicalRoadKm(straight);
      const durationMins = Math.round((roadKm / 50) * 60);
      return {
        ...p,
        straightKm: Math.round(straight * 10) / 10,
        roadKm,
        durationFormatted: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
      };
    });

    if (nearbyRadius !== "all") {
      const r = Number(nearbyRadius);
      places = places.filter((p) => p.straightKm <= r);
    }

    if (nearbyCategory !== "all") {
      places = places.filter((p) => {
        if (nearbyCategory === "jyotirlingas") return p.category === "jyotirlingas";
        if (nearbyCategory === "shaktipeeths") return p.category === "shaktipeeths";
        if (nearbyCategory === "temples") return p.category === "manyata_temples" || p.category === "jyotirlingas" || p.category === "shaktipeeths";
        if (nearbyCategory === "mountains") return p.category === "mountains";
        if (nearbyCategory === "heritage") return p.category === "heritage_history";
        return true;
      });
    }

    places.sort((a, b) => a.straightKm - b.straightKm);
    return places;
  }, [allPilgrimagePlaces, startingLocation, nearbyRadius, nearbyCategory]);

  // Icon mapping for categories
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Flame":
        return <Flame size={18} />;
      case "Sparkles":
        return <Sparkles size={18} />;
      case "Compass":
        return <Compass size={18} />;
      case "Landmark":
        return <Landmark size={18} />;
      case "Mountain":
        return <Mountain size={18} />;
      case "Droplets":
        return <Droplets size={18} />;
      case "Waves":
        return <Waves size={18} />;
      case "Castle":
        return <Castle size={18} />;
      default:
        return <Landmark size={18} />;
    }
  };

  // Search autocomplete / suggestions across destinations and states
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const destMatches = FLAGSHIP_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q)
    ).slice(0, 5);

    const stateMatches = ALL_STATES_DATA.filter((s) =>
      s.name.toLowerCase().includes(q)
    ).slice(0, 3);

    return { destinations: destMatches, states: stateMatches };
  }, [searchQuery]);

  // Filtered states for state explorer section
  const filteredStates = useMemo(() => {
    let list = ALL_STATES_DATA;
    if (stateSearchQuery.trim()) {
      const q = stateSearchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q)
      );
    }
    return showAllStates ? list : list.slice(0, 9);
  }, [stateSearchQuery, showAllStates]);

  // Filtered flagship destinations for "Sacred Gems" section
  const filteredGems = useMemo(() => {
    if (activeGemTab === "all") return FLAGSHIP_DESTINATIONS;
    if (activeGemTab === "jyotirlingas")
      return FLAGSHIP_DESTINATIONS.filter((d) => d.category === "jyotirlingas");
    if (activeGemTab === "chardham")
      return FLAGSHIP_DESTINATIONS.filter((d) => d.category === "chardham");
    if (activeGemTab === "shaktipeeths")
      return FLAGSHIP_DESTINATIONS.filter((d) => d.category === "shaktipeeths");
    if (activeGemTab === "manyata")
      return FLAGSHIP_DESTINATIONS.filter((d) => d.category === "manyata_temples");
    if (activeGemTab === "scenic")
      return FLAGSHIP_DESTINATIONS.filter(
        (d) => d.category === "mountains" || d.category === "lakes_waterfalls" || d.category === "beaches_coastal"
      );
    if (activeGemTab === "heritage")
      return FLAGSHIP_DESTINATIONS.filter((d) => d.category === "heritage_history");
    return FLAGSHIP_DESTINATIONS;
  }, [activeGemTab]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="ty-home-view">
      {/* =========================================================================
          HERO SECTION: Full-width cinematic photographic hero
          ========================================================================= */}
      <section className="ty-hero-section">
        <div className="ty-hero-bg">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            src="/images/hero_kedarnath.jpg"
            alt="Kedarnath Temple glowing against snow-capped Himalayan peaks at golden sunset"
            className="ty-hero-image"
            fetchPriority="high"
            decoding="async"
            onError={(e) => handleImgError(e, "/images/hero_kedarnath.jpg")}
          />
          <div className="ty-hero-overlay" />
        </div>

        {/* Cinematic Golden Stardust & Ambient Sacred Glow */}
        <CinematicParticles count={24} showMandala={true} />

        <div className="ty-hero-content" style={{ position: "relative", zIndex: 2 }}>
          {/* Subtle Golden Tagline Badge */}
          <motion.div
            className="ty-hero-badge"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="ty-badge-star">✦</span>
            <span className="ty-badge-text">Explore • Discover • Experience</span>
            <span className="ty-badge-star">✦</span>
          </motion.div>

          {/* Majestic Editorial Heading with Cinematic Motion */}
          <motion.h1
            className="ty-hero-title"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Divine Journeys Across Incredible India
          </motion.h1>

          {/* Refined Subtitle */}
          <motion.p
            className="ty-hero-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Temples, mountains, lakes, beaches and more — explore the spiritual
            and natural beauty of India, state by state.
          </motion.p>

          {/* Interactive Search Bar */}
          <motion.div
            className="ty-hero-search-wrapper"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ty-hero-search-bar">
              <Search className="ty-search-icon" size={20} />
              <input
                type="text"
                className="ty-search-input"
                placeholder="Search for temples, places, states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    onExploreMap(searchQuery);
                  }
                }}
              />
              <button
                className="ty-hero-search-btn"
                onClick={() => onExploreMap(searchQuery)}
                title="Explore destinations on interactive map"
              >
                <span>Explore Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchResults.destinations &&
              (searchResults.destinations.length > 0 || searchResults.states.length > 0) && (
                <div className="ty-search-dropdown">
                  {searchResults.destinations.length > 0 && (
                    <div className="ty-search-group">
                      <span className="ty-search-group-title">Destinations</span>
                      {searchResults.destinations.map((dest) => (
                        <div
                          key={dest.id}
                          className="ty-search-result-item"
                          onClick={() => {
                            setSearchQuery("");
                            onSelectDestination(dest);
                          }}
                        >
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="ty-search-thumb"
                            onError={handleImgError}
                          />
                          <div className="ty-search-info">
                            <span className="ty-search-name">{dest.name}</span>
                            <span className="ty-search-location">
                              {dest.location}
                            </span>
                          </div>
                          <span className="ty-search-badge">{dest.badge}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.states.length > 0 && (
                    <div className="ty-search-group">
                      <span className="ty-search-group-title">States</span>
                      {searchResults.states.map((st) => (
                        <div
                          key={st.id}
                          className="ty-search-result-item"
                          onClick={() => {
                            setSearchQuery("");
                            onSelectState(st);
                          }}
                        >
                          <MapPin size={16} className="text-amber-500" />
                          <div className="ty-search-info">
                            <span className="ty-search-name">{st.name}</span>
                            <span className="ty-search-location">
                              {st.placesCount} places documented
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </motion.div>

          {/* Journey Origin Setting & Dual-Mode Controls */}
          <div className="ty-hero-origin-container">
            <div
              className="ty-hero-origin-bar"
              onClick={onOpenLocationSelector}
              role="button"
              tabIndex={0}
              title="Click to change your starting origin or search cities"
            >
              <div className="ty-hero-origin-content">
                <div className={`ty-hero-origin-dot ${isCurrentGps ? "gps" : ""}`} />
                <MapPin size={14} className={isCurrentGps ? "text-emerald-400 flex-shrink-0" : "text-amber-400 flex-shrink-0"} />
                <span className="ty-hero-origin-label">
                  {isCurrentGps ? "Live GPS Origin:" : isVaranasiActive ? "Sacred Origin (Default):" : "Starting Origin:"}
                </span>
                <strong className="ty-hero-origin-place">
                  {startingLocation?.name || VARANASI_ORIGIN.name}
                </strong>
                {isCurrentGps && (
                  <span className="ty-origin-mode-badge gps">LIVE GPS</span>
                )}
                {isVaranasiActive && (
                  <span className="ty-origin-mode-badge sacred">KASHI CORRIDOR</span>
                )}
              </div>
              <span className="ty-hero-origin-action">Change ▾</span>
            </div>

            {/* Quick Two-Mode Switching Pills */}
            <div className="ty-hero-mode-toggles">
              <button
                className={`ty-hero-mode-btn ${isCurrentGps ? "gps-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetectGps();
                }}
                disabled={isLocatingGps}
                title="Detect your actual coordinates via browser GPS"
              >
                <Navigation size={13} className={isLocatingGps ? "ty-spin text-emerald-400" : "text-emerald-400"} />
                <span>{isLocatingGps ? "Locating..." : isCurrentGps ? "GPS Active" : "Detect My Location"}</span>
              </button>

              <button
                className={`ty-hero-mode-btn ${isVaranasiActive ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetVaranasi();
                }}
                title="Start pilgrimage from Varanasi (Kashi Vishwanath Corridor)"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>Start from Varanasi</span>
              </button>
            </div>

            {gpsMessage && (
              <div className="text-xs text-amber-200 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                {gpsMessage}
              </div>
            )}
          </div>

          {/* AI Travel Planner Hero Callout */}
          {onOpenAiPlanner && (
            <motion.div
              className="ty-hero-ai-planner-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              onClick={() => onOpenAiPlanner()}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <div className="ty-ai-sparkle-orb">
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm font-bold font-serif flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      AI Travel Planner & Complete Budget Calculator
                    </strong>
                    <span className="ty-ai-card-pill">Automatic</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Plan any temple trip across India: automatically calculates trains, hotels, local auto-rickshaw fares, meals & day-wise itinerary.
                  </p>
                </div>
              </div>
              <div className="ty-ai-plan-now-btn">
                <span>Plan My Yatra</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          )}

          {/* Compact Pilgrimage Statistics Ribbon */}
          <div className="ty-hero-stats-ribbon">
            <div
              className="ty-hero-stat-card"
              onClick={() => onSelectCategory("jyotirlingas")}
            >
              <span className="ty-stat-number">12</span>
              <span className="ty-stat-label">Jyotirlingas</span>
            </div>
            <div className="ty-stat-separator" />

            <div
              className="ty-hero-stat-card"
              onClick={() => onSelectCategory("shaktipeeths")}
            >
              <span className="ty-stat-number">51/52</span>
              <span className="ty-stat-label">Shaktipeeths</span>
            </div>
            <div className="ty-stat-separator" />

            <div
              className="ty-hero-stat-card"
              onClick={() => onSelectCategory("chardham")}
            >
              <span className="ty-stat-number">Char Dham</span>
              <span className="ty-stat-label">& Chota Char Dham</span>
            </div>
            <div className="ty-stat-separator" />

            <div
              className="ty-hero-stat-card"
              onClick={() => onExploreMap("all")}
            >
              <span className="ty-stat-number">All States & UTs</span>
              <span className="ty-stat-label">Explore on Map</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Explore by Category (Warm Ivory Editorial Canvas)
          ========================================================================= */}
      <section className="ty-section ty-category-section">
        <div className="ty-container">
          {/* Section Header with Refined Indian Editorial Accents */}
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower">✢</span>
              <h2 className="ty-section-title">Explore by Category</h2>
              <span className="ty-ornament-flower">✢</span>
            </div>
            <p className="ty-section-subtitle">
              Choose your path — spiritual, scenic, or cultural
            </p>
          </div>

          {/* Editorial 8-Category Grid matching visual reference */}
          <div className="ty-category-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="ty-category-card"
                onClick={() => onSelectCategory(cat.id)}
                role="button"
                tabIndex={0}
              >
                <div className="ty-category-image-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="ty-category-img"
                    loading="lazy"
                    decoding="async"
                    onError={handleImgError}
                  />
                  <div className="ty-category-img-overlay" />
                  {/* Circular Badge Icon overlapping edge */}
                  <div
                    className="ty-category-icon-badge"
                    style={{ background: cat.color }}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                </div>

                <div className="ty-category-body">
                  <h3 className="ty-category-name">{cat.name}</h3>
                  <p className="ty-category-tagline">{cat.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Discover Pilgrimages Near You (Proximity & Navigation Engine)
          ========================================================================= */}
      <section className="ty-nearby-section">
        <div className="ty-container">
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower">✦</span>
              <h2 className="ty-section-title">Discover Pilgrimages Near You</h2>
              <span className="ty-ornament-flower">✦</span>
            </div>
            <p className="ty-section-subtitle">
              Verified road distances, estimated driving times, and direct navigation from your active origin
            </p>
          </div>

          {/* Active Origin Banner & Dual Mode Switcher */}
          <div className="ty-nearby-header-box">
            <div className="ty-nearby-origin-status">
              <div className="ty-nearby-origin-icon-wrap">
                {isCurrentGps ? (
                  <Navigation size={20} className="text-emerald-600" />
                ) : (
                  <Sparkles size={20} className="text-amber-600" />
                )}
              </div>
              <div className="ty-nearby-origin-meta">
                <h4>
                  {isCurrentGps
                    ? "Pilgrimages Near Your GPS Location"
                    : isVaranasiActive
                    ? "Pilgrimages Around Varanasi (Kashi)"
                    : `Pilgrimages Near ${startingLocation?.city || "Origin"}`}
                </h4>
                <p>
                  Departing from: <strong>{startingLocation?.name || VARANASI_ORIGIN.name}</strong>
                  {startingLocation?.lat && ` (${startingLocation.lat.toFixed(3)}°N, ${startingLocation.lng.toFixed(3)}°E)`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                className={`ty-hero-mode-btn ${isCurrentGps ? "gps-active" : ""}`}
                onClick={handleDetectGps}
                disabled={isLocatingGps}
              >
                <Navigation size={13} className={isLocatingGps ? "ty-spin" : ""} />
                <span>{isLocatingGps ? "Querying GPS..." : "Detect My Location"}</span>
              </button>

              <button
                className={`ty-hero-mode-btn ${isVaranasiActive ? "active" : ""}`}
                onClick={handleSetVaranasi}
              >
                <Sparkles size={13} />
                <span>Start from Varanasi</span>
              </button>

              <button
                className="ty-hero-mode-btn"
                onClick={onOpenLocationSelector}
              >
                <Search size={13} />
                <span>Change City</span>
              </button>
            </div>
          </div>

          {/* Controls: Radius & Category Filters */}
          <div className="ty-nearby-controls-row">
            {/* Radius Selector */}
            <div className="ty-radius-pill-group">
              <span className="ty-radius-pill-label">Search Radius:</span>
              {[
                { id: "10", label: "10 km" },
                { id: "25", label: "25 km" },
                { id: "50", label: "50 km" },
                { id: "100", label: "100 km" },
                { id: "all", label: "All India" }
              ].map((r) => (
                <button
                  key={r.id}
                  className={`ty-radius-pill-btn ${nearbyRadius === r.id ? "active" : ""}`}
                  onClick={() => setNearbyRadius(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Category Filter Chips */}
            <div className="ty-gems-tabs" style={{ margin: 0 }}>
              {[
                { id: "all", label: "All Places" },
                { id: "temples", label: "Temples" },
                { id: "jyotirlingas", label: "Jyotirlingas" },
                { id: "shaktipeeths", label: "Shaktipeeths" },
                { id: "mountains", label: "Mountains" },
                { id: "heritage", label: "Heritage" }
              ].map((c) => (
                <button
                  key={c.id}
                  className={`ty-gem-tab-btn ${nearbyCategory === c.id ? "active" : ""}`}
                  onClick={() => setNearbyCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nearby Places Grid */}
          <div className="ty-nearby-grid">
            {nearbyPlacesList.slice(0, 8).map((place) => {
              const isFav = savedFavorites.some((f) => f.id === place.id);
              const originLat = startingLocation?.lat || VARANASI_ORIGIN.lat;
              const originLng = startingLocation?.lng || VARANASI_ORIGIN.lng;
              const gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originLat + "," + originLng)}&destination=${encodeURIComponent(place.lat + "," + place.lng)}`;

              return (
                <div
                  key={place.id}
                  className="ty-nearby-place-card"
                  onClick={() => onSelectDestination(place)}
                >
                  <div className="ty-card-media">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="ty-card-img"
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                    <div className="ty-card-badge-row">
                      <span className="ty-card-category-badge">{place.badge || "Sacred Shrine"}</span>
                      <button
                        className={`ty-card-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(place);
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

                  <div className="ty-card-body" style={{ flex: 1 }}>
                    <div className="ty-card-meta">
                      <MapPin size={13} className="text-amber-700" />
                      <span>{place.location || `${place.city}, ${place.state}`}</span>
                    </div>
                    <h3 className="ty-card-title">{place.name}</h3>
                    <p className="ty-card-deity">Deity: {place.deity || "Sanatana Sanctum"}</p>
                  </div>

                  {/* Road Distance Bar */}
                  <div className="ty-nearby-card-distance-bar">
                    <div className="flex items-center gap-1.5">
                      <Navigation size={13} className="text-amber-700" />
                      <span className="ty-nearby-distance-number">~{place.roadKm} km</span>
                      <span className="ty-nearby-distance-duration">Road Distance</span>
                    </div>
                    <span className="ty-nearby-distance-duration text-stone-600 font-medium">
                      Est. {place.durationFormatted}
                    </span>
                  </div>

                  {/* Card Actions */}
                  <div className="ty-nearby-card-btn-row" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={gmapsDirUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ty-nearby-dir-btn"
                      title="Open GPS Turn-by-Turn in Google Maps"
                    >
                      <Navigation size={12} />
                      <span>Directions</span>
                      <ExternalLink size={10} />
                    </a>

                    <button
                      className="ty-nearby-detail-btn"
                      onClick={() => onSelectDestination(place)}
                      title="View temple history and darshan timings"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {nearbyPlacesList.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
              <MapPin size={32} className="text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold text-stone-800">No destinations found within {nearbyRadius} km</h3>
              <p className="text-sm text-stone-500 mb-4">Try expanding your search radius to 50 km, 100 km, or All India.</p>
              <button
                className="ty-radius-pill-btn active"
                onClick={() => setNearbyRadius("all")}
              >
                Expand to All India
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Varanasi Sacred Starting Point & Curated Circuits (Kashi Corridors)
          ========================================================================= */}
      <section className="ty-varanasi-section">
        <div className="ty-container">
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower" style={{ color: "#f59e0b" }}>✦</span>
              <h2 className="ty-section-title" style={{ color: "#ffffff" }}>
                Varanasi (Kashi) — The Sacred Starting Point
              </h2>
              <span className="ty-ornament-flower" style={{ color: "#f59e0b" }}>✦</span>
            </div>
            <p className="ty-section-subtitle" style={{ color: "#cbd5e1" }}>
              The eternal spiritual axis of Lord Shiva • Gateway to Panch Kroshi Parikrama, Purvanchal Triangle & Char Dham
            </p>
          </div>

          {/* Key Varanasi Pilgrimage Shrines Showcase */}
          <div className="ty-section-tagline text-center text-amber-300 font-bold mb-4 tracking-wider uppercase text-xs">
            Sacred Sanctums of Kashi Mokshakshetra
          </div>

          <div className="ty-gems-grid">
            {VARANASI_SACRED_PLACES.slice(0, 6).map((sanctum) => {
              const isFav = savedFavorites.some((f) => f.id === sanctum.id);
              return (
                <div
                  key={sanctum.id}
                  className="ty-destination-card"
                  onClick={() => onSelectDestination(sanctum)}
                >
                  <div className="ty-card-media">
                    <img
                      src={sanctum.image}
                      alt={sanctum.name}
                      className="ty-card-img"
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                    <div className="ty-card-badge-row">
                      <span className="ty-card-category-badge">{sanctum.badge}</span>
                      <button
                        className={`ty-card-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(sanctum);
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
                    <div className="ty-card-meta">
                      <MapPin size={13} className="text-amber-500" />
                      <span>{sanctum.location}</span>
                    </div>
                    <h3 className="ty-card-title">{sanctum.name}</h3>
                    <p className="ty-card-deity">Deity: {sanctum.deity}</p>
                    <div className="ty-card-footer">
                      <span className="ty-card-altitude">Timings: {sanctum.timings?.split("(")[0]}</span>
                      <span className="ty-card-action">
                        Explore <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Curated Pilgrimage Circuits Departing from Varanasi */}
          <div className="mt-14">
            <div className="ty-section-tagline text-center text-amber-300 font-bold mb-2 tracking-wider uppercase text-xs">
              Curated Circuits Departing from Varanasi
            </div>
            <h3 className="text-center font-serif text-2xl text-amber-100 font-bold mb-6">
              Ancient Parikramas & Pan-Indian Corridors
            </h3>

            <div className="ty-varanasi-circuits-grid">
              {VARANASI_CURATED_CIRCUITS.map((circuit) => (
                <div
                  key={circuit.id}
                  className="ty-varanasi-circuit-card"
                  onClick={() => onSelectCircuit(circuit)}
                >
                  <div className="ty-vcircuit-media">
                    <img
                      src={circuit.image}
                      alt={circuit.name}
                      className="ty-vcircuit-img"
                      loading="lazy"
                      onError={handleImgError}
                    />
                    <span className="ty-vcircuit-badge">{circuit.badge}</span>
                  </div>

                  <div className="ty-vcircuit-body">
                    <div className="ty-vcircuit-metrics">
                      <span>Origin: {circuit.origin}</span>
                      <span>•</span>
                      <span>~{circuit.totalDistanceKm} km</span>
                      <span>•</span>
                      <span>{circuit.durationDays}</span>
                    </div>

                    <h4 className="ty-vcircuit-title">{circuit.name}</h4>
                    <p className="ty-vcircuit-desc">{circuit.description}</p>

                    <div className="ty-vcircuit-highlights">
                      {circuit.highlights?.map((hl, i) => (
                        <span key={i} className="ty-vcircuit-tag">
                          {hl}
                        </span>
                      ))}
                    </div>

                    <button className="ty-vcircuit-btn mt-auto">
                      <span>Explore Circuit Itinerary</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Explore by State & Union Territory
          ========================================================================= */}
      <section className="ty-section ty-state-section">
        <div className="ty-container">
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower">✦</span>
              <h2 className="ty-section-title">
                Explore by State & Union Territory
              </h2>
              <span className="ty-ornament-flower">✦</span>
            </div>
            <p className="ty-section-subtitle">
              Discover temples, spiritual, scenic and more across all states and UTs
            </p>
          </div>

          <div className="ty-state-explorer-layout">
            {/* Left Column: Search & State Cards Grid */}
            <div className="ty-state-left-column">
              <div className="ty-state-search-box">
                <Search size={16} className="text-amber-800/60" />
                <input
                  type="text"
                  placeholder="Search for a state or UT..."
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                  className="ty-state-search-input"
                />
              </div>

              <div className="ty-state-cards-grid">
                {filteredStates.map((st) => (
                  <div
                    key={st.id}
                    className="ty-state-card"
                    onClick={() => onExploreMap(st.name)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ty-state-icon-pill">
                      <Landmark size={15} className="text-amber-400" />
                    </div>
                    <div className="ty-state-info">
                      <span className="ty-state-name">{st.name}</span>
                      <span className="ty-state-places">
                        ({st.placesCount} places)
                      </span>
                    </div>
                  </div>
                ))}

                {/* Expand / Collapse Button for remaining States & UTs */}
                <div
                  className="ty-state-card ty-state-more-card"
                  onClick={() => setShowAllStates(!showAllStates)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ty-state-icon-pill more">
                    <Compass size={16} />
                  </div>
                  <div className="ty-state-info">
                    <span className="ty-state-name">
                      {showAllStates ? "Show Less" : "And 27 more..."}
                    </span>
                    <span className="ty-state-places">
                      {showAllStates ? "Collapse" : "Explore all India"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Antique Vintage Parchment India Map Graphic */}
            <div className="ty-state-right-column">
              <div
                className="ty-antique-map-frame"
                onClick={() => onExploreMap()}
                title="Click to open interactive Bharat map"
              >
                <img
                  src="/images/india_antique_map.jpg"
                  alt="Historical antique cartographic map of India"
                  className="ty-antique-map-img"
                  onError={(e) => handleImgError(e, "/images/india_antique_map.jpg")}
                />
                <div className="ty-antique-map-banner">
                  <span>Interactive Map Explorer</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Featured Pilgrimage Circuits & Routes
          ========================================================================= */}
      <section className="ty-section ty-circuits-section">
        <div className="ty-container">
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower">✦</span>
              <h2 className="ty-section-title">
                Featured Pilgrimage Circuits & Routes
              </h2>
              <span className="ty-ornament-flower">✦</span>
            </div>
            <p className="ty-section-subtitle">
              Curated journeys for a complete travel experience
            </p>
          </div>

          <div className="ty-circuits-grid">
            {FEATURED_CIRCUITS.map((circuit) => (
              <div
                key={circuit.id}
                className="ty-circuit-card"
                onClick={() => onSelectCircuit(circuit)}
                role="button"
                tabIndex={0}
              >
                <div className="ty-circuit-image-wrap">
                  <img
                    src={circuit.image}
                    alt={circuit.title}
                    className="ty-circuit-img"
                    loading="lazy"
                    onError={handleImgError}
                  />
                  <div className="ty-circuit-overlay" />
                </div>

                <div className="ty-circuit-content">
                  <span className="ty-circuit-subtitle">{circuit.subtitle}</span>
                  <h3 className="ty-circuit-title">{circuit.title}</h3>
                  <p className="ty-circuit-distance">
                    {circuit.stopsCount} • {circuit.distance}
                  </p>
                  <button className="ty-circuit-btn">
                    <span>View Circuit</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Sacred Gems of Bharat (Curated Destination Cards)
          ========================================================================= */}
      <section className="ty-section ty-gems-section">
        <div className="ty-container">
          <div className="ty-section-header">
            <div className="ty-ornament-line">
              <span className="ty-ornament-flower">✦</span>
              <h2 className="ty-section-title">Sacred Gems of Bharat</h2>
              <span className="ty-ornament-flower">✦</span>
            </div>
            <p className="ty-section-subtitle">
              Handpicked divine abodes, high-altitude shrines, and ancient wonders
            </p>

            {/* Filter Tabs */}
            <div className="ty-gems-tabs">
              {[
                { id: "all", label: "All Sacred Places" },
                { id: "jyotirlingas", label: "12 Jyotirlingas" },
                { id: "chardham", label: "Char Dham" },
                { id: "shaktipeeths", label: "Shaktipeeths" },
                { id: "manyata", label: "Manyata Temples" },
                { id: "scenic", label: "Scenic & Mountains" },
                { id: "heritage", label: "Heritage Forts" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`ty-gem-tab-btn ${
                    activeGemTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => setActiveGemTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ty-gems-grid">
            {filteredGems.map((gem) => {
              const isFav = savedFavorites.some((f) => f.id === gem.id);
              return (
                <div
                  key={gem.id}
                  className="ty-destination-card"
                  onClick={() => onSelectDestination(gem)}
                >
                  <div className="ty-card-media">
                    <img
                      src={gem.image}
                      alt={gem.name}
                      className="ty-card-img"
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                    <div className="ty-card-badge-row">
                      <span className="ty-card-category-badge">
                        {gem.badge}
                      </span>
                      <button
                        className={`ty-card-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(gem);
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
                    <div className="ty-card-meta">
                      <MapPin size={13} className="text-amber-700" />
                      <span>{gem.location}</span>
                    </div>

                    <h3 className="ty-card-title">{gem.name}</h3>
                    <p className="ty-card-deity">Deity: {gem.deity}</p>

                    {/* Verified Road Distance from Starting Point */}
                    {startingLocation?.lat && gem.lat && (
                      <div className="ty-card-distance-tag">
                        <Navigation size={11} className="text-amber-600 flex-shrink-0" />
                        <span>
                          ~{computeTopographicalRoadKm(calculateHaversineKm(startingLocation.lat, startingLocation.lng, gem.lat, gem.lng))} km from {startingLocation.city || startingLocation.name?.split(" ")[0]}
                        </span>
                      </div>
                    )}

                    <div className="ty-card-footer">
                      <span className="ty-card-altitude">
                        Alt: {gem.altitude}
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
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Spiritual Essence Quote Banner
          ========================================================================= */}
      <section className="ty-quote-banner">
        <div className="ty-quote-bg">
          <img
            src="/images/spiritual_ghat_evening.jpg"
            alt="Evening temple ghats with glowing sacred diyas on river water"
            className="ty-quote-image"
            onError={(e) => handleImgError(e, DEFAULT_GHAT_FALLBACK)}
          />
          <div className="ty-quote-overlay" />
        </div>

        <div className="ty-quote-content">
          <span className="ty-quote-om">ॐ</span>
          <p className="ty-quote-main">
            Not just a journey...
            <br />
            <span className="ty-quote-highlight">It's a feeling</span>
          </p>
          <p className="ty-quote-sub">
            The soul discovers peace not in the destination, but in every sacred step
            taken across the sacred soil of Bharat.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: Rich Editorial Footer (Deep Forest Green)
          ========================================================================= */}
      <footer className="ty-footer">
        <div className="ty-container">
          <div className="ty-footer-main">
            {/* Column 1: Brand & Bio */}
            <div className="ty-footer-brand-col">
              <div className="ty-footer-brand">
                <div
                  className="ty-footer-logo-mark"
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    padding: 0
                  }}
                >
                  <img
                    src="/images/journey_to_bharat_emblem.png"
                    alt="Journey to Bharat"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 10px rgba(212, 175, 55, 0.5))"
                    }}
                  />
                </div>
                <div className="ty-footer-brand-text">
                  <span className="ty-footer-brand-title">Journey to Bharat</span>
                  <span className="ty-footer-brand-subtitle">Discover • Explore • Experience</span>
                </div>
              </div>

              <p className="ty-footer-tagline">
                Explore the divine, discover the beautiful, experience incredible
                India. An authentic travel and pilgrimage atlas celebrating
                cultural heritage and sacred geography.
              </p>

              {/* Social links */}
              <div className="ty-footer-socials">
                <a href="#twitter" aria-label="X / Twitter" className="ty-social-icon">
                  𝕏
                </a>
                <a href="#instagram" aria-label="Instagram" className="ty-social-icon">
                  IG
                </a>
                <a href="#youtube" aria-label="YouTube" className="ty-social-icon">
                  YT
                </a>
                <a href="#facebook" aria-label="Facebook" className="ty-social-icon">
                  FB
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="ty-footer-links-col">
              <h4 className="ty-footer-col-title">Quick Links</h4>
              <ul className="ty-footer-links">
                <li>
                  <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#explore" onClick={(e) => { e.preventDefault(); onExploreMap(); }}>
                    Explore Places
                  </a>
                </li>
                <li>
                  <a href="#temples" onClick={(e) => { e.preventDefault(); onSelectCategory("jyotirlingas"); }}>
                    12 Jyotirlingas
                  </a>
                </li>
                <li>
                  <a href="#shakti" onClick={(e) => { e.preventDefault(); onSelectCategory("shaktipeeths"); }}>
                    Shaktipeeths
                  </a>
                </li>
                <li>
                  <a href="#chardham" onClick={(e) => { e.preventDefault(); onSelectCategory("chardham"); }}>
                    Char Dham
                  </a>
                </li>
                <li>
                  <a href="#map" onClick={(e) => { e.preventDefault(); onExploreMap(); }}>
                    Explore Places on Map
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: About & Heritage */}
            <div className="ty-footer-links-col">
              <h4 className="ty-footer-col-title">About & Heritage</h4>
              <ul className="ty-footer-links">
                <li>
                  <a href="#about" onClick={(e) => e.preventDefault()}>About Us</a>
                </li>
                <li>
                  <a href="#sources" onClick={(e) => e.preventDefault()}>Government Sources</a>
                </li>
                <li>
                  <a href="#guidelines" onClick={(e) => e.preventDefault()}>Yatra Guidelines</a>
                </li>
                <li>
                  <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
                </li>
                <li>
                  <a href="#disclaimer" onClick={(e) => e.preventDefault()}>Disclaimer</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="ty-footer-newsletter-col">
              <h4 className="ty-footer-col-title">Subscribe for Updates</h4>
              <p className="ty-footer-newsletter-text">
                Get travel inspiration, authentic pilgrimage schedules and new
                destinations straight to your inbox.
              </p>

              <form
                className="ty-newsletter-form"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="ty-newsletter-input"
                />
                <button
                  type="submit"
                  className="ty-newsletter-submit-btn"
                  title="Subscribe"
                >
                  <Send size={15} />
                </button>
              </form>

              {newsletterSubscribed && (
                <p className="ty-newsletter-success">
                  Dhanyawaad! You have been subscribed for divine updates.
                </p>
              )}
            </div>
          </div>

          {/* Bottom Bar: Copyright and Spiritual Blessings */}
          <div className="ty-footer-bottom">
            <span className="ty-copyright">
              © 2026 Journey to Bharat. All rights reserved.
            </span>
            <span className="ty-footer-blessings">
              जय श्री राम • हर हर महादेव • जय माता दी • ॐ नमः शिवाय
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

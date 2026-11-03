import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  MapPin,
  Heart,
  Globe,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Mountain,
  Landmark,
  Route as RouteIcon,
  Search,
  Navigation
} from "lucide-react";

export default function Navbar({
  activeView,
  setActiveView,
  savedFavorites = [],
  onOpenMyYatra,
  onOpenSearch,
  startingLocation,
  onOpenLocationSelector
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "हिन्दी (Hindi)" },
    { code: "SA", name: "संस्कृतम् (Sanskrit)" },
    { code: "TA", name: "தமிழ் (Tamil)" },
    { code: "TE", name: "తెలుగు (Telugu)" },
    { code: "MR", name: "मराठी (Marathi)" },
    { code: "BN", name: "বাংলা (Bengali)" },
    { code: "GU", name: "ગુજરાતી (Gujarati)" }
  ];

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "nearby", label: "Route & Budget Planner", isSpecial: true },
    { id: "map", label: "Explore Places" },
    { id: "temples", label: "Temples" },
    { id: "mountains", label: "Mountains" },
    { id: "routes", label: "Routes" },
    { id: "my_yatra", label: "My Yatra" }
  ];

  const handleNavClick = (viewId) => {
    // Unify planner directly into the Integrated Route & Budget Planner
    const target = viewId === "planner" ? "nearby" : viewId;
    setActiveView(target);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="ty-navbar">
      <div className="ty-nav-container">
        {/* Brand Mark */}
        <div
          className="ty-brand"
          onClick={() => handleNavClick("home")}
          role="button"
          tabIndex={0}
          title="Journey to Bharat — Discover. Explore. Experience."
          style={{ flexShrink: 0, minWidth: "max-content", whiteSpace: "nowrap" }}
        >
          {/* Transparent Emblem PNG */}
          <motion.div
            className="ty-brand-icon-wrapper"
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
              flexShrink: 0
            }}
          >
            <img
              src="/images/journey_to_bharat_emblem.png"
              alt="Journey to Bharat"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 0 12px rgba(212, 175, 55, 0.35))"
              }}
            />
          </motion.div>

          <div
            className="ty-brand-text"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexShrink: 0,
              whiteSpace: "nowrap"
            }}
          >
            <span
              className="ty-brand-title"
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                fontSize: "17px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                color: "#fff9e6",
                whiteSpace: "nowrap",
                lineHeight: "1.15"
              }}
            >
              Journey to Bharat
            </span>
            <span
              className="ty-brand-subtitle"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "9px",
                fontWeight: "600",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#d4af37",
                whiteSpace: "nowrap",
                lineHeight: "1.2",
                marginTop: "2px"
              }}
            >
              Discover • Explore • Experience
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="ty-nav-links" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                className={`ty-nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(link.id)}
                style={{ position: "relative" }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="ty-navbar-active-pill"
                    className="ty-nav-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "14%",
                      right: "14%",
                      height: "3px",
                      background: "linear-gradient(90deg, #d4af37 0%, #ffeaa7 50%, #d4af37 100%)",
                      borderRadius: "3px",
                      boxShadow: "0 0 12px rgba(212, 175, 55, 0.8), 0 0 20px rgba(212, 175, 55, 0.4)",
                      zIndex: 1
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Starting Location, Language Selector & Saved Favourites Counter */}
        <div className="ty-nav-actions">
          {/* Starting Location Trigger Pill */}
          {startingLocation?.isGpsVerified || startingLocation?.type === "gps" ? (
            <button
              className="ty-nav-origin-btn ty-nav-origin-gps"
              onClick={onOpenLocationSelector}
              title={`GPS Location: ${startingLocation?.name}. Click to switch origin or search cities.`}
            >
              <Navigation size={13} className="text-emerald-400 flex-shrink-0" />
              <span className="ty-nav-origin-text">
                GPS: <strong className="ty-nav-origin-strong text-emerald-300">{startingLocation?.city || startingLocation?.name || "Detected City"}</strong>
              </span>
              <span className="ty-origin-mode-badge gps">LIVE GPS</span>
              <ChevronDown size={11} className="ty-origin-chevron" />
            </button>
          ) : startingLocation?.id === "hub_varanasi" || startingLocation?.city === "Varanasi" || startingLocation?.name?.toLowerCase().includes("varanasi") ? (
            <button
              className="ty-nav-origin-btn ty-nav-origin-sacred"
              onClick={onOpenLocationSelector}
              title="Sacred Origin: Varanasi, Uttar Pradesh (Kashi Vishwanath Corridor). Click to switch to GPS or another city."
            >
              <Sparkles size={13} className="text-amber-400 flex-shrink-0" />
              <span className="ty-nav-origin-text">
                Origin: <strong className="ty-nav-origin-strong text-amber-300">Varanasi (Kashi)</strong>
              </span>
              <span className="ty-origin-mode-badge sacred">SACRED ORIGIN</span>
              <ChevronDown size={11} className="ty-origin-chevron" />
            </button>
          ) : (
            <button
              className="ty-nav-origin-btn"
              onClick={onOpenLocationSelector}
              title={`Journey Origin: ${startingLocation?.name || "Varanasi"}. Click to change starting location.`}
            >
              <MapPin size={13} className="text-amber-400 flex-shrink-0" />
              <span className="ty-nav-origin-text">
                Origin: <strong className="ty-nav-origin-strong">{startingLocation?.city || startingLocation?.name?.split(" ")[0] || "Origin"}</strong>
              </span>
              <ChevronDown size={11} className="ty-origin-chevron" />
            </button>
          )}

          {/* Quick "Near Me" Button */}
          <button
            className="ty-nav-near-me-btn"
            onClick={onOpenLocationSelector}
            title="Detect My Location & Find Nearby Shrines"
          >
            <Navigation size={13} className="text-amber-300 flex-shrink-0" />
            <span className="hidden sm:inline">Near Me</span>
          </button>

          {/* Language Selector */}
          <div className="ty-lang-dropdown-wrapper">
            <button
              className="ty-lang-btn"
              onClick={() => setLanguageOpen(!languageOpen)}
              title="Select Language"
              aria-expanded={languageOpen}
            >
              <Globe size={14} className="ty-lang-icon" />
              <span className="ty-lang-current">{currentLang}</span>
              <ChevronDown size={12} className={`ty-chevron ${languageOpen ? "rotate" : ""}`} />
            </button>

            {languageOpen && (
              <div className="ty-lang-menu">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    className={`ty-lang-option ${currentLang === l.code ? "selected" : ""}`}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLanguageOpen(false);
                    }}
                  >
                    <span className="lang-code">{l.code}</span>
                    <span className="lang-name">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Yatra Counter */}
          <button
            className="ty-bookmarks-btn"
            onClick={() => handleNavClick("my_yatra")}
            title="My Saved Yatra & Itinerary"
          >
            <Heart size={16} className={savedFavorites.length > 0 ? "text-amber-400 fill-amber-400" : ""} />
            <span className="ty-badge-count">{savedFavorites.length}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="ty-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="ty-mobile-drawer">
          <div
            className="ty-mobile-origin-row"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLocationSelector();
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-amber-400" />
              <span>
                Origin: <strong>{startingLocation?.name || "Varanasi (Kashi)"}</strong>
                {startingLocation?.isGpsVerified && <span className="ml-2 text-xs text-emerald-400 font-semibold">[GPS]</span>}
              </span>
            </div>
            <span className="ty-mobile-change-link">Change</span>
          </div>

          <div className="ty-mobile-drawer-links">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  className={`ty-mobile-link ${isActive ? "active" : ""}`}
                  onClick={() => handleNavClick(link.id)}
                >
                  <span>{link.label}</span>
                  {link.id === "my_yatra" && savedFavorites.length > 0 && (
                    <span className="ty-mobile-count">{savedFavorites.length}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ty-mobile-drawer-footer">
            <span className="ty-blessing-text">हर हर महादेव • जय श्री राम • जय माता दी</span>
          </div>
        </div>
      )}
    </header>
  );
}

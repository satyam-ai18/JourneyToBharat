import React, { useState } from "react";
import {
  FEATURED_CIRCUITS
} from "../data/tirthData";
import {
  ROUTES_REGISTRY
} from "../data/multiRoutes.js";
import {
  Route as RouteIcon,
  Compass,
  ArrowRight,
  Car,
  Train,
  Calculator,
  Ruler,
  CheckCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { handleImgError, DEFAULT_HERO_FALLBACK, DEFAULT_TEMPLE_FALLBACK } from "../utils/imageFallback";

export default function RoutesView({
  onSelectCircuit,
  onExploreOnMap,
  onOpenComparator,
  onOpenBudget,
  onOpenLegDistances,
  onOpenVerification,
  activeRouteId,
  setActiveRouteId,
  routeMetrics
}) {
  const [activeTab, setActiveTab] = useState("circuits"); // "circuits" or "multiroutes"
  const multiRoutesList = Object.values(ROUTES_REGISTRY);

  return (
    <div className="ty-routes-view">
      {/* Editorial Header */}
      <section className="ty-state-hero-banner">
        <div className="ty-state-hero-bg">
          <img
            src="/images/hero_kedarnath.jpg"
            alt="Pilgrimage Circuits"
            className="ty-state-hero-img"
            onError={(e) => handleImgError(e, DEFAULT_HERO_FALLBACK)}
          />
          <div className="ty-state-hero-overlay" />
        </div>

        <div className="ty-state-hero-content">
          <div className="ty-hero-badge mb-2">
            <span className="ty-badge-star">✦</span>
            <span className="ty-badge-text">Pilgrimage Circuits & Road Journeys</span>
            <span className="ty-badge-star">✦</span>
          </div>
          <h1 className="ty-state-hero-title">
            Curated Routes & Travel Corridors
          </h1>
          <p className="ty-state-hero-subtitle">
            Flagship pilgrimage circuits and verified multi-modal road & rail transit corridors across India
          </p>

          {/* Quick Actions Row */}
          <div className="ty-routes-quick-actions">
            <button
              className="ty-routes-action-btn"
              onClick={onOpenComparator}
            >
              <Ruler size={15} />
              <span>Route Comparator</span>
            </button>
            <button
              className="ty-routes-action-btn"
              onClick={onOpenBudget}
            >
              <Calculator size={15} />
              <span>Trip Budget Calculator</span>
            </button>
            <button
              className="ty-routes-action-btn"
              onClick={onOpenLegDistances}
            >
              <Car size={15} />
              <span>Turn-by-Turn Leg Distances</span>
            </button>
            <button
              className="ty-routes-action-btn"
              onClick={onOpenVerification}
            >
              <ShieldCheck size={15} />
              <span>Official IRCTC Sources</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="ty-state-content-section">
        <div className="ty-container">
          {/* Sub Navigation Tabs */}
          <div className="ty-state-tabs-ribbon mb-6">
            <button
              className={`ty-state-tab-btn ${activeTab === "circuits" ? "active" : ""}`}
              onClick={() => setActiveTab("circuits")}
            >
              Flagship Pilgrimage Circuits (4)
            </button>
            <button
              className={`ty-state-tab-btn ${activeTab === "multiroutes" ? "active" : ""}`}
              onClick={() => setActiveTab("multiroutes")}
            >
              Subcontinental Regional Networks (Routes A–H)
            </button>
          </div>

          {/* TAB 1: 4 FLAGSHIP PILGRIMAGE CIRCUITS */}
          {activeTab === "circuits" && (
            <div className="ty-circuits-large-grid">
              {FEATURED_CIRCUITS.map((circuit) => (
                <div
                  key={circuit.id}
                  className="ty-circuit-card large"
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
                    <p className="ty-circuit-desc">{circuit.description}</p>
                    <p className="ty-circuit-distance">
                      {circuit.stopsCount} • {circuit.distance} • {circuit.duration}
                    </p>
                    <button className="ty-circuit-btn">
                      <span>View Circuit Details</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 8 SUBCONTINENTAL REGIONAL NETWORKS (A through H) */}
          {activeTab === "multiroutes" && (
            <div className="ty-multiroutes-list">
              {multiRoutesList.map((route) => {
                const isSelected = activeRouteId === route.id;
                return (
                  <div
                    key={route.id}
                    className={`ty-multiroute-row-card ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setActiveRouteId(route.id);
                      onExploreOnMap();
                    }}
                  >
                    <div className="ty-multiroute-left">
                      <div
                        className="ty-route-key-badge"
                        style={{ background: route.color || "#d4af37" }}
                      >
                        {route.key}
                      </div>
                      <div className="ty-multiroute-info">
                        <h4 className="ty-multiroute-name">{route.name}</h4>
                        <p className="ty-multiroute-corridor">{route.corridor}</p>
                        <span className="ty-multiroute-stops-count">
                          {route.stopIds?.length || 0} Verified Stops
                        </span>
                      </div>
                    </div>

                    <div className="ty-multiroute-actions">
                      <button className="ty-multiroute-view-btn">
                        <span>Plot on Map</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

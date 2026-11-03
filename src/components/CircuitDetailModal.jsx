import React from "react";
import {
  X,
  Compass,
  MapPin,
  Clock,
  Car,
  CheckCircle,
  ArrowRight,
  Navigation
} from "lucide-react";
import { handleImgError, DEFAULT_TEMPLE_FALLBACK } from "../utils/imageFallback";

export default function CircuitDetailModal({
  circuit,
  onClose,
  onExploreOnMap
}) {
  if (!circuit) return null;

  return (
    <div className="ty-modal-backdrop" onClick={onClose}>
      <div
        className="ty-detail-modal ty-circuit-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ty-modal-hero">
          <img
            src={circuit.image}
            alt={circuit.title}
            className="ty-modal-hero-img"
            onError={handleImgError}
          />
          <div className="ty-modal-hero-overlay" />

          <div className="ty-modal-hero-topbar">
            <span className="ty-modal-badge" style={{ background: circuit.color }}>
              Pilgrimage Circuit
            </span>
            <button
              className="ty-modal-close-btn"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="ty-modal-hero-text">
            <span className="ty-circuit-modal-sub">{circuit.subtitle}</span>
            <h2 className="ty-modal-title">{circuit.title}</h2>
            <div className="ty-modal-location-row">
              <Compass size={14} className="text-amber-400" />
              <span>{circuit.stopsCount}</span>
              <span className="bullet">•</span>
              <span>{circuit.distance}</span>
              <span className="bullet">•</span>
              <span>{circuit.duration}</span>
            </div>
          </div>
        </div>

        <div className="ty-modal-body">
          <p className="ty-modal-editorial-desc">{circuit.description}</p>

          <h3 className="ty-circuit-stops-heading">
            Sacred Stops in this Divine Circuit
          </h3>

          <div className="ty-circuit-stops-grid">
            {circuit.highlights.map((stop, i) => (
              <div key={i} className="ty-circuit-stop-card">
                <div className="ty-stop-number">{i + 1}</div>
                <div className="ty-stop-info">
                  <span className="ty-stop-name">{stop}</span>
                  <span className="ty-stop-sub">Sacred Pilgrimage Dhaam</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ty-circuit-travel-advice">
            <h4 className="font-semibold text-amber-900 mb-1">
              Pilgrim Travel Advisory
            </h4>
            <p className="text-sm text-gray-700">
              For high-altitude Himalayan sectors (Kedarnath/Badrinath), travel
              during May–June or September–October. Pre-book biometric e-passes
              and accommodation well in advance.
            </p>
          </div>
        </div>

        <div className="ty-modal-footer">
          <button
            className="ty-modal-directions-btn"
            onClick={onClose}
          >
            <span>Close</span>
          </button>

          <button
            className="ty-modal-save-btn"
            onClick={() => {
              onClose();
              onExploreOnMap();
            }}
          >
            <Compass size={15} />
            <span>Explore Circuit on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
}

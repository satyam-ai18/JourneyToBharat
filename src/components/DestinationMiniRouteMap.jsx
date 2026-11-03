import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, ExternalLink, Maximize2 } from "lucide-react";

export default function DestinationMiniRouteMap({
  destination,
  startingLocation,
  routeData,
  onExpandToFullMap
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !destination) return;

    const destLat = destination.lat;
    const destLng = destination.lng;
    const originLat = startingLocation?.lat || 28.6139;
    const originLng = startingLocation?.lng || 77.2090;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [(originLat + destLat) / 2, (originLng + destLng) / 2],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false
    });
    mapInstanceRef.current = map;

    // Clean Google Maps Roadmap Tile layer
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 19,
      attribution: "&copy; Google Maps"
    }).addTo(map);

    // 1. Origin Marker
    const originIcon = L.divIcon({
      className: "custom-mini-origin-marker",
      html: `
        <div style="
          background: #064e3b;
          color: #fef3c7;
          padding: 4px 9px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 700;
          font-size: 11px;
          border: 1.5px solid #d4af37;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          white-space: nowrap;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#d4af37" stroke="#064e3b" stroke-width="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <span>Origin: ${startingLocation?.city || startingLocation?.name?.split(" ")[0] || "Origin"}</span>
        </div>
      `,
      iconSize: [110, 24],
      iconAnchor: [55, 12]
    });

    const originMarker = L.marker([originLat, originLng], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 2px;">
        <strong style="color: #064e3b;">Starting Point</strong><br/>
        ${startingLocation?.name || "Selected Journey Origin"}
      </div>
    `);

    // 2. Destination Marker
    const destIcon = L.divIcon({
      className: "custom-mini-dest-marker",
      html: `
        <div style="
          background: #d97706;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 800;
          font-size: 11px;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(217,119,6,0.6);
          white-space: nowrap;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l7 7v13H5V9z"/><path d="M12 2v20"/><circle cx="12" cy="7" r="1"/></svg>
          <span>${destination.name}</span>
        </div>
      `,
      iconSize: [130, 26],
      iconAnchor: [65, 13]
    });

    const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 2px;">
        <strong style="color: #b45309;">${destination.name}</strong><br/>
        <span>${destination.location}</span>
      </div>
    `);

    // 3. Connect Origin and Destination with Route Line
    const corridorLine = L.polyline(
      [
        [originLat, originLng],
        [destLat, destLng]
      ],
      {
        color: "#d97706",
        weight: 3.5,
        opacity: 0.85,
        dashArray: "6, 8"
      }
    ).addTo(map);

    // Fit map bounds to show both origin and destination cleanly
    try {
      const bounds = L.latLngBounds([
        [originLat, originLng],
        [destLat, destLng]
      ]);
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 10
      });
    } catch (e) {
      // Fallback
    }

    // Invalidate size on resize or modal tab switch
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination, startingLocation]);

  return (
    <div className="ty-mini-route-map-container">
      {/* Top Banner on Map */}
      <div className="ty-mini-map-banner">
        <div className="ty-mini-map-meta">
          <span className="ty-mini-route-label">
            {startingLocation?.city || "Origin"} ➔ {destination.name}
          </span>
          <span className="ty-mini-route-stats">
            <strong>~{routeData?.distanceKm || "--"} km</strong> • {routeData?.durationText || "--"}
          </span>
        </div>

        <div className="ty-mini-map-btns">
          <a
            href={routeData?.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ty-mini-nav-btn"
            title="Open Google Maps Navigation"
          >
            <Navigation size={12} />
            <span>Google Nav</span>
            <ExternalLink size={10} />
          </a>

          {onExpandToFullMap && (
            <button
              className="ty-mini-expand-btn"
              onClick={onExpandToFullMap}
              title="Open in full Interactive Map Explorer"
            >
              <Maximize2 size={12} />
              <span>Full Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Map DOM Target */}
      <div
        ref={mapContainerRef}
        className="ty-mini-route-map-canvas"
        style={{ width: "100%", height: "240px", borderRadius: "10px" }}
      />
    </div>
  );
}

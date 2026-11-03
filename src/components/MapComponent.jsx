import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { compareRoutes } from "../utils/geoUtils";
import { ROUTES_REGISTRY, getRouteStopsList } from "../data/multiRoutes.js";
import {
  calculateHaversineKm,
  computeTopographicalRoadKm,
  formatDuration,
  isGhatOrHillTerrain
} from "../services/distanceService";

// Fix default leaflet marker icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Custom SVG map marker creators with category styling
const createCustomIcon = (type, label, color = "#3b82f6") => {
  let iconSvg = "";
  if (type === "station") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`;
  } else if (type === "bus") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><rect width="20" height="15" x="2" y="4" rx="2"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>`;
  } else if (type === "temple") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 7v13H5V9z"/><path d="M12 2v20"/><path d="M9 22V12h6v10"/><circle cx="12" cy="7" r="1"/></svg>`;
  } else if (type === "heritage" || type === "fort") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l3-3 3 3v14"/><path d="M13 21V7l3-3 3 3v14"/><path d="M9 11h2"/><path d="M17 11h2"/><path d="M9 15h2"/><path d="M17 15h2"/></svg>`;
  } else if (type === "waterfall" || type === "nature") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><circle cx="17" cy="6" r="2"/></svg>`;
  } else if (type === "ghat") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18c3-3 6 3 9 0 3-3 6 3 9 0"/><path d="M2 12c3-3 6 3 9 0 3-3 6 3 9 0"/><path d="M4 6h16"/></svg>`;
  } else if (type === "destination") {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
  }

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        cursor: pointer;
      ">
        ${iconSvg}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16]
  });
};

// Numbered Stop Pin for Active Route (1, 2, 3...)
const createNumberedStopIcon = (stopNumber, color = "#f59e0b", isDetour = false) => {
  const bgColor = isDetour ? "#ec4899" : color;
  return L.divIcon({
    className: "custom-numbered-pin",
    html: `
      <div style="
        background: ${bgColor};
        color: #ffffff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.65);
        cursor: pointer;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      ">
        ${stopNumber}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
};

// Distinctive Ornate Origin Pin (Customized for GPS vs Varanasi vs General Hub)
const createOriginIcon = (name, isGps = false, isVaranasi = false) => {
  if (isGps) {
    return L.divIcon({
      className: "custom-origin-marker gps",
      html: `
        <div style="
          background: #065f46;
          color: #ecfdf5;
          padding: 5px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 11px;
          border: 2px solid #34d399;
          box-shadow: 0 0 16px rgba(52, 211, 153, 0.7);
          cursor: pointer;
          white-space: nowrap;
        ">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
          <span>GPS: ${name || "My Location"}</span>
        </div>
      `,
      iconSize: [140, 30],
      iconAnchor: [70, 15],
      popupAnchor: [0, -16]
    });
  }

  if (isVaranasi) {
    return L.divIcon({
      className: "custom-origin-marker varanasi",
      html: `
        <div style="
          background: linear-gradient(135deg, #78350f 0%, #451a03 100%);
          color: #fef3c7;
          padding: 5px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 11px;
          border: 2px solid #f59e0b;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.6);
          cursor: pointer;
          white-space: nowrap;
          gap: 6px;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M12 2v20M2 12h20M7 7l10 10M17 7 7 17"/></svg>
          <span>Origin: Varanasi (Kashi)</span>
        </div>
      `,
      iconSize: [160, 30],
      iconAnchor: [80, 15],
      popupAnchor: [0, -16]
    });
  }

  return L.divIcon({
    className: "custom-origin-marker",
    html: `
      <div style="
        background: #064e3b;
        color: #fef3c7;
        padding: 5px 11px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 700;
        font-size: 11px;
        border: 2px solid #d4af37;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.65);
        cursor: pointer;
        white-space: nowrap;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#d4af37" stroke="#064e3b" stroke-width="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        <span>Origin: ${name || "Starting Point"}</span>
      </div>
    `,
    iconSize: [140, 30],
    iconAnchor: [70, 15],
    popupAnchor: [0, -16]
  });
};

export default function MapComponent({
  selectedItem,
  onSelectItem,
  activeLayers,
  selectedStationFilter, // "all" | "5" | "10" | "25" | "50"
  selectedTileLayer,
  setSelectedTileLayer,
  measureMode,
  setMeasureMode,
  onMeasureResult,
  destinations = [],
  stations = [],
  attractions = [],
  busTerminals = [],
  rentals = [],
  routeCorridors = {},
  customRoutePoints = null,
  customRoutePolyline = null,
  activeRoute = null,
  routeStops = [],
  showAllRoutes = false,
  setShowAllRoutes = null,
  startingLocation = null,
  onToggleTripStop = null,
  activeTripStops = [],
  onOpenDetail = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(5);
  const layerGroupsRef = useRef({
    origin: null,
    destinations: null,
    routePins: null,
    allRoutes: null,
    stations: null,
    attractions: null,
    busTerminals: null,
    rentals: null,
    grandLoop: null,
    railCorridors: null,
    busCorridors: null,
    scenicRoads: null,
    walkingTrails: null,
    measure: null
  });
  const tileLayerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const measurePointsRef = useRef([]);

  // Supported Google Maps and OSM Tile Layers
  const TILE_LAYERS = {
    googleRoadmap: {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps'
    },
    googleHybrid: {
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps Hybrid'
    },
    googleTerrain: {
      url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps Terrain'
    },
    googleSatellite: {
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attribution: '&copy; Google Maps Satellite'
    },
    osm: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const defaultCenter = activeRoute?.defaultCenter || [22.5, 79.5];
    const defaultZoom = activeRoute?.defaultZoom || 5;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Track current zoom for zoom-dependent layer decluttering
    map.on("zoomend", () => {
      if (map) setCurrentZoom(map.getZoom());
    });

    // Initial Tile Layer
    const tileConfig = TILE_LAYERS[selectedTileLayer] || TILE_LAYERS.googleRoadmap;
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19
    }).addTo(map);

    // Initialize Layer Groups
    Object.keys(layerGroupsRef.current).forEach(key => {
      layerGroupsRef.current[key] = L.layerGroup().addTo(map);
    });

    // Invalidate map size
    const triggerInvalidate = () => {
      if (map) map.invalidateSize();
    };
    setTimeout(triggerInvalidate, 100);
    setTimeout(triggerInvalidate, 350);
    setTimeout(triggerInvalidate, 800);

    const resizeObserver = new ResizeObserver(() => {
      triggerInvalidate();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Map click listener for distance measuring
    map.on("click", (e) => {
      if (!measureMode) return;
      const { lat, lng } = e.latlng;
      const newPoint = { lat, lng, name: `Pin ${measurePointsRef.current.length + 1}` };
      measurePointsRef.current.push(newPoint);

      if (measurePointsRef.current.length === 1) {
        layerGroupsRef.current.measure.clearLayers();
        const marker = L.marker([lat, lng], {
          icon: createCustomIcon("point", "A", "#10b981")
        }).addTo(layerGroupsRef.current.measure);
        marker.bindPopup("<b>Point A (Origin)</b><br/>Click second location on map to measure").openPopup();
      } else if (measurePointsRef.current.length === 2) {
        const p1 = measurePointsRef.current[0];
        const p2 = measurePointsRef.current[1];

        L.marker([lat, lng], {
          icon: createCustomIcon("point", "B", "#ef4444")
        }).addTo(layerGroupsRef.current.measure);

        const polyline = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
          color: "#f59e0b",
          weight: 4,
          dashArray: "6, 8"
        }).addTo(layerGroupsRef.current.measure);

        map.fitBounds(polyline.getBounds(), { padding: [60, 60] });

        const comparison = compareRoutes(p1, p2);
        if (onMeasureResult) {
          onMeasureResult({ p1, p2, comparison });
        }

        measurePointsRef.current = [];
      }
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Update Tile Layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConfig = TILE_LAYERS[selectedTileLayer] || TILE_LAYERS.googleRoadmap;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
  }, [selectedTileLayer]);

  // Adjust center/zoom when active route changes
  useEffect(() => {
    if (!mapInstanceRef.current || !activeRoute) return;
    if (activeRoute.defaultCenter && activeRoute.defaultZoom) {
      mapInstanceRef.current.flyTo(activeRoute.defaultCenter, activeRoute.defaultZoom, {
        duration: 1.0
      });
    }
  }, [activeRoute?.id]);

  // Render Markers and Polylines (With Zoom-Aware Overcrowding Control)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const getGroup = (key) => {
      if (!mapInstanceRef.current) return null;
      if (!layerGroupsRef.current[key]) {
        layerGroupsRef.current[key] = L.layerGroup().addTo(mapInstanceRef.current);
      }
      return layerGroupsRef.current[key];
    };

    // 0. Journey Starting Origin Pin & Connecting Route Line
    const originGroup = getGroup("origin");
    if (originGroup) {
      originGroup.clearLayers();
      if (startingLocation && startingLocation.lat && startingLocation.lng) {
        const isGps = Boolean(startingLocation.isGpsVerified || startingLocation.type === "gps");
        const isVaranasi = Boolean(!isGps && (startingLocation.id === "hub_varanasi" || startingLocation.city === "Varanasi" || startingLocation.name?.toLowerCase().includes("varanasi")));

        const originMarker = L.marker([startingLocation.lat, startingLocation.lng], {
          icon: createOriginIcon(startingLocation.name, isGps, isVaranasi),
          zIndexOffset: 1000
        });

        const badgeLabel = isGps
          ? "LIVE GPS DETECTED LOCATION"
          : isVaranasi
          ? "SACRED PILGRIMAGE ORIGIN (DEFAULT)"
          : "STARTING TRANSIT ORIGIN";

        originMarker.bindPopup(`
          <div style="font-family: inherit; color: #0f172a; min-width: 210px; padding: 2px;">
            <div style="font-size: 10px; font-weight: 800; color: ${isGps ? "#059669" : isVaranasi ? "#b45309" : "#0284c7"}; text-transform: uppercase; margin-bottom: 2px;">
              ${badgeLabel}
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 2px 0;">
              ${startingLocation.name}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 5px;">
              ${startingLocation.address || (isVaranasi ? "Kashi Vishwanath Corridor, Varanasi, UP" : "Verified Starting Transit Hub")}
            </div>
            <div style="font-size: 10px; color: #64748b; background: #f8fafc; padding: 4px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
              Coordinates: ${startingLocation.lat.toFixed(4)}°N, ${startingLocation.lng.toFixed(4)}°E
              ${isGps && startingLocation.accuracyMeters ? `<br/>Accuracy: ~${startingLocation.accuracyMeters} meters` : ""}
            </div>
          </div>
        `);
        originMarker.addTo(originGroup);

        // If a destination is currently selected, draw connecting dashed route line
        if (selectedItem && selectedItem.lat && selectedItem.lng &&
            (Math.abs(selectedItem.lat - startingLocation.lat) > 0.001 || Math.abs(selectedItem.lng - startingLocation.lng) > 0.001)) {
          const directLine = L.polyline([
            [startingLocation.lat, startingLocation.lng],
            [selectedItem.lat, selectedItem.lng]
          ], {
            color: "#d4af37",
            weight: 3.5,
            dashArray: "7, 9",
            opacity: 0.95
          });
          directLine.bindTooltip(`Direct Route: ${startingLocation.city || "Origin"} ➔ ${selectedItem.name}`, { sticky: true });
          directLine.addTo(originGroup);
        }
      }
    }

    // 1. Numbered Route Stops (Active Route or Multi-Stop Itinerary)
    const pinGroup = getGroup("routePins");
    if (pinGroup) {
      pinGroup.clearLayers();
      const stopsToRender = (activeTripStops && activeTripStops.length > 0)
        ? activeTripStops
        : ((routeStops && routeStops.length > 0) ? routeStops : []);

      if (stopsToRender.length > 0) {
        stopsToRender.forEach((stop, idx) => {
          const stopNumber = stop.stopIndex || (idx + 1);
          const isReturn = stop.isReturnStop;
          const pinColor = isReturn ? "#10b981" : stop.isDetour ? "#ec4899" : (activeRoute?.color || "#e11d48");
          const marker = L.marker([stop.lat, stop.lng], {
            icon: createNumberedStopIcon(stopNumber, pinColor, stop.isDetour),
            zIndexOffset: 600 + idx
          });
          marker.on("click", () => onSelectItem({ ...stop, itemType: "destination" }));
          marker.bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 220px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 800; background: ${pinColor}; color: white; padding: 2px 7px; border-radius: 10px;">Stop ${stopNumber}</span>
                <span style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700;">${stop.state || ""}</span>
              </div>
              <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0;">${stop.name}</div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${stop.city ? `${stop.city}, ` : ""}${stop.location || stop.subtitle || stop.role || ""}</div>
              ${stop.nearestStation ? `<div style="font-size: 10px; color: #1e3a8a; margin-bottom: 3px;"><b>Station:</b> ${stop.nearestStation.name} (${stop.nearestStation.code})</div>` : stop.nearestRailhead ? `<div style="font-size: 10px; color: #3b82f6; margin-bottom: 3px;"><b>Station:</b> ${stop.nearestRailhead}</div>` : ""}
              ${stop.trekNote ? `<div style="font-size: 10px; color: #b45309; background: #fffbeb; padding: 3px 6px; border-radius: 4px; margin-bottom: 4px;"><b>Trek Note:</b> ${stop.trekNote}</div>` : ""}
            </div>
          `);
          marker.addTo(pinGroup);
        });
      }
    }

    // 2. All Destinations Markers (Category-Styled Pins + Informative Interactive Popups)
    const destGroup = getGroup("destinations");
    if (destGroup) {
      destGroup.clearLayers();
      if (activeLayers.destinations && destinations.length > 0) {
        const tripStopIds = new Set((activeTripStops || []).map(s => s.id));
        const renderedRouteStopIds = new Set((routeStops || []).map(s => s.id));

        destinations.forEach((dest) => {
          if (!dest.lat || !dest.lng) return;
          // If already rendered prominently as a numbered route stop pin, skip standard pin
          if (tripStopIds.has(dest.id) || renderedRouteStopIds.has(dest.id)) return;

          // Category styling
          let iconType = "temple";
          let destColor = "#f59e0b";
          const cat = dest.category || (dest.categories && dest.categories[0]) || "";
          
          if (cat === "jyotirlingas") {
            iconType = "temple";
            destColor = "#d4af37";
          } else if (cat === "shaktipeeths") {
            iconType = "temple";
            destColor = "#e11d48";
          } else if (cat === "chardham") {
            iconType = "temple";
            destColor = "#2563eb";
          } else if (cat === "mountains") {
            iconType = "nature";
            destColor = "#10b981";
          } else if (cat === "heritage_history") {
            iconType = "heritage";
            destColor = "#7c3aed";
          } else if (cat === "lakes_waterfalls" || cat === "beaches_coastal") {
            iconType = "ghat";
            destColor = "#06b6d4";
          }

          // Distance calculation from active starting location
          const oLat = startingLocation?.lat || 25.3176;
          const oLng = startingLocation?.lng || 82.9739;
          const straightKm = Math.round(calculateHaversineKm(oLat, oLng, dest.lat, dest.lng) * 10) / 10;
          const isGhat = isGhatOrHillTerrain(dest.lat, dest.lng);
          const roadKm = computeTopographicalRoadKm(straightKm, isGhat);
          const speed = isGhat ? 32 : roadKm > 400 ? 60 : 50;
          const duration = formatDuration(Math.round((roadKm / speed) * 60));

          const isInTrip = tripStopIds.has(dest.id);
          const marker = L.marker([dest.lat, dest.lng], {
            icon: createCustomIcon(iconType, dest.name, destColor)
          });

          marker.on("click", () => onSelectItem({ ...dest, itemType: "destination" }));

          const stationInfo = dest.nearestStation ? `
            <div style="font-size: 11px; color: #1e3a8a; margin-top: 4px; padding: 4px 6px; background: #eff6ff; border-radius: 4px;">
              <b>Nearest Station:</b> ${dest.nearestStation.name} (${dest.nearestStation.code}) • ~${dest.nearestStation.distanceKm} km away<br/>
              <span style="font-size: 10px; color: #64748b;">${dest.nearestStation.transferOptions || "Autos and taxis available"}</span>
            </div>
          ` : "";

          const trekNotice = dest.trekNote ? `
            <div style="font-size: 10px; color: #b45309; background: #fffbeb; padding: 4px 6px; border-radius: 4px; margin-top: 4px; border-left: 3px solid #f59e0b;">
              <b>Trek Section:</b> ${dest.trekNote}
            </div>
          ` : "";

          marker.bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 240px; max-width: 290px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 10px; font-weight: 800; background: ${destColor}; color: white; padding: 2px 7px; border-radius: 8px;">
                  ${dest.badge || dest.categoryLabel || "Sacred Destination"}
                </span>
                <span style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700;">${dest.state}</span>
              </div>
              <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0;">${dest.name}</div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 5px;">${dest.location || dest.state} ${dest.altitude ? `• Elevation: ${dest.altitude}` : ""}</div>
              ${dest.deity ? `<div style="font-size: 11px; color: #d97706; font-weight: 600; margin-bottom: 4px;"><b>Deity:</b> ${dest.deity}</div>` : ""}
              
              <div style="font-size: 11px; color: #059669; font-weight: 600; margin: 4px 0; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
                <b>Road distance:</b> ~${roadKm} km (est. ${duration})<br/>
                <span style="font-size: 10px; color: #64748b;">Straight-line: ${straightKm} km from ${startingLocation?.city || "Varanasi"}</span>
              </div>

              ${stationInfo}
              ${trekNotice}

              <div style="display: flex; gap: 6px; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                <button class="ty-popup-trip-btn" style="flex: 1; padding: 5px 8px; font-size: 11px; font-weight: 700; background: ${isInTrip ? '#059669' : '#064e3b'}; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  ${isInTrip ? "✓ In Trip" : "+ Add to Trip"}
                </button>
                <button class="ty-popup-detail-btn" style="padding: 5px 8px; font-size: 11px; font-weight: 700; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer;">
                  Details
                </button>
                <a href="https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dest.lat},${dest.lng}" target="_blank" rel="noopener noreferrer" style="padding: 5px 8px; font-size: 11px; font-weight: 700; background: #f1f5f9; color: #2563eb; border: 1px solid #cbd5e1; border-radius: 4px; text-decoration: none; display: flex; align-items: center;">
                  Maps
                </a>
              </div>
            </div>
          `);

          marker.on("popupopen", () => {
            const popupEl = marker.getPopup()?.getElement();
            if (!popupEl) return;
            const tripBtn = popupEl.querySelector(".ty-popup-trip-btn");
            if (tripBtn && onToggleTripStop) {
              tripBtn.onclick = (e) => {
                e.stopPropagation();
                onToggleTripStop(dest);
              };
            }
            const detailBtn = popupEl.querySelector(".ty-popup-detail-btn");
            if (detailBtn && onOpenDetail) {
              detailBtn.onclick = (e) => {
                e.stopPropagation();
                onOpenDetail(dest);
              };
            }
          });

          marker.addTo(destGroup);
        });
      }
    }

    // 3. Railway Stations Markers (Zoom-Aware to prevent clutter)
    const stationGroup = getGroup("stations");
    if (stationGroup) {
      stationGroup.clearLayers();
      if (activeLayers.stations && stations.length > 0 && currentZoom >= 7) {
        stations.forEach(station => {
          // At zoom 7-9: show only major junctions. At zoom >= 10: show all matching radius filter
          const isMajor = station.category?.includes("Major") || station.category?.includes("Junction") ||
            ["BSB", "PRYJ", "JBP", "BPL", "UJN", "INDB", "NK", "MTJ", "JP", "TPTY", "MAS", "MDU", "ERS", "SBC", "DDU"].includes(station.code);
          if (currentZoom < 10 && !isMajor) return;

          // Radius filter logic
          if (selectedStationFilter && selectedStationFilter !== "all") {
            const maxRadius = parseInt(selectedStationFilter, 10);
            const stRadius = parseInt(station.radiusCategory || station.distanceFromCenterKm || "50", 10);
            if (stRadius > maxRadius) return;
          }

          let stationColor = "#3b82f6";
          if (isMajor) stationColor = "#1d4ed8";
          if (station.category?.includes("Halt")) stationColor = "#06b6d4";

          const marker = L.marker([station.lat, station.lng], {
            icon: createCustomIcon("station", station.code, stationColor)
          });
          marker.on("click", () => onSelectItem({ ...station, itemType: "station" }));
          marker.bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 190px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: ${stationColor}; color: white; font-weight: 800; font-size: 11px; padding: 2px 6px; border-radius: 4px;">${station.code}</span>
                <span style="font-size: 10px; color: #64748b; font-weight: 600;">${station.zone || ""}</span>
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${station.name}</div>
              <div style="font-size: 11px; color: #475569; margin: 3px 0;"><b>Dest:</b> ${station.destinationName || ""} (${station.distanceFromCenterKm || ""} km)</div>
              <div style="font-size: 10px; color: #16a34a; font-weight: 600;">✔ Verified Station</div>
            </div>
          `);
          marker.addTo(stationGroup);
        });
      }
    }

    // 4. Attractions Markers (Revealed when zoomed into a city / cluster at zoom >= 10)
    const attractionGroup = getGroup("attractions");
    if (attractionGroup) {
      attractionGroup.clearLayers();
      if (activeLayers.attractions && attractions.length > 0 && currentZoom >= 10) {
        attractions.forEach(att => {
          let attType = "temple";
          let attColor = "#f59e0b";

          if (att.category === "temple" || att.category?.includes("Jyotirlinga") || att.category?.includes("Shaktipeeth")) {
            attType = "temple";
            attColor = "#d97706";
          } else if (att.category === "nature" || att.category?.includes("Wildlife")) {
            attType = "nature";
            attColor = "#059669";
          } else if (att.category === "waterfall") {
            attType = "waterfall";
            attColor = "#0891b2";
          } else if (att.category === "heritage" || att.category?.includes("Fort") || att.category?.includes("Palace")) {
            attType = "heritage";
            attColor = "#7c3aed";
          } else if (att.category === "ghat") {
            attType = "ghat";
            attColor = "#0284c7";
          }

          const marker = L.marker([att.lat, att.lng], {
            icon: createCustomIcon(attType, (att.name || "").split(" ")[0], attColor)
          });
          marker.on("click", () => onSelectItem({ ...att, itemType: "attraction" }));
          marker.bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 210px;">
              <div style="font-size: 10px; text-transform: uppercase; color: ${attColor}; font-weight: 800;">${att.category} • ${att.state}</div>
              <div style="font-size: 14px; font-weight: 800; margin: 2px 0;">${att.name}</div>
              <div style="font-size: 11px; color: #334155; margin: 4px 0;"><b>Nearest Rail:</b> ${att.practicalRailhead || "Verified Railhead"} (${att.distanceFromRailheadKm || ""} km)</div>
              <div style="font-size: 10px; color: #64748b; line-height: 1.4;">${(att.description || "").slice(0, 95)}...</div>
            </div>
          `);
          marker.addTo(attractionGroup);
        });
      }
    }

    // 5. Bus Terminals Markers (Revealed at zoom >= 9)
    const busGroup = getGroup("busTerminals");
    if (busGroup) {
      busGroup.clearLayers();
      if (activeLayers.busCorridors && busTerminals.length > 0 && currentZoom >= 9) {
        busTerminals.forEach(bt => {
          const marker = L.marker([bt.lat, bt.lng], {
            icon: createCustomIcon("bus", "Bus", "#e11d48")
          });
          marker.on("click", () => onSelectItem({ ...bt, itemType: "bus" }));
          marker.bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 200px;">
              <div style="font-size: 10px; font-weight: 800; color: #e11d48; text-transform: uppercase;">${bt.operator || "State Bus Terminal"}</div>
              <div style="font-size: 13px; font-weight: 800;">${bt.name}</div>
              <div style="font-size: 11px; color: #475569; margin: 3px 0;"><b>City:</b> ${bt.destinationName} (${bt.state})</div>
              <div style="font-size: 10px; color: #64748b;">${bt.lastMileNote || ""}</div>
            </div>
          `);
          marker.addTo(busGroup);
        });
      }
    }

    // 6. Active Highway Route Corridor Polyline (Real Google road polyline or canonical loop)
    const loopGroup = getGroup("grandLoop");
    if (loopGroup) {
      loopGroup.clearLayers();

      // High-precision road polyline from Google Routes API
      if (customRoutePolyline && customRoutePolyline.length >= 2) {
        // Luminous outer golden halo
        L.polyline(customRoutePolyline, {
          color: "rgba(212, 175, 55, 0.45)",
          weight: 8,
          lineCap: "round",
          lineJoin: "round"
        }).addTo(loopGroup);

        // Core vivid road polyline
        const roadPoly = L.polyline(customRoutePolyline, {
          color: "#10b981",
          weight: 4.5,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round"
        }).addTo(loopGroup);

        roadPoly.bindPopup(`<b>Journey from ${startingLocation?.city || "Varanasi"}</b><br/>${(activeTripStops?.length || 0)} Stops Connected`);
      } else if (activeLayers.grandLoop) {
        const pointsToUse = (routeStops && routeStops.length >= 2) ? routeStops : (customRoutePoints && customRoutePoints.length >= 2 ? customRoutePoints : null);
        if (pointsToUse && pointsToUse.length >= 2) {
          const loopCoords = pointsToUse.map(p => [p.lat, p.lng]);
          const routeColor = activeRoute?.color || "#f59e0b";
          const grandPolyline = L.polyline(loopCoords, {
            color: routeColor,
            weight: 5,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round"
          }).addTo(loopGroup);
          grandPolyline.bindPopup(`<b>${activeRoute?.name || "Active Journey Route"}</b><br/>${pointsToUse.length} Consecutive Stops`);
        }
      }
    }

    // 7. Optional "Show All Routes" Overview Mode (Subdued colors)
    const allRoutesGroup = getGroup("allRoutes");
    if (allRoutesGroup) {
      allRoutesGroup.clearLayers();
      if (showAllRoutes) {
        Object.values(ROUTES_REGISTRY).forEach(r => {
          if (r.id === activeRoute?.id) return; // already drawn prominently in grandLoop
          const stops = getRouteStopsList(r.id);
          if (stops && stops.length >= 2) {
            const coords = stops.map(s => [s.lat, s.lng]);
            const poly = L.polyline(coords, {
              color: r.color || "#94a3b8",
              weight: 3.5,
              opacity: 0.55,
              dashArray: "6, 6"
            }).addTo(allRoutesGroup);
            poly.bindPopup(`<b>${r.name}</b><br/>${stops.length} Stops`);
          }
        });
      }
    }

    // 8. Verified Indian Railways Tracks (Dashed Cyan - Visually completely distinct from road)
    const railGroup = getGroup("railCorridors");
    if (railGroup) {
      railGroup.clearLayers();
      const railLines = routeCorridors?.railways || routeCorridors?.railCorridors || [];
      if (activeLayers.railCorridors && railLines.length > 0) {
        railLines.forEach(lineData => {
          const line = L.polyline(lineData.points, {
            color: lineData.color || "#38bdf8",
            weight: 3.5,
            opacity: 0.85,
            dashArray: "6, 8"
          }).addTo(railGroup);
          line.bindPopup(`<b>Railway Mainline:</b><br/>${lineData.name}`);
        });
      }
    }

    // 9. Optional Detour Overlays
    const roadGroup = getGroup("scenicRoads");
    if (roadGroup) {
      roadGroup.clearLayers();
      const detours = routeCorridors?.optionalDetours || routeCorridors?.scenicRoads || [];
      if (activeLayers.scenicRoads && detours.length > 0) {
        detours.forEach(detour => {
          const line = L.polyline(detour.points, {
            color: detour.color || "#ec4899",
            weight: 4,
            opacity: 0.85
          }).addTo(roadGroup);
          line.bindPopup(`<b>Optional Detour Corridor:</b><br/>${detour.name}`);
        });
      }
    }

  }, [isMapReady, activeLayers, selectedStationFilter, destinations, stations, attractions, busTerminals, rentals, routeCorridors, customRoutePoints, customRoutePolyline, activeRoute, routeStops, activeTripStops, showAllRoutes, currentZoom, startingLocation, selectedItem]);

  // Auto-fit map bounds when a new journey route polyline is calculated
  useEffect(() => {
    if (!mapInstanceRef.current || !customRoutePolyline || customRoutePolyline.length < 2) return;
    try {
      const bounds = L.latLngBounds(customRoutePolyline);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    } catch (e) {
      console.warn("Could not fit route bounds", e);
    }
  }, [customRoutePolyline]);

  // Pan smoothly to selected item
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedItem) return;
    if (selectedItem.lat && selectedItem.lng) {
      mapInstanceRef.current.flyTo([selectedItem.lat, selectedItem.lng], selectedItem.zoom || 14, {
        duration: 1.2
      });
    }
  }, [selectedItem]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%", background: "#0b0f19" }} />

      {/* Floating Control Bar: Basemaps & Show All Routes */}
      <div style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
        justifyContent: "flex-end"
      }}>
        {/* "Show All Routes" Overview Mode Toggle */}
        {setShowAllRoutes && (
          <button
            onClick={() => setShowAllRoutes(!showAllRoutes)}
            style={{
              background: showAllRoutes ? "rgba(16, 185, 129, 0.3)" : "rgba(15, 23, 42, 0.9)",
              color: showAllRoutes ? "#34d399" : "#cbd5e1",
              border: showAllRoutes ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              padding: "5px 10px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.55)",
              transition: "all 0.15s ease"
            }}
            title="Toggle national overview of all 8 circuits simultaneously"
          >
            <span>{showAllRoutes ? "Showing All 8 Routes" : "Overview All 8 Routes"}</span>
          </button>
        )}

        {/* Floating Google Maps Basemap Switcher */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "4px 8px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.55)"
        }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", padding: "0 4px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
            Basemaps:
          </span>
          {[
            { id: "googleRoadmap", label: "Roadmap" },
            { id: "googleHybrid", label: "Hybrid" },
            { id: "googleTerrain", label: "Terrain" },
            { id: "googleSatellite", label: "Satellite" },
            { id: "osm", label: "OSM" }
          ].map(tile => (
            <button
              key={tile.id}
              onClick={() => setSelectedTileLayer && setSelectedTileLayer(tile.id)}
              style={{
                background: selectedTileLayer === tile.id ? "rgba(59, 130, 246, 0.35)" : "transparent",
                color: selectedTileLayer === tile.id ? "#60a5fa" : "#cbd5e1",
                border: selectedTileLayer === tile.id ? "1px solid #3b82f6" : "1px solid transparent",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: selectedTileLayer === tile.id ? "700" : "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.15s ease"
              }}
            >
              <span>{tile.icon}</span>
              <span>{tile.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Zoom-Dependent Decluttering Status Indicator */}
      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "12px",
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(8px)",
        padding: "5px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "11px",
        color: "#cbd5e1",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        pointerEvents: "none"
      }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: activeRoute?.color || "#f59e0b", boxShadow: `0 0 6px ${activeRoute?.color || "#f59e0b"}` }} />
        <span style={{ color: "#f8fafc", fontWeight: "700" }}>{activeRoute?.shortName || "Active Route"}</span>
        <span style={{ color: "#64748b" }}>•</span>
        <span>Zoom {currentZoom}: {currentZoom < 7 ? "Subcontinental View (Numbered Stops)" : currentZoom < 10 ? "Regional View (Major Junctions)" : "Local City View (All Temples, Sights & Halts Active)"}</span>
      </div>

      {/* Measure Mode Banner if active */}
      {measureMode && (
        <div style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(15, 23, 42, 0.95)",
          color: "#f8fafc",
          padding: "10px 20px",
          borderRadius: "30px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          border: "1px solid #f59e0b",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backdropFilter: "blur(8px)"
        }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: "13px", fontWeight: "600" }}>Distance Ruler Active: Click any two points on the map to compare distances</span>
          <button
            onClick={() => {
              setMeasureMode(false);
              measurePointsRef.current = [];
              if (layerGroupsRef.current.measure) layerGroupsRef.current.measure.clearLayers();
            }}
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "4px 10px",
              borderRadius: "15px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

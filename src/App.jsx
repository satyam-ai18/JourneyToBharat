import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Master Editorial Navigation & Landing View
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import GlobalAmbientBackground from "./components/GlobalAmbientBackground";
import AiScreenNarrator from "./components/AiScreenNarrator";

// Lazy-Loaded Heavy Views for Instant Initial Page Load
const MapExplorerView = lazy(() => import("./components/MapExplorerView"));
const DestinationDetailModal = lazy(() => import("./components/DestinationDetailModal"));
const CircuitDetailModal = lazy(() => import("./components/CircuitDetailModal"));
const MyYatraView = lazy(() => import("./components/MyYatraView"));
const DirectoryView = lazy(() => import("./components/DirectoryView"));
const RoutesView = lazy(() => import("./components/RoutesView"));
const StartingLocationSelector = lazy(() => import("./components/StartingLocationSelector"));
const SmartNearbyExplorer = lazy(() => import("./components/SmartNearbyExplorer"));
const AiTravelPlannerView = lazy(() => import("./components/AiTravelPlannerView"));

// Lazy-Loaded Analysis & Distance Modals
const BudgetCalculator = lazy(() => import("./components/BudgetCalculator"));
const RouteComparator = lazy(() => import("./components/RouteComparator"));
const VerificationModal = lazy(() => import("./components/VerificationModal"));
const ApiConnectionModal = lazy(() => import("./components/ApiConnectionModal"));
const LegDistanceModal = lazy(() => import("./components/LegDistanceModal"));

class ViewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("View boundary caught error:", error, errorInfo);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.activeView !== this.props.activeView && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#f8fafc" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f59e0b", marginBottom: "8px" }}>
            View Loading Notice
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            {this.state.error?.message || "A temporary issue occurred while rendering this page."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            style={{
              background: "#d4af37",
              color: "#091712",
              border: "none",
              padding: "8px 18px",
              borderRadius: "6px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ViewLoadingFallback() {
  return (
    <div className="ty-view-loading-fallback">
      <div className="ty-view-loading-pulse">
        <img
          src="/images/journey_to_bharat_emblem.png"
          alt="Loading..."
          className="ty-loading-emblem"
        />
      </div>
      <span className="ty-loading-text">JOURNEY TO BHARAT</span>
    </div>
  );
}

// Data & Intelligence Engines
import {
  CATEGORIES,
  ALL_STATES_DATA,
  FEATURED_CIRCUITS,
  FLAGSHIP_DESTINATIONS
} from "./data/tirthData";

import {
  ROUTES_REGISTRY,
  getRouteStopsList,
  getStopDetails,
  calculateRouteDistanceMetrics
} from "./data/multiRoutes.js";

import {
  ALL_DESTINATIONS,
  ALL_STATIONS,
  ALL_ATTRACTIONS,
  ALL_BUS_TERMINALS,
  UNIQUE_STATIONS
} from "./data/unifiedData";
import { UNIFIED_CORRIDORS } from "./data/unifiedCorridors";
import { BIKE_RENTALS } from "./data/rentals";
import {
  getSavedStartingLocation,
  setSavedStartingLocation
} from "./services/locationService";

export default function App() {
  // Primary Navigation View State: 'home' | 'map' | 'temples' | 'mountains' | 'states' | 'routes' | 'my_yatra'
  const [activeView, setActiveView] = useState("home");

  // Active Starting Location State (New Delhi default, or browser GPS / user manual input)
  const [startingLocation, setStartingLocation] = useState(() => getSavedStartingLocation());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Selected State for State Page View
  const [selectedState, setSelectedState] = useState(ALL_STATES_DATA[0]);

  // Selected Destination for Detail Modal
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Target Destination for Smart Nearby Explorer & Route Planner
  const [nearbyExplorerTarget, setNearbyExplorerTarget] = useState(null);

  // Target Destination for AI Travel Planner & Budget Calculation
  const [aiPlannerTarget, setAiPlannerTarget] = useState(null);

  // Live Screen Narrator Context (shared across SmartNearbyExplorer, Map, and App)
  const [narratorContext, setNarratorContext] = useState(null);

  // Selected Circuit for Circuit Modal
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  // Map Filter presets when navigating from Home
  const [mapInitialQuery, setMapInitialQuery] = useState("");
  const [mapInitialCategory, setMapInitialCategory] = useState("all");

  // Saved Favourites (My Yatra) initialized from localStorage
  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("ty_saved_favorites");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load favorites from storage", e);
    }
    // Default initial seed matching visual reference
    return [
      FLAGSHIP_DESTINATIONS[0], // Kedarnath Temple
      FLAGSHIP_DESTINATIONS[4], // Vaishno Devi
      FLAGSHIP_DESTINATIONS[5], // Tirupati Balaji
      FLAGSHIP_DESTINATIONS[7]  // Jagannath Puri
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("ty_saved_favorites", JSON.stringify(savedFavorites));
    } catch (e) {
      console.warn("Could not persist favorites to storage", e);
    }
  }, [savedFavorites]);

  const handleToggleFavorite = (item) => {
    setSavedFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveFavorite = (itemId) => {
    setSavedFavorites((prev) => prev.filter((f) => f.id !== itemId));
  };

  // Map Layer & Tile states (Clean Explorer defaults - start uncluttered without overlapping pins)
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTileLayer, setSelectedTileLayer] = useState("googleRoadmap");
  const [activeLayers, setActiveLayers] = useState({
    destinations: false, // Default to FALSE to prevent overlapping markers across India
    stations: false,
    attractions: false,  // Default to FALSE
    busCorridors: false,
    rentals: false,
    grandLoop: false,
    railCorridors: false,
    scenicRoads: false
  });

  // 8 Canonical Routes State (A through H)
  const [activeRouteId, setActiveRouteId] = useState("route_g");
  const activeRoute = useMemo(() => {
    return ROUTES_REGISTRY[activeRouteId] || ROUTES_REGISTRY.route_g;
  }, [activeRouteId]);

  const activeRouteStops = useMemo(() => {
    return getRouteStopsList(activeRouteId, false);
  }, [activeRouteId]);

  const [routeMetrics, setRouteMetrics] = useState(null);
  useEffect(() => {
    let isMounted = true;
    calculateRouteDistanceMetrics(activeRouteStops).then((res) => {
      if (isMounted) setRouteMetrics(res);
    });
    return () => {
      isMounted = false;
    };
  }, [activeRouteStops]);

  // Modals for Distance & Budget Calculators
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isLegModalOpen, setIsLegModalOpen] = useState(false);

  // Navigation Handlers
  const handleSelectDestination = (dest) => {
    setSelectedDestination(dest);
  };

  const handleSelectState = (stateItem) => {
    setMapInitialQuery(stateItem?.name || "");
    setActiveView("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (categoryId) => {
    if (categoryId === "jyotirlingas" || categoryId === "chardham" || categoryId === "shaktipeeths" || categoryId === "manyata_temples") {
      setActiveView("temples");
    } else if (categoryId === "mountains" || categoryId === "lakes_waterfalls" || categoryId === "beaches_coastal") {
      setActiveView("mountains");
    } else {
      setMapInitialCategory(categoryId);
      setActiveView("map");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCircuit = (circuit) => {
    setSelectedCircuit(circuit);
  };

  const handleExploreMap = (query = "") => {
    if (query) setMapInitialQuery(query);
    setActiveView("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreDestinationOnMap = (dest) => {
    setSelectedItem({
      ...dest,
      lat: dest.lat,
      lng: dest.lng,
      zoom: 13
    });
    setActiveView("map");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenNearbyExplorer = (dest) => {
    if (dest) setNearbyExplorerTarget(dest);
    setActiveView("nearby");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAiPlanner = (dest) => {
    if (dest) setNearbyExplorerTarget(dest);
    setActiveView("nearby");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ty-app">
      {/* Living Spiritual Background Animation */}
      <GlobalAmbientBackground />

      {/* Flagship Slim Editorial Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        savedFavorites={savedFavorites}
        onOpenMyYatra={() => setActiveView("my_yatra")}
        onOpenSearch={() => handleExploreMap()}
        startingLocation={startingLocation}
        onOpenLocationSelector={() => setIsLocationModalOpen(true)}
      />

      {/* Main View Router with 60fps GPU-Accelerated View Transitions */}
      <main className="ty-main-view">
        <ViewErrorBoundary activeView={activeView} onReset={() => setActiveView("home")}>
          <Suspense fallback={<ViewLoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + (activeView === "temples" || activeView === "mountains" ? `_${activeView}` : "")}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%" }}
            >
              {/* VIEW 1: FLAGSHIP EDITORIAL HOMEPAGE */}
              {activeView === "home" && (
                <HomeView
                  onSelectDestination={handleSelectDestination}
                  onSelectState={handleSelectState}
                  onSelectCategory={handleSelectCategory}
                  onSelectCircuit={handleSelectCircuit}
                  onExploreMap={handleExploreMap}
                  savedFavorites={savedFavorites}
                  onToggleFavorite={handleToggleFavorite}
                  startingLocation={startingLocation}
                  onSelectStartingLocation={(newLoc) => {
                    setStartingLocation(newLoc);
                    setSavedStartingLocation(newLoc);
                  }}
                  onOpenLocationSelector={() => setIsLocationModalOpen(true)}
                  onOpenNearbyExplorer={handleOpenNearbyExplorer}
                  onOpenAiPlanner={handleOpenAiPlanner}
                />
              )}

              {/* VIEW: SMART NEARBY PLACES DISCOVERY & AUTOMATIC ROUTE MAP WITH INTEGRATED BUDGET */}
              {(activeView === "nearby" || activeView === "planner") && (
                <SmartNearbyExplorer
                  initialDestination={nearbyExplorerTarget || aiPlannerTarget}
                  onOpenDetail={handleSelectDestination}
                  onToggleFavorite={handleToggleFavorite}
                  savedFavorites={savedFavorites}
                  onOpenAiPlanner={(dest) => handleOpenNearbyExplorer(dest)}
                  onUpdateNarratorContext={setNarratorContext}
                />
              )}

              {/* VIEW 2: INTERACTIVE MAP EXPLORER */}
              {activeView === "map" && (
                <MapExplorerView
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  onOpenDetail={(item) => setSelectedDestination(item)}
                  activeLayers={activeLayers}
                  setActiveLayers={setActiveLayers}
                  selectedTileLayer={selectedTileLayer}
                  setSelectedTileLayer={setSelectedTileLayer}
                  destinations={ALL_DESTINATIONS}
                  stations={UNIQUE_STATIONS}
                  attractions={ALL_ATTRACTIONS}
                  busTerminals={ALL_BUS_TERMINALS}
                  rentals={BIKE_RENTALS}
                  routeCorridors={UNIFIED_CORRIDORS}
                  activeRoute={activeRoute}
                  routeStops={activeRouteStops}
                  initialQuery={mapInitialQuery}
                  initialCategory={mapInitialCategory}
                  startingLocation={startingLocation}
                  onSelectStartingLocation={(newLoc) => {
                    setStartingLocation(newLoc);
                    setSavedStartingLocation(newLoc);
                  }}
                  onOpenLocationSelector={() => setIsLocationModalOpen(true)}
                  onToggleFavorite={handleToggleFavorite}
                  savedFavorites={savedFavorites}
                />
              )}

              {/* VIEW 4: TEMPLES DIRECTORY */}
              {activeView === "temples" && (
                <DirectoryView
                  type="temples"
                  onSelectDestination={handleSelectDestination}
                  onExploreOnMap={handleExploreDestinationOnMap}
                  savedFavorites={savedFavorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {/* VIEW 5: MOUNTAINS & NATURE DIRECTORY */}
              {activeView === "mountains" && (
                <DirectoryView
                  type="mountains"
                  onSelectDestination={handleSelectDestination}
                  onExploreOnMap={handleExploreDestinationOnMap}
                  savedFavorites={savedFavorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {/* VIEW 6: CIRCUITS & MULTI-ROUTES */}
              {activeView === "routes" && (
                <RoutesView
                  onSelectCircuit={handleSelectCircuit}
                  onExploreOnMap={() => setActiveView("map")}
                  onOpenComparator={() => setIsComparatorOpen(true)}
                  onOpenBudget={() => setIsBudgetOpen(true)}
                  onOpenLegDistances={() => setIsLegModalOpen(true)}
                  onOpenVerification={() => setIsVerificationOpen(true)}
                  activeRouteId={activeRouteId}
                  setActiveRouteId={setActiveRouteId}
                  routeMetrics={routeMetrics}
                />
              )}

              {/* VIEW 7: MY YATRA (Wishlist, Itinerary, Checklist) */}
              {activeView === "my_yatra" && (
                <MyYatraView
                  savedFavorites={savedFavorites}
                  onRemoveFavorite={handleRemoveFavorite}
                  onSelectDestination={handleSelectDestination}
                  onExploreOnMap={() => setActiveView("map")}
                  onNavigateHome={() => setActiveView("home")}
                  startingLocation={startingLocation}
                  onOpenLocationSelector={() => setIsLocationModalOpen(true)}
                  onUpdateFavorites={setSavedFavorites}
                  onOpenAiPlanner={handleOpenAiPlanner}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </ViewErrorBoundary>
    </main>

      {/* Lazy Modals with Suspense fallback */}
      <Suspense fallback={null}>
        {/* Destination Detail Modal */}
        {selectedDestination && (
          <DestinationDetailModal
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
            onExploreOnMap={handleExploreDestinationOnMap}
            onOpenNearbyExplorer={(dest) => {
              setSelectedDestination(null);
              handleOpenNearbyExplorer(dest);
            }}
            onOpenAiPlanner={(dest) => {
              setSelectedDestination(null);
              handleOpenAiPlanner(dest);
            }}
            isFavorite={savedFavorites.some((f) => f.id === selectedDestination.id)}
            onToggleFavorite={handleToggleFavorite}
            startingLocation={startingLocation}
            onOpenLocationSelector={() => setIsLocationModalOpen(true)}
          />
        )}

        {/* Circuit Detail Modal */}
        {selectedCircuit && (
          <CircuitDetailModal
            circuit={selectedCircuit}
            onClose={() => setSelectedCircuit(null)}
            onExploreOnMap={() => {
              setSelectedCircuit(null);
              setActiveView("map");
            }}
          />
        )}

        {/* Starting Location Selector Modal */}
        <StartingLocationSelector
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={startingLocation}
          onLocationSelect={(newLoc) => {
            setStartingLocation(newLoc);
            setSavedStartingLocation(newLoc);
          }}
        />

        {/* Analysis Modals (Preserved from Existing Distance Engine) */}
        <BudgetCalculator
          isOpen={isBudgetOpen}
          onClose={() => setIsBudgetOpen(false)}
          onOpenAiPlanner={handleOpenAiPlanner}
        />

        <RouteComparator
          isOpen={isComparatorOpen}
          onClose={() => setIsComparatorOpen(false)}
          destinations={ALL_DESTINATIONS}
          stations={UNIQUE_STATIONS}
          onApplyRoute={() => setActiveView("map")}
          onSelectRoute={(newRouteId) => setActiveRouteId(newRouteId)}
        />

        <LegDistanceModal
          isOpen={isLegModalOpen}
          onClose={() => setIsLegModalOpen(false)}
          route={activeRoute}
          metrics={routeMetrics}
          stops={activeRouteStops}
          onSelectStop={(stop) => {
            setSelectedItem(stop);
            setIsLegModalOpen(false);
            setActiveView("map");
          }}
        />

        <VerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
        />

        <ApiConnectionModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
        />
      </Suspense>

      {/* Flagship Live AI Voice Screen Explainer (VoiceStudio + OpenJarvis + ECC Agent Core) */}
      <AiScreenNarrator
        activeView={activeView}
        selectedStops={narratorContext?.selectedStops || []}
        journeyOrigin={narratorContext?.journeyOrigin || startingLocation}
        journeyRouteResult={narratorContext?.journeyRouteResult || null}
        activeBudget={narratorContext?.activeBudget || null}
        activeDestination={selectedDestination || narratorContext?.activeDestination || nearbyExplorerTarget || null}
        actions={narratorContext?.actions || null}
      />
    </div>
  );
}

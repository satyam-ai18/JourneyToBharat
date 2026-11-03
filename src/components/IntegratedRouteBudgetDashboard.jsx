import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  IndianRupee,
  Users,
  Calendar,
  Utensils,
  BedDouble,
  Bus,
  Train,
  Car,
  Compass,
  Check,
  Share2,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  Clock,
  ArrowRight,
  Landmark,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Volume2,
  Square,
  Headphones,
  Heart,
  User,
  Smile,
  ShieldCheck,
  Shield,
  Layers
} from "lucide-react";
import { LOCATION_COST_INDEX, detectLocationCostTier } from "../services/aiTravelPlannerService.js";
import { speakText, stopSpeech, buildRouteAudioBriefing } from "../services/voiceStudioService.js";

export default function IntegratedRouteBudgetDashboard({
  integratedBudget,
  budgetTier,
  onSelectTier,
  groupType = "couple",
  onSelectGroupType,
  budgetAdults = 2,
  onChangeAdults,
  budgetChildren = 0,
  onChangeChildren,
  budgetInfants = 0,
  onChangeInfants,
  roomCountOverride = null,
  onChangeRoomCount,
  budgetTravellers = 2,
  onChangeTravellers,
  budgetDurationDays,
  onChangeDurationDays,
  budgetStartDate,
  onChangeStartDate,
  customBudgetPreferences,
  onChangeCustomPreference,
  isCustomBudgetOpen,
  onToggleCustomBudget,
  selectedJourneyStops,
  journeyOrigin,
  journeyRouteResult,
  onCopyBudgetSummary,
  copyFeedback,
  onPrintBudget
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlayingVoiceBriefing, setIsPlayingVoiceBriefing] = useState(false);

  const handleToggleVoiceBriefing = () => {
    if (isPlayingVoiceBriefing) {
      stopSpeech();
      setIsPlayingVoiceBriefing(false);
    } else {
      const text = buildRouteAudioBriefing({
        distanceKm: journeyRouteResult?.totalRoadKm,
        durationText: journeyRouteResult?.totalDurationFormatted,
        stops: [journeyOrigin?.name, ...selectedJourneyStops.map((s) => s.name)].filter(Boolean),
        totalBudget: activePlan?.totalCost?.toLocaleString("en-IN")
      });
      setIsPlayingVoiceBriefing(true);
      speakText(text, {
        onStart: () => setIsPlayingVoiceBriefing(true),
        onEnd: () => setIsPlayingVoiceBriefing(false),
        onError: () => setIsPlayingVoiceBriefing(false)
      });
    }
  };

  if (!integratedBudget || !integratedBudget.plans) {
    return null;
  }

  const tierKey =
    budgetTier === "cheapest" || budgetTier === "economy"
      ? "economy"
      : budgetTier === "mid_budget" || budgetTier === "middle"
        ? "middle"
        : budgetTier === "custom"
          ? "custom"
          : "comfortable";

  const activePlan = integratedBudget.plans[tierKey] || integratedBudget.plans.comfortable;
  const plans = integratedBudget.plans;
  const b = activePlan.breakdown || {};
  const totalCost = activePlan.totalCost || 1;

  // Percentage calculations for all 6 categories (Stay + Food + Local + Intercity + Spends + Buffer)
  const pAcc = Math.round(((b.accommodation || 0) / totalCost) * 100);
  const pFood = Math.round(((b.food || 0) / totalCost) * 100);
  const pLocal = Math.round(((b.localTransport || 0) / totalCost) * 100);
  const pInter = Math.round(((b.intercityTransport || 0) / totalCost) * 100);
  const pSpends = Math.round(((b.darshanAndSightseeing || 0) / totalCost) * 100);
  const pBuffer = Math.max(0, 100 - (pAcc + pFood + pLocal + pInter + pSpends));

  const accEst = integratedBudget.accommodationEst || {};
  const foodEst = integratedBudget.foodEst || {};
  const localEst = integratedBudget.localTransitEst || {};
  const routeLegs = journeyRouteResult?.legs || integratedBudget.routeLegs || [];

  // Stop cost tiers
  const stopTiers = selectedJourneyStops.map((st) => {
    const tierId = detectLocationCostTier(st);
    return {
      name: st.name,
      tierId,
      tier: LOCATION_COST_INDEX[tierId] || { label: "Standard", costMultiplier: 1.0 }
    };
  });
  const hasHimalayan = stopTiers.some((t) => t.tierId === "himalayan");

  return (
    <div
      id="integrated-route-budget"
      style={{
        background: "#ffffff",
        border: "1.5px solid #d4af37",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        fontFamily: "inherit"
      }}
    >
      {/* 1. Dashboard Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
          padding: "20px 24px",
          color: "#ffffff",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          borderBottom: "2px solid #d4af37"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                color: "#e8c872",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}
            >
              Automatic Route Budget Engine
            </span>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>•</span>
            <span style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: "700" }}>
              {journeyRouteResult ? `${journeyRouteResult.totalRoadKm} km Connected` : "Route Connected"}
            </span>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#fef3c7", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Wallet size={22} className="text-amber-400" />
            <span>Complete Travel Budget for Selected Stops</span>
          </h2>

          <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "4px 0 0 0", maxWidth: "680px" }}>
            Calculated automatically for {journeyOrigin.name} ➔ {selectedJourneyStops.map((s) => s.name).join(" ➔ ")}. Covers hotel tariffs, satvik food, local auto transfers, and intercity travel without manual research.
          </p>

          {/* VoiceStudio Journey Audio Briefing */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={handleToggleVoiceBriefing}
              style={{
                background: isPlayingVoiceBriefing ? "#dc2626" : "rgba(212, 175, 55, 0.2)",
                color: isPlayingVoiceBriefing ? "#ffffff" : "#fef3c7",
                border: isPlayingVoiceBriefing ? "1px solid #ef4444" : "1px solid rgba(212, 175, 55, 0.5)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title="VoiceStudio AI Voice: Listen to spoken journey briefing"
            >
              {isPlayingVoiceBriefing ? <Square size={13} fill="#ffffff" /> : <Volume2 size={13} />}
              <span>{isPlayingVoiceBriefing ? "Stop Voice Briefing" : "Listen to Route Voice Briefing"}</span>
            </button>
            <span style={{ fontSize: "11px", color: "#6ee7b7", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Headphones size={12} /> Powered by VoiceStudio
            </span>
          </div>
        </div>

        {/* Interactive Group & Passenger Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(212, 175, 55, 0.3)"
          }}
        >
          {/* Group Type Pills (Professional SVG Icons) */}
          {onSelectGroupType && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
              {[
                { id: "couple", label: "Couple", Icon: Heart },
                { id: "family", label: "Family", Icon: Users },
                { id: "friends", label: "Friends", Icon: Smile },
                { id: "solo", label: "Solo", Icon: User },
                { id: "girls", label: "Girls Group", Icon: Sparkles },
                { id: "group", label: "Group", Icon: Layers }
              ].map((gt) => {
                const isSel = groupType === gt.id;
                const IconComp = gt.Icon;
                return (
                  <button
                    key={gt.id}
                    type="button"
                    onClick={() => onSelectGroupType(gt.id)}
                    style={{
                      background: isSel ? "linear-gradient(135deg, #d4af37 0%, #b45309 100%)" : "rgba(255, 255, 255, 0.08)",
                      color: isSel ? "#091712" : "#e2e8f0",
                      border: isSel ? "1.5px solid #ffffff" : "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: "4px",
                      padding: "3px 8px",
                      cursor: "pointer",
                      fontSize: "10.5px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <IconComp size={11} />
                    <span>{gt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Steppers: Adults, Kids, Rooms, Days */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Adults Stepper */}
            {onChangeAdults && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "10px", color: "#e2e8f0", fontWeight: "700" }}>Adults:</span>
                <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <button
                    type="button"
                    onClick={() => onChangeAdults(-1)}
                    disabled={budgetAdults <= 1}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >-</button>
                  <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "11px", minWidth: "16px", textAlign: "center" }}>{budgetAdults}</span>
                  <button
                    type="button"
                    onClick={() => onChangeAdults(1)}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >+</button>
                </div>
              </div>
            )}

            {/* Kids Stepper */}
            {onChangeChildren && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "10px", color: "#e2e8f0", fontWeight: "700" }}>Kids (5-11):</span>
                <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <button
                    type="button"
                    onClick={() => onChangeChildren(-1)}
                    disabled={budgetChildren <= 0}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >-</button>
                  <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "11px", minWidth: "16px", textAlign: "center" }}>{budgetChildren}</span>
                  <button
                    type="button"
                    onClick={() => onChangeChildren(1)}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >+</button>
                </div>
              </div>
            )}

            {/* Rooms Stepper */}
            {onChangeRoomCount && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "10px", color: "#e2e8f0", fontWeight: "700" }}>Rooms:</span>
                <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <button
                    type="button"
                    onClick={() => onChangeRoomCount(-1)}
                    disabled={(roomCountOverride || integratedBudget.numRooms) <= 1}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >-</button>
                  <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "11px", minWidth: "16px", textAlign: "center" }}>
                    {roomCountOverride !== null ? roomCountOverride : integratedBudget.numRooms}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChangeRoomCount(1)}
                    style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                  >+</button>
                </div>
              </div>
            )}

            {/* Duration Days Stepper */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "10px", color: "#e2e8f0", fontWeight: "700" }}>Days:</span>
              <div style={{ display: "flex", alignItems: "center", background: "#091712", borderRadius: "4px", border: "1px solid rgba(212,175,55,0.3)" }}>
                <button
                  type="button"
                  onClick={() => onChangeDurationDays(-1)}
                  disabled={budgetDurationDays <= 1}
                  style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                >-</button>
                <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "11px", minWidth: "20px", textAlign: "center" }}>{budgetDurationDays}d</span>
                <button
                  type="button"
                  onClick={() => onChangeDurationDays(1)}
                  disabled={budgetDurationDays >= 30}
                  style={{ background: "transparent", color: "#e8c872", border: "none", padding: "2px 6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}
                >+</button>
              </div>
            </div>

            {/* Custom Mix Toggle Button */}
            <button
              type="button"
              onClick={onToggleCustomBudget}
              style={{
                background: isCustomBudgetOpen || tierKey === "custom" ? "#d4af37" : "rgba(212, 175, 55, 0.15)",
                color: isCustomBudgetOpen || tierKey === "custom" ? "#091712" : "#fef3c7",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "10px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              <SlidersHorizontal size={11} />
              <span>Mix & Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Location Intelligence & Cost-of-Living Ribbon */}
      <div
        style={{
          background: "#faf7ee",
          borderBottom: "1px solid #e5dec9",
          padding: "10px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#1c2e26", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={13} className="text-emerald-700" />
            <span>Destination Cost Multipliers:</span>
          </span>
          {stopTiers.map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                padding: "2px 8px",
                borderRadius: "12px",
                color: "#334155",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <strong>{item.name}</strong>
              <span style={{ color: "#d97706", fontWeight: "700" }}>({item.tier.label} {item.tier.costMultiplier}x)</span>
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "#15803d", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} />
            <span>Dharamshala & Langar active in pilgrimage hubs</span>
          </span>

          {hasHimalayan && (
            <span style={{ fontSize: "11px", color: "#b45309", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldAlert size={13} />
              <span>Himalayan terrain transit adjusted</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Three Universal Budget Category Cards */}
      <div style={{ padding: "20px 24px", background: "#fcfbf7" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* Card A: CHEAPEST / ECONOMY */}
          <div
            onClick={() => onSelectTier("economy")}
            className={tierKey === "economy" ? "magic-border-beam" : ""}
            style={{
              background: "#ffffff",
              border: tierKey === "economy" ? "2.5px solid #10b981" : "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "16px",
              cursor: "pointer",
              position: "relative",
              boxShadow: tierKey === "economy" ? "0 4px 18px rgba(16, 185, 129, 0.15)" : "none",
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#047857", background: "#d1fae5", padding: "2px 8px", borderRadius: "4px" }}>
                A. CHEAPEST / ECONOMY
              </span>
              {tierKey === "economy" && (
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "800", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Check size={14} /> Active
                </span>
              )}
            </div>

            <div style={{ margin: "8px 0" }}>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b" }}>
                ₹{plans.economy.totalCost.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                ₹{plans.economy.perPersonCost.toLocaleString("en-IN")} / person • ₹{plans.economy.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <ul style={{ margin: "10px 0 14px 0", paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>
              <li><strong>Accommodation:</strong> {plans.economy.details.stayType} (~₹{plans.economy.details.stayRatePerNight}/night)</li>
              <li><strong>Food:</strong> Satvik Thali, Temple Langar (~₹235/person/day)</li>
              <li><strong>Local:</strong> {plans.economy.details.localTransitStyle}</li>
              <li><strong>Intercity:</strong> {plans.economy.details.transportMode}</li>
              <li><strong>Spends & Darshan:</strong> {plans.economy.details.darshanStyle}</li>
            </ul>

            <button
              style={{
                width: "100%",
                background: tierKey === "economy" ? "#10b981" : "#f1f5f9",
                color: tierKey === "economy" ? "#ffffff" : "#334155",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              {tierKey === "economy" ? "Selected Option" : "Choose Economy"}
            </button>
          </div>

          {/* Card B: BALANCED / COMFORTABLE (RECOMMENDED) */}
          <div
            onClick={() => onSelectTier("comfortable")}
            className={tierKey === "comfortable" ? "magic-border-beam" : ""}
            style={{
              background: "#ffffff",
              border: tierKey === "comfortable" ? "2.5px solid #d4af37" : "1.5px solid #e8c872",
              borderRadius: "10px",
              padding: "16px",
              cursor: "pointer",
              position: "relative",
              boxShadow: tierKey === "comfortable" ? "0 6px 22px rgba(212, 175, 55, 0.25)" : "none",
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div style={{ position: "absolute", top: "-10px", right: "14px", background: "linear-gradient(135deg, #d4af37 0%, #b45309 100%)", color: "#091712", fontWeight: "900", fontSize: "10px", padding: "2px 8px", borderRadius: "10px", letterSpacing: "0.5px" }}>
              RECOMMENDED FOR FAMILIES
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#b45309", background: "#fef3c7", padding: "2px 8px", borderRadius: "4px" }}>
                B. BALANCED / COMFORTABLE
              </span>
              {tierKey === "comfortable" && (
                <span style={{ fontSize: "11px", color: "#b45309", fontWeight: "800", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Check size={14} /> Active
                </span>
              )}
            </div>

            <div style={{ margin: "8px 0" }}>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#091712" }}>
                ₹{plans.comfortable.totalCost.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                ₹{plans.comfortable.perPersonCost.toLocaleString("en-IN")} / person • ₹{plans.comfortable.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <ul style={{ margin: "10px 0 14px 0", paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>
              <li><strong>Accommodation:</strong> {plans.comfortable.details.stayType} (~₹{plans.comfortable.details.stayRatePerNight}/night)</li>
              <li><strong>Food:</strong> Hygienic restaurant meals (~₹490/person/day)</li>
              <li><strong>Local:</strong> {plans.comfortable.details.localTransitStyle}</li>
              <li><strong>Intercity:</strong> {plans.comfortable.details.transportMode}</li>
              <li><strong>Spends & Darshan:</strong> {plans.comfortable.details.darshanStyle}</li>
            </ul>

            <button
              style={{
                width: "100%",
                background: tierKey === "comfortable" ? "linear-gradient(135deg, #d4af37 0%, #b45309 100%)" : "#fef3c7",
                color: tierKey === "comfortable" ? "#091712" : "#92400e",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "12px",
                fontWeight: "900",
                cursor: "pointer"
              }}
            >
              {tierKey === "comfortable" ? "Selected (Recommended)" : "Choose Balanced"}
            </button>
          </div>

          {/* Card C: MID BUDGET */}
          <div
            onClick={() => onSelectTier("middle")}
            className={tierKey === "middle" ? "magic-border-beam" : ""}
            style={{
              background: "#ffffff",
              border: tierKey === "middle" ? "2.5px solid #0284c7" : "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "16px",
              cursor: "pointer",
              position: "relative",
              boxShadow: tierKey === "middle" ? "0 4px 18px rgba(2, 132, 199, 0.15)" : "none",
              transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#0369a1", background: "#e0f2fe", padding: "2px 8px", borderRadius: "4px" }}>
                C. MID BUDGET (PREMIUM COMFORT)
              </span>
              {tierKey === "middle" && (
                <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: "800", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Check size={14} /> Active
                </span>
              )}
            </div>

            <div style={{ margin: "8px 0" }}>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b" }}>
                ₹{plans.middle.totalCost.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                ₹{plans.middle.perPersonCost.toLocaleString("en-IN")} / person • ₹{plans.middle.perDayCost.toLocaleString("en-IN")} / day
              </div>
            </div>

            <ul style={{ margin: "10px 0 14px 0", paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.6" }}>
              <li><strong>Accommodation:</strong> {plans.middle.details.stayType} (~₹{plans.middle.details.stayRatePerNight}/night)</li>
              <li><strong>Food:</strong> Fine dining & regional specialties (~₹980/person/day)</li>
              <li><strong>Local:</strong> {plans.middle.details.localTransitStyle}</li>
              <li><strong>Intercity:</strong> {plans.middle.details.transportMode}</li>
              <li><strong>Spends & Darshan:</strong> {plans.middle.details.darshanStyle}</li>
            </ul>

            <button
              style={{
                width: "100%",
                background: tierKey === "middle" ? "#0284c7" : "#f1f5f9",
                color: tierKey === "middle" ? "#ffffff" : "#334155",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              {tierKey === "middle" ? "Selected Option" : "Choose Mid Budget"}
            </button>
          </div>
        </div>

        {/* Side-by-Side Category Comparison Table (Section 6 Specification) */}
        {integratedBudget.comparisonTable && (
          <div
            style={{
              marginTop: "20px",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1.5px solid #d4af37",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #091712 0%, #153e2d 100%)",
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileSpreadsheet size={16} className="text-amber-400" />
                <span style={{ fontSize: "13px", fontWeight: "900", color: "#fef3c7", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Complete Journey Budget Comparison Table
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "#e8c872", fontWeight: "700" }}>
                {budgetAdults} Adults{budgetChildren > 0 ? `, ${budgetChildren} Children` : ""} • {roomCountOverride || integratedBudget.numRooms} Room(s) • {budgetDurationDays} Days
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#1e293b" }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #cbd5e1" }}>Expense Category</th>
                    <th style={{ textAlign: "right", padding: "10px 14px", borderBottom: "2px solid #10b981", color: "#047857" }}>Cheapest / Economy</th>
                    <th style={{ textAlign: "right", padding: "10px 14px", borderBottom: "2px solid #d4af37", background: "#fef3c7", color: "#92400e" }}>
                      Balanced / Comfortable (Recommended)
                    </th>
                    <th style={{ textAlign: "right", padding: "10px 14px", borderBottom: "2px solid #0284c7", color: "#0369a1" }}>Mid Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {integratedBudget.comparisonTable.map((row, rIdx) => {
                    const isTotal = row.isTotal;
                    const isPerPerson = row.isPerPerson;
                    return (
                      <tr
                        key={rIdx}
                        style={{
                          borderBottom: isTotal ? "2.5px solid #091712" : "1px solid #f1f5f9",
                          background: isTotal ? "#fef3c7" : isPerPerson ? "#ecfdf5" : rIdx % 2 === 0 ? "#ffffff" : "#fcfbf7",
                          fontWeight: isTotal || isPerPerson ? "900" : "500",
                          color: isTotal ? "#78350f" : isPerPerson ? "#065f46" : "#334155",
                          fontSize: isTotal || isPerPerson ? "13px" : "11.5px"
                        }}
                      >
                        <td style={{ padding: "10px 14px" }}>
                          {row.category}
                          {row.notes && (
                            <span style={{ display: "block", fontSize: "9.5px", color: "#64748b", fontWeight: "400", marginTop: "2px" }}>
                              {budgetTier === "cheapest" ? row.notes.economy : budgetTier === "mid_budget" ? row.notes.middle : row.notes.comfortable}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right", padding: "10px 14px" }}>₹{row.economy.toLocaleString("en-IN")}</td>
                        <td style={{ textAlign: "right", padding: "10px 14px", background: isTotal ? "#fde68a" : "#fffbeb" }}>
                          ₹{row.comfortable.toLocaleString("en-IN")}
                        </td>
                        <td style={{ textAlign: "right", padding: "10px 14px" }}>₹{row.middle.toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Multi-Color Expense Proportion Bar */}
        <div style={{ marginTop: "20px", background: "#ffffff", padding: "14px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b" }}>
              Expense Breakdown ({activePlan.title} — {budgetTravellers} pax, {budgetDurationDays}d):
            </span>
            <span style={{ fontSize: "14px", fontWeight: "900", color: "#b45309" }}>
              Total: ₹{totalCost.toLocaleString("en-IN")}
            </span>
          </div>

          <div style={{ height: "12px", borderRadius: "6px", overflow: "hidden", display: "flex", background: "#f1f5f9" }}>
            <div style={{ width: `${pAcc}%`, background: "#d4af37" }} title={`Stay / Hotel: ₹${b.accommodation} (${pAcc}%)`} />
            <div style={{ width: `${pFood}%`, background: "#10b981" }} title={`Food & Meals: ₹${b.food} (${pFood}%)`} />
            <div style={{ width: `${pLocal}%`, background: "#06b6d4" }} title={`Local Auto / Transit: ₹${b.localTransport} (${pLocal}%)`} />
            <div style={{ width: `${pInter}%`, background: "#0284c7" }} title={`Intercity Travel: ₹${b.intercityTransport} (${pInter}%)`} />
            <div style={{ width: `${pSpends}%`, background: "#8b5cf6" }} title={`Spends & Darshan: ₹${b.darshanAndSightseeing || 0} (${pSpends}%)`} />
            <div style={{ width: `${pBuffer}%`, background: "#f59e0b" }} title={`Tolls & Buffer: ₹${(b.tollsAndMisc || 0) + (b.emergencyBuffer || 0)} (${pBuffer}%)`} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px", fontSize: "11px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#d4af37" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <BedDouble size={13} className="text-amber-600" />
                <span>Stay ({pAcc}%): <strong className="tabular-nums">₹{(b.accommodation || 0).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#10b981" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Utensils size={13} className="text-emerald-600" />
                <span>Food ({pFood}%): <strong className="tabular-nums">₹{(b.food || 0).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#06b6d4" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Car size={13} className="text-cyan-600" />
                <span>Local ({pLocal}%): <strong className="tabular-nums">₹{(b.localTransport || 0).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#0284c7" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Train size={13} className="text-blue-600" />
                <span>Intercity ({pInter}%): <strong className="tabular-nums">₹{(b.intercityTransport || 0).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#8b5cf6" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Landmark size={13} className="text-purple-600" />
                <span>Spends ({pSpends}%): <strong className="tabular-nums">₹{(b.darshanAndSightseeing || 0).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#f59e0b" }} />
              <span style={{ color: "#475569", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={13} className="text-amber-500" />
                <span>Tolls/Buffer ({pBuffer}%): <strong className="tabular-nums">₹{((b.tollsAndMisc || 0) + (b.emergencyBuffer || 0)).toLocaleString("en-IN")}</strong></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Strip */}
      <div
        style={{
          background: "#091712",
          padding: "14px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#fef3c7", fontSize: "12px", fontWeight: "800" }}>
            Total Budget Package ({activePlan.title}):
          </span>
          <span style={{ color: "#e8c872", fontSize: "18px", fontWeight: "900" }}>
            ₹{totalCost.toLocaleString("en-IN")}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onCopyBudgetSummary}
            style={{
              background: copyFeedback ? "#10b981" : "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {copyFeedback ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copyFeedback ? "Copied WhatsApp Summary!" : "Share to WhatsApp"}</span>
          </button>

          <button
            onClick={onPrintBudget}
            style={{
              background: "rgba(212, 175, 55, 0.2)",
              color: "#fef3c7",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Printer size={14} />
            <span>Print Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
}

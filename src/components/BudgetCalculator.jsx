import React, { useState } from "react";
import {
  X,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Train,
  Bus,
  Bike,
  Home,
  Utensils,
  Ticket,
  ShieldAlert
} from "lucide-react";

export default function BudgetCalculator({ isOpen, onClose, onOpenAiPlanner }) {
  // Initial total budget is strictly ₹25,000 as required
  const [totalBudget, setTotalBudget] = useState(25000);

  // Editable expense categories
  const [expenses, setExpenses] = useState({
    longDistanceTrains: 4200,
    localTrainsToyTrain: 750,
    intercityBuses: 2650,
    localTransitAutoMetro: 2100,
    bikeRentalsFuel: 3400,
    accommodation: 6800,
    foodDining: 3300,
    attractionFees: 1200,
    emergencyReserve: 2000
  });

  const categoryConfigs = [
    { key: "longDistanceTrains", label: "Train Transport (Mail / Express / Vande Bharat)", icon: Train, color: "#3b82f6" },
    { key: "localTrainsToyTrain", label: "Passenger Halts & Local Shuttles", icon: Train, color: "#60a5fa" },
    { key: "intercityBuses", label: "Bus Transport (UPSRTC, MP Transport, MSRTC, RSRTC)", icon: Bus, color: "#10b981" },
    { key: "localTransitAutoMetro", label: "Local Transfers (E-rickshaw, Auto, Taxi)", icon: Bus, color: "#14b8a6" },
    { key: "bikeRentalsFuel", label: "Vehicle Rentals & Local Fuel", icon: Bike, color: "#f59e0b" },
    { key: "accommodation", label: "Accommodation (Dharamshalas, Ashrams, Hotels)", icon: Home, color: "#a855f7" },
    { key: "foodDining", label: "Food & Pure Veg Dining (Thali, Bazaars)", icon: Utensils, color: "#ec4899" },
    { key: "attractionFees", label: "Temple Darshan, Puja & Entry Fees", icon: Ticket, color: "#eab308" },
    { key: "emergencyReserve", label: "Emergency Reserve Fund", icon: ShieldAlert, color: "#64748b" }
  ];

  // Update specific expense
  const handleExpenseChange = (key, value) => {
    const val = parseInt(value, 10);
    setExpenses(prev => ({
      ...prev,
      [key]: isNaN(val) ? 0 : Math.max(0, val)
    }));
  };

  // Calculations
  const totalExpenditure = Object.values(expenses).reduce((acc, curr) => acc + curr, 0);
  const remainingBudget = totalBudget - totalExpenditure;
  const isOverBudget = remainingBudget < 0;
  const percentUsed = totalBudget > 0 ? Math.round((totalExpenditure / totalBudget) * 100) : 100;

  // Presets
  const applyPreset = (presetType) => {
    if (presetType === "backpacker") {
      setTotalBudget(20000);
      setExpenses({
        longDistanceTrains: 2800,
        localTrainsToyTrain: 350,
        intercityBuses: 2200,
        localTransitAutoMetro: 1400,
        bikeRentalsFuel: 2100,
        accommodation: 5200,
        foodDining: 2800,
        attractionFees: 800,
        emergencyReserve: 1500
      });
    } else if (presetType === "balanced") {
      setTotalBudget(25000);
      setExpenses({
        longDistanceTrains: 4200,
        localTrainsToyTrain: 750,
        intercityBuses: 2650,
        localTransitAutoMetro: 2100,
        bikeRentalsFuel: 3400,
        accommodation: 6800,
        foodDining: 3300,
        attractionFees: 1200,
        emergencyReserve: 2000
      });
    } else if (presetType === "comfort") {
      setTotalBudget(35000);
      setExpenses({
        longDistanceTrains: 6500,
        localTrainsToyTrain: 1200,
        intercityBuses: 3500,
        localTransitAutoMetro: 2800,
        bikeRentalsFuel: 4800,
        accommodation: 9800,
        foodDining: 4500,
        attractionFees: 1500,
        emergencyReserve: 3000
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="budget-modal-overlay" onClick={onClose}>
      <div className="budget-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge budget-badge">EDITABLE TRAVEL BUDGET</span>
            <h2 className="modal-title">South India Circuit Budget Calculator</h2>
            <p className="modal-subtitle">Baseline set to ₹25,000 — Adjust categories freely to balance your journey</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* AI Travel Planner Integration Banner */}
          {onOpenAiPlanner && (
            <div
              className="ty-ai-calc-launch-strip"
              onClick={() => {
                onClose();
                onOpenAiPlanner();
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-amber-400" />
                </div>
                <div>
                  <strong className="text-xs text-white block">Need an Automatic Location-Based Travel Plan?</strong>
                  <span className="text-[11px] text-stone-300">
                    Let Journey to Bharat automatically calculate verified train fares, hotels, local auto rates & complete day-wise budget.
                  </span>
                </div>
              </div>
              <button type="button" className="ty-ai-launch-btn">
                <span>Launch AI Planner</span>
                <Sparkles size={12} />
              </button>
            </div>
          )}

          {/* Presets Row */}
          <div className="presets-bar">
            <span className="preset-label">Quick Presets:</span>
            <button onClick={() => applyPreset("backpacker")} className="preset-btn">
              Backpacker (₹20,000)
            </button>
            <button onClick={() => applyPreset("balanced")} className="preset-btn active">
              Balanced Explorer (₹25,000)
            </button>
            <button onClick={() => applyPreset("comfort")} className="preset-btn">
              Comfort Voyager (₹35,000)
            </button>
            <button onClick={() => applyPreset("balanced")} className="preset-btn reset" title="Reset to ₹25k">
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Budget Overview KPI Banner */}
          <div className={`budget-kpi-banner ${isOverBudget ? "danger" : "safe"}`}>
            <div className="kpi-cell">
              <span className="kpi-title">Total Travel Budget</span>
              <div className="kpi-input-wrapper">
                <span className="currency-prefix">₹</span>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="kpi-input"
                />
              </div>
            </div>

            <div className="kpi-cell">
              <span className="kpi-title">Total Estimated Expenditure</span>
              <span className="kpi-val text-white">₹{totalExpenditure.toLocaleString("en-IN")}</span>
            </div>

            <div className="kpi-cell">
              <span className="kpi-title">{isOverBudget ? "Budget Deficit" : "Remaining Surplus"}</span>
              <span className={`kpi-val ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                {isOverBudget ? `- ₹${Math.abs(remainingBudget).toLocaleString("en-IN")}` : `₹${remainingBudget.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>

          {/* Warning Banner if Exceeded */}
          {isOverBudget && (
            <div className="budget-alert-banner">
              <AlertTriangle size={20} className="alert-icon" />
              <div>
                <h4 className="alert-title">Warning: Route Expenses Exceed Budget by ₹{Math.abs(remainingBudget).toLocaleString("en-IN")}!</h4>
                <p className="alert-desc">
                  Your estimated route expenditure (₹{totalExpenditure.toLocaleString("en-IN")}) exceeds your allocated budget of ₹{totalBudget.toLocaleString("en-IN")}.
                  Consider reducing bike rental duration, opting for sleeper class on select overnight trains, or utilizing public state ferries in Alleppey and Kochi.
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-labels">
              <span>Budget Utilization ({percentUsed}%)</span>
              <span>{percentUsed > 100 ? "OVER ALLOCATED" : `${100 - percentUsed}% Unspent`}</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${isOverBudget ? "danger" : "safe"}`}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
          </div>

          {/* Expense Categories Grid */}
          <div className="expense-categories-section">
            <h3 className="section-title">Itemized Expenditure Breakdown</h3>
            <div className="expenses-grid">
              {categoryConfigs.map(cat => {
                const IconComponent = cat.icon;
                const value = expenses[cat.key] || 0;
                const catPercent = totalExpenditure > 0 ? Math.round((value / totalExpenditure) * 100) : 0;

                return (
                  <div key={cat.key} className="expense-card">
                    <div className="expense-card-header">
                      <div className="expense-icon-wrapper" style={{ background: `${cat.color}22`, color: cat.color }}>
                        <IconComponent size={16} />
                      </div>
                      <div className="expense-name-wrap">
                        <span className="expense-label">{cat.label}</span>
                        <span className="expense-percent">{catPercent}% of total</span>
                      </div>
                    </div>
                    <div className="expense-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        step="50"
                        value={value}
                        onChange={(e) => handleExpenseChange(cat.key, e.target.value)}
                        className="expense-input"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

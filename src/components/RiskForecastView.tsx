/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, AlertCircle, Info, ChevronDown, ChevronUp, Users, TrendingDown } from 'lucide-react';
import { InventoryItem } from '../types/inventory.ts';
import { calculateSurplusForecast, CAMPUS_ATTENDANCE_SCHEDULE } from '../utils/demandForecaster.ts';
import { evaluateItemRisk } from '../utils/riskCalculator.ts';

interface RiskForecastViewProps {
  items: InventoryItem[];
}

export const RiskForecastView: React.FC<RiskForecastViewProps> = ({ items }) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const forecastResults = items.map((item) => calculateSurplusForecast(item));
  const surplusCount = forecastResults.filter((f) => f.estimatedSurplus > 0).length;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Campus Demand Velocity & Surplus Forecasting
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Combines historical dining hall turnout with calendar dynamics to project stock surplus before expiry.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-900">
              <span className="font-bold">{surplusCount}</span> items flagged with surplus risk
            </div>
          </div>
        </div>
      </div>

      {/* Campus Weekly Turnout Dynamics (Educational / Contextual) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Campus Weekly Meal Turnout Model (Baseline: 850 Students)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Hostel Dining Turnout Velocity
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {Object.entries(CAMPUS_ATTENDANCE_SCHEDULE).map(([day, config]) => {
            const isWeekend = day === 'Saturday' || day === 'Sunday' || day === 'Friday';
            return (
              <div
                key={day}
                className={`p-3 rounded-lg border text-xs ${
                  isWeekend ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>{day.slice(0, 3)}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {Math.round(config.factor * 100)}%
                  </span>
                </div>
                <div className="mt-2 text-base font-bold font-mono text-slate-900">
                  {config.studentCount}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  {config.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Surplus Predictions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Perishable Surplus Projections
          </h3>
          <span className="text-xs text-slate-500">
            Transparent deterministic estimation model
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {forecastResults.map((forecast) => {
            const item = items.find((i) => i.id === forecast.itemId);
            if (!item) return null;
            const isExpanded = expandedItemId === forecast.itemId;
            const hasSurplus = forecast.estimatedSurplus > 0;

            return (
              <div key={forecast.itemId} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{forecast.itemName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({item.category.replace('_', ' ')})
                      </span>
                      {hasSurplus && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                          <TrendingDown className="w-3 h-3 text-amber-600" />
                          Surplus: {forecast.estimatedSurplus} {forecast.unit}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                      <span>On-Hand: <strong className="font-mono text-slate-900">{forecast.currentStock} {forecast.unit}</strong></span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Expires in: <strong className="font-mono text-slate-900">{forecast.daysUntilExpiry} days</strong></span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>Projected Intake: <strong className="font-mono text-slate-900">{forecast.expectedTotalConsumptionBeforeExpiry} {forecast.unit}</strong></span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">{forecast.confidenceLevel}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1.5 italic">
                      {forecast.rationale}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : forecast.itemId)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap self-start md:self-center"
                  >
                    <span>{isExpanded ? 'Hide Assumptions' : 'Inspect Rationale'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expandable Transparency Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 grid md:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-emerald-800" />
                        Model Assumptions
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                        {forecast.assumptions.map((asm, idx) => (
                          <li key={idx}>{asm}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        Confidence & Data Limitations
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                        {forecast.limitations.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Mathematical Formula Specification */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xs">
        <h3 className="text-sm font-bold text-white mb-2">
          Transparent Risk & Food Safety Constitution
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In strict accordance with competition safety guidelines, ShelfSense AI uses deterministic rules for food safety and shelf-life calculations:
        </p>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-emerald-400 font-bold block mb-1">01. Shelf-Life Clock</span>
            <span className="text-slate-300">
              HoursRemaining = (ExpiryDate - CurrentTime) / (3600 * 1000)
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">02. Storage Multiplier</span>
            <span className="text-slate-300">
              Ambient Perishables degrade 2.5x faster than cold-room baselines.
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-red-400 font-bold block mb-1">03. Food Safety Invariant</span>
            <span className="text-slate-300">
              If HoursRemaining &le; 0: ZERO human consumption or donation permitted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

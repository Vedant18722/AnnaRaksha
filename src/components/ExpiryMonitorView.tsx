/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  ArrowUpDown,
  Filter,
  DollarSign,
  Package,
} from 'lucide-react';
import { InventoryItem, RiskTier } from '../types/inventory.ts';
import { evaluateItemRisk } from '../utils/riskCalculator.ts';
import { useI18n } from '../context/I18nContext.tsx';

interface ExpiryMonitorViewProps {
  items: InventoryItem[];
  onTriggerAgentSolution: (item: InventoryItem) => void;
}

export const ExpiryMonitorView: React.FC<ExpiryMonitorViewProps> = ({
  items,
  onTriggerAgentSolution,
}) => {
  const { t } = useI18n();

  const [thresholdDays, setThresholdDays] = useState<number>(3); // 1, 3, or 7 days
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hours' | 'cost' | 'name'>('hours');

  // Compute assessments for all items
  const assessments = useMemo(() => {
    return items.map((item) => ({
      item,
      risk: evaluateItemRisk(item),
    }));
  }, [items]);

  // Filtered & sorted
  const filteredAssessments = useMemo(() => {
    return assessments
      .filter(({ item, risk }) => {
        // Exclude nominal items that expire beyond thresholdDays unless all is selected
        if (selectedTier === 'all') {
          return risk.riskTier === 'expired' || risk.daysRemaining <= thresholdDays;
        }
        return risk.riskTier === selectedTier;
      })
      .sort((a, b) => {
        if (sortBy === 'hours') return a.risk.hoursRemaining - b.risk.hoursRemaining;
        if (sortBy === 'cost') return b.risk.costAtRisk - a.risk.costAtRisk;
        return a.item.name.localeCompare(b.item.name);
      });
  }, [assessments, thresholdDays, selectedTier, sortBy]);

  // Aggregate stats
  const totalCostAtRisk = useMemo(() => {
    return assessments.reduce((acc, { risk }) => {
      if (risk.riskTier === 'critical' || risk.riskTier === 'expired') {
        return acc + risk.costAtRisk;
      }
      return acc;
    }, 0);
  }, [assessments]);

  const criticalCount = assessments.filter(({ risk }) => risk.riskTier === 'critical').length;
  const expiredCount = assessments.filter(({ risk }) => risk.riskTier === 'expired').length;
  const lowStockCount = items.filter((i) => i.quantity <= 15 && i.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Expiry Risk Detection & Perishable Horizon
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time deterministic shelf-life monitor identifying impending spoilage before food becomes unsafe.
          </p>
        </div>

        {/* Configurable Horizon Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          <span className="text-[11px] text-slate-400 px-2">Risk Horizon:</span>
          <button
            onClick={() => setThresholdDays(1)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              thresholdDays === 1
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setThresholdDays(3)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              thresholdDays === 3
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3 Days
          </button>
          <button
            onClick={() => setThresholdDays(7)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              thresholdDays === 7
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            Critical (&lt;24h)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
              {criticalCount}
            </span>
            <span className="text-xs text-slate-500">items</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Immediate action required</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">
            Expired (Quarantined)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-red-700 dark:text-red-400">
              {expiredCount}
            </span>
            <span className="text-xs text-slate-500">batches</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero human consumption</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Financial Value at Risk
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              ₹{(totalCostAtRisk * 83).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500">(${totalCostAtRisk.toFixed(2)})</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ingredient loss if untreated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
            Low Stock Replenishment
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
              {lowStockCount}
            </span>
            <span className="text-xs text-slate-500">items</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Below threshold (&le;15 units)</span>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filter By Risk:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Approaching Horizon</option>
            <option value="critical">Critical Only (&lt;24h)</option>
            <option value="moderate">Moderate Only (24h - 72h)</option>
            <option value="expired">Expired Batches</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          >
            <option value="hours">Hours Remaining (Shortest First)</option>
            <option value="cost">Cost at Risk (Highest First)</option>
            <option value="name">Item Name</option>
          </select>
        </div>
      </div>

      {/* Risk Items Cards List */}
      <div className="space-y-3">
        {filteredAssessments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
              No inventory records match the selected horizon.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              All other tracked stock items are within nominal shelf-life thresholds.
            </p>
          </div>
        ) : (
          filteredAssessments.map(({ item, risk }) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all duration-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                risk.riskTier === 'expired'
                  ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10'
                  : risk.riskTier === 'critical'
                  ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white">{item.name}</span>
                  <span className="text-xs text-slate-500 font-mono">({item.category.replace('_', ' ')})</span>
                  {risk.riskTier === 'expired' ? (
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-sm border border-red-200 dark:border-red-800">
                      Expired
                    </span>
                  ) : risk.riskTier === 'critical' ? (
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-sm border border-amber-200 dark:border-amber-800">
                      Critical ({risk.hoursRemaining}h left)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-sm border border-blue-200 dark:border-blue-800">
                      Moderate ({risk.daysRemaining} days left)
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                  <span>Batch: <strong className="font-mono text-slate-900 dark:text-white">{item.batchNumber}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Balance: <strong className="font-mono text-slate-900 dark:text-white">{item.quantity} {item.unit}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Zone: <strong className="capitalize text-slate-900 dark:text-white">{item.storageCondition} ({item.location})</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Value at Risk: <strong className="font-mono text-slate-900 dark:text-white">₹{(risk.costAtRisk * 83).toFixed(0)} (${risk.costAtRisk.toFixed(2)})</strong></span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal italic">
                  {risk.deterministicReason}
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => onTriggerAgentSolution(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Agent Solution</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

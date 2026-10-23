/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Utensils,
  Award,
  ShieldCheck,
  AlertTriangle,
  Package,
  Clock,
  PieChart,
} from 'lucide-react';
import { InventoryItem, AuditRecord, ProposedAction } from '../types/inventory.ts';
import { evaluateInventorySummary, evaluateItemRisk } from '../utils/riskCalculator.ts';
import { computeCumulativeEsgMetrics } from '../utils/auditLogger.ts';
import { CATEGORY_VISUALS } from '../data/categoryImages.ts';

interface AnalyticsViewProps {
  items: InventoryItem[];
  auditLogs: AuditRecord[];
  proposedActions: ProposedAction[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  items,
  auditLogs,
  proposedActions,
}) => {
  // 1. Dynamic Inventory Summary
  const invSummary = useMemo(() => evaluateInventorySummary(items), [items]);

  // 2. Cumulative ESG from real audit logs
  const esg = useMemo(() => computeCumulativeEsgMetrics(auditLogs), [auditLogs]);

  // 3. Category distribution
  const categoryStats = useMemo(() => {
    const counts: Record<string, { count: number; totalQty: number; value: number }> = {};
    for (const catKey of Object.keys(CATEGORY_VISUALS)) {
      counts[catKey] = { count: 0, totalQty: 0, value: 0 };
    }

    for (const item of items) {
      const key = item.category === 'curd' ? 'curd' : item.category;
      if (!counts[key]) counts[key] = { count: 0, totalQty: 0, value: 0 };
      counts[key].count += 1;
      counts[key].totalQty += item.quantity;
      counts[key].value += item.quantity * item.unitCost;
    }

    return Object.entries(counts).map(([catId, data]) => ({
      catId,
      meta: CATEGORY_VISUALS[catId] || { defaultTitle: catId, hindiTitle: '' },
      ...data,
    }));
  }, [items]);

  // 4. Proposed Action approval stats
  const actionStats = useMemo(() => {
    const total = proposedActions.length;
    const approved = proposedActions.filter((a) => a.approvalStatus === 'approved').length;
    const rejected = proposedActions.filter((a) => a.approvalStatus === 'rejected').length;
    const pending = proposedActions.filter((a) => a.approvalStatus === 'pending').length;
    const resolutionRate = total > 0 ? Math.round(((approved + rejected) / total) * 100) : 100;
    const approvalRate = approved + rejected > 0 ? Math.round((approved / (approved + rejected)) * 100) : 100;

    return { total, approved, rejected, pending, resolutionRate, approvalRate };
  }, [proposedActions]);

  // 5. Expiry Risk breakdown
  const riskBreakdown = useMemo(() => {
    let under24h = 0;
    let under72h = 0;
    let safeOver72h = 0;
    let expired = 0;

    for (const item of items) {
      const r = evaluateItemRisk(item);
      if (r.riskTier === 'expired') expired++;
      else if (r.hoursRemaining <= 24) under24h++;
      else if (r.hoursRemaining <= 72) under72h++;
      else safeOver72h++;
    }

    const total = items.length || 1;
    return {
      under24h,
      under72h,
      safeOver72h,
      expired,
      safePercentage: Math.round((safeOver72h / total) * 100),
    };
  }, [items]);

  const maxCategoryQty = Math.max(...categoryStats.map((c) => c.totalQty), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Institutional Inventory Intelligence & Impact Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytical metrics derived from active canteen inventory, verifiable ledger disbursements, and agent actions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-200 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>FSSAI Dining Safety & Zero-Waste Protocol</span>
        </div>
      </div>

      {/* 4 Quantitative ESG Impact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Food Waste Diverted
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
              {esg.totalWasteAvoidedKg}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Audited mass diverted from landfill
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Meals Preserved
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
              {esg.totalMealsGenerated}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">portions</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Charity & mess repurposed nutrition
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Financial Value Saved
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
              ₹{(esg.totalCostPreserved * 83).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              (${esg.totalCostPreserved.toFixed(2)})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            Kitchen purchasing loss prevented
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              CO₂e Offset
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
              {esg.co2eAvoidedKg}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            2.5 kg CO₂e avoided per 1 kg food saved
          </span>
        </div>
      </div>

      {/* Analytical Charts & Distribution Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Volume & Value Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Inventory Category Distribution</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {invSummary.totalItems} Batches Tracked
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryStats.map((cat) => {
              const percentage = Math.round((cat.totalQty / maxCategoryQty) * 100);
              return (
                <div key={cat.catId} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cat.meta.defaultTitle}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({cat.count} items)
                      </span>
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {cat.totalQty} units · ₹{(cat.value * 83).toFixed(0)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shelf-Life Horizons & Governance Metrics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Shelf-Life Horizon Breakdown</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
              {riskBreakdown.safePercentage}% Nominal Stability
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
              <span className="text-amber-800 dark:text-amber-300 block font-semibold">Under 24h Left</span>
              <span className="text-2xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-1 block">
                {riskBreakdown.under24h} items
              </span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400 mt-0.5 block">
                Requires same-day disposal/redistribution
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
              <span className="text-blue-800 dark:text-blue-300 block font-semibold">24h - 72h Window</span>
              <span className="text-2xl font-bold font-mono text-blue-900 dark:text-blue-200 mt-1 block">
                {riskBreakdown.under72h} items
              </span>
              <span className="text-[10px] text-blue-700/80 dark:text-blue-400 mt-0.5 block">
                Eligible for kitchen repurposing
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-emerald-800 dark:text-emerald-300 block font-semibold">Safe (&gt; 72h)</span>
              <span className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1 block">
                {riskBreakdown.safeOver72h} items
              </span>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 mt-0.5 block">
                Stable kitchen storage
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
              <span className="text-red-800 dark:text-red-300 block font-semibold">Expired Quarantined</span>
              <span className="text-2xl font-bold font-mono text-red-900 dark:text-red-200 mt-1 block">
                {riskBreakdown.expired} items
              </span>
              <span className="text-[10px] text-red-700/80 dark:text-red-400 mt-0.5 block">
                Zero human consumption
              </span>
            </div>
          </div>

          {/* HITL Governance Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span>Agentic Recommendation Resolution</span>
              <span className="font-mono">{actionStats.approved} Approved / {actionStats.rejected} Rejected</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Human Approval Ratio: {actionStats.approvalRate}%</span>
              <span>Pending in Gate: {actionStats.pending}</span>
            </div>
          </div>

          {/* Transparent Storage & Methodology Disclosure */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Transparency Disclosure:</strong> Analytics and ESG metrics are computed directly from verified canteen ledger activity in this session. Inventory persists locally in your browser storage; it is not multi-user cloud synchronized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

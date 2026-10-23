/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Sparkles,
  Plus,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingDown,
  Truck,
  Leaf,
  Utensils,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { InventoryItem, ProposedAction, AuditRecord } from '../types/inventory.ts';
import { evaluateInventorySummary, evaluateItemRisk } from '../utils/riskCalculator.ts';
import { computeCumulativeEsgMetrics } from '../utils/auditLogger.ts';
import { CATEGORY_VISUALS } from '../data/categoryImages.ts';
import { useI18n } from '../context/I18nContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface DashboardViewProps {
  items: InventoryItem[];
  proposedActions: ProposedAction[];
  auditLogs: AuditRecord[];
  onNavigateTab: (tab: any) => void;
  onOpenAddItem: () => void;
  onRunAgent: () => void;
  onOpenCategoryGuide?: (categoryId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  proposedActions,
  auditLogs,
  onNavigateTab,
  onOpenAddItem,
  onRunAgent,
  onOpenCategoryGuide,
}) => {
  const { t } = useI18n();
  const { user } = useAuth();

  const inventorySummary = useMemo(() => evaluateInventorySummary(items), [items]);
  const esgMetrics = useMemo(() => computeCumulativeEsgMetrics(auditLogs), [auditLogs]);
  const pendingActions = proposedActions.filter((a) => a.approvalStatus === 'pending');

  return (
    <div className="space-y-8">
      {/* Welcome & Command Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Live Facility Telemetry
            </span>
            <span className="text-xs text-emerald-200/80 font-mono">
              {user?.facility || 'Campus Dining System'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Kitchen Steward'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            AnnaRaksha AI is monitoring {items.length} food inventory batches. Currently detecting {inventorySummary.criticalCount} perishable batches requiring urgent action today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onRunAgent}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>Generate Agent Solution</span>
          </button>

          <button
            onClick={onOpenAddItem}
            className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/40 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* 4-KPI Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('inventory')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('trackedStock')}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {inventorySummary.totalItems}
            </span>
            <span className="text-xs text-slate-500">batches</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active kitchen stock</span>
        </div>

        <div
          onClick={() => onNavigateTab('expiry_monitor')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-600 transition-all"
        >
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            {t('criticalRisk')}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
              {inventorySummary.criticalCount}
            </span>
            <span className="text-xs text-slate-500">&lt;24h left</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires action before spoilage</span>
        </div>

        <div
          onClick={() => onNavigateTab('expiry_monitor')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-600 transition-all"
        >
          <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider block">
            {t('expiredStock')}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-red-700 dark:text-red-400">
              {inventorySummary.expiredCount}
            </span>
            <span className="text-xs text-slate-500">segregated</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero human consumption</span>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 transition-all"
        >
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('costAtRisk')}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              ₹{(inventorySummary.totalCostAtRisk * 83).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500">(${inventorySummary.totalCostAtRisk.toFixed(2)})</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Potential financial loss</span>
        </div>
      </div>

      {/* Pending Agent Action Alert Banner (if any) */}
      {pendingActions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {pendingActions.length} Actions Awaiting Your Human Approval
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                The agent formulated verified redistribution and kitchen repurpose proposals. Review before execution.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('agent_solution')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs self-start sm:self-auto"
          >
            <span>Review Proposals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category Visual Grid Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Food Categories & Specialized Handling
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any category to inspect temperature zones, shelf horizons, and kitchen handling protocols.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenCategoryGuide ? onOpenCategoryGuide('dairy') : onNavigateTab('inventory')}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Handling Guide &rarr;
            </button>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              All Inventory &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_VISUALS).slice(0, 4).map(([key, item]) => {
            const count = items.filter((i) => i.category === item.id).length;
            return (
              <div
                key={key}
                onClick={() => onOpenCategoryGuide ? onOpenCategoryGuide(key) : onNavigateTab('inventory')}
                role="button"
                tabIndex={0}
                className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all group hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.photoAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 text-xs font-bold font-mono text-white bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {count} items
                  </span>
                  <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-emerald-300 bg-slate-900/80 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    {item.handling.storageZone}
                  </span>
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.defaultTitle}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{item.hindiTitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ESG Proof & Audit Snapshot */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ESG Proof */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Verifiable ESG & Waste Reduction</span>
            </h3>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Full Analytics &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">{t('wasteAvoided')}</span>
              <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-1 block">
                {esgMetrics.totalWasteAvoidedKg} kg
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-semibold">{t('mealsServed')}</span>
              <span className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-1 block">
                {esgMetrics.totalMealsGenerated}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Audit Log */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Immutable Ledger Receipts</span>
            </h3>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              View All Logs &rarr;
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{log.summary}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.performedBy} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                  {log.verificationHash.slice(0, 14)}...
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

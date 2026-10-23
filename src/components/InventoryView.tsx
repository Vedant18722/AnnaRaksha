/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Clock, Trash2, Edit2, ShieldAlert, Sparkles, Plus, BookOpen } from 'lucide-react';
import { InventoryItem, FoodCategory, RiskTier, StorageCondition } from '../types/inventory.ts';
import { evaluateItemRisk, evaluateInventorySummary } from '../utils/riskCalculator.ts';

interface InventoryViewProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenAddItem: () => void;
  onQuickAction: (item: InventoryItem) => void;
  initialCategoryFilter?: string;
  onOpenCategoryGuide?: (categoryId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onOpenAddItem,
  onQuickAction,
  initialCategoryFilter = 'all',
  onOpenCategoryGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategoryFilter && initialCategoryFilter !== 'all') {
      setSelectedCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  const summary = useMemo(() => evaluateInventorySummary(items), [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const risk = evaluateItemRisk(item);

      // Search match
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Storage match
      const matchesStorage = selectedStorage === 'all' || item.storageCondition === selectedStorage;

      // Risk match
      const matchesRisk = selectedRisk === 'all' || risk.riskTier === selectedRisk;

      return matchesSearch && matchesCategory && matchesStorage && matchesRisk;
    });
  }, [items, searchQuery, selectedCategory, selectedStorage, selectedRisk]);

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteItem(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Column Executive Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Tracked Stock Items
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {summary.totalItems}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">records</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">Campus canteen & hostel store</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Critical Spoilage Risk
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {summary.criticalCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">under 24h</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">Requires prompt action today</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider block">
            Expired (Quarantined)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-red-600 dark:text-red-400">
              {summary.expiredCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">segregated</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">Zero human consumption</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Cost At Risk
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              ₹{(summary.totalCostAtRisk * 83).toFixed(0)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">(${summary.totalCostAtRisk.toFixed(2)})</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">Potential loss if unmitigated</span>
        </div>
      </div>

      {/* Control Bar: Search & Multi-Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food item, batch number, or storage location..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">All Categories</option>
            <option value="dairy">Dairy</option>
            <option value="produce">Fresh Vegetables</option>
            <option value="fruits">Seasonal Fruits</option>
            <option value="bakery">Bakery</option>
            <option value="grains">Grains & Pulses</option>
            <option value="prepared_meals">Prepared Meals</option>
            <option value="proteins">Proteins & Tofu</option>
          </select>

          {/* Storage Filter */}
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">All Storage</option>
            <option value="refrigerated">Refrigerated</option>
            <option value="frozen">Frozen</option>
            <option value="ambient">Ambient</option>
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">All Risk Tiers</option>
            <option value="critical">Critical (&lt;24h)</option>
            <option value="moderate">Moderate (24h-72h)</option>
            <option value="nominal">Nominal (&gt;72h)</option>
            <option value="expired">Expired</option>
          </select>

          {onOpenCategoryGuide && (
            <button
              onClick={() => onOpenCategoryGuide(selectedCategory === 'all' ? 'dairy' : selectedCategory)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Open Food Categories & Specialized Handling Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Handling Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Item & Batch Details</th>
                <th className="py-3 px-4">Storage Zone</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Expiry Window</th>
                <th className="py-3 px-4">Deterministic Risk</th>
                <th className="py-3 px-4 text-right">Cost at Risk</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No matching inventory records found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add a new stock item.</p>
                    <button
                      onClick={onOpenAddItem}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Stock Item</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const risk = evaluateItemRisk(item);
                  const expiryDateObj = new Date(item.expiryDate);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Name & Metadata */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span
                            onClick={() => onOpenCategoryGuide?.(item.category)}
                            className="capitalize cursor-pointer hover:underline text-emerald-700 dark:text-emerald-400 font-medium"
                          >
                            {item.category.replace('_', ' ')}
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="font-mono text-slate-600 dark:text-slate-400">{item.batchNumber}</span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-slate-600 dark:text-slate-400">{item.location}</span>
                        </div>
                      </td>

                      {/* Storage Condition */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                          {item.storageCondition}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-right font-mono font-medium tabular-nums text-slate-900 dark:text-white">
                        {item.quantity} {item.unit}
                      </td>

                      {/* Expiry Window */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                          {expiryDateObj.toLocaleDateString()} {expiryDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {risk.hoursRemaining <= 0 ? (
                            <span className="text-red-600 dark:text-red-400 font-semibold">Expired</span>
                          ) : (
                            <span>{risk.hoursRemaining}h remaining</span>
                          )}
                        </div>
                      </td>

                      {/* Risk Tier with unboxed clean styling */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {risk.riskTier === 'expired' && (
                            <span className="text-red-700 dark:text-red-400 font-semibold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                              Expired
                            </span>
                          )}
                          {risk.riskTier === 'critical' && (
                            <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Critical
                            </span>
                          )}
                          {risk.riskTier === 'moderate' && (
                            <span className="text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              Moderate
                            </span>
                          )}
                          {risk.riskTier === 'nominal' && (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              Nominal
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-xs mt-0.5 line-clamp-1" title={risk.deterministicReason}>
                          {risk.deterministicReason}
                        </p>
                      </td>

                      {/* Cost at Risk */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-white font-bold">
                        ₹{(risk.costAtRisk * 83).toFixed(0)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onQuickAction(item)}
                            title="Generate Agent Solution"
                            className="p-1.5 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            title="Edit Item"
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            title="Delete Item"
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Deletion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to remove this stock record? This operation will be recorded in the audit trail.
            </p>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

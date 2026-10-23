/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Thermometer,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  BookOpen,
} from 'lucide-react';
import { CATEGORY_VISUALS, CategoryVisualMeta } from '../data/categoryImages.ts';

interface CategoryHandlingModalProps {
  isOpen: boolean;
  initialCategoryId?: string;
  onClose: () => void;
  onFilterInventoryByCategory?: (categoryId: string) => void;
}

export const CategoryHandlingModal: React.FC<CategoryHandlingModalProps> = ({
  isOpen,
  initialCategoryId = 'dairy',
  onClose,
  onFilterInventoryByCategory,
}) => {
  if (!isOpen) return null;

  const categories = Object.values(CATEGORY_VISUALS);
  const [selectedId, setSelectedId] = useState<string>(
    CATEGORY_VISUALS[initialCategoryId] ? initialCategoryId : 'dairy'
  );
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const activeMeta: CategoryVisualMeta = CATEGORY_VISUALS[selectedId] || CATEGORY_VISUALS.dairy;

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="category-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Food Categories & Specialized Handling Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional canteen safety, temperature zones & spoilage mitigation protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Horizontal Pill Switcher */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto scrollbar-none flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedId === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.defaultTitle}</span>
              <span className="text-[10px] opacity-75 font-normal">({cat.hindiTitle})</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Section: Realistic Photograph + Quick Summary */}
          <div className="grid sm:grid-cols-12 gap-5 items-center">
            {/* Realistic Food Photograph */}
            <div className="sm:col-span-5 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-4/3 shadow-xs">
              {!imageError[activeMeta.id] ? (
                <img
                  src={activeMeta.photoUrl}
                  alt={activeMeta.photoAlt}
                  loading="lazy"
                  onError={() => handleImageError(activeMeta.id)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <Info className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-semibold">{activeMeta.defaultTitle}</span>
                  <span className="text-[10px] text-slate-400 mt-1">Photo unavailable offline</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3 text-white">
                <div className="font-bold text-xs">{activeMeta.defaultTitle}</div>
                <div className="text-[10px] text-amber-300 font-medium">{activeMeta.hindiTitle}</div>
              </div>
            </div>

            {/* Quick Metrics & Parameters */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Storage Protocol
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeMeta.defaultTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {activeMeta.tagline}
                </p>
              </div>

              {/* Key Parameters Cards */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                    <span>Target Temperature</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 text-[11px] leading-snug">
                    {activeMeta.handling.recommendedTemp}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Avg Shelf Horizon</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 text-[11px]">
                    ~{activeMeta.handling.maxShelfLifeDays} Days
                  </div>
                </div>
              </div>

              {/* Typical Pantry & Kitchen Items */}
              <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Common Items: </span>
                {activeMeta.typicalItems.join(', ')}
              </div>
            </div>
          </div>

          {/* Critical Handling Rules */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Standard Operational Handling Procedures</span>
            </h4>
            <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
              {activeMeta.handling.criticalRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spoilage & Sensory Check */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Sensory Spoilage Indicators (Quarantine Triggers)</span>
            </h4>
            <ul className="grid sm:grid-cols-3 gap-2 text-xs text-amber-950 dark:text-amber-200">
              {activeMeta.handling.spoilageIndicators.map((indicator, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{indicator}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authoritative Disclaimer Note */}
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-700 dark:text-slate-300">Regulatory & Safety Notice: </strong>
              {activeMeta.handling.regulatoryNote}{' '}
              Storage requirements depend on specific batch dates, packaging integrity, and local food-safety authority regulations (e.g. FSSAI or campus dining guidelines).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Close Guide
          </button>

          {onFilterInventoryByCategory && (
            <button
              onClick={() => {
                onFilterInventoryByCategory(activeMeta.id === 'curd' ? 'dairy' : activeMeta.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <span>View {activeMeta.defaultTitle} in Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

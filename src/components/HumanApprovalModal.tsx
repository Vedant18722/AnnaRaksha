/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Building2, Utensils, ShieldCheck } from 'lucide-react';
import { ProposedAction, InventoryItem } from '../types/inventory.ts';

interface HumanApprovalModalProps {
  isOpen: boolean;
  action: ProposedAction | null;
  item: InventoryItem | null;
  onClose: () => void;
  onApprove: (action: ProposedAction, approvedQuantity: number) => void;
  onReject: (actionId: string, reason: string) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  action,
  item,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !action || !item) return null;

  const [quantity, setQuantity] = useState<string>(action.quantity.toString());
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleApprove = () => {
    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    if (numQty > item.quantity) {
      setError(`Quantity cannot exceed current on-hand stock (${item.quantity} ${item.unit}).`);
      return;
    }

    onApprove(action, numQty);
    onClose();
  };

  const handleReject = () => {
    onReject(action.id, rejectReason.trim() || 'Declined by kitchen manager.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 id="approval-title" className="text-base font-bold text-slate-900 dark:text-white">
              Human-in-the-Loop Action Gate
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Action Overview Banner */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                {action.actionType === 'ngo_donation' && 'Proposed Local NGO Redistribution'}
                {action.actionType === 'kitchen_repurpose' && 'Proposed Kitchen Recipe Repurposing'}
                {action.actionType === 'quarantine_spoilage' && 'Proposed Spoilage Quarantine'}
              </span>
              <span className="px-2 py-0.5 rounded-sm font-semibold uppercase text-[10px] tracking-wider bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300">
                Urgency: {action.urgency}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{action.rationale}</p>
          </div>

          {/* Action Parameters Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 text-xs bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Target Stock Item:</span>
              <span className="font-bold text-slate-900 dark:text-white">{item.name} ({item.batchNumber})</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Current On-Hand Balance:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                {item.quantity} {item.unit}
              </span>
            </div>

            {action.recipientOrgName && (
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Designated Partner:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{action.recipientOrgName}</span>
              </div>
            )}

            {action.recipeTitle && (
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-slate-400" />
                  Culinary Procedure:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{action.recipeTitle}</span>
              </div>
            )}

            {/* Editable Quantity Control */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                Approved Quantity to Allocate ({item.unit})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={item.quantity}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">{item.unit}</span>
              </div>
              {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">{error}</p>}
            </div>
          </div>

          {/* Expected Impact Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">Waste Avoided</span>
              <span className="text-base font-bold font-mono text-emerald-800 dark:text-emerald-400">
                {action.expectedImpact.wasteAvoidedKg} kg
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">Meals Preserved</span>
              <span className="text-base font-bold font-mono text-emerald-800 dark:text-emerald-400">
                {action.expectedImpact.mealsGenerated}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">Value Saved</span>
              <span className="text-base font-bold font-mono text-emerald-800 dark:text-emerald-400">
                ₹{(action.expectedImpact.costPreserved * 83).toFixed(0)}
              </span>
            </div>
          </div>

          {/* Rejection Drawer if toggled */}
          {isRejecting ? (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl space-y-2 text-xs">
              <label className="block font-semibold text-red-900 dark:text-red-300">
                Provide reason for declining this proposed action:
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Needed for unexpected weekend catering booking"
                className="w-full px-3 py-1.5 text-xs border border-red-300 dark:border-red-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3 py-1 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            /* Action Buttons */
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Proposal</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Execute Operation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

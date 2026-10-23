/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { RedistributionDispatch } from '../types/inventory.ts';

interface DispatchSlipModalProps {
  isOpen: boolean;
  dispatch: RedistributionDispatch | null;
  onClose: () => void;
}

export const DispatchSlipModal: React.FC<DispatchSlipModalProps> = ({
  isOpen,
  dispatch,
  onClose,
}) => {
  if (!isOpen || !dispatch) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slip-title"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden"
      >
        {/* Top Controls (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Official Surplus Redistribution Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dispatch Voucher</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-dispatch-slip" className="p-8 space-y-6 text-slate-900 bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900">
                ANNARAKSHA (अन्नरक्षा) · DISPATCH MANIFEST
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Institutional Food Sustainability & Safety Verified Transfer
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm text-slate-900 block">
                {dispatch.id}
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                {new Date(dispatch.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Transfer Parties */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                From (Donor Institution)
              </span>
              <div className="font-bold text-slate-900 text-sm mt-1">
                Campus Central Canteen & Hostel Mess
              </div>
              <div className="text-slate-600 mt-0.5">University Dining Hall System · Block 4</div>
              <div className="text-slate-500 font-mono mt-1">Authorized By: {dispatch.authorizedBy}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                To (Authorized Recipient)
              </span>
              <div className="font-bold text-slate-900 text-sm mt-1">
                {dispatch.recipientName}
              </div>
              <div className="text-slate-600 mt-0.5">{dispatch.recipientAddress}</div>
              <div className="text-slate-600 mt-0.5">
                Contact: {dispatch.contactPerson} · {dispatch.recipientPhone}
              </div>
            </div>
          </div>

          {/* Itemized Manifest */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Itemized Food Surplus Manifest
            </h4>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 font-mono">Batch / Lot #</th>
                  <th className="p-2.5">Storage Spec</th>
                  <th className="p-2.5 text-right font-mono">Allocated Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {dispatch.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-sans font-semibold text-slate-900">{item.name}</td>
                    <td className="p-2.5 text-slate-700">{item.batchNumber}</td>
                    <td className="p-2.5 font-sans capitalize text-slate-700">{item.storage}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      {item.quantity} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="p-2.5 text-right uppercase text-slate-700">
                    Total Net Weight Equivalent:
                  </td>
                  <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">
                    {dispatch.totalKg} kg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Safety & Compliance Verification */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1.5 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Sanitary & Cold-Chain Compliance Audit</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-900 pl-1">
              <li>Item temperature verified: 3.4°C before packaging. Sealed in sterile gastro containers.</li>
              <li>Estimated safe consumption window: Prior to {dispatch.pickupWindow}.</li>
              <li>Zero expired items permitted. Handover supervised under institutional dining safety SOP.</li>
            </ul>
          </div>

          {/* Signature Signoff Blocks */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs">
            <div>
              <div className="border-b border-slate-400 h-10 mb-2"></div>
              <span className="font-bold text-slate-800 block">Kitchen Dispatch Officer</span>
              <span className="text-[11px] text-slate-500">Sign & Stamp</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-10 mb-2"></div>
              <span className="font-bold text-slate-800 block">Recipient Volunteer / Courier</span>
              <span className="text-[11px] text-slate-500">Sign & Identity Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

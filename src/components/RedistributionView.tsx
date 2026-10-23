/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, CheckCircle, Clock, Truck, FileText, Phone, MapPin, ShieldCheck, Thermometer } from 'lucide-react';
import { RecipientOrg, RedistributionDispatch } from '../types/inventory.ts';

interface RedistributionViewProps {
  recipients: RecipientOrg[];
  dispatches: RedistributionDispatch[];
  onOpenDispatchSlip: (dispatch: RedistributionDispatch) => void;
  onUpdateDispatchStatus: (dispatchId: string, newStatus: RedistributionDispatch['status']) => void;
}

export const RedistributionView: React.FC<RedistributionViewProps> = ({
  recipients,
  dispatches,
  onOpenDispatchSlip,
  onUpdateDispatchStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'dispatches' | 'directory'>('dispatches');

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Surplus Redistribution & Partner Dispatch Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Coordinates audited handovers to qualified local NGO partners with cold-chain verification and printable transfer manifests.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab('dispatches')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'dispatches'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dispatch Transfers ({dispatches.length})
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Partner Directory ({recipients.length})
          </button>
        </div>
      </div>

      {activeTab === 'dispatches' ? (
        /* Dispatches List */
        <div className="space-y-4">
          {dispatches.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active surplus dispatches scheduled.</p>
              <p className="text-xs text-slate-400 mt-1">
                When you approve an NGO redistribution action in the Agent Planner, a verified transfer voucher will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {dispatches.map((dispatch) => (
                <div
                  key={dispatch.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">{dispatch.id}</span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{dispatch.recipientName}</h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{dispatch.recipientAddress}</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                        dispatch.status === 'collected'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {dispatch.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Manifest Item Strip */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      {dispatch.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-mono">
                          <span className="font-sans text-slate-700 dark:text-slate-300">{item.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1 flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Net Surplus Weight:</span>
                        <span className="font-mono text-emerald-800 dark:text-emerald-400">{dispatch.totalKg} kg</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pickup Window: {dispatch.pickupWindow}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cold Chain: {dispatch.requiresColdChain ? 'Required (Refrigerated Transfer)' : 'Ambient Transfer'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {/* Status update switcher */}
                    <select
                      value={dispatch.status}
                      onChange={(e) => onUpdateDispatchStatus(dispatch.id, e.target.value as any)}
                      className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="collected">Collected / Verified</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => onOpenDispatchSlip(dispatch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Official Slip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Verified Partner Directory */
        <div className="grid md:grid-cols-2 gap-4">
          {recipients.map((org) => (
            <div key={org.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{org.name}</h3>
                    {org.isVerified && (
                      <span title="Verified Charity Partner" className="text-emerald-700 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{org.type.replace('_', ' ')}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">{org.distanceKm} km</span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{org.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{org.contactPhone || org.phone} ({org.contactPerson})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Accepts: {org.acceptedCategories.join(', ')}</span>
                <span className={`font-semibold ${org.hasColdChain ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {org.hasColdChain ? 'Cold-Chain Certified' : 'Dry/Ambient Only'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

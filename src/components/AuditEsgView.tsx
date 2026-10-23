/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ShieldCheck, Download, Award, Leaf, Utensils, DollarSign, CheckCircle2 } from 'lucide-react';
import { AuditRecord } from '../types/inventory.ts';
import { computeCumulativeEsgMetrics } from '../utils/auditLogger.ts';

interface AuditEsgViewProps {
  auditLogs: AuditRecord[];
}

export const AuditEsgView: React.FC<AuditEsgViewProps> = ({ auditLogs }) => {
  const esg = useMemo(() => computeCumulativeEsgMetrics(auditLogs), [auditLogs]);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shelfsense-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* 4 Quantitative ESG & Efficiency Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Food Waste Avoided
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-800">
              {esg.totalWasteAvoidedKg}
            </span>
            <span className="text-xs text-slate-500 font-medium">kg total</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified weight diverted from landfill</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Meal Portions Provided
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-800">
              {esg.totalMealsGenerated}
            </span>
            <span className="text-xs text-slate-500 font-medium">servings</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Charity & campus mess portions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Financial Value Saved
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-800">
              ${esg.totalCostPreserved.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">USD</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ingredient purchasing loss avoided</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              CO₂e Offset Avoided
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-800">
              {esg.co2eAvoidedKg}
            </span>
            <span className="text-xs text-slate-500 font-medium">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">UN FAO benchmark: 2.5kg per kg food</span>
        </div>
      </div>

      {/* Audit Trail Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-slate-900">
                Immutable Operation Audit Ledger ({auditLogs.length} Records)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographically signed event receipts capturing actor approvals, parameter overrides, and inventory balances.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit JSON</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Operation Summary</th>
                <th className="py-3 px-4 text-right">Verified Impact</th>
                <th className="py-3 px-4 text-right font-mono">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      <div>{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      <div className="text-slate-400">{log.id}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 capitalize">
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      <span className="font-medium text-slate-900">{log.performedBy}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.summary}</div>
                      {log.details && (
                        <div className="text-[11px] text-slate-500 line-clamp-1">{log.details}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] tabular-nums whitespace-nowrap">
                      {log.impact && log.impact.wasteAvoidedKg > 0 ? (
                        <span className="text-emerald-800 font-semibold">
                          +{log.impact.wasteAvoidedKg} kg (${log.impact.costPreserved.toFixed(2)})
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {log.verificationHash}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

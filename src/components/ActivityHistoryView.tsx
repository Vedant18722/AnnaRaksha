/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';
import { AuditRecord } from '../types/inventory.ts';

interface ActivityHistoryViewProps {
  auditLogs: AuditRecord[];
}

export const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedActor, setSelectedActor] = useState<string>('all');

  // Sorted newest first
  const sortedLogs = useMemo(() => {
    return [...auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [auditLogs]);

  // Filtered
  const filteredLogs = useMemo(() => {
    return sortedLogs.filter((log) => {
      const matchesSearch =
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.verificationHash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || log.actionType === selectedType;
      const actorName = log.actorRole || log.performedBy;
      const matchesActor = selectedActor === 'all' || actorName.toLowerCase().includes(selectedActor.toLowerCase());

      return matchesSearch && matchesType && matchesActor;
    });
  }, [sortedLogs, searchQuery, selectedType, selectedActor]);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `annaraksha-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'ngo_donation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>NGO Donation</span>
          </span>
        );
      case 'kitchen_repurpose':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3 h-3" />
            <span>Kitchen Repurpose</span>
          </span>
        );
      case 'quarantine_spoilage':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3 h-3" />
            <span>Quarantine Spoilage</span>
          </span>
        );
      case 'recommendation_rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <XCircle className="w-3 h-3" />
            <span>Proposal Declined</span>
          </span>
        );
      case 'stock_created':
      case 'stock_updated':
      case 'stock_deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <FileText className="w-3 h-3" />
            <span>Inventory Change</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span>{type.replace(/_/g, ' ')}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Activity History & Cryptographic Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological, immutable record of inventory operations, AI proposals, human approvals, and dispatches.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors self-start md:self-auto shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Ledger (.json)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action ID, actor, item, or hash..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Action Types</option>
            <option value="ngo_donation">NGO Donation</option>
            <option value="kitchen_repurpose">Kitchen Repurpose</option>
            <option value="quarantine_spoilage">Quarantine Spoilage</option>
            <option value="recommendation_rejected">Declined Proposals</option>
          </select>

          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Actors</option>
            <option value="manager">Kitchen Steward / Manager</option>
            <option value="system">Autonomous Agent / System</option>
          </select>
        </div>
      </div>

      {/* Chronological Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Event Classification</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Operation Summary</th>
                <th className="py-3 px-4 text-right">Verified Impact</th>
                <th className="py-3 px-4 text-right font-mono">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No matching activity records found.</p>
                    <p className="text-xs text-slate-400 mt-1">Actions approved in the Agent Solution Planner will be logged here.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-900 dark:text-white font-bold">{log.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getActionBadge(log.actionType)}</td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                          {log.actorRole || log.performedBy}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{log.details}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Ref: {log.actionId}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-emerald-800 dark:text-emerald-400 font-mono">
                          +{log.impact.wasteAvoidedKg} kg diverted
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {log.impact.mealsGenerated} meals · ₹{(log.impact.costPreserved * 83).toFixed(0)} saved
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] border border-slate-200 dark:border-slate-700">
                          {log.verificationHash.slice(0, 16)}...
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, ArrowRight, Building2, Utensils, CheckCircle2, XCircle, RefreshCw, Cpu } from 'lucide-react';
import { ProposedAction, InventoryItem, RecipientOrg, RepurposeRecipe } from '../types/inventory.ts';

interface AgentPlannerViewProps {
  proposedActions: ProposedAction[];
  inventory: InventoryItem[];
  recipients: RecipientOrg[];
  recipes: RepurposeRecipe[];
  isLoading: boolean;
  onRunPlanner: () => void;
  onSelectActionForReview: (action: ProposedAction) => void;
  executiveSummary: string;
  identifiedRisks: Array<{ itemId: string; itemName: string; reason: string; severity: string }>;
  assumptions: string[];
  agentProvider: string;
}

export const AgentPlannerView: React.FC<AgentPlannerViewProps> = ({
  proposedActions,
  inventory,
  recipients,
  recipes,
  isLoading,
  onRunPlanner,
  onSelectActionForReview,
  executiveSummary,
  identifiedRisks,
  assumptions,
  agentProvider,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredActions = proposedActions.filter((action) => {
    if (filter === 'pending') return action.approvalStatus === 'pending';
    if (filter === 'resolved') return action.approvalStatus === 'approved' || action.approvalStatus === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Agent Workflow Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Agentic Action Planner & HITL Gate
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Autonomous reasoning coordinates multi-step mitigation while enforcing strict human approval before state mutations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              Provider: <strong className="text-slate-900 dark:text-white">{agentProvider}</strong>
            </span>

            <button
              onClick={onRunPlanner}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-400 rounded-lg transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Plan...' : 'Run Agentic Analysis'}</span>
            </button>
          </div>
        </div>

        {/* 4 Controlled Workflow Phases */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
            <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase">Step 01</span>
            <span className="font-semibold block mt-0.5">Telemetry Ingestion</span>
            <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300">Evaluates live shelf-life & velocity</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
            <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase">Step 02</span>
            <span className="font-semibold block mt-0.5">Safety & Cold-Chain Check</span>
            <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300">Strict zero-consumption past expiry</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
            <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase">Step 03</span>
            <span className="font-semibold block mt-0.5">Dual-Channel Formulation</span>
            <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300">Matches verified NGOs & recipes</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200">
            <span className="font-bold text-[10px] text-amber-800 dark:text-amber-400 block uppercase">Step 04</span>
            <span className="font-semibold block mt-0.5">Human Approval Gate</span>
            <span className="text-[10px] text-amber-900/80 dark:text-amber-300">Explicit signoff required for execution</span>
          </div>
        </div>
      </div>

      {/* Synthesis Diagnostic Report */}
      {executiveSummary && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Agent Diagnostic Assessment
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live Inventory Context Analyzed
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            {executiveSummary}
          </p>

          {/* Identified Hazards & Assumptions */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Identified Spoilage Hazards ({identifiedRisks.length})
              </span>
              <ul className="space-y-1.5">
                {identifiedRisks.map((risk, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-900 dark:text-white">{risk.itemName}:</strong> {risk.reason}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                Agent Working Assumptions ({assumptions.length})
              </span>
              <ul className="space-y-1.5">
                {assumptions.map((asm, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                    {asm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Proposed Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Structured Action Proposals ({proposedActions.length})
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Proposals
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'pending' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending Approval ({proposedActions.filter((a) => a.approvalStatus === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'resolved' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Resolved History
            </button>
          </div>
        </div>

        {filteredActions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No proposed actions in this view.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Run Agentic Analysis&quot; to synthesize fresh mitigation proposals for items approaching expiry.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredActions.map((action) => {
              const targetItem = inventory.find((i) => i.id === action.targetItemId);
              const isPending = action.approvalStatus === 'pending';
              const isApproved = action.approvalStatus === 'approved';
              const isRejected = action.approvalStatus === 'rejected';

              return (
                <div
                  key={action.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                    isPending
                      ? 'border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 opacity-90'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span>{action.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="uppercase text-[10px] font-bold text-slate-600 dark:text-slate-400">Urgency: {action.urgency}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {action.actionType === 'ngo_donation' && 'Dispatch to Verified Local NGO'}
                          {action.actionType === 'kitchen_repurpose' && 'Kitchen Culinary Repurposing'}
                          {action.actionType === 'quarantine_spoilage' && 'Sanitary Spoilage Quarantine'}
                        </h4>
                      </div>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-sm">
                          Pending Approval
                        </span>
                      )}
                      {isApproved && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                          Approved & Executed
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-sm flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          Declined
                        </span>
                      )}
                    </div>

                    {/* Stock Item Badge */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] block">Target Item:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{action.itemName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] block">Proposed Allocation:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {action.quantity} {action.unit}
                        </span>
                      </div>
                    </div>

                    {/* Rationale */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {action.rationale}
                    </p>

                    {/* Channel Specific Info */}
                    {action.actionType === 'ngo_donation' && action.recipientOrgName && (
                      <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
                        <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-semibold">Recipient: {action.recipientOrgName}</span>
                          {action.recipientOrgAddress && (
                            <span className="text-[11px] text-emerald-800/80 dark:text-emerald-400 block">{action.recipientOrgAddress}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {action.actionType === 'kitchen_repurpose' && action.recipeTitle && (
                      <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/50">
                        <Utensils className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                        <div>
                          <span className="font-semibold">Repurposing Procedure: {action.recipeTitle}</span>
                          <span className="text-[11px] text-amber-800/80 dark:text-amber-400 block">Extends product utility and shelf stability</span>
                        </div>
                      </div>
                    )}

                    {/* Expected Impact Forecast */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Waste Avoided:</span>
                        <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
                          {action.expectedImpact.wasteAvoidedKg} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Preserved Value:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          ₹{(action.expectedImpact.costPreserved * 83).toFixed(0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Meals Saved:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {action.expectedImpact.mealsGenerated} portions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / HITL Gate Button */}
                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isPending ? 'Requires Steward Signoff' : `Decision recorded`}
                    </span>

                    {isPending ? (
                      <button
                        onClick={() => onSelectActionForReview(action)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
                      >
                        <span>Review & Decide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectActionForReview(action)}
                        className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline"
                      >
                        View Decision Ledger
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

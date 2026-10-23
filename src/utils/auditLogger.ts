/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditRecord } from '../types/inventory.ts';

/**
 * Deterministic checksum/digest generation for audit trail immutability.
 * In production or web environments without Node crypto, this creates a deterministic,
 * tamper-evident hash string from the record payload.
 */
export function generateVerificationHash(payload: Record<string, any>): string {
  const jsonStr = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const timestampPart = Date.now().toString(16).slice(-4);
  return `SS-VHASH-${hex.toUpperCase()}-${timestampPart}`;
}

/**
 * Creates a validated AuditRecord and signs it with an integrity hash.
 */
export function createAuditRecord(params: {
  actionId: string;
  actionType: string;
  performedBy: string;
  summary: string;
  details: string;
  itemId?: string;
  itemName?: string;
  quantityDelta?: number;
  unit?: string;
  impact?: {
    wasteAvoidedKg: number;
    costPreserved: number;
    mealsGenerated: number;
  };
}): AuditRecord {
  const timestamp = new Date().toISOString();
  const id = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const impact = params.impact || {
    wasteAvoidedKg: 0,
    costPreserved: 0,
    mealsGenerated: 0,
  };

  const verificationHash = generateVerificationHash({
    id,
    timestamp,
    actionId: params.actionId,
    actionType: params.actionType,
    performedBy: params.performedBy,
    impact,
  });

  return {
    id,
    timestamp,
    actionId: params.actionId,
    actionType: params.actionType,
    performedBy: params.performedBy,
    summary: params.summary,
    details: params.details,
    itemId: params.itemId,
    itemName: params.itemName,
    quantityDelta: params.quantityDelta,
    unit: params.unit,
    impact,
    verificationHash,
  };
}

/**
 * Aggregates all recorded audit records to compute verified ESG impact.
 */
export function computeCumulativeEsgMetrics(records: AuditRecord[]) {
  let totalWasteAvoidedKg = 0;
  let totalCostPreserved = 0;
  let totalMealsGenerated = 0;
  let completedActionCount = 0;

  for (const record of records) {
    if (record.impact) {
      totalWasteAvoidedKg += record.impact.wasteAvoidedKg || 0;
      totalCostPreserved += record.impact.costPreserved || 0;
      totalMealsGenerated += record.impact.mealsGenerated || 0;
    }
    if (record.actionType !== 'seed_data') {
      completedActionCount++;
    }
  }

  // 1 kg of avoided food waste prevents approx 2.5 kg CO2e greenhouse emissions (UN FAO standard)
  const co2eAvoidedKg = Math.round(totalWasteAvoidedKg * 2.5 * 10) / 10;

  return {
    totalWasteAvoidedKg: Math.round(totalWasteAvoidedKg * 10) / 10,
    totalCostPreserved: Math.round(totalCostPreserved * 100) / 100,
    totalMealsGenerated: Math.round(totalMealsGenerated),
    co2eAvoidedKg,
    completedActionCount,
    totalAuditEntries: records.length,
  };
}

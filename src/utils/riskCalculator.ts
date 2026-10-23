/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, RiskAssessment, RiskTier, StorageCondition, FoodCategory } from '../types/inventory.ts';

/**
 * Storage multiplier dictates how quickly perishable quality degrades under sub-optimal conditions.
 * Lower multiplier = preserved longer. Higher multiplier = accelerated spoilage.
 */
export function getStorageRiskMultiplier(category: FoodCategory, storage: StorageCondition): number {
  if (storage === 'frozen') return 0.5;
  if (storage === 'refrigerated') return 1.0;
  
  // Ambient storage for sensitive items poses accelerated risk
  if (category === 'dairy' || category === 'proteins' || category === 'prepared_meals') {
    return 2.5; // High hazard if ambient
  }
  if (category === 'produce' || category === 'bakery') {
    return 1.4;
  }
  return 1.0; // Grains/dry items handle ambient safely
}

/**
 * Calculates deterministic risk metrics for a single inventory item.
 * Pure function: accepts an optional `now` timestamp for deterministic unit testing.
 */
export function evaluateItemRisk(item: InventoryItem, now: Date = new Date()): RiskAssessment {
  const expiryTime = new Date(item.expiryDate).getTime();
  const currentTime = now.getTime();
  const diffMs = expiryTime - currentTime;
  const hoursRemaining = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  const daysRemaining = Math.round((diffMs / (1000 * 60 * 60 * 24)) * 10) / 10;

  const storageMultiplier = getStorageRiskMultiplier(item.category, item.storageCondition);
  const costAtRisk = Math.round(item.quantity * item.unitCost * 100) / 100;

  // Rule 1: Expired Items (zero consumption tolerance)
  if (hoursRemaining <= 0) {
    return {
      itemId: item.id,
      itemName: item.name,
      hoursRemaining,
      daysRemaining,
      riskTier: 'expired',
      riskScore: 100,
      storageRiskMultiplier: storageMultiplier,
      deterministicReason: `Item expired on ${new Date(item.expiryDate).toLocaleDateString()}. Zero human consumption permitted. Quarantine required.`,
      recommendedActionWindowHours: 0,
      costAtRisk,
      eligibleForDonation: false,
      eligibleForRepurpose: false,
    };
  }

  // Rule 2: Sub-optimal storage violation for high-perishables
  if (item.storageCondition === 'ambient' && (item.category === 'dairy' || item.category === 'proteins')) {
    return {
      itemId: item.id,
      itemName: item.name,
      hoursRemaining,
      daysRemaining,
      riskTier: 'critical',
      riskScore: 95,
      storageRiskMultiplier: storageMultiplier,
      deterministicReason: `High risk: Perishable ${item.category} stored in ambient conditions instead of cold room. Rapid bacterial multiplication hazard.`,
      recommendedActionWindowHours: Math.min(2, Math.max(0.5, hoursRemaining * 0.1)),
      costAtRisk,
      eligibleForDonation: false, // Unsafe for external donation due to broken cold chain
      eligibleForRepurpose: true, // Internal heat-sterilization batch cooking only
    };
  }

  // Rule 3: Critical Expiry (under 24 hours remaining)
  if (hoursRemaining <= 24) {
    const calculatedScore = Math.min(95, Math.round(75 + (24 - hoursRemaining) * 0.8));
    return {
      itemId: item.id,
      itemName: item.name,
      hoursRemaining,
      daysRemaining,
      riskTier: 'critical',
      riskScore: calculatedScore,
      storageRiskMultiplier: storageMultiplier,
      deterministicReason: `Expires in ${hoursRemaining}h. Immediate redistribution or same-day kitchen repurpose required before waste occurs.`,
      recommendedActionWindowHours: Math.max(2, Math.floor(hoursRemaining * 0.6)),
      costAtRisk,
      eligibleForDonation: hoursRemaining >= 3 && item.status === 'available',
      eligibleForRepurpose: hoursRemaining >= 1 && item.status === 'available',
    };
  }

  // Rule 4: Moderate Risk (24h to 72h remaining)
  if (hoursRemaining <= 72) {
    const calculatedScore = Math.round(40 + (72 - hoursRemaining) * 0.7);
    return {
      itemId: item.id,
      itemName: item.name,
      hoursRemaining,
      daysRemaining,
      riskTier: 'moderate',
      riskScore: calculatedScore,
      storageRiskMultiplier: storageMultiplier,
      deterministicReason: `Expires in ${daysRemaining} days (${hoursRemaining}h). Stock velocity monitoring advised to prevent end-of-week surplus.`,
      recommendedActionWindowHours: Math.floor(hoursRemaining * 0.5),
      costAtRisk,
      eligibleForDonation: item.status === 'available',
      eligibleForRepurpose: item.status === 'available',
    };
  }

  // Rule 5: Nominal Risk (> 72 hours remaining)
  const nominalScore = Math.max(5, Math.round(35 - Math.min(30, (hoursRemaining - 72) * 0.15)));
  return {
    itemId: item.id,
    itemName: item.name,
    hoursRemaining,
    daysRemaining,
    riskTier: 'nominal',
    riskScore: nominalScore,
    storageRiskMultiplier: storageMultiplier,
    deterministicReason: `Nominal shelf-life (${daysRemaining} days remaining). Current storage parameters are within safe thresholds.`,
    recommendedActionWindowHours: hoursRemaining,
    costAtRisk,
    eligibleForDonation: item.status === 'available',
    eligibleForRepurpose: item.status === 'available',
  };
}

/**
 * Evaluates entire inventory list and aggregates high-level risk statistics.
 */
export function evaluateInventorySummary(items: InventoryItem[], now: Date = new Date()) {
  let totalCostAtRisk = 0;
  let expiredCount = 0;
  let criticalCount = 0;
  let moderateCount = 0;
  let nominalCount = 0;
  let totalQuantityKgEquivalent = 0;

  const assessments = items.map((item) => {
    const assessment = evaluateItemRisk(item, now);
    if (assessment.riskTier === 'expired') {
      expiredCount++;
      totalCostAtRisk += assessment.costAtRisk;
    } else if (assessment.riskTier === 'critical') {
      criticalCount++;
      totalCostAtRisk += assessment.costAtRisk;
    } else if (assessment.riskTier === 'moderate') {
      moderateCount++;
    } else {
      nominalCount++;
    }
    totalQuantityKgEquivalent += item.quantity;
    return assessment;
  });

  return {
    totalItems: items.length,
    totalQuantityKgEquivalent: Math.round(totalQuantityKgEquivalent * 10) / 10,
    totalCostAtRisk: Math.round(totalCostAtRisk * 100) / 100,
    expiredCount,
    criticalCount,
    moderateCount,
    nominalCount,
    assessments,
  };
}

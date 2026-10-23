/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, DemandForecastPoint } from '../types/inventory.ts';

export interface SurplusForecastResult {
  itemId: string;
  itemName: string;
  currentStock: number;
  unit: string;
  expectedDailyConsumption: number;
  daysUntilExpiry: number;
  expectedTotalConsumptionBeforeExpiry: number;
  estimatedSurplus: number;
  surplusRiskRatio: number; // 0 to 1 (fraction of stock likely wasted)
  confidenceLevel: 'High (Historical)' | 'Medium (Seasonal Adjusted)' | 'Baseline Estimate (Low Data)';
  confidenceScorePct: number;
  assumptions: string[];
  limitations: string[];
  rationale: string;
}

/**
 * 7-Day Campus Meal Attendance Forecast Curve
 * University hostel mess attendance fluctuates predictably across the week:
 * - Mon-Thu: 100% full dining attendance (~850 students)
 * - Fri: 80% (students depart for weekend)
 * - Sat-Sun: 45% (hostel exodus / local weekend trips)
 */
export const CAMPUS_ATTENDANCE_SCHEDULE: Record<string, { studentCount: number; factor: number; note: string }> = {
  Monday: { studentCount: 880, factor: 1.05, note: 'Peak academic weekday turnout' },
  Tuesday: { studentCount: 860, factor: 1.02, note: 'Normal weekday mess schedule' },
  Wednesday: { studentCount: 850, factor: 1.0, note: 'Midweek baseline attendance' },
  Thursday: { studentCount: 840, factor: 0.98, note: 'Normal meal prep routine' },
  Friday: { studentCount: 680, factor: 0.8, note: 'Pre-weekend campus departures' },
  Saturday: { studentCount: 390, factor: 0.46, note: 'Hostel weekend exodus (low turnout)' },
  Sunday: { studentCount: 420, factor: 0.49, note: 'Reduced Sunday brunch schedule' },
};

/**
 * Returns estimated daily consumption rate for an item category per 100 students.
 */
export function getBaselineDailyConsumptionRate(itemName: string, category: string): number {
  const normalized = itemName.toLowerCase();
  if (normalized.includes('milk')) return 12; // liters / day for baseline mess
  if (normalized.includes('paneer') || normalized.includes('tofu')) return 8; // kg / day
  if (normalized.includes('bread')) return 15; // units / day
  if (normalized.includes('tomato') || normalized.includes('vegetable') || normalized.includes('spinach')) return 10; // kg / day
  if (normalized.includes('rice')) return 25; // kg / day
  if (normalized.includes('dal') || normalized.includes('lentil')) return 14; // kg / day
  
  if (category === 'dairy') return 10;
  if (category === 'produce') return 12;
  if (category === 'grains') return 20;
  if (category === 'bakery') return 15;
  return 8;
}

/**
 * Calculates surplus forecast deterministically for an item based on days remaining
 * and calendar day modifiers.
 */
export function calculateSurplusForecast(
  item: InventoryItem,
  historicalDaysLogged: number = 14,
  now: Date = new Date()
): SurplusForecastResult {
  const expiryTime = new Date(item.expiryDate).getTime();
  const diffDays = Math.max(0.1, (expiryTime - now.getTime()) / (1000 * 60 * 60 * 24));
  const roundedDays = Math.round(diffDays * 10) / 10;

  // Base consumption rate per day
  const baseRate = getBaselineDailyConsumptionRate(item.name, item.category);

  // Compute weighted consumption over the specific days until expiry
  let projectedConsumption = 0;
  const daysToScan = Math.min(7, Math.ceil(diffDays));
  const daysList: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < daysToScan; i++) {
    const targetDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = daysList[targetDate.getDay()];
    const dayConfig = CAMPUS_ATTENDANCE_SCHEDULE[dayName] || { factor: 1.0, studentCount: 850 };
    const dayRatio = (i === daysToScan - 1 && diffDays < daysToScan) ? (diffDays - Math.floor(diffDays)) || 1.0 : 1.0;
    projectedConsumption += baseRate * dayConfig.factor * dayRatio;
  }

  projectedConsumption = Math.round(projectedConsumption * 10) / 10;
  const estimatedSurplus = Math.max(0, Math.round((item.quantity - projectedConsumption) * 10) / 10);
  const surplusRiskRatio = item.quantity > 0 ? Math.min(1.0, Math.round((estimatedSurplus / item.quantity) * 100) / 100) : 0;

  let confidenceLevel: 'High (Historical)' | 'Medium (Seasonal Adjusted)' | 'Baseline Estimate (Low Data)';
  let confidenceScorePct: number;

  if (historicalDaysLogged >= 14) {
    confidenceLevel = 'High (Historical)';
    confidenceScorePct = 88;
  } else if (historicalDaysLogged >= 7) {
    confidenceLevel = 'Medium (Seasonal Adjusted)';
    confidenceScorePct = 72;
  } else {
    confidenceLevel = 'Baseline Estimate (Low Data)';
    confidenceScorePct = 54;
  }

  const assumptions = [
    `Hostel student meal attendance follows standard calendar (Mon-Thu 100%, Fri 80%, Weekend ~48%).`,
    `Kitchen meal preparation uses FIFO rotation without unrecorded emergency prep batches.`,
    `Standard daily consumption benchmark for ${item.name} is ${baseRate} ${item.unit}/day under full turnout.`,
  ];

  const limitations = [
    `Does not account for unplanned campus holidays, weather disruptions, or hostel mess strikes.`,
    `Confidence is capped at ${confidenceScorePct}% until multi-month real POS logs are ingested.`,
  ];

  const rationale = estimatedSurplus > 0
    ? `At current consumption velocity (${projectedConsumption} ${item.unit} needed over ${roundedDays} days), a surplus of ~${estimatedSurplus} ${item.unit} will remain at expiry. Weekend hostel drop-off elevates this risk.`
    : `Projected consumption (${projectedConsumption} ${item.unit}) exceeds available stock (${item.quantity} ${item.unit}). No surplus expected before expiry.`;

  return {
    itemId: item.id,
    itemName: item.name,
    currentStock: item.quantity,
    unit: item.unit,
    expectedDailyConsumption: baseRate,
    daysUntilExpiry: roundedDays,
    expectedTotalConsumptionBeforeExpiry: projectedConsumption,
    estimatedSurplus,
    surplusRiskRatio,
    confidenceLevel,
    confidenceScorePct,
    assumptions,
    limitations,
    rationale,
  };
}

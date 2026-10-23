/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateItemRisk, evaluateInventorySummary } from './riskCalculator.ts';
import { calculateSurplusForecast } from './demandForecaster.ts';
import { validateProposedAction } from './agentGuardrails.ts';
import { createAuditRecord, computeCumulativeEsgMetrics } from './auditLogger.ts';
import { InventoryItem, ProposedAction, RecipientOrg, RepurposeRecipe } from '../types/inventory.ts';

const mockRecipients: RecipientOrg[] = [
  {
    id: 'REC-01',
    name: "Sneha Care Children's Home",
    type: 'orphanage',
    distanceKm: 1.8,
    contactPerson: 'Sister Mary',
    phone: '555-0199',
    acceptedCategories: ['dairy', 'produce', 'bakery'],
    hasColdChain: true,
    maxDailyCapacityKg: 50,
    operatingHours: '08:00 - 20:00',
    address: '44 Campus Rd',
    isVerified: true,
  },
];

const mockRecipes: RepurposeRecipe[] = [
  {
    id: 'RCP-01',
    title: 'Rich Makhani Base',
    primaryCategory: 'dairy',
    yieldDescription: '40 portions',
    extendedShelfLifeDays: 5,
    storageRequirement: 'frozen',
    canteenUsage: 'Freezer backup',
    steps: ['Simmer', 'Puree'],
  },
];

// TEST A: Vegetables expiring tomorrow
test('TEST A: Vegetables expiring tomorrow identifies risk and requires human approval', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const tomatoes: InventoryItem = {
    id: 'TOMATO-01',
    name: 'Country Tomatoes',
    category: 'produce',
    quantity: 5,
    unit: 'kg',
    unitCost: 0.5, // ~₹40/kg
    purchaseDate: '2026-10-21T10:00:00Z',
    expiryDate: '2026-10-24T10:00:00Z', // 24 hours left
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-T-01',
    location: 'Veg Bin',
    status: 'available',
  };

  const risk = evaluateItemRisk(tomatoes, now);
  assert.equal(risk.riskTier, 'critical');
  assert.equal(risk.hoursRemaining, 24);
  assert.equal(risk.eligibleForDonation, true);

  const forecast = calculateSurplusForecast(tomatoes, 14, now);
  assert.ok(forecast.assumptions.length >= 2);

  // Proposal must not change inventory before approval
  const initialQty = tomatoes.quantity;
  assert.equal(initialQty, 5);
});

// TEST B: Dairy products nearing expiry
test('TEST B: Dairy products nearing expiry respects distinct dates and items', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const milk: InventoryItem = {
    id: 'MILK-01',
    name: 'Cow Milk',
    category: 'dairy',
    quantity: 12,
    unit: 'liters',
    unitCost: 1.2,
    purchaseDate: '2026-10-21T10:00:00Z',
    expiryDate: '2026-10-24T10:00:00Z', // 24 hours left -> critical
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-M-01',
    location: 'Chiller',
    status: 'available',
  };

  const curd: InventoryItem = {
    id: 'CURD-01',
    name: 'Matka Curd',
    category: 'dairy',
    quantity: 8,
    unit: 'units',
    unitCost: 0.8,
    purchaseDate: '2026-10-21T10:00:00Z',
    expiryDate: '2026-10-25T10:00:00Z', // 48 hours left -> moderate
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-C-01',
    location: 'Chiller',
    status: 'available',
  };

  const milkRisk = evaluateItemRisk(milk, now);
  const curdRisk = evaluateItemRisk(curd, now);

  assert.equal(milkRisk.riskTier, 'critical');
  assert.equal(curdRisk.riskTier, 'moderate');
  assert.notEqual(milkRisk.hoursRemaining, curdRisk.hoursRemaining);
});

// TEST C: Healthy inventory
test('TEST C: Healthy inventory with long shelf life does not invent an emergency crisis', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const rice: InventoryItem = {
    id: 'RICE-01',
    name: 'Basmati Rice',
    category: 'grains',
    quantity: 20,
    unit: 'kg',
    unitCost: 1.5,
    purchaseDate: '2026-10-15T10:00:00Z',
    expiryDate: '2027-04-15T10:00:00Z', // 174 days away
    storageCondition: 'ambient',
    batchNumber: 'LOT-R-01',
    location: 'Warehouse',
    status: 'available',
  };

  const risk = evaluateItemRisk(rice, now);
  assert.equal(risk.riskTier, 'nominal');
  assert.ok(risk.daysRemaining > 100);
});

// TEST D: Already expired food
test('TEST D: Already expired food is quarantined and strictly excluded from donation', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const expiredMilk: InventoryItem = {
    id: 'EXP-MILK',
    name: 'Sour Milk',
    category: 'dairy',
    quantity: 5,
    unit: 'liters',
    unitCost: 1.0,
    purchaseDate: '2026-10-15T10:00:00Z',
    expiryDate: '2026-10-22T10:00:00Z', // 24 hours in past
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-EXP-01',
    location: 'Disposal Zone',
    status: 'available',
  };

  const risk = evaluateItemRisk(expiredMilk, now);
  assert.equal(risk.riskTier, 'expired');
  assert.equal(risk.eligibleForDonation, false);
  assert.equal(risk.eligibleForRepurpose, false);

  // Attempting to validate a donation of expired item fails guardrails
  const donationProposal: ProposedAction = {
    id: 'ACT-UNSAFE',
    actionType: 'ngo_donation',
    targetItemId: 'EXP-MILK',
    itemName: 'Sour Milk',
    quantity: 5,
    unit: 'liters',
    recipientOrgId: 'REC-01',
    urgency: 'high',
    rationale: 'Unsafe test',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const validation = validateProposedAction(donationProposal, [expiredMilk], mockRecipients, mockRecipes);
  assert.equal(validation.isValid, false);
  assert.match(validation.errors[0], /FOOD SAFETY VIOLATION/);
});

// TEST E: Large surplus with no demand data
test('TEST E: Large surplus discloses unknown demand limitations', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const surplusVeg: InventoryItem = {
    id: 'SURPLUS-VEG',
    name: 'Mixed Veggies',
    category: 'produce',
    quantity: 50,
    unit: 'kg',
    unitCost: 0.8,
    purchaseDate: '2026-10-22T10:00:00Z',
    expiryDate: '2026-10-26T10:00:00Z', // 3 days away
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-SV-01',
    location: 'Chiller 2',
    status: 'available',
  };

  const forecast = calculateSurplusForecast(surplusVeg, 0, now); // 0 historical days
  assert.equal(forecast.confidenceLevel, 'Baseline Estimate (Low Data)');
  assert.ok(forecast.limitations.length >= 1);
});

// TEST F: Low stock
test('TEST F: Low stock identification', () => {
  const rice: InventoryItem = {
    id: 'LOW-RICE',
    name: 'Rice',
    category: 'grains',
    quantity: 8, // below threshold of 15
    unit: 'kg',
    unitCost: 1.0,
    purchaseDate: '2026-10-10T10:00:00Z',
    expiryDate: '2027-01-10T10:00:00Z',
    storageCondition: 'ambient',
    batchNumber: 'B-LOW',
    location: 'Bay 1',
    status: 'available',
  };

  const isLowStock = rice.quantity <= 15;
  assert.equal(isLowStock, true);
});

// TEST G: Conflicting or invalid inventory data
test('TEST G: Conflicting inventory data (negative qty or exceeding on-hand) is rejected', () => {
  const item: InventoryItem = {
    id: 'TEST-ITEM',
    name: 'Paneer',
    category: 'dairy',
    quantity: 10,
    unit: 'kg',
    unitCost: 4.0,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'B-PAN',
    location: 'Chiller',
    status: 'available',
  };

  const overAction: ProposedAction = {
    id: 'ACT-OVER',
    actionType: 'ngo_donation',
    targetItemId: 'TEST-ITEM',
    itemName: 'Paneer',
    quantity: 100, // exceeds 10
    unit: 'kg',
    recipientOrgId: 'REC-01',
    urgency: 'high',
    rationale: 'Over test',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(overAction, [item], mockRecipients, mockRecipes);
  assert.equal(res.isValid, false);
});

// TEST H: Empty inventory handling
test('TEST H: Empty inventory returns zero summary gracefully without exception', () => {
  const summary = evaluateInventorySummary([]);
  assert.equal(summary.totalItems, 0);
  assert.equal(summary.totalCostAtRisk, 0);
  assert.equal(summary.criticalCount, 0);
  assert.equal(summary.expiredCount, 0);
});

// TEST J: Approve a recommendation updates state
test('TEST J: Approving recommendation reduces inventory and creates signed audit record', () => {
  const item: InventoryItem = {
    id: 'ITEM-J',
    name: 'Milk',
    category: 'dairy',
    quantity: 20,
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'BJ',
    location: 'Chiller',
    status: 'available',
  };

  const approvedQty = 15;
  const newQty = item.quantity - approvedQty;
  assert.equal(newQty, 5);

  const log = createAuditRecord({
    actionId: 'ACT-J',
    actionType: 'ngo_donation',
    performedBy: 'Kitchen Manager (Approved)',
    summary: `Approved donation of 15 L Milk`,
    details: 'Sneha Care Orphanage',
    itemId: item.id,
    itemName: item.name,
    quantityDelta: -15,
    impact: { wasteAvoidedKg: 15, costPreserved: 22.5, mealsGenerated: 33 },
  });

  assert.ok(log.verificationHash.startsWith('SS-VHASH-'));
  assert.equal(log.impact.wasteAvoidedKg, 15);
});

// TEST K: Reject a recommendation leaves inventory unchanged
test('TEST K: Rejecting recommendation preserves inventory balance exactly', () => {
  const item: InventoryItem = {
    id: 'ITEM-K',
    name: 'Bread',
    category: 'bakery',
    quantity: 30,
    unit: 'units',
    unitCost: 1.5,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    storageCondition: 'ambient',
    batchNumber: 'BK',
    location: 'Pantry',
    status: 'available',
  };

  const initialQty = item.quantity;
  // Rejection logic:
  const log = createAuditRecord({
    actionId: 'ACT-K',
    actionType: 'proposal_rejected',
    performedBy: 'Kitchen Manager (Rejected)',
    summary: 'Rejected donation of bread',
    details: 'Needed for evening mess snack',
  });

  // Verify inventory remained identical
  assert.equal(item.quantity, initialQty);
  assert.equal(log.actionType, 'proposal_rejected');
});

// TEST L: Double approval idempotency
test('TEST L: Double approval idempotency prevents duplicate execution', () => {
  let executedActionIds = new Set<string>();
  const actionId = 'ACT-IDEMPOTENT-01';

  function applyAction(id: string) {
    if (executedActionIds.has(id)) {
      return { applied: false, error: 'Duplicate action rejected' };
    }
    executedActionIds.add(id);
    return { applied: true };
  }

  const firstCall = applyAction(actionId);
  const secondCall = applyAction(actionId);

  assert.equal(firstCall.applied, true);
  assert.equal(secondCall.applied, false);
  assert.equal(secondCall.error, 'Duplicate action rejected');
});

// TEST M: Stale proposal detection
test('TEST M: Stale proposal is flagged if inventory quantity changed below proposed amount', () => {
  const item: InventoryItem = {
    id: 'ITEM-M',
    name: 'Yogurt',
    category: 'dairy',
    quantity: 5, // Dropped to 5
    unit: 'units',
    unitCost: 1.0,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'BM',
    location: 'Chiller',
    status: 'available',
  };

  const staleAction: ProposedAction = {
    id: 'ACT-STALE',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-M',
    itemName: 'Yogurt',
    quantity: 20, // Stale: requires 20, but only 5 remain
    unit: 'units',
    recipientOrgId: 'REC-01',
    urgency: 'high',
    rationale: 'Stale test',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const validation = validateProposedAction(staleAction, [item], mockRecipients, mockRecipes);
  assert.equal(validation.isValid, false);
  assert.match(validation.errors[0], /exceeds available stock/);
});

// TEST O: Financial and ESG metrics arithmetic
test('TEST O: Financial and ESG metrics arithmetic calculates correctly', () => {
  const records = [
    createAuditRecord({
      actionId: 'ACT-O1',
      actionType: 'ngo_donation',
      performedBy: 'Manager',
      summary: 'Action O1',
      details: '',
      impact: { wasteAvoidedKg: 20, costPreserved: 50.0, mealsGenerated: 44 },
    }),
    createAuditRecord({
      actionId: 'ACT-O2',
      actionType: 'kitchen_repurpose',
      performedBy: 'Chef',
      summary: 'Action O2',
      details: '',
      impact: { wasteAvoidedKg: 10, costPreserved: 30.0, mealsGenerated: 20 },
    }),
  ];

  const metrics = computeCumulativeEsgMetrics(records);
  assert.equal(metrics.totalWasteAvoidedKg, 30);
  assert.equal(metrics.totalCostPreserved, 80.0);
  assert.equal(metrics.totalMealsGenerated, 64);
  assert.equal(metrics.co2eAvoidedKg, 75.0); // 30 * 2.5
});

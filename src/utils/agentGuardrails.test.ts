/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProposedAction } from './agentGuardrails.ts';
import { InventoryItem, ProposedAction, RecipientOrg, RepurposeRecipe } from '../types/inventory.ts';

const mockInventory: InventoryItem[] = [
  {
    id: 'ITEM-1',
    name: 'Fresh Cow Milk',
    category: 'dairy',
    quantity: 20,
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'B1',
    location: 'Chiller',
    status: 'available',
  },
  {
    id: 'ITEM-EXPIRED',
    name: 'Expired Rice',
    category: 'prepared_meals',
    quantity: 10,
    unit: 'kg',
    unitCost: 2.0,
    purchaseDate: '2026-10-18T10:00:00Z',
    expiryDate: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    storageCondition: 'refrigerated',
    batchNumber: 'B2',
    location: 'Chiller',
    status: 'available',
  },
];

const mockRecipients: RecipientOrg[] = [
  {
    id: 'REC-1',
    name: 'Children Shelter',
    type: 'orphanage',
    distanceKm: 2.0,
    contactPerson: 'Director',
    phone: '555-1234',
    acceptedCategories: ['dairy', 'bakery'],
    hasColdChain: true,
    maxDailyCapacityKg: 50,
    operatingHours: '08:00-18:00',
    address: '123 Main St',
    isVerified: true,
  },
];

const mockRecipes: RepurposeRecipe[] = [
  {
    id: 'RCP-1',
    title: 'Gravy Base',
    primaryCategory: 'dairy',
    yieldDescription: '30 portions',
    extendedShelfLifeDays: 5,
    storageRequirement: 'frozen',
    canteenUsage: 'Lunch curry',
    steps: ['Simmer', 'Blend'],
  },
];

test('validateProposedAction: accepts valid donation action within constraints', () => {
  const validAction: ProposedAction = {
    id: 'ACT-VALID',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-1',
    itemName: 'Fresh Cow Milk',
    quantity: 10,
    unit: 'liters',
    recipientOrgId: 'REC-1',
    urgency: 'high',
    rationale: 'Avoid weekend spoilage',
    assumptions: ['Pickup within 2h'],
    expectedImpact: { wasteAvoidedKg: 10, costPreserved: 15, mealsGenerated: 22, co2eAvoidedKg: 25 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(validAction, mockInventory, mockRecipients, mockRecipes);
  assert.equal(res.isValid, true);
  assert.equal(res.errors.length, 0);
  assert.ok(res.sanitizedAction);
  assert.equal(res.sanitizedAction.quantity, 10);
});

test('validateProposedAction: rejects quantity exceeding inventory balance', () => {
  const overAction: ProposedAction = {
    id: 'ACT-OVER',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-1',
    itemName: 'Fresh Cow Milk',
    quantity: 50, // exceeds 20 available
    unit: 'liters',
    recipientOrgId: 'REC-1',
    urgency: 'high',
    rationale: 'Bulk dispatch',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(overAction, mockInventory, mockRecipients, mockRecipes);
  assert.equal(res.isValid, false);
  assert.match(res.errors[0], /exceeds available stock/);
});

test('validateProposedAction: rejects negative or zero quantity', () => {
  const negAction: ProposedAction = {
    id: 'ACT-NEG',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-1',
    itemName: 'Fresh Cow Milk',
    quantity: -5,
    unit: 'liters',
    recipientOrgId: 'REC-1',
    urgency: 'high',
    rationale: 'Invalid',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(negAction, mockInventory, mockRecipients, mockRecipes);
  assert.equal(res.isValid, false);
  assert.match(res.errors[0], /Invalid quantity/);
});

test('validateProposedAction: strictly rejects donation of expired food', () => {
  const expiredAction: ProposedAction = {
    id: 'ACT-EXP',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-EXPIRED',
    itemName: 'Expired Rice',
    quantity: 5,
    unit: 'kg',
    recipientOrgId: 'REC-1',
    urgency: 'high',
    rationale: 'Unsafe test',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(expiredAction, mockInventory, mockRecipients, mockRecipes);
  assert.equal(res.isValid, false);
  assert.match(res.errors[0], /FOOD SAFETY VIOLATION/);
});

test('validateProposedAction: rejects recipient that does not accept category', () => {
  const grainInventory: InventoryItem[] = [
    {
      id: 'ITEM-GRAIN',
      name: 'Rice Bags',
      category: 'grains',
      quantity: 20,
      unit: 'kg',
      unitCost: 1.0,
      purchaseDate: '2026-10-20T10:00:00Z',
      expiryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      storageCondition: 'ambient',
      batchNumber: 'B3',
      location: 'Dry Bay',
      status: 'available',
    },
  ];

  const mismatchAction: ProposedAction = {
    id: 'ACT-MISMATCH',
    actionType: 'ngo_donation',
    targetItemId: 'ITEM-GRAIN',
    itemName: 'Rice Bags',
    quantity: 10,
    unit: 'kg',
    recipientOrgId: 'REC-1', // REC-1 only accepts dairy, bakery
    urgency: 'medium',
    rationale: 'Mismatch test',
    assumptions: [],
    expectedImpact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0, co2eAvoidedKg: 0 },
    approvalStatus: 'pending',
  };

  const res = validateProposedAction(mismatchAction, grainInventory, mockRecipients, mockRecipes);
  assert.equal(res.isValid, false);
  assert.match(res.errors[0], /does not accept items in the category 'grains'/);
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateItemRisk, getStorageRiskMultiplier, evaluateInventorySummary } from './riskCalculator.ts';
import { InventoryItem } from '../types/inventory.ts';

test('getStorageRiskMultiplier: returns correct factors for categories and storage', () => {
  assert.equal(getStorageRiskMultiplier('dairy', 'ambient'), 2.5);
  assert.equal(getStorageRiskMultiplier('dairy', 'refrigerated'), 1.0);
  assert.equal(getStorageRiskMultiplier('produce', 'frozen'), 0.5);
  assert.equal(getStorageRiskMultiplier('grains', 'ambient'), 1.0);
});

test('evaluateItemRisk: correctly classifies expired food with zero consumption tolerance', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const expiredItem: InventoryItem = {
    id: 'T-1',
    name: 'Cooked Rice',
    category: 'prepared_meals',
    quantity: 10,
    unit: 'kg',
    unitCost: 2.0,
    purchaseDate: '2026-10-20T10:00:00Z',
    expiryDate: '2026-10-23T08:00:00Z', // 2 hours in the past
    storageCondition: 'refrigerated',
    batchNumber: 'B-01',
    location: 'Chiller',
    status: 'available',
  };

  const assessment = evaluateItemRisk(expiredItem, now);
  assert.equal(assessment.riskTier, 'expired');
  assert.equal(assessment.riskScore, 100);
  assert.equal(assessment.eligibleForDonation, false);
  assert.equal(assessment.eligibleForRepurpose, false);
  assert.equal(assessment.costAtRisk, 20.0);
  assert.match(assessment.deterministicReason, /Zero human consumption permitted/);
});

test('evaluateItemRisk: critical tier triggered for items expiring in under 24 hours', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const criticalItem: InventoryItem = {
    id: 'T-2',
    name: 'Fresh Cow Milk',
    category: 'dairy',
    quantity: 20,
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: '2026-10-21T10:00:00Z',
    expiryDate: '2026-10-24T02:00:00Z', // 16 hours ahead
    storageCondition: 'refrigerated',
    batchNumber: 'B-02',
    location: 'Chiller',
    status: 'available',
  };

  const assessment = evaluateItemRisk(criticalItem, now);
  assert.equal(assessment.riskTier, 'critical');
  assert.equal(assessment.hoursRemaining, 16);
  assert.equal(assessment.eligibleForDonation, true);
  assert.equal(assessment.eligibleForRepurpose, true);
  assert.ok(assessment.riskScore >= 75);
});

test('evaluateItemRisk: ambient storage of high-perishable dairy triggers critical temperature violation', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const warmItem: InventoryItem = {
    id: 'T-3',
    name: 'Fresh Paneer',
    category: 'dairy',
    quantity: 15,
    unit: 'kg',
    unitCost: 4.0,
    purchaseDate: '2026-10-22T10:00:00Z',
    expiryDate: '2026-10-25T10:00:00Z', // 48 hours remaining, but ambient
    storageCondition: 'ambient',
    batchNumber: 'B-03',
    location: 'Kitchen Counter',
    status: 'available',
  };

  const assessment = evaluateItemRisk(warmItem, now);
  assert.equal(assessment.riskTier, 'critical');
  assert.equal(assessment.eligibleForDonation, false); // Cannot donate broken cold-chain item
  assert.match(assessment.deterministicReason, /Rapid bacterial multiplication hazard/);
});

test('evaluateInventorySummary: aggregates totals and counts accurately', () => {
  const now = new Date('2026-10-23T10:00:00Z');
  const items: InventoryItem[] = [
    {
      id: 'T-1',
      name: 'Expired Dal',
      category: 'prepared_meals',
      quantity: 5,
      unit: 'kg',
      unitCost: 3.0,
      purchaseDate: '2026-10-20T10:00:00Z',
      expiryDate: '2026-10-22T10:00:00Z', // Expired
      storageCondition: 'refrigerated',
      batchNumber: 'B-1',
      location: 'C',
      status: 'available',
    },
    {
      id: 'T-2',
      name: 'Critical Milk',
      category: 'dairy',
      quantity: 10,
      unit: 'liters',
      unitCost: 1.5,
      purchaseDate: '2026-10-21T10:00:00Z',
      expiryDate: '2026-10-23T20:00:00Z', // 10h remaining -> Critical
      storageCondition: 'refrigerated',
      batchNumber: 'B-2',
      location: 'C',
      status: 'available',
    },
    {
      id: 'T-3',
      name: 'Long Life Rice',
      category: 'grains',
      quantity: 50,
      unit: 'kg',
      unitCost: 2.0,
      purchaseDate: '2026-10-20T10:00:00Z',
      expiryDate: '2026-12-20T10:00:00Z', // 58 days -> Nominal
      storageCondition: 'ambient',
      batchNumber: 'B-3',
      location: 'Warehouse',
      status: 'available',
    },
  ];

  const summary = evaluateInventorySummary(items, now);
  assert.equal(summary.totalItems, 3);
  assert.equal(summary.expiredCount, 1);
  assert.equal(summary.criticalCount, 1);
  assert.equal(summary.nominalCount, 1);
  assert.equal(summary.totalCostAtRisk, 5 * 3.0 + 10 * 1.5); // 15 + 15 = 30
});

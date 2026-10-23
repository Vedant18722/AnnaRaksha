/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuditRecord, computeCumulativeEsgMetrics, generateVerificationHash } from './auditLogger.ts';

test('createAuditRecord: signs record with verification hash and assigns unique ID', () => {
  const record = createAuditRecord({
    actionId: 'ACT-01',
    actionType: 'ngo_donation',
    performedBy: 'Manager (Approved)',
    summary: 'Dispatched 15kg paneer',
    details: 'Routed to local orphanage',
    itemId: 'ITEM-1',
    itemName: 'Fresh Paneer',
    quantityDelta: -15,
    unit: 'kg',
    impact: { wasteAvoidedKg: 15, costPreserved: 72.0, mealsGenerated: 33 },
  });

  assert.ok(record.id.startsWith('AUD-'));
  assert.ok(record.verificationHash.startsWith('SS-VHASH-'));
  assert.equal(record.actionType, 'ngo_donation');
  assert.equal(record.impact.wasteAvoidedKg, 15);
  assert.equal(record.impact.costPreserved, 72.0);
});

test('generateVerificationHash: deterministic output for identical payloads', () => {
  const payload1 = { a: 1, b: 'test' };
  const payload2 = { a: 1, b: 'test' };
  const hash1 = generateVerificationHash(payload1);
  const hash2 = generateVerificationHash(payload2);
  assert.equal(hash1.slice(0, 15), hash2.slice(0, 15));
});

test('computeCumulativeEsgMetrics: aggregates metrics across multiple records and calculates CO2e', () => {
  const records = [
    createAuditRecord({
      actionId: 'A-1',
      actionType: 'ngo_donation',
      performedBy: 'Manager',
      summary: 'Action 1',
      details: '',
      impact: { wasteAvoidedKg: 20, costPreserved: 50, mealsGenerated: 44 },
    }),
    createAuditRecord({
      actionId: 'A-2',
      actionType: 'kitchen_repurpose',
      performedBy: 'Chef',
      summary: 'Action 2',
      details: '',
      impact: { wasteAvoidedKg: 10, costPreserved: 30, mealsGenerated: 22 },
    }),
  ];

  const metrics = computeCumulativeEsgMetrics(records);
  assert.equal(metrics.totalWasteAvoidedKg, 30);
  assert.equal(metrics.totalCostPreserved, 80);
  assert.equal(metrics.totalMealsGenerated, 66);
  // 30 kg waste avoided * 2.5 kg CO2e factor = 75 kg CO2e avoided
  assert.equal(metrics.co2eAvoidedKg, 75);
  assert.equal(metrics.completedActionCount, 2);
});

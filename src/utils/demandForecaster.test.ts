/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSurplusForecast, getBaselineDailyConsumptionRate } from './demandForecaster.ts';
import { InventoryItem } from '../types/inventory.ts';

test('getBaselineDailyConsumptionRate: returns appropriate defaults', () => {
  assert.equal(getBaselineDailyConsumptionRate('Cow Milk A2', 'dairy'), 12);
  assert.equal(getBaselineDailyConsumptionRate('Basmati Rice', 'grains'), 25);
  assert.equal(getBaselineDailyConsumptionRate('Bread Loaf', 'bakery'), 15);
});

test('calculateSurplusForecast: flags surplus when stock exceeds projected multi-day consumption', () => {
  // Friday morning test date
  const now = new Date('2026-10-23T08:00:00Z'); // Friday
  const surplusItem: InventoryItem = {
    id: 'T-SURPLUS',
    name: 'Fresh Cow Milk',
    category: 'dairy',
    quantity: 40, // 40 liters on hand
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: '2026-10-22T08:00:00Z',
    expiryDate: '2026-10-25T08:00:00Z', // 2 days ahead (Friday-Saturday-Sunday weekend drop)
    storageCondition: 'refrigerated',
    batchNumber: 'B-SURPLUS',
    location: 'Chiller',
    status: 'available',
  };

  const forecast = calculateSurplusForecast(surplusItem, 14, now);
  assert.ok(forecast.estimatedSurplus > 0, 'Should detect surplus over low-attendance weekend');
  assert.equal(forecast.confidenceLevel, 'High (Historical)');
  assert.ok(forecast.assumptions.length >= 2);
  assert.ok(forecast.limitations.length >= 1);
});

test('calculateSurplusForecast: detects zero surplus when current stock is quickly depleted', () => {
  const now = new Date('2026-10-21T08:00:00Z'); // Wednesday
  const scarceItem: InventoryItem = {
    id: 'T-SCARCE',
    name: 'Fresh Cow Milk',
    category: 'dairy',
    quantity: 5, // only 5 liters
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: '2026-10-20T08:00:00Z',
    expiryDate: '2026-10-23T08:00:00Z', // 2 days
    storageCondition: 'refrigerated',
    batchNumber: 'B-SCARCE',
    location: 'Chiller',
    status: 'available',
  };

  const forecast = calculateSurplusForecast(scarceItem, 14, now);
  assert.equal(forecast.estimatedSurplus, 0);
  assert.equal(forecast.surplusRiskRatio, 0);
});

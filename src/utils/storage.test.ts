/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidInventoryItem,
  loadStoredItems,
  persistStoredItems,
  resetAllStoredData,
  STORAGE_KEYS,
} from './storage.ts';
import { InventoryItem } from '../types/inventory.ts';

test('isValidInventoryItem: validates correct item schema', () => {
  const valid: InventoryItem = {
    id: 'TEST-1',
    name: 'Test Milk',
    category: 'dairy',
    quantity: 10,
    unit: 'liters',
    unitCost: 1.5,
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 86400000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-1',
    location: 'Chiller',
    status: 'available',
  };

  assert.equal(isValidInventoryItem(valid), true);
});

test('isValidInventoryItem: rejects invalid or corrupted objects', () => {
  assert.equal(isValidInventoryItem(null), false);
  assert.equal(isValidInventoryItem('string'), false);
  assert.equal(isValidInventoryItem({ id: '1' }), false); // missing name, quantity, expiryDate
  assert.equal(isValidInventoryItem({ id: '1', name: 'Milk', quantity: NaN, expiryDate: '2026', unit: 'kg' }), false);
});

test('loadStoredItems: returns seed inventory if storage is empty', () => {
  const items = loadStoredItems();
  assert.ok(Array.isArray(items));
  assert.ok(items.length > 0);
  assert.equal(typeof items[0].id, 'string');
});

test('persistStoredItems: saves items and allows clean re-load', () => {
  const testItem: InventoryItem = {
    id: 'PERSIST-TEST-101',
    name: 'Fresh Organic Paneer',
    category: 'dairy',
    quantity: 42,
    unit: 'kg',
    unitCost: 3.5,
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 36000000).toISOString(),
    storageCondition: 'refrigerated',
    batchNumber: 'LOT-TEST-99',
    location: 'Cold Room',
    status: 'available',
  };

  persistStoredItems([testItem]);
  const loaded = loadStoredItems();
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].id, 'PERSIST-TEST-101');
  assert.equal(loaded[0].quantity, 42);
});

test('resetAllStoredData: restores initial seed inventory and clears actions', () => {
  const res = resetAllStoredData();
  assert.ok(Array.isArray(res.items));
  assert.ok(res.items.length >= 5);
  assert.equal(res.actions.length, 0);
  assert.ok(res.auditLogs.length > 0);
});

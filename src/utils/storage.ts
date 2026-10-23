/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, ProposedAction, RedistributionDispatch, AuditRecord } from '../types/inventory.ts';
import { generateSeedInventory, INITIAL_AUDIT_LOGS } from '../data/seedData.ts';

export const STORAGE_KEYS = {
  ITEMS: 'annaraksha_items_v2',
  ACTIONS: 'annaraksha_actions_v2',
  DISPATCHES: 'annaraksha_dispatches_v2',
  AUDIT_LOGS: 'annaraksha_audit_v2',
} as const;

// Safe in-memory store for sandboxed iframe environments where window.localStorage throws SecurityError
const inMemoryStore = new Map<string, string>();

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (err) {
    // Storage access denied or blocked in partitioned iframe
  }
  return inMemoryStore.get(key) || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (err) {
    // QuotaExceeded or SecurityError
  }
  inMemoryStore.set(key, value);
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {}
  inMemoryStore.delete(key);
}

/**
 * Validates whether an object conforms to the minimal InventoryItem interface.
 */
export function isValidInventoryItem(item: any): item is InventoryItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.quantity === 'number' &&
    !isNaN(item.quantity) &&
    typeof item.expiryDate === 'string' &&
    typeof item.unit === 'string'
  );
}

/**
 * Safely loads stored inventory items.
 * If storage has valid data, it returns it; otherwise, it returns the seed inventory
 * and persists it so that subsequent reloads consistently find it.
 */
export function loadStoredItems(): InventoryItem[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.ITEMS) || safeGetItem('annaraksha_items');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidInventoryItem)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AnnaRaksha Storage] Error parsing stored items, loading seed:', err);
  }

  const seed = generateSeedInventory();
  persistStoredItems(seed);
  return seed;
}

/**
 * Persists inventory items synchronously to localStorage and notifies server in background.
 */
export function persistStoredItems(items: InventoryItem[]): void {
  try {
    safeSetItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    // Asynchronously notify backend server store for container-level persistence
    if (typeof fetch !== 'undefined') {
      fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }).catch(() => {
        // Non-blocking background sync
      });
    }
  } catch (err) {
    console.warn('[AnnaRaksha Storage] Failed to persist items:', err);
  }
}

/**
 * Safely loads stored agent actions.
 */
export function loadStoredActions(): ProposedAction[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.ACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return [];
}

export function persistStoredActions(actions: ProposedAction[]): void {
  safeSetItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
}

/**
 * Safely loads stored dispatches.
 */
export function loadStoredDispatches(): RedistributionDispatch[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.DISPATCHES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return [
    {
      id: 'DSP-2026-1049',
      actionId: 'ACT-INIT-01',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      pickupWindow: 'Within 2 hours',
      recipientName: "Sneha Care Children's Home & Mess",
      recipientPhone: '+1 (555) 234-5678',
      recipientAddress: '44 Campus Road, North Ward (1.8 km)',
      contactPerson: 'Sister Mary Joseph',
      items: [
        {
          name: 'Breakfast Sandwich Loaves',
          batchNumber: 'LOT-BR-1102',
          quantity: 20,
          unit: 'units',
          storage: 'ambient',
          tempCheckPassed: true,
        },
      ],
      totalKg: 10,
      requiresColdChain: false,
      status: 'collected',
      authorizedBy: 'Campus Kitchen Steward',
      notes: 'Handed over directly to volunteer van driver.',
    },
  ];
}

export function persistStoredDispatches(dispatches: RedistributionDispatch[]): void {
  safeSetItem(STORAGE_KEYS.DISPATCHES, JSON.stringify(dispatches));
}

/**
 * Safely loads stored audit logs.
 */
export function loadStoredAuditLogs(): AuditRecord[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return INITIAL_AUDIT_LOGS;
}

export function persistStoredAuditLogs(logs: AuditRecord[]): void {
  safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

/**
 * Completely resets local data back to initial seed state.
 */
export function resetAllStoredData(): {
  items: InventoryItem[];
  actions: ProposedAction[];
  dispatches: RedistributionDispatch[];
  auditLogs: AuditRecord[];
} {
  safeRemoveItem(STORAGE_KEYS.ITEMS);
  safeRemoveItem(STORAGE_KEYS.ACTIONS);
  safeRemoveItem(STORAGE_KEYS.DISPATCHES);
  safeRemoveItem(STORAGE_KEYS.AUDIT_LOGS);

  const freshItems = generateSeedInventory();
  persistStoredItems(freshItems);
  persistStoredActions([]);
  persistStoredAuditLogs(INITIAL_AUDIT_LOGS);

  if (typeof fetch !== 'undefined') {
    fetch('/api/inventory/reset', { method: 'POST' }).catch(() => {});
  }

  return {
    items: freshItems,
    actions: [],
    dispatches: [],
    auditLogs: INITIAL_AUDIT_LOGS,
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { InventoryItem, FoodCategory, StorageCondition } from '../types/inventory.ts';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  editingItem: InventoryItem | null;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('dairy');
  const [quantity, setQuantity] = useState<string>('10');
  const [unit, setUnit] = useState<'kg' | 'liters' | 'units' | 'portions'>('kg');
  const [unitCost, setUnitCost] = useState<string>('2.50');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('refrigerated');
  const [batchNumber, setBatchNumber] = useState('');
  const [location, setLocation] = useState('Cold Room 1');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setQuantity(editingItem.quantity.toString());
      setUnit(editingItem.unit);
      setUnitCost(editingItem.unitCost.toString());
      // Format ISO string to datetime-local format
      const dt = new Date(editingItem.expiryDate);
      const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setExpiryDate(localIso);
      setStorageCondition(editingItem.storageCondition);
      setBatchNumber(editingItem.batchNumber);
      setLocation(editingItem.location);
      setNotes(editingItem.notes || '');
    } else {
      // Default new item: expiring 48 hours from now
      const defaultExp = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const localIso = new Date(defaultExp.getTime() - defaultExp.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setName('');
      setCategory('dairy');
      setQuantity('15');
      setUnit('kg');
      setUnitCost('3.00');
      setExpiryDate(localIso);
      setStorageCondition('refrigerated');
      setBatchNumber(`LOT-${Math.floor(1000 + Math.random() * 9000)}`);
      setLocation('Walk-in Chiller');
      setNotes('');
    }
    setErrors([]);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push('Item name is required.');
    }
    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      newErrors.push('Quantity must be a positive number greater than 0.');
    }
    const numCost = parseFloat(unitCost);
    if (isNaN(numCost) || numCost < 0) {
      newErrors.push('Unit cost must be a valid non-negative number.');
    }
    if (!expiryDate) {
      newErrors.push('Expiry date and time are required.');
    }
    if (!batchNumber.trim()) {
      newErrors.push('Batch / Lot number is required for traceability.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const itemPayload: InventoryItem = {
      id: editingItem ? editingItem.id : `INV-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      quantity: Math.round(numQty * 10) / 10,
      unit,
      unitCost: Math.round(numCost * 100) / 100,
      purchaseDate: editingItem ? editingItem.purchaseDate : new Date().toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      storageCondition,
      batchNumber: batchNumber.trim(),
      location: location.trim() || 'Main Kitchen Storage',
      status: editingItem ? editingItem.status : 'available',
      notes: notes.trim(),
    };

    onSave(itemPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <h2 id="modal-title" className="text-base font-bold text-slate-900 dark:text-white">
            {editingItem ? 'Edit Inventory Record' : 'Log New Stock Intake'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-red-900 dark:text-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Please correct the following:</span>
              </div>
              <ul className="list-disc list-inside pl-1 space-y-0.5">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Food Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Malai Paneer"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="dairy">Dairy</option>
                <option value="produce">Fresh Vegetables</option>
                <option value="fruits">Seasonal Fruits</option>
                <option value="bakery">Bakery & Bread</option>
                <option value="grains">Grains & Pulses</option>
                <option value="prepared_meals">Prepared Meals</option>
                <option value="proteins">Proteins & Tofu</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Condition</label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="refrigerated">Refrigerated (2°C - 4°C)</option>
                <option value="frozen">Deep Frozen (-18°C)</option>
                <option value="ambient">Ambient Dry Storage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="kg">kg</option>
                <option value="liters">liters</option>
                <option value="units">units (loaves/cups)</option>
                <option value="portions">portions</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Cost ($)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expiry Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Batch / Lot # <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="LOT-9021"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-mono text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Walk-in Chiller 1 - Rack B"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Operational Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Leftover from morning breakfast batch"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              {editingItem ? 'Update Stock' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

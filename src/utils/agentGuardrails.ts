/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, ProposedAction, RecipientOrg, RepurposeRecipe } from '../types/inventory.ts';

export interface GuardrailValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedAction?: ProposedAction;
}

/**
 * Validates a proposed action against strict inventory constraints, food safety invariants,
 * and recipient qualifications before allowing it into the Human Approval Gate or execution.
 */
export function validateProposedAction(
  action: ProposedAction,
  inventory: InventoryItem[],
  recipients: RecipientOrg[],
  recipes: RepurposeRecipe[]
): GuardrailValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Invariant 1: Action ID and Item ID must exist
  if (!action.id || typeof action.id !== 'string') {
    errors.push('Action ID is missing or invalid.');
  }

  // Invariant 2: Target item must exist in current inventory
  const item = inventory.find((i) => i.id === action.targetItemId);
  if (!item) {
    errors.push(`Target item '${action.targetItemId}' does not exist in inventory.`);
    return { isValid: false, errors, warnings };
  }

  // Invariant 3: Quantity must be positive number and not exceed on-hand stock
  if (typeof action.quantity !== 'number' || action.quantity <= 0 || isNaN(action.quantity)) {
    errors.push(`Invalid quantity: ${action.quantity}. Must be a positive number.`);
  } else if (action.quantity > item.quantity) {
    errors.push(`Quantity requested (${action.quantity} ${item.unit}) exceeds available stock (${item.quantity} ${item.unit}).`);
  }

  // Invariant 4: Item status must be available
  if (item.status !== 'available') {
    errors.push(`Item '${item.name}' is already marked as '${item.status}' and cannot be scheduled for new actions.`);
  }

  // Invariant 5: Food Safety Gate - Never donate expired items
  const now = Date.now();
  const expiryTime = new Date(item.expiryDate).getTime();
  if (expiryTime <= now) {
    if (action.actionType === 'ngo_donation') {
      errors.push(`FOOD SAFETY VIOLATION: Item '${item.name}' expired on ${new Date(item.expiryDate).toLocaleDateString()}. Donation to human recipients is strictly prohibited.`);
    } else if (action.actionType === 'kitchen_repurpose') {
      errors.push(`FOOD SAFETY VIOLATION: Expired ingredients cannot be used for kitchen meal preparation.`);
    }
  }

  // Invariant 6: Recipient verification for NGO donations
  if (action.actionType === 'ngo_donation') {
    if (!action.recipientOrgId) {
      errors.push('NGO Donation action requires a designated recipient organization ID.');
    } else {
      const recipient = recipients.find((r) => r.id === action.recipientOrgId);
      if (!recipient) {
        errors.push(`Recipient organization '${action.recipientOrgId}' is not found in the verified directory.`);
      } else {
        if (!recipient.isVerified) {
          warnings.push(`Recipient '${recipient.name}' is pending regulatory verification.`);
        }
        if (!recipient.acceptedCategories.includes(item.category)) {
          errors.push(`Recipient '${recipient.name}' does not accept items in the category '${item.category}'.`);
        }
        if (action.quantity > recipient.maxDailyCapacityKg) {
          errors.push(`Quantity (${action.quantity} kg) exceeds recipient's daily intake capacity (${recipient.maxDailyCapacityKg} kg).`);
        }
        // Cold-chain check
        if ((item.storageCondition === 'refrigerated' || item.storageCondition === 'frozen') && !recipient.hasColdChain) {
          warnings.push(`Caution: Recipient '${recipient.name}' lacks cold chain facilities. Requires prompt <2 hour consumption upon handover.`);
        }
      }
    }
  }

  // Invariant 7: Recipe verification for Kitchen Repurposing
  if (action.actionType === 'kitchen_repurpose') {
    if (!action.recipeId) {
      errors.push('Kitchen Repurpose action requires a designated transformation recipe ID.');
    } else {
      const recipe = recipes.find((r) => r.id === action.recipeId);
      if (!recipe) {
        errors.push(`Recipe '${action.recipeId}' not found in approved culinary procedures.`);
      } else if (recipe.primaryCategory !== item.category) {
        warnings.push(`Recipe '${recipe.title}' expects category '${recipe.primaryCategory}', but item is '${item.category}'.`);
      }
    }
  }

  // Construct sanitized action if valid
  const sanitizedAction: ProposedAction = {
    ...action,
    quantity: Math.min(action.quantity, item.quantity),
    expectedImpact: {
      wasteAvoidedKg: Math.round(action.quantity * (item.unit === 'liters' ? 1.03 : 1.0) * 10) / 10,
      costPreserved: Math.round(action.quantity * item.unitCost * 100) / 100,
      mealsGenerated: Math.round(action.quantity * (item.category === 'prepared_meals' ? 1 : 2.2)),
      co2eAvoidedKg: Math.round(action.quantity * 2.5 * 10) / 10,
    },
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedAction,
  };
}

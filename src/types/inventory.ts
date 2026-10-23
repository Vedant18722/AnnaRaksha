/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StorageCondition = 'ambient' | 'refrigerated' | 'frozen';
export type FoodCategory = 'dairy' | 'curd' | 'produce' | 'fruits' | 'bakery' | 'grains' | 'prepared_meals' | 'proteins';
export type RiskTier = 'nominal' | 'moderate' | 'critical' | 'expired';
export type ItemStatus = 'available' | 'reserved_donation' | 'repurposed' | 'depleted';

export interface InventoryItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: 'kg' | 'liters' | 'units' | 'portions';
  unitCost: number; // Cost in USD / unit
  purchaseDate: string; // ISO8601 string
  expiryDate: string; // ISO8601 string
  storageCondition: StorageCondition;
  batchNumber: string;
  location: string; // e.g. "Cold Room B - Shelf 2"
  status: ItemStatus;
  notes?: string;
}

export interface RiskAssessment {
  itemId: string;
  itemName: string;
  hoursRemaining: number;
  daysRemaining: number;
  riskTier: RiskTier;
  riskScore: number; // 0 (safest) to 100 (expired/extreme)
  storageRiskMultiplier: number;
  deterministicReason: string;
  recommendedActionWindowHours: number;
  costAtRisk: number;
  eligibleForDonation: boolean;
  eligibleForRepurpose: boolean;
}

export interface RecipientOrg {
  id: string;
  name: string;
  type: 'orphanage' | 'food_bank' | 'community_shelter' | 'animal_welfare';
  distanceKm: number;
  contactPerson: string;
  phone: string;
  contactPhone?: string;
  acceptedCategories: FoodCategory[];
  hasColdChain: boolean;
  maxDailyCapacityKg: number;
  operatingHours: string;
  address: string;
  isVerified: boolean;
}

export interface RepurposeRecipe {
  id: string;
  title: string;
  primaryCategory: FoodCategory;
  yieldDescription: string;
  extendedShelfLifeDays: number;
  storageRequirement: StorageCondition;
  canteenUsage: string;
  steps: string[];
}

export interface ProposedAction {
  id: string;
  actionType: 'ngo_donation' | 'kitchen_repurpose' | 'markdown_clearance' | 'quarantine_spoilage';
  targetItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  recipientOrgId?: string;
  recipientOrgName?: string;
  recipientOrgAddress?: string;
  recipeId?: string;
  recipeTitle?: string;
  urgency: 'high' | 'medium' | 'low';
  rationale: string;
  assumptions: string[];
  expectedImpact: {
    wasteAvoidedKg: number;
    costPreserved: number;
    mealsGenerated: number;
    co2eAvoidedKg: number;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'modified';
  rejectionReason?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actionId: string;
  actionType: string;
  performedBy: string; // "AI Agent (Proposed)" | "Manager (Approved)" | "System Executor" | "User Action"
  actorRole?: string;
  summary: string;
  details: string;
  itemId?: string;
  itemName?: string;
  quantityDelta?: number;
  unit?: string;
  impact: {
    wasteAvoidedKg: number;
    costPreserved: number;
    mealsGenerated: number;
  };
  verificationHash: string;
}

export interface RedistributionDispatch {
  id: string;
  actionId: string;
  createdAt: string;
  pickupWindow: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  contactPerson: string;
  items: Array<{
    name: string;
    batchNumber: string;
    quantity: number;
    unit: string;
    storage: StorageCondition;
    tempCheckPassed: boolean;
  }>;
  totalKg: number;
  requiresColdChain: boolean;
  status: 'scheduled' | 'dispatched' | 'collected' | 'cancelled';
  authorizedBy: string;
  notes: string;
}

export interface DemandForecastPoint {
  date: string;
  dayOfWeek: string;
  expectedStudentCount: number;
  historicalVariancePct: number;
  campusEventNote: string;
  estimatedDailyConsumptionKg: number;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, RecipientOrg, RepurposeRecipe, AuditRecord } from '../types/inventory.ts';

/**
 * Returns dynamic timestamps relative to execution time so the demo is always live and realistic.
 */
export function generateSeedInventory(): InventoryItem[] {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  return [
    {
      id: 'INV-101',
      name: 'Fresh Cow Milk (A2)',
      category: 'dairy',
      quantity: 25,
      unit: 'liters',
      unitCost: 1.45,
      purchaseDate: new Date(now - 3 * DAY).toISOString(),
      expiryDate: new Date(now + 18 * HOUR).toISOString(), // Expires in 18h -> Critical
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-MK-8821',
      location: 'Walk-in Chiller - Shelf A1',
      status: 'available',
      notes: 'Morning mess delivery. High velocity required before weekend.',
    },
    {
      id: 'INV-102',
      name: 'Fresh Malai Paneer',
      category: 'dairy',
      quantity: 18,
      unit: 'kg',
      unitCost: 4.80,
      purchaseDate: new Date(now - 2 * DAY).toISOString(),
      expiryDate: new Date(now + 28 * HOUR).toISOString(), // Expires in 28h -> Moderate
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-PN-9042',
      location: 'Cold Room 2 - Shelf B',
      status: 'available',
      notes: 'Procured for Friday curry special; student attendance dropped 40%.',
    },
    {
      id: 'INV-103',
      name: 'Whole Wheat Sandwich Bread',
      category: 'bakery',
      quantity: 32,
      unit: 'units',
      unitCost: 1.60,
      purchaseDate: new Date(now - 4 * DAY).toISOString(),
      expiryDate: new Date(now + 11 * HOUR).toISOString(), // Expires in 11h -> Critical
      storageCondition: 'ambient',
      batchNumber: 'LOT-BR-1109',
      location: 'Bakery Dry Pantry - Rack 1',
      status: 'available',
      notes: 'Daily breakfast loaf surplus from hostel breakfast service.',
    },
    {
      id: 'INV-104',
      name: 'Farm Fresh Tomatoes & Spinach',
      category: 'produce',
      quantity: 45,
      unit: 'kg',
      unitCost: 1.20,
      purchaseDate: new Date(now - 3 * DAY).toISOString(),
      expiryDate: new Date(now + 42 * HOUR).toISOString(), // Expires in 42h -> Moderate
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-VG-5431',
      location: 'Crisper Unit - Zone 3',
      status: 'available',
      notes: 'Grade-A fresh produce surplus from student salad bar.',
    },
    {
      id: 'INV-105',
      name: 'Pre-Cooked Basmati Pilaf',
      category: 'prepared_meals',
      quantity: 14,
      unit: 'kg',
      unitCost: 2.10,
      purchaseDate: new Date(now - 2 * DAY).toISOString(),
      expiryDate: new Date(now - 4 * HOUR).toISOString(), // Expired 4 hours ago -> Expired
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-ML-0033',
      location: 'Holding Chiller - Bin 4',
      status: 'available',
      notes: 'Evening mess leftover. Passed safety cutoff. Quarantine test case.',
    },
    {
      id: 'INV-106',
      name: 'Organic Red Lentils (Masoor Dal)',
      category: 'grains',
      quantity: 85,
      unit: 'kg',
      unitCost: 2.25,
      purchaseDate: new Date(now - 10 * DAY).toISOString(),
      expiryDate: new Date(now + 180 * DAY).toISOString(), // 180 days -> Nominal
      storageCondition: 'ambient',
      batchNumber: 'LOT-GR-7744',
      location: 'Dry Bulk Warehouse - Bay 4',
      status: 'available',
      notes: 'Stable dry store reserve. Low priority for spoilage.',
    },
    {
      id: 'INV-107',
      name: 'Greek Yogurt Cups',
      category: 'dairy',
      quantity: 40,
      unit: 'units',
      unitCost: 0.95,
      purchaseDate: new Date(now - 6 * DAY).toISOString(),
      expiryDate: new Date(now + 21 * HOUR).toISOString(), // Expires in 21h -> Critical
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-YG-3021',
      location: 'Display Chiller - Tier 2',
      status: 'available',
      notes: 'Pre-packaged snack inventory approaching sell-by date.',
    },
    {
      id: 'INV-108',
      name: 'Firm Organic Tofu Blocks',
      category: 'proteins',
      quantity: 12,
      unit: 'kg',
      unitCost: 3.90,
      purchaseDate: new Date(now - 3 * DAY).toISOString(),
      expiryDate: new Date(now + 64 * HOUR).toISOString(), // Expires in 64h -> Moderate
      storageCondition: 'refrigerated',
      batchNumber: 'LOT-TF-4110',
      location: 'Cold Room 2 - Shelf A',
      status: 'available',
      notes: 'Vegan protein option for hostel dining hall.',
    },
  ];
}

export const SEED_RECIPIENT_ORGS: RecipientOrg[] = [
  {
    id: 'REC-01',
    name: "Sneha Care Children's Home & Mess",
    type: 'orphanage',
    distanceKm: 1.8,
    contactPerson: 'Sister Mary Joseph',
    phone: '+1 (555) 234-5678',
    acceptedCategories: ['dairy', 'bakery', 'produce', 'prepared_meals'],
    hasColdChain: true,
    maxDailyCapacityKg: 50,
    operatingHours: '08:00 - 20:00 Daily',
    address: '44 Campus Road, North Ward (1.8 km)',
    isVerified: true,
  },
  {
    id: 'REC-02',
    name: 'City Hope Community Food Pantry',
    type: 'food_bank',
    distanceKm: 3.4,
    contactPerson: 'Marcus Vance',
    phone: '+1 (555) 345-6789',
    acceptedCategories: ['grains', 'produce', 'bakery', 'dairy'],
    hasColdChain: true,
    maxDailyCapacityKg: 150,
    operatingHours: '09:00 - 18:00 Mon-Sat',
    address: '112 Industrial Ave, Sector 4 (3.4 km)',
    isVerified: true,
  },
  {
    id: 'REC-03',
    name: 'Vatsalya Senior Citizens Living Care',
    type: 'community_shelter',
    distanceKm: 4.2,
    contactPerson: 'Dr. Anita Roy',
    phone: '+1 (555) 456-7890',
    acceptedCategories: ['dairy', 'bakery', 'produce'],
    hasColdChain: false,
    maxDailyCapacityKg: 35,
    operatingHours: '10:00 - 19:00 Daily',
    address: '89 Green Meadows Blvd (4.2 km)',
    isVerified: true,
  },
  {
    id: 'REC-04',
    name: 'GreenEarth Animal Sanctuary & Shelter',
    type: 'animal_welfare',
    distanceKm: 6.8,
    contactPerson: 'Samir Patel',
    phone: '+1 (555) 789-0123',
    acceptedCategories: ['produce', 'bakery', 'grains'],
    hasColdChain: false,
    maxDailyCapacityKg: 200,
    operatingHours: '07:00 - 17:00 Daily',
    address: '12 Farmhouse Bypass Road (6.8 km)',
    isVerified: true,
  },
];

export const SEED_REPURPOSE_RECIPES: RepurposeRecipe[] = [
  {
    id: 'RCP-01',
    title: 'Rich Makhani Curry Base (Bulk Freeze)',
    primaryCategory: 'dairy',
    yieldDescription: '40 student lunch portions',
    extendedShelfLifeDays: 5,
    storageRequirement: 'frozen',
    canteenUsage: 'Can be reheated and served with rice/naan during Monday peak rush.',
    steps: [
      'Simmer milk and paneer solids with sautéed tomato puree and aromatic spices.',
      'Blend into velvet gravy consistency and chill down to 4°C within 90 minutes.',
      'Portion into sealed stainless gastro containers and deep freeze.',
    ],
  },
  {
    id: 'RCP-02',
    title: 'Herb & Garlic Toasted Soup Croutons',
    primaryCategory: 'bakery',
    yieldDescription: '60 soup garnish servings',
    extendedShelfLifeDays: 14,
    storageRequirement: 'ambient',
    canteenUsage: 'Garnish for evening hostel tomato basil and sweet corn soups.',
    steps: [
      'Cube surplus bread loaves into uniform 1.5cm dice.',
      'Toss in olive oil, dried oregano, sea salt, and garlic granules.',
      'Bake at 160°C for 22 minutes until crisp; cool and store in airtight bulk drums.',
    ],
  },
  {
    id: 'RCP-03',
    title: 'South-Indian Spiced Tomato Chutney',
    primaryCategory: 'produce',
    yieldDescription: '80 breakfast idli/dosa portions',
    extendedShelfLifeDays: 4,
    storageRequirement: 'refrigerated',
    canteenUsage: 'Accompaniment for weekend student breakfast buffet.',
    steps: [
      'Roast surplus tomatoes with mustard seeds, curry leaves, and red chilies.',
      'Simmer until reduced by 50% and natural pectin stabilizes.',
      'Store in sanitized food-grade buckets under refrigeration.',
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-INIT-01',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionId: 'ACT-SYS-BOOT',
    actionType: 'system_initialized',
    performedBy: 'System Bootstrapper',
    summary: 'ShelfSense AI telemetry connected to Campus Canteen Main Store',
    details: 'Initial inventory profile loaded: 8 tracked items across Dairy, Bakery, Produce, and Grains.',
    impact: { wasteAvoidedKg: 0, costPreserved: 0, mealsGenerated: 0 },
    verificationHash: 'SS-VHASH-9E2A81-BOOT',
  },
  {
    id: 'AUD-INIT-02',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    actionId: 'ACT-REDIST-PREV',
    actionType: 'ngo_donation',
    performedBy: 'Manager (Approved)',
    summary: 'Dispatched 20 loaves bread to Sneha Care Children Home',
    details: 'Surplus bakery batch B-1102 routed prior to Friday dinner service. Verified cold-chain receipt.',
    itemId: 'INV-PREV-01',
    itemName: 'Breakfast Loaves',
    quantityDelta: -20,
    unit: 'units',
    impact: { wasteAvoidedKg: 10, costPreserved: 32.0, mealsGenerated: 25 },
    verificationHash: 'SS-VHASH-44A12B-PREV',
  },
];

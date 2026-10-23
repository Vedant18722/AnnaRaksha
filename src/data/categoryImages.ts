/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodCategory } from '../types/inventory.ts';

export interface SpecializedHandlingGuidance {
  recommendedTemp: string;
  storageZone: 'refrigerated' | 'frozen' | 'ambient';
  maxShelfLifeDays: number;
  criticalRules: string[];
  spoilageIndicators: string[];
  regulatoryNote: string;
}

export interface CategoryVisualMeta {
  id: FoodCategory | 'curd';
  titleKey: string;
  defaultTitle: string;
  hindiTitle: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  iconName: string;
  photoUrl: string;
  photoAlt: string;
  typicalItems: string[];
  handling: SpecializedHandlingGuidance;
}

export const CATEGORY_VISUALS: Record<string, CategoryVisualMeta> = {
  dairy: {
    id: 'dairy',
    titleKey: 'categoryDairy',
    defaultTitle: 'Dairy Products',
    hindiTitle: 'डेयरी उत्पाद',
    tagline: 'Fresh Cow Milk, Malai Paneer, Butter & Cream',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-900/20',
    iconName: 'Milk',
    photoUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Fresh organic milk bottles in cold storage',
    typicalItems: ['Fresh Cow Milk (A2)', 'Malai Paneer', 'Fresh Ghee', 'Full Cream Milk'],
    handling: {
      recommendedTemp: '2°C to 4°C (Strict Cold Chain)',
      storageZone: 'refrigerated',
      maxShelfLifeDays: 3,
      criticalRules: [
        'Store immediately upon delivery in dedicated cold storage below 4°C.',
        'Never mix old milk batches with new milk deliveries.',
        'Ensure pasteurization verification and FIFO stock rotation.',
      ],
      spoilageIndicators: ['Sour or acidic odor', 'Curdling or separation of whey', 'Bitter taste notes'],
      regulatoryNote: 'Complies with FSSAI guidance on microbiological safety of raw and pasteurized milk.',
    },
  },
  curd: {
    id: 'curd',
    titleKey: 'categoryCurd',
    defaultTitle: 'Curd & Yogurt',
    hindiTitle: 'दही और योगर्ट',
    tagline: 'Traditional Clay Matka Dahi & Probiotic Yogurt',
    accentColor: '#D97706',
    bgGradient: 'from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/20',
    iconName: 'Soup',
    photoUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Traditional creamy curd yogurt served in a bowl',
    typicalItems: ['Fresh Matka Curd', 'Greek Yogurt Cups', 'Masala Chaas Base', 'Sweet Lassi'],
    handling: {
      recommendedTemp: '2°C to 5°C',
      storageZone: 'refrigerated',
      maxShelfLifeDays: 4,
      criticalRules: [
        'Keep covered in airtight food-grade containers to prevent yeast spore contamination.',
        'Use clean, dry ladles to prevent microbial inoculation.',
        'Surplus curd approaching Day 3 must be repurposed into Kadhi or Chaas base immediately.',
      ],
      spoilageIndicators: ['Excessive sour effervescence / gas bubbles', 'Pink or gray mold mycelium', 'Rancid smell'],
      regulatoryNote: 'Storage requirements depend on live culture activity and local health standards.',
    },
  },
  produce: {
    id: 'produce',
    titleKey: 'categoryVegetables',
    defaultTitle: 'Fresh Vegetables',
    hindiTitle: 'ताज़ी सब्जियाँ',
    tagline: 'Farm Tomatoes, Spinach (Palak), Potatoes & Carrots',
    accentColor: '#16A34A',
    bgGradient: 'from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/20',
    iconName: 'Carrot',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Assortment of fresh farm vegetables including tomatoes, spinach and carrots',
    typicalItems: ['Country Tomatoes', 'Fresh Palak (Spinach)', 'Baby Potatoes', 'Carrots', 'Green Chilies'],
    handling: {
      recommendedTemp: '8°C to 12°C (Produce Crisper) or Cool Dark Ambient for Tubers',
      storageZone: 'refrigerated',
      maxShelfLifeDays: 5,
      criticalRules: [
        'Keep leafy greens dry and chilled; wash only immediately prior to cooking.',
        'Separate ethylene-producing items (ripe tomatoes) from ethylene-sensitive greens.',
        'Potatoes and onions must be kept in well-ventilated dry ambient crates away from sunlight.',
      ],
      spoilageIndicators: ['Sliminess on leafy greens', 'Soft watery spots on tomatoes', 'Sprouting or green solanine on potatoes'],
      regulatoryNote: 'Produce handling adheres to canteen sanitary wash protocols.',
    },
  },
  fruits: {
    id: 'fruits',
    titleKey: 'categoryFruits',
    defaultTitle: 'Seasonal Fruits',
    hindiTitle: 'ताज़े फल',
    tagline: 'Bananas, Apples, Oranges & Papayas',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-50 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/20',
    iconName: 'Apple',
    photoUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Vibrant assortment of seasonal fresh fruits',
    typicalItems: ['Robusta Bananas', 'Himachal Apples', 'Nagpur Oranges', 'Papaya Slices'],
    handling: {
      recommendedTemp: '10°C to 14°C (Apples/Citrus) / 18°C to 20°C (Bananas)',
      storageZone: 'ambient',
      maxShelfLifeDays: 4,
      criticalRules: [
        'Do not refrigerate unripe bananas or stone fruits.',
        'Inspect daily for fruit fly vectors and bruising.',
        'Overripe fruits should be allocated to same-day canteen smoothies or fruit halwa.',
      ],
      spoilageIndicators: ['Alcoholic fermenting smell', 'Soft sunken brown rot spots', 'Fungal fuzz'],
      regulatoryNote: 'Inspect peel integrity and sanitize washing before serving whole.',
    },
  },
  grains: {
    id: 'grains',
    titleKey: 'categoryGrains',
    defaultTitle: 'Grains & Pulses',
    hindiTitle: 'अनाज और दालें',
    tagline: 'Basmati Rice, Wheat Flour, Toor & Masoor Dal',
    accentColor: '#CA8A04',
    bgGradient: 'from-yellow-50 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20',
    iconName: 'Wheat',
    photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Wholesome organic grains, rice and lentils in storage bowls',
    typicalItems: ['Cooked Basmati Pilaf', 'Organic Masoor Dal', 'Wheat Atta 10kg', 'Toor Dal Premium'],
    handling: {
      recommendedTemp: '18°C to 22°C (Dry Storage < 14% Moisture)',
      storageZone: 'ambient',
      maxShelfLifeDays: 90,
      criticalRules: [
        'Store in airtight polypropylene food bins elevated 15cm off the floor on pallets.',
        'Keep dry pantry humidity strictly under 60% relative humidity to prevent weevils.',
        'Cooked grains/rice must be cooled rapidly within 2 hours or kept above 60°C.',
      ],
      spoilageIndicators: ['Weevil emergence or web silk', 'Musty damp odor', 'Clumping from moisture ingress'],
      regulatoryNote: 'Uncooked dry grains have extended shelf life; cooked rice requires strict temperature control (Bacillus cereus prevention).',
    },
  },
  bakery: {
    id: 'bakery',
    titleKey: 'categoryBakery',
    defaultTitle: 'Bakery & Bread',
    hindiTitle: 'बेकरी उत्पाद',
    tagline: 'Fresh Pav, Sandwich Bread Loaves & Rusks',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-50 to-amber-50 dark:from-purple-950/40 dark:to-amber-900/20',
    iconName: 'Croissant',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Freshly baked artisanal bread loaves and rustic bakery rolls',
    typicalItems: ['Whole Wheat Sandwich Bread', 'Fresh Mumbai Pav', 'Milk Bread', 'Tea Rusks'],
    handling: {
      recommendedTemp: '20°C to 24°C (Dry, Dark Pantry)',
      storageZone: 'ambient',
      maxShelfLifeDays: 3,
      criticalRules: [
        'Do NOT refrigerate bread; refrigeration accelerates starch retrogradation and staling.',
        'Keep in breathable paper or sealed poly bags away from direct steam.',
        'Bread near day 3 must be converted to toasted croutons or breadcrumbs.',
      ],
      spoilageIndicators: ['Green, blue or white mold spots', 'Unusual sour smell', 'Sticky rope spoilage'],
      regulatoryNote: 'Discard immediately upon any visible mold growth.',
    },
  },
  prepared_meals: {
    id: 'prepared_meals',
    titleKey: 'categoryPackaged',
    defaultTitle: 'Prepared Meals',
    hindiTitle: 'तैयार भोजन',
    tagline: 'Cooked Canteen Batches, Gravies & Sambar Pots',
    accentColor: '#DC2626',
    bgGradient: 'from-rose-50 to-red-100 dark:from-rose-950/40 dark:to-red-900/20',
    iconName: 'Utensils',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Freshly cooked institutional meal spread prepared for service',
    typicalItems: ['Pre-Cooked Basmati Pilaf', 'Hostel Mess Curry Batch', 'Dal Tadka Prep', 'Sambar Pot'],
    handling: {
      recommendedTemp: 'Above 63°C (Hot Holding) or Rapid Chill to Below 4°C within 90 minutes',
      storageZone: 'refrigerated',
      maxShelfLifeDays: 2,
      criticalRules: [
        'Strict 2-hour / 4-hour rule: Food between 5°C and 60°C must be consumed or refrigerated within 2 hours.',
        'Reheat to a core temperature of 75°C before serving.',
        'Never reheat prepared food more than once.',
      ],
      spoilageIndicators: ['Sour bubbling, sour curdling smell', 'Loss of viscosity or gelatin breakdown', 'Discoloration'],
      regulatoryNote: 'FSSAI high-risk food category. Surplus distribution requires hot-chain or chilled-chain compliance.',
    },
  },
  proteins: {
    id: 'proteins',
    titleKey: 'categoryProteins',
    defaultTitle: 'Proteins & Tofu',
    hindiTitle: 'प्रोटीन और टोफू',
    tagline: 'Firm Tofu Blocks, Soya Chunks & Plant Protein',
    accentColor: '#059669',
    bgGradient: 'from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-900/20',
    iconName: 'Shield',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-d72b220b3f54?auto=format&fit=crop&w=800&q=80',
    photoAlt: 'Healthy protein and tofu meal bowl with rich nutrients',
    typicalItems: ['Firm Organic Tofu', 'Soya Chunks Premium', 'Fresh Paneer Cubes', 'Sprouted Moong'],
    handling: {
      recommendedTemp: '1°C to 4°C (Submerged in filtered water for tofu)',
      storageZone: 'refrigerated',
      maxShelfLifeDays: 4,
      criticalRules: [
        'Change soaking water for opened tofu daily using chilled potable water.',
        'Store in dedicated vegetarian protein chill bins.',
        'Freeze blocks for extended preservation if not utilized within 72 hours.',
      ],
      spoilageIndicators: ['Slimy surface texture', 'Sour foul smell', 'Yellow discoloration'],
      regulatoryNote: 'Plant proteins are vulnerable to bacterial biofilm without daily cold water changes.',
    },
  },
};

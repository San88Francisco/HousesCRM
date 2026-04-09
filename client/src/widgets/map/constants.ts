import type { LucideIcon } from 'lucide-react';
import { BusFront, Coffee, Landmark, MapPin, Pill, Store, UtensilsCrossed } from 'lucide-react';
import type { POICategory } from './types';

export const RIVNE_CENTER = { lat: 50.6199, lng: 26.2516 } as const;

export const MAP_TOOLTIP_CLASS =
  '!rounded-md border border-border bg-dropdown !px-2.5 !py-2 !text-text shadow-lg pointer-events-auto';

export const CATEGORY_PRIORITY: POICategory[] = [
  'bus_stop',
  'supermarket',
  'pharmacy',
  'hospital',
  'bank',
  'atm',
  'restaurant',
  'cafe',
  'shop',
  'other',
];

export const POI_VISUAL: Record<POICategory, { label: string; color: string; Icon: LucideIcon }> = {
  bus_stop: { label: 'Зупинка', color: '#3b82f6', Icon: BusFront },
  supermarket: { label: 'Супермаркет', color: '#22c55e', Icon: Store },
  shop: { label: 'Магазин', color: '#16a34a', Icon: Store },
  pharmacy: { label: 'Аптека', color: '#ec4899', Icon: Pill },
  hospital: { label: 'Лікарня', color: '#ef4444', Icon: Landmark },
  cafe: { label: 'Кафе', color: '#f97316', Icon: Coffee },
  restaurant: { label: 'Ресторан', color: '#f59e0b', Icon: UtensilsCrossed },
  bank: { label: 'Банк', color: '#8b5cf6', Icon: Landmark },
  atm: { label: 'Банкомат', color: '#7c3aed', Icon: Landmark },
  other: { label: 'Інше', color: '#6b7280', Icon: MapPin },
};

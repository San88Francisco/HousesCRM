import { ApartmentType } from '@/types/core/house/house';
import type { LucideIcon } from 'lucide-react';
import { Building } from 'lucide-react';

export const PROPERTY_TYPE_MAP: Record<ApartmentType, { label: string; icon: LucideIcon }> = {
  [ApartmentType.NEW_BUILD]: {
    label: 'Первинка',
    icon: Building,
  },
  [ApartmentType.RESALE]: {
    label: 'Вторинка',
    icon: Building,
  },
};

import { HouseType } from '@/types/core/house';
import type { LucideIcon } from 'lucide-react';
import { Building } from 'lucide-react';

export const PROPERTY_TYPE_MAP: Record<HouseType, { label: string; icon: LucideIcon }> = {
  [HouseType.NEW_BUILD]: {
    label: 'Первинка',
    icon: Building,
  },
  [HouseType.RESALE]: {
    label: 'Вторинка',
    icon: Building,
  },
};

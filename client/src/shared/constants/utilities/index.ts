import { UtilityType } from '@/types/services/meters';
import {
  Droplets,
  Flame,
  LucideIcon,
  ReceiptText,
  Recycle,
  ShowerHead,
  Thermometer,
  Truck,
  Zap,
} from 'lucide-react';

export type UtilityConfig = {
  type: UtilityType;
  label: string;
  unit: string;
  tariffUnitLabel: string;
  metered: boolean;
  icon: LucideIcon;
  description: string;
  colorClass: string;
  softBgClass: string;
  pillBgClass: string;
  /** Колір сегмента на графіках (CSS-змінна, theme-aware) */
  chartColor: string;
  allowManual?: boolean;
  manualOnly?: boolean;
};

export type UtilityMode = 'metered' | 'fixed-fee' | 'manual';

export const resolveUtilityMode = (metered: boolean, manual: boolean): UtilityMode => {
  if (manual) return 'manual';
  return metered ? 'metered' : 'fixed-fee';
};

export const getUtilityMode = (config: UtilityConfig): UtilityMode =>
  resolveUtilityMode(config.metered, config.manualOnly ?? false);

export const UTILITY_CONFIG: Record<UtilityType, UtilityConfig> = {
  [UtilityType.ELECTRICITY]: {
    type: UtilityType.ELECTRICITY,
    label: 'Світло',
    unit: 'кВт·год',
    tariffUnitLabel: 'грн/кВт·год',
    metered: true,
    icon: Zap,
    description: 'Показники лічильника електроенергії, споживання та вартість.',
    colorClass: 'text-chart-pie-3',
    softBgClass: 'bg-yellow/25',
    pillBgClass: 'bg-yellow/40',
    chartColor: 'var(--chart-pie-3)',
  },
  [UtilityType.WATER_COLD]: {
    type: UtilityType.WATER_COLD,
    label: 'Холодна вода',
    unit: 'м³',
    tariffUnitLabel: 'грн/м³',
    metered: true,
    icon: Droplets,
    description: 'Показники лічильника холодної води, споживання та вартість.',
    colorClass: 'text-chart-pie-1',
    softBgClass: 'bg-blue/30',
    pillBgClass: 'bg-blue/40',
    chartColor: 'var(--chart-pie-1)',
  },
  [UtilityType.WATER_HOT]: {
    type: UtilityType.WATER_HOT,
    label: 'Гаряча вода',
    unit: 'м³',
    tariffUnitLabel: 'грн/м³',
    metered: true,
    icon: ShowerHead,
    description: 'Показники лічильника гарячої води, споживання та вартість.',
    colorClass: 'text-chart-pie-6',
    softBgClass: 'bg-red/15',
    pillBgClass: 'bg-red/25',
    chartColor: 'var(--chart-pie-6)',
  },
  [UtilityType.WATER_SUBSCRIPTION]: {
    type: UtilityType.WATER_SUBSCRIPTION,
    label: 'Абонплата за воду',
    unit: 'міс',
    tariffUnitLabel: 'грн/міс',
    metered: false,
    manualOnly: true,
    icon: ReceiptText,
    description: 'Абонентська плата водоканалу — у кожної квартири своя: дата і сума з платіжки.',
    colorClass: 'text-chart-pie-2',
    softBgClass: 'bg-blue-medium/30',
    pillBgClass: 'bg-blue-medium/40',
    chartColor: 'var(--chart-pie-2)',
  },
  [UtilityType.GAS]: {
    type: UtilityType.GAS,
    label: 'Газ',
    unit: 'м³',
    tariffUnitLabel: 'грн/м³',
    metered: true,
    icon: Flame,
    description: 'Показники газового лічильника, споживання та вартість.',
    colorClass: 'text-chart-pie-10',
    softBgClass: 'bg-info/15',
    pillBgClass: 'bg-info/25',
    chartColor: 'var(--chart-pie-10)',
    allowManual: true,
  },
  [UtilityType.GAS_DELIVERY]: {
    type: UtilityType.GAS_DELIVERY,
    label: 'Доставка газу',
    unit: 'міс',
    tariffUnitLabel: 'грн/міс',
    metered: false,
    manualOnly: true,
    icon: Truck,
    description: 'Плата оператору ГРМ — у кожної квартири своя: записуйте дату і суму з платіжки.',
    colorClass: 'text-chart-pie-5',
    softBgClass: 'bg-purple-medium/30',
    pillBgClass: 'bg-purple-medium/40',
    chartColor: 'var(--chart-pie-5)',
  },
  [UtilityType.HEATING]: {
    type: UtilityType.HEATING,
    label: 'Тепло',
    unit: 'міс',
    tariffUnitLabel: 'грн/міс',
    metered: false,
    manualOnly: true,
    icon: Thermometer,
    description: 'Опалення — записуйте дату і суму з платіжки, без розрахунків.',
    colorClass: 'text-chart-pie-4',
    softBgClass: 'bg-red/15',
    pillBgClass: 'bg-red/25',
    chartColor: 'var(--chart-pie-4)',
  },
  [UtilityType.GARBAGE]: {
    type: UtilityType.GARBAGE,
    label: 'Сміття',
    unit: 'міс',
    tariffUnitLabel: 'грн/міс',
    metered: false,
    icon: Recycle,
    description: 'Фіксована місячна плата за вивіз сміття — нарахування за чинним тарифом.',
    colorClass: 'text-chart-pie-14',
    softBgClass: 'bg-green/30',
    pillBgClass: 'bg-green/40',
    chartColor: 'var(--chart-pie-14)',
  },
};

export type UtilityTab = {
  key: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  softBgClass: string;
  types: UtilityType[];
};

export const UTILITIES_TAB_PARAM = 'tab';

export const UTILITY_TABS: UtilityTab[] = [
  {
    key: 'electricity',
    label: 'Світло',
    icon: Zap,
    colorClass: 'text-chart-pie-3',
    softBgClass: 'bg-yellow/25',
    types: [UtilityType.ELECTRICITY],
  },
  {
    key: 'water',
    label: 'Вода',
    icon: Droplets,
    colorClass: 'text-chart-pie-1',
    softBgClass: 'bg-blue/30',
    types: [UtilityType.WATER_COLD, UtilityType.WATER_HOT, UtilityType.WATER_SUBSCRIPTION],
  },
  {
    key: 'gas',
    label: 'Газ',
    icon: Flame,
    colorClass: 'text-chart-pie-10',
    softBgClass: 'bg-info/15',
    types: [UtilityType.GAS, UtilityType.GAS_DELIVERY],
  },
  {
    key: 'heating',
    label: 'Тепло',
    icon: Thermometer,
    colorClass: 'text-chart-pie-4',
    softBgClass: 'bg-red/15',
    types: [UtilityType.HEATING],
  },
  {
    key: 'garbage',
    label: 'Сміття',
    icon: Recycle,
    colorClass: 'text-chart-pie-14',
    softBgClass: 'bg-green/30',
    types: [UtilityType.GARBAGE],
  },
];

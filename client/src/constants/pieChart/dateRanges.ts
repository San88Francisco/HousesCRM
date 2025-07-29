import { DropdownSelectOption } from '@/types';
import { DateRangeWithMonth } from '../allApartmentsDescriptionPieChart/allApartmentsDescriptionPieChart';

export const dateRanges: DropdownSelectOption<DateRangeWithMonth>[] = [
  { label: '1 місяць', value: '1m' },
  { label: '1 рік', value: '1y' },
  { label: '5 років', value: '5y' },
  { label: '10 років', value: '10y' },
  { label: 'Весь час', value: 'all' },
];

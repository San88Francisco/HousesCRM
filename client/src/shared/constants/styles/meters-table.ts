import { UtilityMode } from '@/shared/constants/utilities';

export const metersTableGrid =
  'grid grid-cols-[minmax(100px,1fr)_minmax(100px,1fr)_minmax(110px,1fr)_minmax(200px,1.4fr)_minmax(130px,1fr)_minmax(150px,1.2fr)_64px] [&>*]:flex [&>*]:items-center [&>*:not(:last-child)]:justify-center [&>*:last-child]:justify-center';

export const fixedFeeTableGrid =
  'grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)_minmax(160px,1.2fr)_64px] [&>*]:flex [&>*]:items-center [&>*:not(:last-child)]:justify-center [&>*:last-child]:justify-center';

export const manualTableGrid =
  'grid grid-cols-[minmax(140px,1fr)_minmax(180px,1.2fr)_64px] [&>*]:flex [&>*]:items-center [&>*:not(:last-child)]:justify-center [&>*:last-child]:justify-center';

export const tableGridByMode: Record<UtilityMode, string> = {
  metered: metersTableGrid,
  'fixed-fee': fixedFeeTableGrid,
  manual: manualTableGrid,
};

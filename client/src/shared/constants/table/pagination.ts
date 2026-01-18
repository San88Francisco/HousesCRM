import { PageSize } from '@/types/core/table/pagination';

export const DEFAULT_START_PAGE = 0;

export const DEFAULT_PAGE_SIZE = PageSize.TEN_ROWS;

export const PAGE_SIZE_OPTIONS = [
  { label: PageSize.FIVE_ROWS, value: PageSize.FIVE_ROWS },
  { label: PageSize.TEN_ROWS, value: PageSize.TEN_ROWS },
  { label: PageSize.FIFTEEN_ROWS, value: PageSize.FIFTEEN_ROWS },
  { label: PageSize.TWENTY_ROWS, value: PageSize.TWENTY_ROWS },
];

import { PaginationSortBy, PaginationSortOrder } from '@/types/core/pagination';

export type PaginationRequest = {
  page: number;
  limit: number;
  sortBy?: PaginationSortBy;
  order?: PaginationSortOrder;
};

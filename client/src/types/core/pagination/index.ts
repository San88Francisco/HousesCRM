export enum PaginationSortBy {
  TOTAL_REVENUE = 'totalRevenue',
  RENTERS_COUNT = 'rentersCount',
  CURRENT_PAYMENT = 'currentPayment',
}

export enum PaginationSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PaginationRequest = {
  page: number;
  limit: number;
  sortBy?: PaginationSortBy;
  order?: PaginationSortOrder;
};

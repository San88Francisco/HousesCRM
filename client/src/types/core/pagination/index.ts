export enum PaginationSortBy {
  APARTMENT_NAME = 'apartmentName',
  TOTAL_REVENUE = 'totalRevenue',
  RENTERS_COUNT = 'rentersCount',
  CURRENT_PAYMENT = 'currentPayment',
  CREATED_AT = 'createdAt',
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

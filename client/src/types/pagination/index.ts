export type PaginationRequest = {
  page: number;
  limit: number;
  sortBy?: 'totalRevenue' | 'rentersCount' | 'currentPayment';
  order?: 'ASC' | 'DESC';
};

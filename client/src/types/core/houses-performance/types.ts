export type HousesPerformance = {
  data: HousePerformanceItem[];
  meta: HousesPerformanceMeta;
};

export type HousePerformanceItem = {
  apartmentName: string;
  rentersCount: number;
  totalRevenue: number;
  currentPayment: number;
};

export type HousesPerformanceMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

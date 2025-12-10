export interface HousesPerformance {
  data: HousePerformanceItem[];
  meta: HousesPerformanceMeta;
}

export interface HousePerformanceItem {
  apartmentName: string;
  rentersCount: number;
  totalRevenue: number;
  currentPayment: number;
}

export interface HousesPerformanceMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

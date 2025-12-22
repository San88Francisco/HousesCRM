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

export type HousesPerformanceRequest = {
  page: number;
  limit: number;
  sortBy?: 'totalRevenue' | 'rentersCount' | 'currentPayment';
  order?: 'ASC' | 'DESC';
};

export type HousesPerformanceResponse = {
  data: HousePerformanceItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

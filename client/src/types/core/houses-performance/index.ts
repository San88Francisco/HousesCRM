import { Metadata } from '../metadata';

export type HousePerformanceItem = {
  id: string;
  apartmentName: string;
  rentersCount: number;
  totalRevenue: number;
  currentPayment: number;
};

export type HousesPerformanceResponse = {
  data: HousePerformanceItem[];
  meta: Metadata;
};

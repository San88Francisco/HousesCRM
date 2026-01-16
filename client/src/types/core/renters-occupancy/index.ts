import { Metadata } from '../metadata';

export type RentersOccupancyItem = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: 'active' | 'inactive';
};

export type RentersOccupancyRequest = {
  page: number;
  limit: number;
  sortBy?: 'totalRevenue' | 'rentersCount' | 'currentPayment';
  order?: 'ASC' | 'DESC';
};

export type RentersOccupancyResponse = {
  data: RentersOccupancyItem[];
  meta: Metadata;
};

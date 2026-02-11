import { Metadata } from '../metadata';
import { PaginationSortBy, PaginationSortOrder } from '../pagination';
import { ContractStatus } from '../status';

export type RentersOccupancyItem = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
};

export type RentersOccupancyRequest = {
  page: number;
  limit: number;
  sortBy?: PaginationSortBy;
  order?: PaginationSortOrder;
};

export type RentersOccupancyResponse = {
  data: RentersOccupancyItem[];
  meta: Metadata;
};

import { RenterFormData } from '@/shared/validation/create-update-renter';
import { ContractWithRevenue } from '@/types/core/contract';

import { Metadata } from '@/types/core/metadata';
import { PaginationSortBy, PaginationSortOrder } from '@/types/core/pagination';
import { Renter } from '@/types/core/renter';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { HousesPerformanceResponse } from '../houses';

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};

export type AllContractsByRenterIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: RentersIdContractsResponse;
};

export type RentersIdContractsResponse = {
  data: ContractWithRevenue[];
  meta: Metadata;
};

export type RenterContractsPaginatedRequest = {
  renterId: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
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

export type CreateRenterResponse = Renter;
export type CreateRenterRequest = RenterFormData;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = Partial<RenterFormData> & { id: string };

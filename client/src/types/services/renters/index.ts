import { RenterFormData } from '@/shared/validation/create-update-renter';
import { ContractWithRevenue } from '@/types/core/contract';
import { HousesPerformanceResponse } from '@/types/core/houses-performance';
import { Metadata } from '@/types/core/metadata';
import { Renter } from '@/types/core/renter';

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

export type CreateRenterResponse = Renter;
export type CreateRenterRequest = RenterFormData;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = Partial<RenterFormData> & { id: string };

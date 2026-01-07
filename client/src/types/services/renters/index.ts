import { Contract } from '@/types/core/contract';
import { HousesPerformanceResponse } from '@/types/core/houses-performance';
import { Metadata } from '@/types/core/metadata';
import { Renter } from '@/types/core/renter';
import { RenterFormFields } from '@/types/model/form/renter';

export type RenterReportResponse = {
  firstName: string;
  lastName: string;
};

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};

export type AllContractsByRenterIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: {
    data: Contract[];
    meta: Metadata;
  };
};

export type RentersPaginatedRequest = {
  renterId: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
};

export type CreateRenterResponse = Renter;
export type CreateRenterRequest = RenterFormFields;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = Partial<RenterFormFields> & { id: string };

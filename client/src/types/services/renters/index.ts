import { HousesPerformanceResponse } from '@/types/core/houses-performance';
import { Renter } from '@/types/core/renter';
import { RenterFormFields } from '@/types/model/form/renter';
import { Metadata } from '../../core/metadata';
import { ContractStatus } from '../../core/status/status';

export type ContractResponse = {
  id: string;
  commencement: string;
  termination: string;
  status: ContractStatus;
  monthlyPayment: number;
};

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
    data: ContractResponse[];
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

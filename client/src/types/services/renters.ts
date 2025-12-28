import { ContractStatus } from './statuses';

export type Renter = {
  id: string;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
  totalIncome: number;
  status: ContractStatus;
};

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

export type AllContractsByRenterIdResponse = {
  oneRenterReport: RenterReportResponse;
  allContractsByRenterId: {
    data: ContractResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type RentersPaginatedRequest = {
  renterId: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
};

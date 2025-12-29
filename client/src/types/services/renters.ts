import { RenterResponse } from '../model/renter';
import { ContractStatus } from './statuses';

export type RenterByIdResponse = {
  allContractsByRenterId: {
    data: {
      id: string;
      commencement: string;
      termination: string;
      monthlyPayment: number;
      totalRevenue: number;
      status: ContractStatus;
    }[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  oneRenterReport: RenterResponse;
};

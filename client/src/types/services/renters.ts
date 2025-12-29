import { RenterResponse } from '../model/renter';

export interface RenterByIdResponse {
  allContractsByRenterId: {
    data: {
      id: string;
      commencement: string;
      termination: string;
      monthlyPayment: number;
      totalRevenue: number;
      status: string;
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
}

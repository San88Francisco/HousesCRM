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
  oneRenterReport: {
    id: string;
    firstName: string;
    lastName: string;
    age: number | null;
    occupied: string;
    vacated?: string;
    status: string;
    totalIncome?: number;
  };
}

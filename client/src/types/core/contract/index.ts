import { House } from '../house';
import { Metadata } from '../metadata';
import { PaginationSortBy, PaginationSortOrder } from '../pagination';
import { Renter } from '../renter';
import { ContractStatus } from '../status/status';

export interface Contract {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
}

export interface ContractWithRevenue extends Contract {
  totalRevenue: number;
}

export interface ContractCreateUpdate extends Contract {
  houseId?: string;
  renterId?: string;
  house?: House;
  renter?: Renter;
}

export type ContractsRequest = {
  page: number;
  limit: number;
  sortBy?: PaginationSortBy;
  order?: PaginationSortOrder;
};

export type ContractsResponse = {
  data: Contract[];
  meta: Metadata;
};

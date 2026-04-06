import { House } from '../house';
import { Metadata } from '../metadata';
import { PaginationSortBy, PaginationSortOrder } from '../pagination';
import { Renter } from '../renter';
import { ContractStatus } from '../status';

export type ContractListRenter = Pick<Renter, 'id' | 'firstName' | 'lastName'>;
export type ContractListHouse = Pick<House, 'id' | 'apartmentName' | 'street'>;

export interface Contract {
  id: string;
  commencement: string;
  termination: string | null;
  monthlyPayment: number;
  status: ContractStatus;
  renter?: ContractListRenter | null;
  house?: ContractListHouse | null;
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

import { Contract } from '@/types/core/contract';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: Renter[];
  houses: House[];
  contracts: Contract[];
};

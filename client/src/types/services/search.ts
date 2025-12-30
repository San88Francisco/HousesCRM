import { Contract } from '../core/contract/contract';
import { House } from '../core/house/house';
import { Renter } from './renters';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: Renter[];
  houses: House[];
  contracts: Contract[];
};

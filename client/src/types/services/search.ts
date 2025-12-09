import { Contract } from './contracts';
import { House } from './houses';
import { Renter } from './renters';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: Renter[];
  houses: House[];
  contracts: Contract[];
};

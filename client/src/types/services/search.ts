import { Contract } from './contracts';
import { HousePayload } from './houses';
import { Renter } from './renters';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: Renter[];
  houses: HousePayload[];
  contracts: Contract[];
};

import { RenterResponse } from '../model/renter';
import { Contract } from './contracts';
import { House } from './houses';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: RenterResponse[];
  houses: House[];
  contracts: Contract[];
};

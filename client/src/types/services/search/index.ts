import { Contract } from '../../core/contract';
import { House } from '../../core/house';
import { Renter } from '../renters';

export type SearchRequest = {
  query?: string;
};

export type SearchResponse = {
  renters: Renter[];
  houses: House[];
  contracts: Contract[];
};

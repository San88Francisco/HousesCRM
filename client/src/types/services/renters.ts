import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { Renter } from '../core/renter/renter';

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};

export type RenterFormFields = Pick<Renter, 'firstName' | 'lastName' | 'age'>;

export type CreateRenterResponse = Omit<Renter, 'id'>;
export type CreateRenterRequest = RenterFormFields;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = RenterFormFields & { id: string };

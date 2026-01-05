import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { Renter, RenterFormFields } from '../core/renter/renter';

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};

export type CreateRenterResponse = Omit<Renter, 'id'>;
export type CreateRenterRequest = RenterFormFields;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = Partial<RenterFormFields> & { id: string };

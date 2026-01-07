import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { Renter } from '../core/renter/renter';
import { RenterFormFields } from '../model/form/renter';

export type RenterByIdResponse = {
  oneRenterReport: Renter;
  allContractsByRenterId: HousesPerformanceResponse;
};

export type CreateRenterResponse = Renter;
export type CreateRenterRequest = RenterFormFields;

export type UpdateRenterResponse = Renter;
export type UpdateRenterRequest = Partial<RenterFormFields> & { id: string };

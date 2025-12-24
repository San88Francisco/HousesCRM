import { RenterResponse } from '@/types/model/renter';
import { RenterFormData } from '@/shared/validation/renter/renter-schema';

export const mapRenterToFormData = (renter: RenterResponse): RenterFormData => {
  return {
    firstName: renter.firstName,
    lastName: renter.lastName,
    occupied: new Date(renter.occupied),
    vacated: new Date(renter.vacated),
  };
};

import { RenterFormData } from '@/shared/validation/renter/renter-schema';
import { RenterResponse } from '@/types/model/renter';

export const mapRenterToFormData = (renter: RenterResponse): RenterFormData => {
  return {
    firstName: renter.firstName,
    lastName: renter.lastName,
    age: renter.age || null,
  };
};

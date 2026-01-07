import { RenterFormData } from '@/shared/validation/create-update-renter/renter-schema';
import { Renter } from '@/types/core/renter';

export const mapRenterToFormData = (renter: Renter): RenterFormData => {
  return {
    firstName: renter.firstName,
    lastName: renter.lastName,
    age: renter.age,
  };
};

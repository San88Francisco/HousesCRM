import { RenterFormData } from '@/shared/validation/create-update-renter/renter-schema';
import { UpdateRenterRequest } from '@/types/services/renters';

export const mapRenterToFormData = (renter: UpdateRenterRequest): RenterFormData => {
  return {
    firstName: renter.firstName,
    lastName: renter.lastName,
    age: renter.age,
  };
};

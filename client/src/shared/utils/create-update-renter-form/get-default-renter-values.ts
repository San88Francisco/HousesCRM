import { RenterFormData } from '@/shared/validation/create-update-renter/renter-schema';

export const getDefaultRenterValues = (): Partial<RenterFormData> => {
  return {
    firstName: '',
    lastName: '',
    age: undefined,
  };
};

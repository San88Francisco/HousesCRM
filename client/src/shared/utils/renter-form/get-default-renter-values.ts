import { RenterFormData } from '@/shared/validation/renter/renter-schema';

export const getDefaultRenterValues = (): Partial<RenterFormData> => {
  return {
    firstName: '',
    lastName: '',
    age: null,
  };
};

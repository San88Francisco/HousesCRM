import { RenterFormData } from '@/shared/validation/create-update-renter/renter-schema';

export const getDefaultRenterValues = (): Partial<RenterFormData> => ({
  firstName: '',
  lastName: '',
  age: undefined,
});

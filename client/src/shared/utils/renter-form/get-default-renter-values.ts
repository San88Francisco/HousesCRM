import { RenterFormData } from '@/shared/validation/renter/renter-schema';
import { startOfToday } from 'date-fns';

export const getDefaultRenterValues = (): Partial<RenterFormData> => {
  const today = startOfToday();
  return {
    firstName: '',
    lastName: '',
    occupied: today,
    vacated: today,
  };
};

import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentType } from '@/types/core/houses';

export const getDefaultApartmentValues = (): ApartmentFormData => ({
  apartmentName: '',
  roomsCount: 1,
  totalArea: 1,
  purchaseDate: new Date(),
  price: 1,
  floor: 1,
  street: '',
  apartmentType: ApartmentType.NEW_BUILD,
});

import { ApartmentFormData } from '@/shared/validation/add-houses/house-schema';
import { ApartmentType } from '@/types/core/houses';

export const getDefaultHouseValues = (): ApartmentFormData => ({
  apartmentName: '',
  roomsCount: 1,
  totalArea: 1,
  purchaseDate: new Date(),
  price: 1,
  floor: 1,
  street: '',
  apartmentType: ApartmentType.NEW_BUILD,
});

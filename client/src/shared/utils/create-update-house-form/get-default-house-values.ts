import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { ApartmentType } from '@/types/core/house';

export const getDefaultHouseValues = (): HouseFormData => ({
  apartmentName: '',
  roomsCount: 1,
  totalArea: 1,
  purchaseDate: new Date(),
  price: 1,
  floor: 1,
  street: '',
  apartmentType: ApartmentType.NEW_BUILD,
});

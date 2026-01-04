import { ApartmentType } from '@/types/core/house/house';

export const defaultHouseValues = {
  apartmentName: '',
  roomsCount: 1,
  totalArea: 1,
  // purchaseDate: new Date(),
  purchaseDate: '',
  price: 1,
  floor: 1,
  street: '',
  apartmentType: ApartmentType.NEW_BUILD,
};

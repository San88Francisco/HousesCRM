import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { ApartmentType } from '@/types/core/house/house';

export const defaultHouseValues: Partial<HouseFormData> = {
  apartmentName: '',
  roomsCount: null,
  totalArea: null,
  purchaseDate: '',
  price: null,
  floor: null,
  street: '',
  apartmentType: ApartmentType.NEW_BUILD,
};

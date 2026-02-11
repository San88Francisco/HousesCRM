import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { HouseType } from '@/types/core/house';

export const defaultHouseValues: Partial<HouseFormData> = {
  apartmentName: '',
  roomsCount: null,
  totalArea: null,
  purchaseDate: '',
  price: null,
  floor: null,
  street: '',
  apartmentType: HouseType.NEW_BUILD,
};

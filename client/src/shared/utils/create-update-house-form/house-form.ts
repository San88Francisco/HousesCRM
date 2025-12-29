import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { HouseToEdit } from '@/types/core/house';
import { getDefaultHouseValues } from './get-default-house-values';

export const mapHouseToFormData = (house?: HouseToEdit): HouseFormData => {
  if (!house) return getDefaultHouseValues();

  return {
    apartmentName: house.apartmentName,
    roomsCount: house.roomsCount,
    totalArea: house.totalArea,
    purchaseDate: new Date(house.purchaseDate),
    price: house.prices[0]?.amount,
    floor: house.floor,
    street: house.street,
    apartmentType: house.apartmentType,
  };
};

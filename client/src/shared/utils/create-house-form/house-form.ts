import { HouseFormData } from '@/shared/validation/add-houses/house-schema';
import { House } from '@/types/core/house/house';
import { defaultHouseValues } from './get-default-house-values';

export const mapHouseToFormData = (house?: House): HouseFormData => {
  if (!house) return defaultHouseValues;

  return {
    apartmentName: house.apartmentName,
    roomsCount: house.roomsCount,
    totalArea: house.totalArea,
    purchaseDate: house.purchaseDate,
    price: house.prices[0]?.amount,
    floor: house.floor,
    street: house.street,
    apartmentType: house.apartmentType,
  };
};

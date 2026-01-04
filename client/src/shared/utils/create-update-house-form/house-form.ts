import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { House } from '@/types/core/house/house';

export const mapHouseToFormData = (house: House): HouseFormData => {
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

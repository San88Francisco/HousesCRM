import { ApartmentFormData } from '@/shared/validation/add-houses/house-schema';
import { ApartmentToEdit } from '@/types/core/house';
import { getDefaultHouseValues } from './get-default-house-values';

export const mapHouseToFormData = (apartment?: ApartmentToEdit): ApartmentFormData => {
  if (!apartment) return getDefaultHouseValues();

  return {
    apartmentName: apartment.apartmentName,
    roomsCount: apartment.roomsCount,
    totalArea: apartment.totalArea,
    purchaseDate: new Date(apartment.purchaseDate),
    price: apartment.prices[0]?.amount ?? 0,
    floor: apartment.floor,
    street: apartment.street,
    apartmentType: apartment.apartmentType,
  };
};

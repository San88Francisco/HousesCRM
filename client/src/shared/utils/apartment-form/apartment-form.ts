import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentToEdit } from '@/types/core/apartment';
import { getDefaultApartmentValues } from './get-default-apartment-values';

export const mapApartmentToFormData = (apartment?: ApartmentToEdit): ApartmentFormData => {
  if (!apartment) {
    return getDefaultApartmentValues();
  }

  return {
    apartmentName: apartment.apartmentName,
    roomsCount: apartment.roomsCount,
    totalArea: apartment.totalArea,
    purchaseDate: new Date(apartment.purchaseDate),
    price: apartment.prices[0].amount,
    floor: apartment.floor,
    street: apartment.street,
    apartmentType: apartment.apartmentType,
  };
};

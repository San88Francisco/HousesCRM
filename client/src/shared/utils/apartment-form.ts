import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentToEdit } from '@/types/core/apartment';
import { DEFAULT_APARTMENT_VALUES } from '../constants/apartment-form';

export const mapApartmentToFormData = (apartment?: ApartmentToEdit): ApartmentFormData => {
  if (!apartment) {
    return DEFAULT_APARTMENT_VALUES;
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

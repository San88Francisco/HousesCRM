import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentToEdit } from '@/types/core/apartment';
import { DEFAULT_APARTMENT_VALUES } from '../constants/apartment-form';

export const mapApartmentToFormData = (apartment?: ApartmentToEdit): ApartmentFormData => {
  if (!apartment) {
    return DEFAULT_APARTMENT_VALUES;
  }

  return {
    apartmentName: apartment.apartmentName || '',
    roomsCount: apartment.roomsCount || 1,
    totalArea: apartment.totalArea || 1,
    purchaseDate: apartment.purchaseDate ? new Date(apartment.purchaseDate) : new Date(),
    price: apartment.price || 1,
    floor: apartment.floor || 1,
    street: apartment.street || '',
    apartmentType: apartment.apartmentType || 'new_build',
  };
};

import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';

export const APARTMENT_TYPE_OPTIONS = [
  { value: 'new_build', label: 'Новобудова' },
  { value: 'old_build', label: 'Вторинне житло' },
] as const;

export const DEFAULT_APARTMENT_VALUES: ApartmentFormData = {
  apartmentName: '',
  roomsCount: 1,
  totalArea: 1,
  purchaseDate: new Date(),
  price: 1,
  floor: 1,
  street: '',
  apartmentType: 'new_build',
};

import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';

export interface ApartmentToEdit extends ApartmentFormData {
  id: string | number;
}

export interface ApartmentModalPayload {
  apartment?: ApartmentToEdit;
}

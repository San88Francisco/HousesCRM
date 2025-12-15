import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentType } from './houses';

export interface ApartmentFromAPI {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  prices?: Array<{
    id: string;
    amount: number;
    code: string;
    exchangeRate: number;
  }>;
}

export interface ApartmentToEdit extends Omit<ApartmentFormData, 'price' | 'purchaseDate'> {
  id: string;
  price?: number;
  prices: Array<{
    id: string;
    amount: number;
    code: string;
    exchangeRate: number;
  }>;
  purchaseDate: string | Date;
}

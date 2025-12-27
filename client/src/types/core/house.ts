import { HouseFormData } from '@/shared/validation/add-houses/house-schema';
import { ApartmentType } from './houses';

export type HouseFromAPI = {
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
};

export type HouseToEdit = Omit<HouseFormData, 'price' | 'purchaseDate'> & {
  id: string;
  price: number;
  prices: Array<{
    id: string;
    amount: number;
    code: string;
    exchangeRate: number;
  }>;
  purchaseDate: string | Date;
};

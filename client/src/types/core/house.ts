import { HouseFormData } from '@/shared/validation/create-update-houses/house-schema';

type Price = {
  id: string;
  amount: number;
  code: string;
  exchangeRate: number;
};

export enum ApartmentType {
  NEW_BUILD = 'new_build',
  RESALE = 'resale',
}

export type HouseFromAPI = {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  prices?: Price[];
};

export type HouseToEdit = Omit<HouseFormData, 'price' | 'purchaseDate'> & {
  id: string;
  prices: Price[];
  purchaseDate: string;
};

import { Price } from '@/types/model/house-price';

export enum HouseType {
  NEW_BUILD = 'new_build',
  RESALE = 'resale',
}

export interface House {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: HouseType;
  prices: Price[];
  contractIds?: string[];
}

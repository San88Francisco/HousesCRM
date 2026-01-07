import { Price } from '@/types/model/house-price';
import { ApartmentType } from '../apartment-type';

export interface House {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  prices: Price[];
  contractIds?: string[];
}

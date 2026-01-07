import { ApartmentType } from '@/types/core/apartment-type';

export type CreateUpdateHouseForm = {
  apartmentName: string;
  roomsCount: number | null;
  totalArea: number | null;
  purchaseDate: string;
  floor: number | null;
  street: string;
  apartmentType: ApartmentType;
  price: number | null;
  contractIds?: string[];
};

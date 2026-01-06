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

export type Price = {
  id: string;
  amount: number;
  code: string;
  exchangeRate: number;
};

export enum ApartmentType {
  NEW_BUILD = 'new_build',
  RESALE = 'resale',
}

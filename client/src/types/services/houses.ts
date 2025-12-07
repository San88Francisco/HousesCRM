export enum ApartmentType {
  NEW_BUILD = 'new_build',
  RESALE = 'resale',
}

export type House = {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
};

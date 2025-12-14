import { ApartmentType } from '../core/houses';

export interface CreateApartmentPayload {
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string | Date;
  price: number;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  contractIds?: string[];
}

export interface UpdateApartmentPayload extends Partial<CreateApartmentPayload> {
  id: string | number;
}

import { ApartmentType } from '../core/houses';

export interface CreateHousePayload {
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

export interface UpdateApartmentPayload extends Partial<CreateHousePayload> {
  id: string;
}

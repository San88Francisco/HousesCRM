import { ApartmentType } from '../core/houses';

export type House = {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  price: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  contractIds?: string[];
};

export type HouseByIdResponse = {
  houseDetail: {
    prices: {
      id: string;
      amount: number;
      code: string;
      exchangeRate: number;
    }[];
    id: string;
    apartmentName: string;
    roomsCount: number;
    totalArea: number;
    purchaseDate: string;
    floor: number;
    street: string;
    apartmentType: ApartmentType;
  };
  occupancyReports: {
    totalIncome: number;
    status: string;
    id: string;
    firstName: string;
    lastName: string;
    occupied: string;
    vacated: string;
    age: number;
  }[];
};

export type CreateHousePayload = Omit<House, 'id'>;

export type UpdateHousePayload = House;

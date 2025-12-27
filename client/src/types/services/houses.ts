import { ApartmentType } from '../core/houses';

export type HousePayload = {
  id?: string;
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
  }[];
};

export type CreateHousePayload = HousePayload;

export type UpdateHousePayload = HousePayload;

import { CurrencyRevaluation } from '../core/currency-revaluation-chart/types';
import { ApartmentType, House } from '../core/house/house';
import { Renter } from './renters';

export type HouseByIdResponse = {
  houseDetail: House;
  occupancyReports: Renter[];
};

export type CreateHouseResponse = Omit<House, 'id'>;
export type CreateHouseRequest = {
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  price: number;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  contractIds?: string[];
};

export type UpdateHouseResponse = House;
export type UpdateHouseRequest = House;

export type CurrencyRevaluationResponse = CurrencyRevaluation[];

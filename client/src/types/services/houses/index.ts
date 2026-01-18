import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { CurrencyRevaluation } from '../../core/currency-revaluation-chart';
import { Metadata } from '../../core/metadata';
import { OccupancyHouses } from '../../model/houses-occupancy';

export type HouseByIdResponse = {
  houseDetail: House;
  occupancyReports: OccupancyReports;
};

export type OccupancyReports = {
  data: Renter[];
  meta: Metadata;
};

export type CreateHouseResponse = House;
export type CreateHouseRequest = HouseFormData;

export type UpdateHouseResponse = House;
export type UpdateHouseRequest = Partial<HouseFormData> & { id: string };

export type OccupancyHousesPaginatedResponse = {
  data: OccupancyHouses[];
  meta: Metadata;
};

export type OccupancyHousesRequest = {
  id: string;
  page?: number;
  limit?: number;
};

export type CurrencyRevaluationResponse = CurrencyRevaluation[];

export type HousesResponse = {
  data: HousesDataResponse[];
};

export type HousesDataResponse = {
  prices: Prices[];
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: string;
  meta: Metadata;
};

export type Prices = {
  id: string;
  amount: string;
  code: string;
  exchangeRate: number;
};

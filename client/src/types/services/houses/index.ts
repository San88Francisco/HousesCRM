import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { ContractStatus } from '@/types/core/status/status';
import { CurrencyRevaluation } from '../../core/currency-revaluation-chart';
import { Metadata } from '../../core/metadata';
import { HouseOccupancyItem } from '../../model/houses-occupancy';

export type HouseByIdResponse = {
  houseDetail: House;
  occupancyReports: OccupancyReports;
};

export type OccupancyReports = {
  data: Renter[];
  meta: Metadata;
};

export type OccupancyBase = {
  id: string;
  firstName: string;
  lastName: string;
  occupied: string | null;
  vacated: string | null;
  totalIncome: number;
  status: ContractStatus;
};

export type CreateHouseResponse = House;
export type CreateHouseRequest = HouseFormData;

export type UpdateHouseResponse = House;
export type UpdateHouseRequest = Partial<HouseFormData> & { id: string };

export type OccupancyHousesPaginatedResponse = {
  data: HouseOccupancyItem[];
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
  meta: Metadata;
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
  apartmentType: House['apartmentType'];
};

export type Prices = {
  id: string;
  amount: number;
  code: string;
  exchangeRate: number;
};

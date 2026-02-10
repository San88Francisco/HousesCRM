import { HouseFormData } from '@/shared/validation/create-update-house';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { ContractStatus } from '@/types/core/status';
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
  data: House[];
  meta: Metadata;
};

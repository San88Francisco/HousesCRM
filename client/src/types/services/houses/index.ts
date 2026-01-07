import { ApartmentType } from '@/types/core/apartment-type';
import { House } from '@/types/core/house';
import { CurrencyRevaluation } from '../../core/currency-revaluation-chart';
import { Metadata } from '../../core/metadata';
import { OccupancyHouses } from '../../model/houses-occupancy';
import { Renter } from '../renters';

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
export type UpdateHouseRequest = Partial<Omit<CreateHouseRequest, 'contractIds'>> & {
  id: string;
};

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

import { CurrencyRevaluation } from '../core/currency-revaluation-chart/types';
import { House } from '../core/house/house';
import { Renter } from '../core/renter/renter';
import { CreateUpdateHouseForm } from '../model/form/house';

export type HouseByIdResponse = {
  houseDetail: House;
  occupancyReports: Renter[];
};

export type CreateHouseResponse = House;
export type CreateHouseRequest = CreateUpdateHouseForm;

export type UpdateHouseResponse = House;
export type UpdateHouseRequest = Partial<CreateUpdateHouseForm> & { id: string };

export type CurrencyRevaluationResponse = CurrencyRevaluation[];

export interface Renter {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Contract {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  renter: Renter;
}

export interface Apartment {
  id: string;
  apartmentName: string;
  contract: Contract[];
}

export type ChartDataPoint = {
  date: number;
  [key: string]: number | null | Contract | string | undefined;
};

export enum TimeRangeEnum {
  SIX_MONTHS = '6 місяців',
  ONE_YEAR = '1 рік',
  TWO_YEARS = '2 роки',
  FIVE_YEARS = '5 років',
  TEN_YEARS = '10 років',
  FIFTEEN_YEARS = '15 років',
  ALL_DATA = 'Всі дані',
}

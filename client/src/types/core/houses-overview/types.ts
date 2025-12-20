export type Renter = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Contract = {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  renter: Renter;
};

export type Apartment = {
  id: string;
  apartmentName: string;
  contract: Contract[];
};

export type HouseOverviewChartDataItem = Apartment & {
  fill: string;
};

export type PayloadData = {
  [key: string]: Contract | string | number | null | undefined;
};

export type ChartDataPoint = PayloadData & {
  date: number;
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

export type TooltipPayload = {
  dataKey: string;
  payload: PayloadData;
  stroke: string;
};

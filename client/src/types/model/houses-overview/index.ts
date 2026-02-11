export type HousesOverviewRenter = {
  id: string;
  firstName: string;
  lastName: string;
};

export type HousesOverviewContract = {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  renter: HousesOverviewRenter;
};

export type House = {
  id: string;
  apartmentName: string;
  contract: HousesOverviewContract[];
};

export type HouseOverviewChartDataItem = House & {
  fill: string;
};

export type PayloadData = {
  [key: string]: HousesOverviewContract | string | number | null | undefined;
};

export type ChartDataPoint = PayloadData & {
  date: number;
};

export type TooltipPayload = {
  dataKey: string;
  payload: PayloadData;
  stroke: string;
};

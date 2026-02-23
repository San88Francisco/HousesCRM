export type PieRevenueItem = {
  apartmentTotalRevenue: number;
  percentage: number;
  id: string;
  apartmentName: string;
};

export type HouseDistributionDataItemChart = PieRevenueItem & {
  fill: string;
};

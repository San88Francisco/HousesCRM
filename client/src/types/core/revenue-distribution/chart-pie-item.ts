export type PieRevenueItem = {
  apartmentTotalRevenue: number;
  percentage: number;
  id: string;
  apartmentName: string;
};

export type HouseDistributionChartDataItem = PieRevenueItem & {
  fill: string;
};

export interface RevenueDistribution {
  data: PieRevenueItem[];
  grandTotal: number;
}

export type PieRevenueItem = {
  apartmentTotalRevenue: number;
  percentage: number;
  id: string;
  apartmentName: string;
};

export type HouseChartDataItem = PieRevenueItem & {
  fill: string;
};

export interface RevenueDistribution {
  data: PieRevenueItem[];
  grandTotal: number;
}

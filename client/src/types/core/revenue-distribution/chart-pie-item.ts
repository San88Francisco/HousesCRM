import { PieRevenueItem } from '@/types/model/revenue-distribution/pie-chart-items';

export interface RevenueDistribution {
  data: PieRevenueItem[];
  grandTotal: number;
}

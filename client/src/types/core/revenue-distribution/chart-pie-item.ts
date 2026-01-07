import { PieRevenueItem } from '@/types/model/revenue-distribution';

export interface RevenueDistribution {
  data: PieRevenueItem[];
  grandTotal: number;
}

export interface CurrencyRevaluation {
  purchaseRate: number;
  currentRate: number;
  revaluationAmountUah: number;
  purchaseAmountUah: number;
  id: string;
  apartmentName: string;
}

export interface ChartDataItem {
  apartmentName: string;
  purchaseAmount: number;
  revaluationAmount: number;
  purchaseRate: number;
  currentRate: number;
  id: string;
}

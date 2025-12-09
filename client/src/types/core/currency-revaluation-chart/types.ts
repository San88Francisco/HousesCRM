export type CurrencyRevaluation = {
  purchaseRate: number;
  currentRate: number;
  revaluationAmountUah: number;
  purchaseAmountUah: number;
  id: string;
  apartmentName: string;
};

export type ChartDataItem = {
  apartmentName: string;
  purchaseAmount: number;
  revaluationAmount: number;
  purchaseRate: number;
  currentRate: number;
  id: string;
};

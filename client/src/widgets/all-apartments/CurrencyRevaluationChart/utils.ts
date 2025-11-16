/* eslint-disable */
import { CurrencyRevaluation, ChartDataItem } from './types';

const MILLION = 1_000_000;
const THOUSAND = 1_000;
const DECIMAL_PLACES = 1;

export const transformCurrencyData = (data: CurrencyRevaluation[]): ChartDataItem[] => {
  return data.map(item => ({
    apartmentName: item.apartmentName,
    purchaseAmount: item.purchaseAmountUah,
    revaluationAmount: item.revaluationAmountUah,
    purchaseRate: item.purchaseRate,
    currentRate: item.currentRate,
    id: item.id,
  }));
};

export const formatCurrency = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(DECIMAL_PLACES)}M ₴`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(0)}k ₴`;
  }
  return `${value} ₴`;
};

export const formatRate = (rate: number): string => {
  return `${rate.toFixed(2)} ₴/$`;
};

export const truncateText = (text: string, maxLength: number = 15): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

import { ApartmentType } from '../core/houses';

export type House = {
  id: string;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
};

export type HouseResponse = {
  houseDetail: {
    prices: {
      id: string;
      amount: number;
      code: string;
      exchangeRate: number;
    }[];
    id: string;
    apartmentName: string;
    roomsCount: number;
    totalArea: number;
    purchaseDate: string;
    floor: number;
    street: string;
    apartmentType: ApartmentType;
  };
  occupancyReports: {
    totalIncome: number;
    status: string;
    id: string;
    firstName: string;
    lastName: string;
    occupied: string;
    vacated: string;
  }[];
};

export type HousesAllAnalyticsResponse = {
  revenueDistribution: RevenueDistribution;
};

type RevenueDistribution = {
  data: RevenueItem[];
  grandTotal: number;
};
export type RevenueItem = {
  apartmentTotalRevenue: number;
  percentage: number;
  id: string;
  apartmentName: string;
};

export type HouseChartDataItem = RevenueItem & {
  fill: string;
};

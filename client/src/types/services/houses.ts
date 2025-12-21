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

export type HouseByIdResponse = {
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
  occupancyReports: occupanncyResponseData;
};

export type occupanncyResponseData = {
  data: occupanncyApartmentResponse[];
  meta: metadataResponse;
};

export type metadataResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type occupanncyApartmentResponse = {
  totalIncome: number;
  status: string;
  id: string;
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
};

export type OccupancyPaginatedResponse = {
  data: occupanncyApartmentResponse[];
  meta: metadataResponse;
};

export type OccupancyQueryParams = {
  id: string;
  page?: number;
  limit?: number;
};

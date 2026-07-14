export enum UtilityType {
  ELECTRICITY = 'electricity',
  WATER_COLD = 'water_cold',
  WATER_HOT = 'water_hot',
  GAS = 'gas',
  GAS_DELIVERY = 'gas_delivery',
  HEATING = 'heating',
  GARBAGE = 'garbage',
}

export type MeterReading = {
  id: string;
  utilityType: UtilityType;
  value: number;
  readingDate: string;
  previousValue: number | null;
  consumption: number | null;
  tariffPrice: number | null;
  cost: number | null;
  unit: string;
  createdAt: string;
};

export type MeterReadingsResponse = {
  data: MeterReading[];
};

export type MeterReadingsRequest = {
  houseId: string;
  utilityType: UtilityType;
};

export type CreateMeterReadingRequest = {
  houseId: string;
  utilityType: UtilityType;
  readingDate: string;
  value?: number;
};

export type DeleteMeterReadingRequest = {
  houseId: string;
  utilityType: UtilityType;
  id: string;
};

export type UtilityTariff = {
  id: string;
  utilityType: UtilityType;
  pricePerUnit: number;
  validFrom: string;
  createdAt: string;
};

export type UtilitySummaryMonth = {
  month: string;
  total: number;
  costs: Partial<Record<UtilityType, number>>;
};

export type UtilitySummaryResponse = {
  data: UtilitySummaryMonth[];
};

export type CreateUtilityTariffRequest = {
  pricePerUnit: number;
  validFrom: string;
  utilityType: UtilityType;
};

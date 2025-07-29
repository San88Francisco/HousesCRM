import { UUID } from 'crypto';

export enum ContractPeriod {
  OneMonth = '1month',
  SixMonths = '6months',
  OneYear = '1year',
  FiveYears = '5years',
  TenYears = '10years',
  FifteenYears = '15years',
  All = 'all',
}

export enum ContractStatus {
  Active = 'active',
  Inactive = 'inactive',
  Terminated = 'terminated',
}

export type ContractsForPeriodRequest = {
  period: ContractPeriod;
  renter_id?: UUID;
};

export type Contract = {
  _id: string;
  renter_id: string;
  monthlyPayment: number;
  status: ContractStatus;
  originalStartDate: string;
  originalEndDate: string;
  adjustedStartDate: string;
  adjustedEndDate: string;
  renter: {
    _id: string;
    house_id: string;
    name: string;
  };
  house: {
    _id: string;
    apartmentName: string;
    floor: number;
    street: string;
  };
};

export type Period = {
  selected: ContractPeriod;
  startDate: string;
  endDate: string;
  description: string;
};

export type Statistics = {
  totalContracts: number;
  totalRevenue: number;
  averageMonthlyPayment: number;
};

export type ContractsForPeriodResponse = {
  contracts: Contract[];
  period: Period;
  statistics: Statistics;
};

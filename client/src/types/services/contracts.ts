import { UUID } from 'crypto';
import { ContractStatus } from './statuses';

export enum ContractPeriod {
  OneMonth = '1month',
  SixMonths = '6months',
  OneYear = '1year',
  FiveYears = '5years',
  TenYears = '10years',
  FifteenYears = '15years',
  All = 'all',
}

export type ContractsForPeriodRequest = {
  period: ContractPeriod;
  renter_id?: UUID;
};

export type Contract = {
  id: UUID;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
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

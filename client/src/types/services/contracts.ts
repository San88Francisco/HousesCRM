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

export type PdfContractRaw = {
  renterFirstName: string;
  renterLastName: string;
  roomsCount: number;
  street: string;
  commencement: string;
  monthlyPayment: number;
};

export type PdfContractModel = {
  landlord: {
    firstName: string;
    lastName: string;
    passportSeries: string;
    passportNumber: string;
    passportIssued: string;
    address: string;
  };
  tenant: {
    firstName: string;
    lastName: string;
    passportSeries: string;
    passportNumber: string;
    passportIssued: string;
    address: string;
  };
  property: {
    ownershipDocument: string;
    roomCount: string;
    area: string;
    street: string;
    building: string;
    apartment: string;
  };
  terms: {
    inspectionCount: string;
    rentPriceUah: string;
    rentPriceUsd: string;
    initialPayment: string;
    depositAmount: string;
    paymentDeadlineDay: string;
  };
  meters: {
    electricity: string;
    gas: string;
    coldWater: string;
    hotWater: string;
  };
};

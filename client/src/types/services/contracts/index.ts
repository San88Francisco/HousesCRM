import { ContractCreateUpdate } from '@/types/core/contract';
import { ContractFormFields } from '@/types/model/form/contract';

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

export type CreateContractResponse = ContractCreateUpdate;
export type CreateContractRequest = ContractFormFields;

export type UpdateContractResponse = ContractCreateUpdate;
export type UpdateContractRequest = Partial<ContractFormFields> & { id: string };

export type ContractByIdResponse = ContractCreateUpdate;

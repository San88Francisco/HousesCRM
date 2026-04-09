import type { ContractTerminationPayload } from '@/shared/constants/contract-termination';
import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractCreateUpdate } from '@/types/core/contract';

export type PdfContractRaw = {
  renterFirstName: string;
  renterLastName: string;
  roomsCount: number;
  totalArea: number;
  street: string;
  apartmentName: string;
  commencement: string;
  monthlyPayment: number;
};

export type PdfContractResponse = PdfContractRaw;

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
export type CreateContractRequest = Omit<ContractFormData, 'termination'> & {
  termination: ContractTerminationPayload;
};

export type UpdateContractResponse = ContractCreateUpdate;
export type UpdateContractRequest = Partial<Omit<ContractFormData, 'termination'>> & {
  id: string;
  termination?: ContractTerminationPayload;
};

export type ContractByIdResponse = ContractCreateUpdate;

import { PdfContractModel, PdfContractRaw } from '@/types/services/contracts';

const fmt = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '_____';
  }
  return String(value);
};

export const PdfContractAdapter = (data: PdfContractRaw): PdfContractModel => {
  return {
    landlord: {
      firstName: fmt(undefined),
      lastName: fmt(undefined),
      passportSeries: fmt(undefined),
      passportNumber: fmt(undefined),
      passportIssued: fmt(undefined),
      address: fmt(undefined),
    },
    tenant: {
      firstName: fmt(data.renterFirstName),
      lastName: fmt(data.renterLastName),
      passportSeries: fmt(undefined),
      passportNumber: fmt(undefined),
      passportIssued: fmt(undefined),
      address: fmt(undefined),
    },
    property: {
      ownershipDocument: fmt(undefined),
      roomCount: fmt(data.roomsCount),
      area: fmt(undefined),
      street: fmt(data.street),
      building: fmt(undefined),
      apartment: fmt(undefined),
    },
    terms: {
      inspectionCount: fmt(undefined),
      rentPriceUah: fmt(data.monthlyPayment),
      rentPriceUsd: fmt(undefined),
      initialPayment: fmt(undefined),
      depositAmount: fmt(undefined),
      paymentDeadlineDay: fmt(undefined),
    },
    meters: {
      electricity: fmt(undefined),
      gas: fmt(undefined),
      coldWater: fmt(undefined),
      hotWater: fmt(undefined),
    },
  };
};

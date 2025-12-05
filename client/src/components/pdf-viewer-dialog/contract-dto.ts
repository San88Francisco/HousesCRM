/* eslint-disable */

export interface ContractPdfFileDto {
  renterFirstName: string;
  renterLastName: string;
  roomsCount: number;
  street: string;
  commencement: string;
  monthlyPayment: number;
}

export interface ContractViewModel {
  landlord: {
    fullName: string;
    passportSeries: string;
    passportNumber: string;
    passportIssued: string;
    address: string;
  };
  tenant: {
    fullName: string;
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
}

const formatField = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '_____';
  }
  return String(value);
};

export const mapContractToPdfView = (data?: ContractPdfFileDto): ContractViewModel => {
  return {
    landlord: {
      fullName: formatField(undefined),
      passportSeries: formatField(undefined),
      passportNumber: formatField(undefined),
      passportIssued: formatField(undefined),
      address: formatField(undefined),
    },
    tenant: {
      fullName: `${formatField(data?.renterFirstName)} ${formatField(data?.renterLastName)}`,
      passportSeries: formatField(undefined),
      passportNumber: formatField(undefined),
      passportIssued: formatField(undefined),
      address: formatField(undefined),
    },
    property: {
      ownershipDocument: formatField(undefined),
      roomCount: formatField(data?.roomsCount),
      area: formatField(undefined),
      street: formatField(data?.street),
      building: formatField(undefined),
      apartment: formatField(undefined),
    },
    terms: {
      inspectionCount: formatField(undefined),
      rentPriceUah: formatField(data?.monthlyPayment),
      rentPriceUsd: formatField(undefined),
      initialPayment: formatField(undefined),
      depositAmount: formatField(undefined),
      paymentDeadlineDay: formatField(undefined),
    },
    meters: {
      electricity: formatField(undefined),
      gas: formatField(undefined),
      coldWater: formatField(undefined),
      hotWater: formatField(undefined),
    },
  };
};

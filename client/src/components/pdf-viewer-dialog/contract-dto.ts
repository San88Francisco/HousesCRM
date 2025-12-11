export type ContractPdfFileDto = {
  renterFirstName: string;
  renterLastName: string;
  roomsCount: number;
  street: string;
  commencement: string;
  monthlyPayment: number;
};

export type ContractViewModel = {
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

const fmt = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '_____';
  }
  return String(value);
};

export const contractViewDto = (data: ContractPdfFileDto): ContractViewModel => {
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

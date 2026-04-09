import type { ContractPdfProfile } from '@/types/contract-pdf-profile';
import { PdfContractModel, PdfContractRaw } from '@/types/services/contracts';
import { parsePropertyAddressLine } from '@/shared/utils/parse-property-address-line';
import { splitPip } from '@/shared/utils/split-pip';

const fmt = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') {
    return '_____';
  }
  return String(value);
};

function buildLandlord(
  p: ContractPdfProfile | undefined,
  data: PdfContractRaw,
): PdfContractModel['landlord'] {
  const pip = splitPip(p?.landlordPip ?? '');
  return {
    firstName: pip.firstName || fmt(undefined),
    lastName: pip.lastName || fmt(undefined),
    passportSeries: fmt(undefined),
    passportNumber: fmt(p?.landlordPassportNumber),
    passportIssued: fmt(p?.landlordPassportIssued),
    address: fmt(data.apartmentName),
  };
}

/** Адреса будинку без «кв …» — з одного рядка `street` у БД. */
function tenantBuildingAddress(data: PdfContractRaw): string {
  const parsed = parsePropertyAddressLine(data.street);
  const line = [parsed.street, parsed.building].filter(Boolean).join(' ').trim();
  return line ? line : fmt(undefined);
}

function buildTenant(data: PdfContractRaw): PdfContractModel['tenant'] {
  return {
    firstName: fmt(data.renterFirstName),
    lastName: fmt(data.renterLastName),
    passportSeries: fmt(undefined),
    passportNumber: fmt(undefined),
    passportIssued: fmt(undefined),
    address: tenantBuildingAddress(data),
  };
}

function buildProperty(data: PdfContractRaw): PdfContractModel['property'] {
  const parsed = parsePropertyAddressLine(data.street);
  const streetLine = parsed.street || (data.street.trim() ? data.street : '');
  return {
    ownershipDocument: fmt(undefined),
    roomCount: fmt(data.roomsCount),
    area: fmt(data.totalArea),
    street: fmt(streetLine || undefined),
    building: fmt(parsed.building || undefined),
    apartment: fmt(parsed.apartment || undefined),
  };
}

function buildTerms(
  data: PdfContractRaw,
  p: ContractPdfProfile | undefined,
): PdfContractModel['terms'] {
  const monthly = Number(data.monthlyPayment);
  const initialPayment =
    Number.isFinite(monthly) && monthly > 0 ? String(monthly * 2) : fmt(undefined);
  return {
    inspectionCount: fmt(p?.inspectionCount),
    rentPriceUah: fmt(data.monthlyPayment),
    initialPayment,
    depositAmount: fmt(undefined),
    paymentDeadlineDay: fmt(undefined),
  };
}

const emptyMeters = (): PdfContractModel['meters'] => ({
  electricity: fmt(undefined),
  gas: fmt(undefined),
  coldWater: fmt(undefined),
  hotWater: fmt(undefined),
});

export const PdfContractAdapter = (
  data: PdfContractRaw,
  profile?: ContractPdfProfile | null,
): PdfContractModel => {
  const p = profile ?? undefined;
  return {
    landlord: buildLandlord(p, data),
    tenant: buildTenant(data),
    property: buildProperty(data),
    terms: buildTerms(data, p),
    meters: emptyMeters(),
  };
};

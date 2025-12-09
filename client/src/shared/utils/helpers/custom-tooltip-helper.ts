import { Apartment } from '@/types/core/line-chart';

export const truncate = (text: string, maxLen: number): string => {
  if (maxLen <= 3) return text.slice(0, maxLen);
  return text.length > maxLen ? text.slice(0, maxLen - 3) + '...' : text;
};

export const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '—';
  }

  const startStr = truncate(startDate.toLocaleDateString('uk-UA'), 15);
  const endStr = truncate(endDate.toLocaleDateString('uk-UA'), 15);
  return `${startStr} – ${endStr}`;
};

export const findApartmentById = (apartments: Apartment[], id: string | null): Apartment | null => {
  if (!id) return null;
  return apartments.find(apt => apt.id === id) || null;
};

const isCursorInGap = (
  cursorTimestamp: number,
  prevEndTimestamp: number,
  currStartTimestamp: number,
): boolean => {
  return cursorTimestamp > prevEndTimestamp && cursorTimestamp < currStartTimestamp;
};

export const findGapBetweenContracts = (
  id: string | null,
  apartments: Apartment[],
  currentDate: string,
): { start: string; end: string } | null => {
  const apartment = findApartmentById(apartments, id);
  if (!apartment) return null;

  const cursorTimestamp = new Date(currentDate).getTime();

  for (let i = 1; i < apartment.contract.length; i++) {
    const prevContract = apartment.contract[i - 1];
    const currentContract = apartment.contract[i];

    const prevEnd = new Date(prevContract.termination).getTime();
    const currStart = new Date(currentContract.commencement).getTime();

    if (isCursorInGap(cursorTimestamp, prevEnd, currStart)) {
      return {
        start: prevContract.termination,
        end: currentContract.commencement,
      };
    }
  }

  return null;
};

export const isApartmentAcquired = (
  id: string | null,
  apartments: Apartment[],
  currentDate: string,
): boolean => {
  const apartment = findApartmentById(apartments, id);
  if (!apartment || apartment.contract.length === 0) return false;

  const cursorTimestamp = new Date(currentDate).getTime();
  const firstContractStart = new Date(apartment.contract[0].commencement).getTime();

  return cursorTimestamp >= firstContractStart;
};

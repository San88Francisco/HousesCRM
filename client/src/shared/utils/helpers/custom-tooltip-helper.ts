import { Apartment } from '@/types/model/houses-overview/types';

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
  if (!apartment || apartment.contract.length < 2) return null;

  const sortedContracts = [...apartment.contract].sort(
    (a, b) => new Date(a.commencement).getTime() - new Date(b.commencement).getTime(),
  );

  const cursorTimestamp = new Date(currentDate).getTime();

  const gapIndex = sortedContracts.findIndex((currentContract, i) => {
    if (i === 0) return false;

    const prevContract = sortedContracts[i - 1];
    const prevEnd = new Date(prevContract.termination).getTime();
    const currStart = new Date(currentContract.commencement).getTime();

    return isCursorInGap(cursorTimestamp, prevEnd, currStart);
  });

  if (gapIndex === -1) return null;

  return {
    start: sortedContracts[gapIndex - 1].termination,
    end: sortedContracts[gapIndex].commencement,
  };
};

export const isApartmentAcquired = (
  id: string | null,
  apartments: Apartment[],
  currentDate: string,
): boolean => {
  const apartment = findApartmentById(apartments, id);
  if (!apartment || apartment.contract.length === 0) return false;

  const cursorTimestamp = new Date(currentDate).getTime();
  if (isNaN(cursorTimestamp)) return false;

  const firstContractStart = Math.min(
    ...apartment.contract.map(c => new Date(c.commencement).getTime()),
  );

  if (isNaN(firstContractStart)) return false;

  return cursorTimestamp >= firstContractStart;
};

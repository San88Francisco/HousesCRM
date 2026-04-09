import { EMPTY_DISPLAY } from '@/shared/constants/ui/empty-display';

type HouseLineInput = {
  apartmentName?: string | null;
  street?: string | null;
} | null;

export const formatHouseLine = (house: HouseLineInput, empty: string = EMPTY_DISPLAY): string => {
  if (!house) return empty;
  return house.apartmentName?.trim() || house.street?.trim() || empty;
};

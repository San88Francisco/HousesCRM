import { DateYear } from '@/types';

const descriptions: Record<DateYear, string> = {
  '1y': 'По місячна оплата за останній рік',
  '5y': 'Середнє місячне значення оплати за останні 5 років',
  '10y': 'Середнє місячне значення оплати за останні 10 років',
  all: 'Середнє місячне значення оплати за весь час',
};

export const getDescription = (range: DateYear): string => descriptions[range];

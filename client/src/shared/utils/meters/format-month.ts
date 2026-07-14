const MONTHS_UK_SHORT = [
  'січ',
  'лют',
  'бер',
  'кві',
  'тра',
  'чер',
  'лип',
  'сер',
  'вер',
  'жов',
  'лис',
  'гру',
];

const MONTHS_UK_FULL = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

/** '2026-06' → 'чер 2026' */
export const formatMonthShort = (month: string): string => {
  const [year, monthNumber] = month.split('-');
  return `${MONTHS_UK_SHORT[Number(monthNumber) - 1] ?? month} ${year}`;
};

/** '2026-06' → 'Червень 2026' */
export const formatMonthFull = (month: string): string => {
  const [year, monthNumber] = month.split('-');
  return `${MONTHS_UK_FULL[Number(monthNumber) - 1] ?? month} ${year}`;
};

import { format, isValid, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatDate = (dateStr: string | null | undefined, placeholder = '–'): string => {
  if (!dateStr) return placeholder;

  const date = parseISO(dateStr);
  if (!isValid(date)) return placeholder;

  return format(date, 'dd.MM.yyyy', { locale: uk });
};

/**
 * Парсить рядок на кшталт "вул. Данила Галицького 4, кв 4" → street, building, apartment.
 */
export const parsePropertyAddressLine = (
  line: string,
): { street: string; building: string; apartment: string } => {
  const trimmed = line.trim();
  if (!trimmed) {
    return { street: '', building: '', apartment: '' };
  }

  const kvMatch = trimmed.match(/,\s*кв\.?\s*(\d+)\s*$/i);
  let apartment = '';
  let rest = trimmed;
  if (kvMatch && kvMatch.index !== undefined) {
    apartment = kvMatch[1];
    rest = trimmed.slice(0, kvMatch.index).trim();
  }

  const parts = rest.split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1];
  if (parts.length >= 2 && /^\d+[а-яА-Яa-zA-Z]?$/.test(last)) {
    return {
      street: parts.slice(0, -1).join(' '),
      building: last,
      apartment,
    };
  }

  return {
    street: rest,
    building: '',
    apartment,
  };
};

/** Плейсхолдер у PDF/HTML — має збігатися з `fmt` у pdf-contract adapter. */
export const PDF_PLACEHOLDER = '_____';

/** Один рядок П.І.Б. для одного підкреслення (не два окремі `<Text>` у react-pdf). */
export const combinePipLine = (a: string, b: string): string => {
  const isPh = (s: string) => !s || s === PDF_PLACEHOLDER;
  const pa = isPh(a) ? '' : a.trim();
  const pb = isPh(b) ? '' : b.trim();
  if (!pa && !pb) return PDF_PLACEHOLDER;
  return [pa, pb].filter(Boolean).join(' ');
};

/** Одне підкреслення для блоку адреси об’єкта (без розривів між вул. / буд. / кв.). */
export const combinePropertyAddressLine = (
  street: string,
  building: string,
  apartment: string,
): string => {
  const isPh = (s: string) => !s || s === PDF_PLACEHOLDER;
  const s = isPh(street) ? '' : street.trim();
  const b = isPh(building) ? '' : building.trim();
  const a = isPh(apartment) ? '' : apartment.trim();
  if (!s && !b && !a) return PDF_PLACEHOLDER;
  const parts: string[] = ['м. Рівне'];
  if (s) parts.push(`вул. ${s}`);
  if (b) parts.push(`буд. ${b}`);
  if (a) parts.push(`кв. ${a}`);
  return parts.join(', ');
};

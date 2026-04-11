/** П.І.П. одним рядком → ім’я і прізвище для підстановки в шаблон. */
export const splitPip = (pip: string): { firstName: string; lastName: string } => {
  const t = pip.trim();
  const i = t.indexOf(' ');
  if (i === -1) return { firstName: t, lastName: '' };
  return { firstName: t.slice(0, i).trim(), lastName: t.slice(i + 1).trim() };
};

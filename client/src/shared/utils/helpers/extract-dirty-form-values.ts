import { FieldNamesMarkedBoolean } from 'react-hook-form';
/**
 * Повертає тільки ті поля форми, які були змінені (dirty)
 *
 * @param data - повні дані форми
 * @param dirtyFields - об’єкт з позначками змінених полів
 * @returns об’єкт з полями, які були змінені
 */
export const extractDirtyFormValues = <T extends Record<string, unknown>>(
  data: T,
  dirtyFields: FieldNamesMarkedBoolean<T>,
): Partial<T> =>
  Object.fromEntries(
    Object.keys(dirtyFields).map(key => [key, data[key as keyof T]]),
  ) as Partial<T>;

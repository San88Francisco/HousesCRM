import { FieldNamesMarkedBoolean } from 'react-hook-form';

export const extractDirtyFormValues = <T extends Record<string, unknown>>(
  data: T,
  dirtyFields: FieldNamesMarkedBoolean<T>,
): Partial<T> =>
  Object.fromEntries(
    Object.keys(dirtyFields).map(key => [key, data[key as keyof T]]),
  ) as Partial<T>;

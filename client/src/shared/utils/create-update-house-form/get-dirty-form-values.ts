import { HouseFormData } from '@/shared/validation/create-update-house/house-schema';
import { FieldNamesMarkedBoolean } from 'react-hook-form';

export const getDirtyFormValues = (
  data: HouseFormData,
  dirtyFields: FieldNamesMarkedBoolean<HouseFormData>,
): Partial<HouseFormData> =>
  Object.fromEntries(Object.keys(dirtyFields).map(key => [key, data[key as keyof HouseFormData]]));

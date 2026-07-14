import { getApiErrorMessage } from '@/shared/utils/api-error-message';
import {
  buildMeterReadingSchema,
  LastMeterReading,
  MeterReadingFormData,
} from '@/shared/validation/meter-reading';
import { useCreateMeterReadingMutation } from '@/store/api/meters-api';
import { UtilityType } from '@/types/services/meters';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  houseId?: string;
  utilityType: UtilityType;
  metered: boolean;
  lastReading: LastMeterReading | null;
  onSuccess: () => void;
};

const defaultValues: MeterReadingFormData = { value: null, readingDate: '' };

export const useMeterReadingForm = ({
  houseId,
  utilityType,
  metered,
  lastReading,
  onSuccess,
}: Props) => {
  const [createMeterReading, { isLoading }] = useCreateMeterReadingMutation();

  const schema = useMemo(
    () => buildMeterReadingSchema(lastReading, metered),
    [lastReading, metered],
  );

  const methods = useForm<MeterReadingFormData>({
    resolver: yupResolver(schema) as Resolver<MeterReadingFormData>,
    defaultValues,
  });

  const reset = () => methods.reset(defaultValues);

  const onSubmit = async (data: MeterReadingFormData) => {
    if (!houseId) return;
    if (metered && (data.value === null || data.value === undefined)) return;

    const toastId = toast.loading(metered ? 'Додаємо показник...' : 'Додаємо нарахування...');

    try {
      await createMeterReading({
        houseId,
        utilityType,
        readingDate: data.readingDate,
        ...(metered ? { value: data.value as number } : {}),
      }).unwrap();

      toast.success(metered ? 'Показник успішно додано!' : 'Нарахування успішно додано!', {
        id: toastId,
      });
      reset();
      onSuccess();
    } catch (e) {
      toast.error(metered ? 'Не вдалося додати показник' : 'Не вдалося додати нарахування', {
        id: toastId,
        description: getApiErrorMessage(e),
      });
    }
  };

  return { methods, onSubmit, isLoading, reset };
};

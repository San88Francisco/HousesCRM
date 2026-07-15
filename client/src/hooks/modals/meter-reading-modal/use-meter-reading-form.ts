import { UtilityMode } from '@/shared/constants/utilities';
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
  mode: UtilityMode;
  lastReading: LastMeterReading | null;
  lastRecordDate: string | null;
  onSuccess: () => void;
};

const defaultValues: MeterReadingFormData = { value: null, amount: null, readingDate: '' };

const loadingTextByMode: Record<UtilityMode, string> = {
  metered: 'Додаємо показник...',
  'fixed-fee': 'Додаємо нарахування...',
  manual: 'Записуємо суму...',
};

export const useMeterReadingForm = ({
  houseId,
  utilityType,
  mode,
  lastReading,
  lastRecordDate,
  onSuccess,
}: Props) => {
  const [createMeterReading, { isLoading }] = useCreateMeterReadingMutation();

  const schema = useMemo(
    () => buildMeterReadingSchema({ lastReading, lastRecordDate, mode }),
    [lastReading, lastRecordDate, mode],
  );

  const methods = useForm<MeterReadingFormData>({
    resolver: yupResolver(schema) as Resolver<MeterReadingFormData>,
    defaultValues,
  });

  const reset = () => methods.reset(defaultValues);

  const onSubmit = async (data: MeterReadingFormData) => {
    if (!houseId) return;
    if (mode === 'manual' && (data.amount === null || data.amount === undefined)) return;
    if (mode === 'metered' && (data.value === null || data.value === undefined)) return;

    const toastId = toast.loading(loadingTextByMode[mode]);

    try {
      await createMeterReading({
        houseId,
        utilityType,
        readingDate: data.readingDate,
        ...(mode === 'manual' && { amount: data.amount as number }),
        ...(mode === 'metered' && { value: data.value as number }),
      }).unwrap();

      toast.success('Запис успішно додано!', { id: toastId });
      reset();
      onSuccess();
    } catch (e) {
      toast.error('Не вдалося додати запис', {
        id: toastId,
        description: getApiErrorMessage(e),
      });
    }
  };

  return { methods, onSubmit, isLoading, reset };
};

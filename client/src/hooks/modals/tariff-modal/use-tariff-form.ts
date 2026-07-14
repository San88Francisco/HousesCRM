import { getApiErrorMessage } from '@/shared/utils/api-error-message';
import { tariffSchema, TariffFormData } from '@/shared/validation/tariff';
import {
  useCreateUtilityTariffMutation,
  useDeleteUtilityTariffMutation,
} from '@/store/api/meters-api';
import { UtilityType } from '@/types/services/meters';
import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const defaultValues: TariffFormData = { pricePerUnit: null, validFrom: '' };

export const useTariffForm = (utilityType: UtilityType) => {
  const [createTariff, { isLoading: isCreating }] = useCreateUtilityTariffMutation();
  const [deleteTariff, { isLoading: isDeleting }] = useDeleteUtilityTariffMutation();

  const methods = useForm<TariffFormData>({
    resolver: yupResolver(tariffSchema) as Resolver<TariffFormData>,
    defaultValues,
  });

  const reset = () => methods.reset(defaultValues);

  const onSubmit = async (data: TariffFormData) => {
    if (data.pricePerUnit === null) return;

    const toastId = toast.loading('Зберігаємо тариф...');

    try {
      await createTariff({
        pricePerUnit: data.pricePerUnit,
        validFrom: data.validFrom,
        utilityType,
      }).unwrap();

      toast.success('Тариф успішно збережено!', { id: toastId });
      reset();
    } catch (e) {
      toast.error('Не вдалося зберегти тариф', {
        id: toastId,
        description: getApiErrorMessage(e),
      });
    }
  };

  const onDelete = async (id: string) => {
    const toastId = toast.loading('Видаляємо тариф...');

    try {
      await deleteTariff(id).unwrap();
      toast.success('Тариф успішно видалено!', { id: toastId });
    } catch (e) {
      toast.error('Не вдалося видалити тариф', {
        id: toastId,
        description: getApiErrorMessage(e),
      });
    }
  };

  return { methods, onSubmit, onDelete, isLoading: isCreating || isDeleting, reset };
};

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { RenterResponse } from '@/types/model/renter';
import { useCreateRenterMutation, useUpdateRenterMutation } from '@/store/houses-api';
import { RenterFormData, renterSchema } from '@/shared/validation/renter/renter-schema';
import { mapRenterToFormData } from '@/shared/utils/renter-form/renter-form';
import { getDefaultRenterValues } from '@/shared/utils/renter-form/get-default-renter-values';

interface Props {
  isEditMode: boolean;
  renterToEdit?: RenterResponse;
  onSuccess: () => void;
}

export const useRenterForm = ({ isEditMode, renterToEdit, onSuccess }: Props) => {
  const [createRenter, { isLoading: isCreating }] = useCreateRenterMutation();
  const [updateRenter, { isLoading: isUpdating }] = useUpdateRenterMutation();

  const methods = useForm<RenterFormData>({
    resolver: yupResolver(renterSchema),
    defaultValues: getDefaultRenterValues(),
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && renterToEdit ? mapRenterToFormData(renterToEdit) : getDefaultRenterValues();

    reset(formData);
  }, [isEditMode, renterToEdit, reset]);

  const handleCreate = async (data: RenterFormData) => {
    await createRenter({
      firstName: data.firstName,
      lastName: data.lastName,
      occupied: data.occupied.toISOString(),
      vacated: data.vacated.toISOString(),
    }).unwrap();
    toast.success('Орендаря успішно додано!');
  };

  const handleUpdate = async (data: RenterFormData) => {
    if (!renterToEdit?.id) {
      toast.error('ID орендаря не знайдено');
      return;
    }

    await updateRenter({
      id: renterToEdit.id,
      firstName: data.firstName,
      lastName: data.lastName,
      occupied: data.occupied.toISOString(),
      vacated: data.vacated.toISOString(),
    }).unwrap();
    toast.success('Орендаря успішно оновлено!');
  };

  const handleFormSubmit = async (data: RenterFormData) => {
    const toastId = toast.loading(isEditMode ? 'Оновлення орендаря...' : 'Створення орендаря...');

    try {
      if (isEditMode) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }

      toast.dismiss(toastId);
      onSuccess();
    } catch (error) {
      console.error('Помилка:', error);
      toast.error(isEditMode ? 'Не вдалося оновити орендаря' : 'Не вдалося додати орендаря', {
        id: toastId,
      });
    }
  };

  return {
    methods,
    onSubmit: handleFormSubmit,
    isLoading: isCreating || isUpdating,
    reset,
  };
};

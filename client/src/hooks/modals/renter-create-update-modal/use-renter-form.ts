import { defaultRenterValues } from '@/shared/utils/create-update-renter-form/default-renter-values';
import { mapRenterToFormData } from '@/shared/utils/create-update-renter-form/renter-form';
import {
  RenterFormData,
  renterSchema,
} from '@/shared/validation/create-update-renter/renter-schema';
import { useCreateRenterMutation, useUpdateRenterMutation } from '@/store/api/houses-api';
import { UpdateRenterRequest } from '@/types/services/renters';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  isEditMode: boolean;
  renterToEdit?: UpdateRenterRequest;
  onSuccess: () => void;
};

export const useRenterForm = ({ isEditMode, renterToEdit, onSuccess }: Props) => {
  const [createRenter, { isLoading: isCreating }] = useCreateRenterMutation();
  const [updateRenter, { isLoading: isUpdating }] = useUpdateRenterMutation();

  const methods = useForm<RenterFormData>({
    resolver: yupResolver(renterSchema),
    defaultValues: defaultRenterValues,
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && renterToEdit ? mapRenterToFormData(renterToEdit) : defaultRenterValues;

    reset(formData);
  }, [isEditMode, renterToEdit, reset]);

  const handleCreate = async (data: RenterFormData) => {
    await createRenter({
      ...data,
    }).unwrap();
  };

  const handleUpdate = async (data: RenterFormData) => {
    if (!renterToEdit?.id) {
      throw new Error('ID орендаря не знайдено');
    }

    await updateRenter({
      id: renterToEdit.id,
      ...data,
    }).unwrap();
  };

  const handleFormSubmit = async (data: RenterFormData) => {
    const toastId = toast.loading(isEditMode ? 'Оновлення орендаря...' : 'Створення орендаря...');

    try {
      if (isEditMode) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }

      toast.success(isEditMode ? 'Орендаря успішно оновлено!' : 'Орендаря успішно додано!', {
        id: toastId,
      });
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Не вдалося оновити орендаря'
            : 'Не вдалося додати орендаря';
      toast.error(errorMessage, {
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

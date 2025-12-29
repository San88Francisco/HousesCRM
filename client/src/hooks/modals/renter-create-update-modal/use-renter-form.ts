import { getDefaultRenterValues } from '@/shared/utils/create-update-renter-form/get-default-renter-values';
import { mapRenterToFormData } from '@/shared/utils/create-update-renter-form/renter-form';
import {
  RenterFormData,
  renterSchema,
} from '@/shared/validation/create-update-renter/renter-schema';
import { useCreateRenterMutation, useUpdateRenterMutation } from '@/store/houses-api';
import { RenterResponse } from '@/types/model/renter';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  isEditMode: boolean;
  renterToEdit?: RenterResponse;
  onSuccess: () => void;
};

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
      age: data.age,
    }).unwrap();
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
      age: data.age,
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

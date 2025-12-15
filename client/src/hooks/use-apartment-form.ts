import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/shared/validation/add-apartments/apartment-schema';
import { mapApartmentToFormData } from '@/shared/utils/apartment-form/apartment-form';
import { ApartmentToEdit } from '@/types/core/apartment';
import { getDefaultApartmentValues } from '@/shared/utils/apartment-form/get-default-apartment-values';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/houses-api';

interface Props {
  isEditMode: boolean;
  apartmentToEdit?: ApartmentToEdit;
  onSuccess: () => void;
}

export const useApartmentForm = ({ isEditMode, apartmentToEdit, onSuccess }: Props) => {
  const [createHouse, { isLoading: isCreating }] = useCreateHouseMutation();
  const [updateHouse, { isLoading: isUpdating }] = useUpdateHouseMutation();

  const methods = useForm<ApartmentFormData>({
    resolver: yupResolver(apartmentSchema),
    defaultValues: getDefaultApartmentValues(),
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && apartmentToEdit
        ? mapApartmentToFormData(apartmentToEdit)
        : getDefaultApartmentValues();

    reset(formData);
  }, [isEditMode, apartmentToEdit, reset]);

  const handleCreate = async (data: ApartmentFormData) => {
    await createHouse(data).unwrap();
    toast.success('Квартиру успішно додано!');
  };

  const handleUpdate = async (data: ApartmentFormData) => {
    if (!apartmentToEdit?.id) {
      toast.error('ID квартири не знайдено');
      return;
    }

    await updateHouse({
      id: apartmentToEdit.id,
      ...data,
    }).unwrap();
    toast.success('Квартиру успішно оновлено!');
  };

  const onSubmit = async (data: ApartmentFormData) => {
    const toastId = toast.loading(isEditMode ? 'Оновлення квартири...' : 'Створення квартири...');

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
      toast.error(isEditMode ? 'Не вдалося оновити квартиру' : 'Не вдалося додати квартиру', {
        id: toastId,
      });
    }
  };

  return {
    methods,
    onSubmit,
    isLoading: isCreating || isUpdating,
    reset,
  };
};

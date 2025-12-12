import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/houses';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentToEdit } from '@/types/core/apartment';
import { DEFAULT_APARTMENT_VALUES } from '@/shared/constants/apartment-form';
import { mapApartmentToFormData } from '@/shared/utils/apartment-form';

interface UseApartmentFormProps {
  isEditMode: boolean;
  apartmentToEdit?: ApartmentToEdit;
  onSuccess: () => void;
}

export const useApartmentForm = ({
  isEditMode,
  apartmentToEdit,
  onSuccess,
}: UseApartmentFormProps) => {
  const [createHouse, { isLoading: isCreating }] = useCreateHouseMutation();
  const [updateHouse, { isLoading: isUpdating }] = useUpdateHouseMutation();

  const methods = useForm<ApartmentFormData>({
    resolver: yupResolver(apartmentSchema),
    defaultValues: DEFAULT_APARTMENT_VALUES,
  });

  const { reset } = methods;

  // Заповнення форми при зміні режиму або даних
  useEffect(() => {
    const formData =
      isEditMode && apartmentToEdit
        ? mapApartmentToFormData(apartmentToEdit)
        : DEFAULT_APARTMENT_VALUES;

    reset(formData);
  }, [isEditMode, apartmentToEdit, reset]);

  const handleCreate = async (data: ApartmentFormData) => {
    await createHouse(data).unwrap();
    toast.success('Квартиру успішно додано!');
  };

  const handleUpdate = async (data: ApartmentFormData) => {
    if (!apartmentToEdit?.id) {
      throw new Error('ID квартири не знайдено');
    }

    await updateHouse({
      id: String(apartmentToEdit.id),
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

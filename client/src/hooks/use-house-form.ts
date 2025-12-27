import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ApartmentFormData, apartmentSchema } from '@/shared/validation/add-houses/house-schema';
import { ApartmentToEdit } from '@/types/core/house';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/houses-api';
import { getDefaultHouseValues } from '@/shared/utils/create-house-form/get-default-house-values';
import { mapHouseToFormData } from '@/shared/utils/create-house-form/house-form';

type Props = {
  isEditMode: boolean;
  apartmentToEdit?: ApartmentToEdit;
  onSuccess: () => void;
};

export const useHouseForm = ({ isEditMode, apartmentToEdit, onSuccess }: Props) => {
  const [createHouse, { isLoading: isCreating }] = useCreateHouseMutation();
  const [updateHouse, { isLoading: isUpdating }] = useUpdateHouseMutation();

  const methods = useForm<ApartmentFormData>({
    resolver: yupResolver(apartmentSchema),
    defaultValues: getDefaultHouseValues(),
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && apartmentToEdit ? mapHouseToFormData(apartmentToEdit) : getDefaultHouseValues();

    reset(formData);
  }, [isEditMode, apartmentToEdit, reset]);

  const handleCreate = async (data: ApartmentFormData) => {
    await createHouse({
      ...data,
      purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
    }).unwrap();
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
      purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
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

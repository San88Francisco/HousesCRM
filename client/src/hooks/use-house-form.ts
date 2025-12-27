import { getDefaultHouseValues } from '@/shared/utils/create-house-form/get-default-house-values';
import { mapHouseToFormData } from '@/shared/utils/create-house-form/house-form';
import { HouseFormData, houseSchema } from '@/shared/validation/add-houses/house-schema';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/houses-api';
import { HouseToEdit } from '@/types/core/house';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  isEditMode: boolean;
  houseToEdit?: HouseToEdit;
  onSuccess: () => void;
};

export const useHouseForm = ({ isEditMode, houseToEdit, onSuccess }: Props) => {
  const [createHouse, { isLoading: isCreating }] = useCreateHouseMutation();
  const [updateHouse, { isLoading: isUpdating }] = useUpdateHouseMutation();

  const methods = useForm<HouseFormData>({
    resolver: yupResolver(houseSchema),
    defaultValues: getDefaultHouseValues(),
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && houseToEdit ? mapHouseToFormData(houseToEdit) : getDefaultHouseValues();

    reset(formData);
  }, [isEditMode, houseToEdit, reset]);

  const handleCreate = async (data: HouseFormData) => {
    await createHouse({
      ...data,
      purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
    }).unwrap();
  };

  const handleUpdate = async (data: HouseFormData) => {
    if (!houseToEdit?.id) {
      throw new Error('ID квартири не знайдено');
    }

    await updateHouse({
      id: houseToEdit.id,
      ...data,
      purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
    }).unwrap();
  };

  const onSubmit = async (data: HouseFormData) => {
    const toastId = toast.loading(isEditMode ? 'Оновлення квартири...' : 'Створення квартири...');

    try {
      if (isEditMode) {
        await handleUpdate(data);
        toast.success('Квартиру успішно оновлено!', { id: toastId });
      } else {
        await handleCreate(data);
        toast.success('Квартиру успішно додано!', { id: toastId });
      }

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

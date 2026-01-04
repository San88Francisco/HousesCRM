import { defaultHouseValues } from '@/shared/utils/create-update-house-form/get-default-house-values';
import { mapHouseToFormData } from '@/shared/utils/create-update-house-form/house-form';
import { HouseFormData, houseSchema } from '@/shared/validation/create-update-house/house-schema';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/api/houses-api';
import { House } from '@/types/core/house/house';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {
  isEditMode: boolean;
  houseToEdit?: House;
  onSuccess: () => void;
};

export const useHouseForm = ({ isEditMode, houseToEdit, onSuccess }: Props) => {
  const [createHouse, { isLoading: isCreating }] = useCreateHouseMutation();
  const [updateHouse, { isLoading: isUpdating }] = useUpdateHouseMutation();

  const methods = useForm<HouseFormData>({
    resolver: yupResolver(houseSchema),
    defaultValues: defaultHouseValues,
  });

  const { reset } = methods;

  useEffect(() => {
    const formData =
      isEditMode && houseToEdit ? mapHouseToFormData(houseToEdit) : defaultHouseValues;

    reset(formData);
  }, [isEditMode, houseToEdit, reset]);

  const handleCreate = async (data: HouseFormData) => {
    const purchaseDateValue = data.purchaseDate as string | Date;
    const purchaseDate =
      purchaseDateValue instanceof Date
        ? purchaseDateValue.toISOString()
        : new Date(purchaseDateValue).toISOString();

    await createHouse({
      apartmentName: data.apartmentName,
      roomsCount: data.roomsCount,
      totalArea: data.totalArea,
      purchaseDate,
      price: data.price,
      floor: data.floor,
      street: data.street,
      apartmentType: data.apartmentType,
      contractIds: undefined,
    }).unwrap();
  };

  const handleUpdate = async (data: HouseFormData) => {
    if (!houseToEdit?.id) {
      throw new Error('ID квартири не знайдено');
    }

    await updateHouse({
      ...houseToEdit,
      ...data,
      purchaseDate: format(data.purchaseDate, 'yyyy-MM-dd'),
    } satisfies House).unwrap();
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Не вдалося оновити квартиру'
            : 'Не вдалося створити квартиру';
      toast.error(errorMessage, {
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

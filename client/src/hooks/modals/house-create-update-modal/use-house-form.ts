import { useHouseCrud } from '@/hooks/modals/house-create-update-modal/use-house-crud';
import { defaultHouseValues } from '@/shared/utils/create-update-house-form/default-house-values';
import { getDirtyFormValues } from '@/shared/utils/create-update-house-form/get-dirty-form-values';
import { mapHouseToFormData } from '@/shared/utils/create-update-house-form/house-form';
import { houseFormToast } from '@/shared/utils/create-update-house-form/house-form-toast';
import { HouseFormData, houseSchema } from '@/shared/validation/create-update-house/house-schema';
import { House } from '@/types/core/house/house';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  isEditMode: boolean;
  houseToEdit?: House;
  onSuccess: () => void;
};

export const useHouseForm = ({ isEditMode, houseToEdit, onSuccess }: Props) => {
  const { create, update, isLoading } = useHouseCrud();

  const methods = useForm<HouseFormData>({
    resolver: yupResolver(houseSchema),
    defaultValues: defaultHouseValues,
  });

  const { reset, formState } = methods;

  useEffect(() => {
    reset(isEditMode && houseToEdit ? mapHouseToFormData(houseToEdit) : defaultHouseValues);
  }, [isEditMode, houseToEdit, reset]);

  const onSubmit = async (data: HouseFormData) => {
    const toastId = houseFormToast.loading(isEditMode);

    try {
      if (isEditMode) {
        if (!houseToEdit?.id) throw new Error('ID квартири не знайдено');

        const changedData = getDirtyFormValues(data, formState.dirtyFields);
        await update(houseToEdit.id, changedData);
      } else {
        await create(data);
      }

      houseFormToast.success(isEditMode, toastId);
      onSuccess();
    } catch (e) {
      houseFormToast.error(isEditMode, toastId, e instanceof Error ? e.message : undefined);
    }
  };

  return { methods, onSubmit, isLoading, reset };
};

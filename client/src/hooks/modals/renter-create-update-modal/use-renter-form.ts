import { useRenterCrud } from '@/hooks/modals/renter-create-update-modal/use-renter-crud';
import { defaultRenterValues } from '@/shared/utils/create-update-renter-form/default-renter-values';
import { mapRenterToFormData } from '@/shared/utils/create-update-renter-form/renter-form';
import { renterFormToast } from '@/shared/utils/create-update-renter-form/renter-form-toast';
import { extractDirtyFormValues } from '@/shared/utils/helpers/extract-dirty-form-values';
import {
  RenterFormData,
  renterSchema,
} from '@/shared/validation/create-update-renter/renter-schema';
import { Renter } from '@/types/core/renter';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';

type Props = {
  isEditMode: boolean;
  renterToEdit?: Renter;
  onSuccess: () => void;
};

export const useRenterForm = ({ isEditMode, renterToEdit, onSuccess }: Props) => {
  const { create, update, isLoading } = useRenterCrud();

  const methods = useForm<RenterFormData>({
    resolver: yupResolver(renterSchema) as Resolver<RenterFormData>,
    defaultValues: defaultRenterValues,
  });

  const { reset, formState } = methods;

  useEffect(() => {
    reset(isEditMode && renterToEdit ? mapRenterToFormData(renterToEdit) : defaultRenterValues);
  }, [isEditMode, renterToEdit, reset]);

  const onSubmit = async (data: RenterFormData) => {
    const toastId = renterFormToast.loading(isEditMode);

    try {
      if (isEditMode) {
        if (!renterToEdit?.id) throw new Error('ID орендаря не знайдено');

        if (!formState.isDirty) {
          renterFormToast.info(toastId);
          onSuccess();
          return;
        }

        const changedData = extractDirtyFormValues(data, formState.dirtyFields);
        await update(renterToEdit.id, changedData);
      } else {
        await create(data);
      }

      renterFormToast.success(isEditMode, toastId);
      onSuccess();
    } catch (e) {
      renterFormToast.error(isEditMode, toastId, e instanceof Error ? e.message : undefined);
    }
  };

  return { methods, onSubmit, isLoading, reset };
};

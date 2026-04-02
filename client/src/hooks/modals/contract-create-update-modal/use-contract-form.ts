import { useContractCrud } from '@/hooks/modals/contract-create-update-modal';
import { mapContractToFormData } from '@/shared/utils/create-update-contract-form/contract-form';
import { contractFormToast } from '@/shared/utils/create-update-contract-form/contract-form-toast';
import { defaultContractValues } from '@/shared/utils/create-update-contract-form/default-contract-values';
import { extractDirtyFormValues } from '@/shared/utils/helpers/extract-dirty-form-values';
import { ContractFormData, contractSchema } from '@/shared/validation/create-update-contract';

import { ContractCreateUpdate } from '@/types/core/contract';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';

type Props = {
  isEditMode: boolean;
  contractToEdit?: ContractCreateUpdate;
  onSuccess: () => void;
};

export const useContractForm = ({ isEditMode, contractToEdit, onSuccess }: Props) => {
  const { create, update, isLoading } = useContractCrud();

  const methods = useForm<ContractFormData>({
    resolver: yupResolver(contractSchema) as Resolver<ContractFormData>,
    defaultValues: defaultContractValues,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(
      isEditMode && contractToEdit ? mapContractToFormData(contractToEdit) : defaultContractValues,
    );
  }, [isEditMode, contractToEdit, reset]);

  const onSubmit = async (data: ContractFormData) => {
    const toastId = contractFormToast.loading(isEditMode);

    try {
      if (isEditMode) {
        if (!contractToEdit?.id) throw new Error('ID контракту не знайдено');

        const changedData = extractDirtyFormValues(data, methods.formState.dirtyFields);
        await update(contractToEdit.id, changedData);
      } else {
        await create(data);
      }

      contractFormToast.success(isEditMode, toastId);
      onSuccess();
    } catch (e) {
      contractFormToast.error(isEditMode, toastId, e instanceof Error ? e.message : undefined);
    }
  };

  return { methods, onSubmit, isLoading, reset };
};

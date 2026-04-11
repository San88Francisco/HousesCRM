'use client';

import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { Button } from '@/shared/ui/button';
import { extractApiMessage } from '@/shared/utils/api-error-message';
import {
  contractPdfProfileSchema,
  type ContractPdfProfileFormValues,
} from '@/shared/validation/profile/contract-pdf-profile';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/users-api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';

const emptyDefaults: ContractPdfProfileFormValues = {
  landlordPip: '',
  landlordPassportNumber: '',
  landlordPassportIssued: '',
  inspectionCount: '',
};

export const ProfileContractsSection = () => {
  const { data, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const form = useForm<ContractPdfProfileFormValues>({
    resolver: yupResolver(contractPdfProfileSchema),
    defaultValues: emptyDefaults,
  });
  const { isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    if (data?.contractPdfProfile) {
      form.reset({ ...emptyDefaults, ...data.contractPdfProfile });
    } else {
      form.reset(emptyDefaults);
    }
  }, [data, form]);

  const onSubmit = async (values: ContractPdfProfileFormValues) => {
    try {
      await updateProfile({ contractPdfProfile: values }).unwrap();
      form.reset(values);
      toast.success('Дані для договору збережено');
    } catch (err) {
      toast.error(extractApiMessage(err, 'Не вдалося зберегти'));
    }
  };

  if (isError) {
    return <p className="text-sm text-red">Не вдалося завантажити дані. Спробуйте пізніше.</p>;
  }

  if (isLoading && !data) {
    return <p className="text-sm text-muted">Завантаження…</p>;
  }

  return (
    <RHFForm form={form} onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
      <p className="text-sm text-muted">
        Тут лише поля орендодавця та кількість оглядів. П.І.Б. орендаря, адреси, кімнати, площа та
        орендна плата підставляються з контракту та квартири в системі. Порожні значення в PDF
        показуються як «_____».
      </p>

      <p className="text-sm font-medium text-text">Орендодавець і умови</p>
      <RHFInput name="landlordPip" label="П.І.П. орендодавця" type="text" />
      <RHFInput name="landlordPassportNumber" label="Номер паспорта орендодавця" type="text" />
      <RHFInput name="landlordPassportIssued" label="Паспорт виданий" type="text" />
      <RHFInput name="inspectionCount" label="Огляд приміщення, раз на місяць" type="text" />

      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving ? 'Збереження…' : 'Зберегти'}
      </Button>
    </RHFForm>
  );
};

'use client';

import { RHFForm } from '@/components/RHF/RHForm';
import { RHFInput } from '@/components/RHF/RHFInput';
import { Button } from '@/shared/ui/button';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/shared/validation/profile/change-password';
import { useChangePasswordMutation } from '@/store/api/users-api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState } from 'react-hook-form';
import { extractApiMessage } from '@/shared/utils/api-error-message';
import { toast } from 'sonner';

export const ProfilePasswordSection = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const { isDirty } = useFormState({ control: form.control });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success('Пароль змінено');
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      toast.error(extractApiMessage(err, 'Не вдалося змінити пароль'));
    }
  };

  return (
    <RHFForm form={form} onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
      <RHFInput
        name="currentPassword"
        label="Поточний пароль"
        type="password"
        autoComplete="current-password"
        required
      />
      <RHFInput
        name="newPassword"
        label="Новий пароль"
        type="password"
        autoComplete="new-password"
        required
      />
      <RHFInput
        name="confirmNewPassword"
        label="Підтвердіть новий пароль"
        type="password"
        autoComplete="new-password"
        required
      />
      <Button type="submit" disabled={isLoading || !isDirty}>
        {isLoading ? 'Зміна пароля…' : 'Змінити пароль'}
      </Button>
    </RHFForm>
  );
};

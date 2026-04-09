'use client';

import { RHFForm } from '@/components/RHF/RHForm';
import { RHFInput } from '@/components/RHF/RHFInput';
import { Button } from '@/shared/ui/button';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/shared/validation/profile/update-profile';
import { tokenStorage } from '@/shared/utils/auth';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/users-api';
import { setUser } from '@/store/slice/user-slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { extractApiMessage } from '@/shared/utils/api-error-message';
import { toast } from 'sonner';

export const ProfilePersonalSection = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const form = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: { email: '', username: '' },
  });
  const { isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    if (data) {
      form.reset({ email: data.email, username: data.username });
    }
  }, [data, form]);

  const onSubmit = async (values: UpdateProfileFormValues) => {
    try {
      const updated = await updateProfile({
        email: values.email,
        username: values.username,
      }).unwrap();
      tokenStorage.setUserData({ email: updated.email, username: updated.username });
      dispatch(setUser({ email: updated.email, username: updated.username }));
      form.reset({ email: updated.email, username: updated.username });
      toast.success('Дані збережено');
    } catch (err) {
      toast.error(extractApiMessage(err, 'Не вдалося зберегти дані'));
    }
  };

  if (isError) {
    return <p className="text-sm text-red">Не вдалося завантажити профіль. Спробуйте пізніше.</p>;
  }

  if (isLoading && !data) {
    return <p className="text-sm text-muted">Завантаження…</p>;
  }

  return (
    <RHFForm form={form} onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
      <RHFInput name="email" label="Електронна пошта" type="email" autoComplete="email" required />
      <RHFInput
        name="username"
        label="Ім'я користувача"
        type="text"
        autoComplete="username"
        required
      />
      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving ? 'Збереження…' : 'Зберегти'}
      </Button>
    </RHFForm>
  );
};

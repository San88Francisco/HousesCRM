'use client';

import type { FormHTMLAttributes, ReactNode } from 'react';
import {
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
  FormProvider,
} from 'react-hook-form';

interface Props<T extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}

export const RHFForm = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = 'space-y-4',
  ...props
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

"use client"

import type { FormHTMLAttributes, ReactNode } from "react"
import { type FieldValues, type UseFormReturn, type SubmitHandler, FormProvider } from "react-hook-form"

interface RFHFormProps<T extends FieldValues> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  children: ReactNode
}

export function RFHForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = "space-y-4",
  ...props
}: RFHFormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} {...props}>
        {children}
      </form>
    </FormProvider>
  )
}


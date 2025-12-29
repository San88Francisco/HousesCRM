'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'> {
  name: string;
  label?: string;
  required?: boolean;
  maxLength?: number | string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const RHFTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      name,
      label,
      required = false,
      maxLength,
      className,
      disabled = false,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-2', className)}>
            {label && (
              <Label htmlFor={name}>
                {label}
                {required && <span className="text-red ml-1">*</span>}
              </Label>
            )}

            <Textarea
              id={name}
              {...field}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value)}
              className={cn(errorMessage && 'border-red focus-visible:ring-red')}
              error={errorMessage}
              maxLength={maxLength}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${name}-error` : undefined}
              {...props}
              ref={ref}
            />

            {error && (
              <div className="text-sm text-red" id={`${name}-error`}>
                {errorMessage}
              </div>
            )}
          </div>
        )}
      />
    );
  },
);

RHFTextarea.displayName = 'RHFTextarea';
export { RHFTextarea };

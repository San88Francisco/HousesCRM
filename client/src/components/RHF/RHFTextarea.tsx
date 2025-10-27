'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Textarea
              id={name}
              {...field}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value)}
              error={errorMessage}
              maxLength={maxLength}
              disabled={disabled}
              placeholder={placeholder}
              className={className}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${name}-error` : undefined}
              {...props}
              ref={ref}
            />
          )}
        />
      </div>
    );
  },
);

RHFTextarea.displayName = 'RHFTextarea';
export { RHFTextarea };

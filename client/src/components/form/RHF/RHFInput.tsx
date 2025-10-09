'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  iconWithError?: boolean;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const RHFInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label,
      required = false,
      helperText,
      icon,
      iconWithError = true,
      type = 'text',
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
      <div className={cn('space-y-2', className, !label && 'mt-[22px]')}>
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
            <Input
              id={name}
              {...field}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value)}
              type={type}
              error={!!errorMessage}
              helperText={errorMessage || helperText}
              icon={icon}
              iconWithError={iconWithError}
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

RHFInput.displayName = 'RHFInput';
export { RHFInput };

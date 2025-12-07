'use client';

import { forwardRef, HTMLInputTypeAttribute, type InputHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  iconWithError?: boolean;
  type?: HTMLInputTypeAttribute;
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
      icon,
      iconWithError = true,
      type = 'text',
      className,
      disabled = false,
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
      <div className={cn('space-y-2', className)}>
        {label && !error && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
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
              type={type}
              onChange={e => {
                field.onChange(e.target.value);
              }}
              error={errorMessage}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? `${name}-error` : undefined}
              icon={icon}
              iconWithError={iconWithError}
              {...props}
              ref={ref}
            />
          )}
        />
        {error && <p className="text-sm text-red !mt-0">{errorMessage}</p>}
      </div>
    );
  },
);

RHFInput.displayName = 'RHFInput';
export { RHFInput };

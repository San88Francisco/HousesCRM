'use client';

import { forwardRef, HTMLInputTypeAttribute, type InputHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  required?: boolean;

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
              type={type as HTMLInputTypeAttribute}
              onChange={e => {
                field.onChange(e.target.value);
              }}
              error={errorMessage}
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

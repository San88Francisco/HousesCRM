'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { useFormFieldFocus } from '@/hooks/use-formfield-Focus';

interface InputProps extends React.ComponentProps<'input'> {
  helperText?: string;
  error?: boolean;
  icon?: React.ReactNode;
  iconWithError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, helperText, error, icon, iconWithError = false, disabled, ...props },
    ref,
  ) => {
    const { isFocused, handleFocus, handleBlur } = useFormFieldFocus();

    return (
      <FormFieldWrapper
        isFocused={isFocused}
        error={error}
        disabled={disabled}
        helperText={helperText}
        icon={icon}
        errorIcon={error && iconWithError ? <CircleAlert className="text-red" /> : undefined}
        className="h-10"
      >
        <input
          className={cn(
            'flex w-full px-2 bg-inherit text-text text-sm ring-offset-none placeholder:text-muted focus-visible:outline-none border-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'text-red',
            className,
          )}
          type={type}
          ref={ref}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </FormFieldWrapper>
    );
  },
);

Input.displayName = 'Input';

export { Input };

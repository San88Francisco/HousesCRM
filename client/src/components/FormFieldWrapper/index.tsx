'use client';

import { cn } from '@/lib/utils';

interface FormFieldWrapperProps {
  children: React.ReactNode;
  isFocused: boolean;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  icon?: React.ReactNode;
  errorIcon?: React.ReactNode;
}

export const FormFieldWrapper = ({
  children,
  isFocused,
  error,
  disabled,
  className,
  helperText,
  icon,
  errorIcon,
}: FormFieldWrapperProps) => {
  return (
    <div>
      <div
        className={cn(
          'flex items-center  w-full px-2 text-sm transition-all duration-200 ease-in-out bg-bg-input rounded-lg border border-solid border-border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
          disabled && 'cursor-not-allowed opacity-50',
          isFocused && 'border-active-border',
          error && 'border-red text-red',
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              'transition-all duration-200 ease-in-out text-muted',
              isFocused && 'text-active-border',
              error && 'text-red',
            )}
          >
            {icon}
          </span>
        )}
        {children}
        {error && errorIcon && errorIcon}
      </div>
      {helperText && (
        <p className={cn('mt-1 text-sm', error ? 'text-red' : 'text-muted')}>{helperText}</p>
      )}
    </div>
  );
};

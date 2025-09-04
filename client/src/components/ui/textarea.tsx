'use client';
import { ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { useTextarea } from '@/hooks/use-textarea';

interface TextareaProps extends ComponentProps<'textarea'> {
  helperText?: string;
  error?: boolean;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, helperText, error, disabled, autoResize = true, onChange, ...props }, ref) => {
    const { isFocused, handleFocus, handleBlur, combinedRef, handleChange } = useTextarea({
      autoResize,
      onChange,
      ref,
    });

    return (
      <FormFieldWrapper
        isFocused={isFocused}
        error={error}
        disabled={disabled}
        helperText={helperText}
        className={cn('items-start  py-2', className)}
      >
        <textarea
          className={cn(
            'flex w-full bg-inherit text-text placeholder:text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-none p-0 resize-y',
            error && 'text-red',
            className,
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          ref={combinedRef}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
      </FormFieldWrapper>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };

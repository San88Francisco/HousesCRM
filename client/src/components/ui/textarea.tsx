'use client';

import { ComponentProps, forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useFormFieldFocus } from '@/hooks/use-formfield-Focus';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { useAutoResize } from '@/hooks/use-auto-resize';

interface TextareaProps extends ComponentProps<'textarea'> {
  helperText?: string;
  error?: boolean;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, helperText, error, disabled, autoResize = true, onChange, ...props }, ref) => {
    const { isFocused, handleFocus, handleBlur } = useFormFieldFocus();
    const { textareaRef, handleInput } = useAutoResize();

    const combinedRef = useCallback(
      (node: HTMLTextAreaElement) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, textareaRef],
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        handleInput();
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <FormFieldWrapper
        isFocused={isFocused}
        error={error}
        disabled={disabled}
        helperText={helperText}
        className="min-h-[80px] w-[300px] items-start py-2"
      >
        <textarea
          className={cn(
            'flex w-full bg-inherit text-text placeholder:text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-none p-0 overflow-hidden',
            autoResize ? 'resize-none' : 'resize-y',
            error && 'text-red',
            className,
          )}
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

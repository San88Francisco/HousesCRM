'use client';

import {
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useRef,
  ReactNode,
  useState,
} from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';
import { useHotkeyForRef } from '@/hooks/use-hotkey-for-ref';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  icon?: ReactNode;
  iconWithError?: boolean;
  type?: HTMLInputTypeAttribute;
  hotkey?: string;
  hotkeyCtrl?: boolean;
  hotkeyShift?: boolean;
  hotkeyAlt?: boolean;
  hotkeyMeta?: boolean;
  hotkeyAction?: 'focus' | 'click';
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
      hotkey,
      hotkeyCtrl,
      hotkeyShift,
      hotkeyAlt,
      hotkeyMeta,
      hotkeyAction = 'focus',
      disabled = false,
      ...props
    },
    forwardedRef,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const [isFocused, setIsFocused] = useState(false);
    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    const internalRef = useRef<HTMLInputElement>(null);

    useHotkeyForRef(hotkey, internalRef, hotkeyAction, {
      ctrl: !!hotkeyCtrl,
      shift: !!hotkeyShift,
      alt: !!hotkeyAlt,
      meta: !!hotkeyMeta,
    });

    const hotkeyHint =
      hotkey &&
      [
        hotkeyCtrl && 'Ctrl',
        hotkeyShift && 'Shift',
        hotkeyAlt && 'Alt',
        hotkeyMeta && '⌘',
        hotkey.toUpperCase(),
      ]
        .filter(Boolean)
        .join(' + ');

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
            <div className="relative">
              <div>
                <Input
                  id={name}
                  type={type}
                  disabled={disabled}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value)}
                  onFocusCapture={() => setIsFocused(true)}
                  onBlurCapture={() => setIsFocused(false)}
                  className={cn(
                    errorMessage && 'border-destructive focus-visible:ring-destructive',
                  )}
                  error={errorMessage}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? `${name}-error` : undefined}
                  icon={icon}
                  iconWithError={iconWithError}
                  {...props}
                  ref={el => {
                    internalRef.current = el;
                    if (typeof forwardedRef === 'function') forwardedRef(el);
                    else if (forwardedRef) {
                      (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current =
                        el;
                    }
                  }}
                />
                {hotkeyHint && !isFocused && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {hotkeyHint}
                  </div>
                )}
              </div>
            </div>
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

RHFInput.displayName = 'RHFInput';

export { RHFInput };

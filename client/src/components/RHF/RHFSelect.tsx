'use client';

import { forwardRef, ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/shared/ui/select';
import { cn } from '@/shared/utils/cn';
import { Label } from '@/shared/ui/label';

type SelectOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

type Props = {
  name: string;
  options: SelectOption[] | SelectOptionGroup[];
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  onValueChange?: (value: string) => void;
};

const isOptionGroup = (option: SelectOption | SelectOptionGroup): option is SelectOptionGroup => {
  return 'options' in option;
};

export const RHFSelect = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      options,
      label,
      placeholder = 'Виберіть опцію',
      disabled,
      className,
      triggerClassName,
      contentClassName,
      onValueChange,
    },
    ref,
  ) => {
    const { control } = useFormContext();

    const renderOptions = (opts: SelectOption[] | SelectOptionGroup[]) => {
      return opts.map((option, index) => {
        if (isOptionGroup(option)) {
          return (
            <SelectGroup key={`group-${index}`}>
              <SelectLabel>{option.label}</SelectLabel>
              {option.options.map(opt => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  icon={opt.icon}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        }

        return (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            icon={option.icon}
          >
            {option.label}
          </SelectItem>
        );
      });
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className={cn('space-y-2', className)}>
            {label && <Label htmlFor={name}>{label}</Label>}
            <Select
              value={field.value}
              onValueChange={value => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                ref={ref}
                id={name}
                className={triggerClassName}
                error={!!error}
                disabled={disabled}
              >
                {error && (
                  <p
                    className={cn(
                      'mt-1 text-sm transition-colors duration-200',
                      error ? 'text-red opacity-100' : 'text-muted opacity-0',
                    )}
                  >
                    {error.message}
                  </p>
                )}
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className={contentClassName}>{renderOptions(options)}</SelectContent>
            </Select>
          </div>
        )}
      />
    );
  },
);

RHFSelect.displayName = 'RHFSelect';

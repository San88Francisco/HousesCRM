'use client';

import { forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface SelectOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface Props {
  name: string;
  options: SelectOption[] | SelectOptionGroup[];
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  helperText?: string;

  onValueChange?: (value: string) => void;
}

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
      helperText,
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
                helperText={error?.message || helperText}
              >
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

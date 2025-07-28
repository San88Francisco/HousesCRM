import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DropdownSelectOption } from '@/types';

export interface DropdownSelectProps<T> {
  options: DropdownSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DropdownSelect<T extends React.Key>({
  options,
  value,
  onChange,
  placeholder = 'Виберіть опцію',
  className = 'w-[100px] sm:w-[120px]',
  disabled = false,
}: DropdownSelectProps<T>) {
  return (
    <Select
      value={String(value)}
      onValueChange={(val: string) => {
        const selectedOption = options.find(option => String(option.value) === val);
        if (selectedOption) {
          onChange(selectedOption.value);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

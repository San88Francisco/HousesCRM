'use client';

import { forwardRef, useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
}

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  options: AutocompleteOption[];
  onSearch?: (searchTerm: string) => void;
  onValueChange?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
};

const RHFAutocomplete = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      label,
      required = false,
      placeholder = 'Select option...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No options found.',
      className,
      options = [],
      onSearch,
      onValueChange,
      loading = false,
      disabled = false,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    useEffect(() => {
      if (onSearch && searchTerm.length >= 2) {
        const timeoutId = setTimeout(() => {
          onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    }, [searchTerm, onSearch]);

    useEffect(() => {
      if (!open) {
        setSearchTerm('');
      }
    }, [open]);

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const selectedOption = options.find(option => option.value === field.value);

            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={ref}
                    id={name}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                    disabled={disabled}
                    className={cn(
                      'w-full justify-between text-text border rounded-md font-normal bg-bg-input',
                      !field.value && 'text-muted',
                      errorMessage && 'border-red',
                      className,
                    )}
                  >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown
                      className={cn('h-4 w-4 shrink-0 ', errorMessage && 'text-red')}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command shouldFilter={!onSearch}>
                    <CommandInput
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      {loading && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Завантаження...
                        </div>
                      )}
                      {!loading && (
                        <>
                          <CommandEmpty>{emptyMessage}</CommandEmpty>
                          <CommandGroup>
                            {options.map(option => (
                              <CommandItem
                                key={option.value}
                                value={option.label}
                                keywords={[option.value]}
                                onSelect={() => {
                                  const newValue = option.value === field.value ? '' : option.value;
                                  field.onChange(newValue);
                                  onValueChange?.(newValue);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === option.value ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          }}
        />

        {errorMessage && (
          <div id={`${name}-error`} role="alert">
            <span className="text-red">{errorMessage}</span>
          </div>
        )}
      </div>
    );
  },
);

RHFAutocomplete.displayName = 'RHFAutocomplete';

export { RHFAutocomplete };

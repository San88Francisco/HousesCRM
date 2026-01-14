'use client';

import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/utils/cn';
import { Check, ChevronsUpDown } from 'lucide-react';
import { forwardRef, RefObject, useState } from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
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
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
  loadMoreRef?: RefObject<HTMLDivElement | null>;
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
      onOpenChange,
      loading = false,
      disabled = false,
      hasMore = false,
      loadMoreRef,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const [open, setOpen] = useState(false);

    const error = get(errors, name);
    const errorMessage = error?.message as string | undefined;

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1 text-text font-medium">
            {label}
            {required && <span className="text-red ml-1">*</span>}
          </Label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const selectedOption = options.find(option => option.value === field.value);

            return (
              <Popover open={open} onOpenChange={handleOpenChange}>
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
                      className={cn('h-4 w-4 shrink-0', errorMessage && 'text-red')}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command shouldFilter={!onSearch}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} />
                    <CommandList>
                      {loading && options.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Завантаження...
                        </div>
                      )}
                      {!loading && options.length === 0 && (
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                      )}
                      {options.length > 0 && (
                        <>
                          <CommandGroup>
                            {options.map(option => (
                              <CommandItem
                                key={option.value}
                                value={option.label}
                                keywords={[option.value]}
                                disabled={option.disabled}
                                onSelect={() => {
                                  if (option.disabled) return;
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

                          {onSearch && loading && (
                            <div className="py-2 text-center text-sm text-muted-foreground">
                              Завантаження...
                            </div>
                          )}

                          {onSearch && hasMore && loadMoreRef && (
                            <div ref={loadMoreRef} className="h-px" aria-hidden="true" />
                          )}

                          {onSearch && !hasMore && !loading && options.length > 0 && (
                            <div className="py-2 text-center text-xs text-muted-foreground">
                              Всі результати завантажені
                            </div>
                          )}
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

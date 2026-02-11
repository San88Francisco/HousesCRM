'use client';

import { scrollbarClasses } from '@/shared/constants/styles/scrollbar';
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
import { Check, ChevronsUpDown, CircleAlert } from 'lucide-react';
import { forwardRef, ReactNode, RefObject, useState } from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';

import type { AutocompleteOption } from '@/types/model/ui';

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  icon?: ReactNode;
  iconWithError?: boolean;
  options: AutocompleteOption[];
  onSearch?: (searchTerm: string) => void;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
  loadMoreRef?: RefObject<HTMLDivElement | null>;
};

export const RHFAutocomplete = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      label,
      required = false,
      placeholder = 'Select option...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No options found.',
      className,
      icon,
      iconWithError = false,
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
                      'w-full justify-between text-text border rounded-lg font-normal bg-bg-input h-10 px-2 transition-all duration-200 ease-in-out',
                      'hover:bg-bg-input active:!bg-bg-input focus:!bg-bg-input focus-visible:!bg-bg-input',
                      'focus-visible:outline-none focus-visible:ring-0',
                      !field.value && 'text-muted',
                      !open &&
                        'border-border active:!border-border focus:!border-border focus-visible:!border-border',
                      open &&
                        'border-active-border active:!border-active-border focus:!border-active-border focus-visible:!border-active-border',
                      errorMessage && 'border-red',
                      className,
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {icon && (
                        <span
                          className={cn(
                            'transition-all duration-200 ease-in-out text-muted shrink-0 pointer-events-none',
                            open && 'text-active-border',
                            errorMessage && 'text-red',
                          )}
                        >
                          {icon}
                        </span>
                      )}
                      <span
                        className={cn(
                          'flex-1 text-left truncate',
                          !selectedOption && 'text-muted-text',
                        )}
                      >
                        {selectedOption ? selectedOption.label : placeholder}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {errorMessage && iconWithError && (
                        <CircleAlert className="h-4 w-4 text-red shrink-0 pointer-events-none" />
                      )}
                      <ChevronsUpDown
                        className={cn(
                          'h-4 w-4 shrink-0 pointer-events-none',
                          errorMessage && 'text-red',
                        )}
                      />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command shouldFilter={!onSearch}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} />
                    <CommandList className={cn(scrollbarClasses)}>
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
                            <div className="py-2 text-center text-xs text-muted-text">
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

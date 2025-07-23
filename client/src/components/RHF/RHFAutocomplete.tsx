"use client"

import { forwardRef, useState, useEffect } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface AutocompleteOption {
  value: string
  label: string
}

interface RHFAutocompleteProps {
  name: string
  label?: string
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  options: AutocompleteOption[]
  onSearch?: (searchTerm: string) => void
  loading?: boolean
  disabled?: boolean
}

const RHFAutocomplete = forwardRef<HTMLButtonElement, RHFAutocompleteProps>(
  ({
    name,
    label,
    required = false,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No options found.",
    className,
    options = [],
    onSearch,
    loading = false,
    disabled = false,
  }) => {
    const {
      control,
      formState: { errors },
    } = useFormContext()

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const error = errors[name]
    const errorMessage = error?.message as string | undefined

    // Handle search with optional callback
    useEffect(() => {
      if (onSearch && searchTerm.length >= 2) {
        onSearch(searchTerm)
      }
    }, [searchTerm, onSearch])

    // Reset search when popover closes
    useEffect(() => {
      if (!open) {
        setSearchTerm("")
      }
    }, [open])

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
            const selectedOption = options.find((option) => option.value === field.value)

            return (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                      errorMessage && "border-destructive focus-visible:ring-destructive",
                      className,
                    )}
                  >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} value={searchTerm} onValueChange={setSearchTerm} />
                    <CommandList>
                      {loading && <div className="py-2 px-4 text-sm text-muted-foreground">Loading...</div>}
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              const newValue = currentValue === field.value ? "" : currentValue
                              field.onChange(newValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", field.value === option.value ? "opacity-100" : "opacity-0")}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )
          }}
        />

        {errorMessage && (
          <div className="flex justify-center items-center mt-1.5 text-sm text-destructive bg-destructive/10 py-1.5 px-3 rounded-md animate-in fade-in-50 duration-300">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  },
)

RHFAutocomplete.displayName = "RHFAutocomplete"

export { RHFAutocomplete }

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const checkboxVariants = cva(
  'relative peer shrink-0 rounded-sm border border-solid box-border ring-offset-background transition-colors duration-300 ease-in-out bg-transparent',
  {
    variants: {
      variant: {
        default:
          'border-border data-[state=checked]:bg-active-bg data-[state=checked]:border-active-bg data-[state=checked]:text-background',
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant, size, label, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ variant, size }),
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-all duration-300 ease-in-out',
            'opacity-0 scale-90 data-[state=checked]:opacity-100 data-[state=checked]:scale-100',
            'text-active-text',
          )}
        >
          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && <span className="text-muted">{label}</span>}
    </label>
  ),
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };

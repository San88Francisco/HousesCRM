import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer shrink-0 rounded-[4px] border-[1.2px] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',

  {
    variants: {
      size: {
        sm: 'h-3 w-3 [&_svg]:h-2 [&_svg]:w-2',
        md: 'h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5',
        lg: 'h-5 w-5 [&_svg]:h-4 [&_svg]:w-4',
      },
      variant: {
        sky: 'data-[state=checked]:bg-sky-500 data-[state=checked]:text-white data-[state=checked]:border-none',
        sky100:
          'data-[state=checked]:bg-sky-100 data-[state=checked]:text-sky-900 data-[state=checked]:border-none',
        blueCustom:
          'data-[state=checked]:bg-blue-700 data-[state=checked]:text-white data-[state=checked]:border-none',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'sky',
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size, variant, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        checkboxVariants({ size, variant }),
        'bg-gray-50 border-gray-200 dark:border-gray-700',
        'data-[state=unchecked]:dark:bg-gray-700',

        variant === 'sky' &&
          'dark:data-[state=checked]:bg-sky-500 dark:data-[state=checked]:text-white dark:data-[state=checked]:border-transparent',
        variant === 'sky100' &&
          'dark:data-[state=checked]:bg-sky-100 dark:data-[state=checked]:text-sky-900 dark:data-[state=checked]:border-transparent',
        variant === 'blueCustom' &&
          'dark:data-[state=checked]:bg-blue-700 dark:data-[state=checked]:text-white dark:data-[state=checked]:border-transparent',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center w-full h-full text-current">
        <Check className="stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

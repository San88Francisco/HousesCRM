import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',

  {
    variants: {
      size: {
        sm: 'h-3 w-5',
        md: 'h-4 w-7',
        lg: 'h-6 w-11',
      },
      variant: {
        sky: 'data-[state=checked]:bg-sky-500',
        sky100: 'data-[state=checked]:bg-sky-100',
        blueCustom: 'data-[state=checked]:bg-blue-700',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'sky',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background dark:bg-gray-500 dark:data-[state=checked]:bg-gray-100 shadow-lg ring-0 transition-transform',

  {
    variants: {
      size: {
        sm: 'h-2 w-2 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0',
        md: 'h-3 w-3 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size, variant, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        switchVariants({ size, variant }),
        'bg-gray-200 border-gray-200 dark:border-gray-700 data-[state=checked]:border-none',
        'data-[state=unchecked]:dark:bg-gray-700',

        variant === 'sky' && 'dark:data-[state=checked]:bg-sky-500',
        variant === 'sky100' && 'dark:data-[state=checked]:bg-sky-100 ',
        variant === 'blueCustom' && 'dark:data-[state=checked]:bg-blue-700 ',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          switchThumbVariants({ size }),
          variant === 'sky100' && 'data-[state=checked]:bg-gray-900',
        )}
      />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

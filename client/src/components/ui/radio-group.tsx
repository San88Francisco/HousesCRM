import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const radioGroupItemVariants = cva(
  'aspect-square rounded-full border ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',

  {
    variants: {
      size: {
        sm: 'h-3 w-3 [&_svg]:h-1.5 [&_svg]:w-1.5',
        md: 'h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5',
        lg: 'h-5 w-5 [&_svg]:h-3.5 [&_svg]:w-3.5',
      },
      variant: {
        sky: 'border-sky-500 text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white',
        sky100:
          'border-sky-100 text-sky-900 data-[state=checked]:bg-sky-100 data-[state=checked]:text-sky-900',
        blueCustom:
          'border-blue-700 text-blue-700 data-[state=checked]:bg-blue-700 data-[state=checked]:text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'sky',
    },
  },
);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        radioGroupItemVariants({ size, variant }),
        'bg-gray-50 border-gray-200 dark:border-none data-[state=cheked]:border-none',
        'data-[state=unchecked]:dark:bg-gray-700',

        variant === 'sky' &&
          'dark:border-sky-500 dark:text-sky-500 dark:data-[state=checked]:bg-sky-500 dark:data-[state=checked]:text-sky-100',
        variant === 'sky100' &&
          'dark:border-sky-100 dark:text-sky-900 dark:data-[state=checked]:bg-sky-100 dark:data-[state=checked]:text-sky-900',
        variant === 'blueCustom' &&
          'dark:border-blue-700 dark:text-blue-700 dark:data-[state=checked]:bg-blue-700 dark:data-[state=checked]:text-sky-100',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          'flex items-center justify-center ',
          variant === 'sky100'
            ? 'data-[state=checked]:text-gray-900'
            : 'data-[state=checked]:text-sky-100',
        )}
      >
        <Circle className="fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'border-transparent border-2 border-solid rounded-[0.75rem] font-semibold leading-[150%] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-700 active:border-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:active:border-gray-400',
        secondary:
          'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-200 active:border-gray-100  dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-800 dark:active:border-gray-600',
        outline:
          'bg-white border-gray-200 text-black hover:bg-gray-100 active:bg-white active:border-sky-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-900 dark:active:border-sky-500',
        destructive:
          'bg-red-100 border-red-500 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-500 active:border-red-200 dark:bg-red-950 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-700 dark:hover:text-white dark:active:bg-red-700 dark:active:border-red-500',
        icon: 'text-inherit hover:opacity-70',
      },
      size: {
        xs: 'px-[11px] py-[7px] text-xs [&_svg]:size-3',
        sm: 'px-[13px] py-[9px] text-sm [&_svg]:size-4',
        md: 'px-[17px] py-[9px] text-sm [&_svg]:size-4',
        lg: 'px-[17px] py-[9px] text-base [&_svg]:size-5',
        xl: 'px-[25px] py-[13px] text-base [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

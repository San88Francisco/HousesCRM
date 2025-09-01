import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'border-transparent border-2 border-solid rounded-[0.75rem] font-semibold leading-[150%] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-gray text-white hover:bg-gray-medium active:bg-gray active:border-dark-light',
        secondary:
          'bg-muted-foreground text-text hover:bg-bg-button active:bg-muted-foreground active:border-bg-button',
        outline:
          'bg-background border-border text-text hover:bg-foreground active:bg-background active:border-blue-light',
        destructive:
          'bg-background border-red text-red hover:bg-red hover:text-white active:bg-red active:border-red',
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

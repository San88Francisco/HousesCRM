import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const radioGroupRoot = cva('grid gap-2');

const radioGroupItem = cva([
  'relative aspect-square h-4 w-4 rounded-full border ring-offset-background',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'border-border',
  'data-[state=checked]:bg-active-bg data-[state=checked]:border-active-bg data-[state=checked]:text-background',
]);

const radioGroupIndicator = cva(['absolute inset-0 flex items-center justify-center text-current']);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn(radioGroupRoot(), className)} {...props} ref={ref} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn(radioGroupItem(), className)} {...props}>
    <RadioGroupPrimitive.Indicator className={cn(radioGroupIndicator())}>
      <Circle className="h-2.5 w-2.5 fill-current text-current translate-x-[-0.4px] translate-y-[-0.4px]" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

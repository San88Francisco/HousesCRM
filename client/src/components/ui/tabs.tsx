'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { TABS_SIZE_CONFIG, TabsSize } from '@/lib/design-tokens/tabs';

type LocalTabsSize = 'default' | 'sm';

const getSizeVars = (size: TabsSize) => TABS_SIZE_CONFIG[size] as React.CSSProperties;

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  size?: LocalTabsSize;
}

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ size = 'default', className, style, ...props }, ref) => {
    const vars = getSizeVars(size);
    return (
      <TabsPrimitive.Root
        ref={ref}
        className={cn(className)}
        style={{ ...vars, ...style }}
        {...props}
      />
    );
  },
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'relative inline-flex items-center justify-center ',

      'min-h-[var(--tabs-list-min-h)] px-[var(--tabs-list-p)] py-[calc(var(--tabs-list-p)*0.5)]',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all duration-300 text-zinc-400 dark:text-white/40',

      'after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[var(--tabs-after-h)] after:rounded-full after:bg-zinc-900 dark:after:bg-white after:transition-transform after:duration-300 after:scale-x-0 after:origin-center',

      'data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:after:scale-x-100',

      'px-[var(--tabs-trigger-px)] py-[var(--tabs-trigger-py)] text-[length:var(--tabs-trigger-fs)]',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-[var(--tabs-content-mt)]', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

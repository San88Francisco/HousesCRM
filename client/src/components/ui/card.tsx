import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  CardProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from '../../types/core/card';

const cardVariants = {
  default: {
    base: 'bg-gray-100 dark:bg-white/5 text-zinc-900 dark:text-white',
    title: 'text-zinc-900 dark:text-white',
    description: 'text-zinc-600 dark:text-zinc-400',
    content: 'text-zinc-900 dark:text-white',
    footer: 'text-zinc-900 dark:text-white',
  },
  sky: {
    base: 'bg-sky-100 dark:bg-sky-100 text-zinc-900',
    title: 'text-zinc-900',
    description: 'text-zinc-700 dark:text-zinc-700',
    content: 'text-zinc-900',
    footer: 'text-zinc-900',
  },
  purple: {
    base: 'bg-blue-100 dark:bg-blue-100 text-zinc-900',
    title: 'text-zinc-900',
    description: 'text-zinc-700 dark:text-zinc-700',
    content: 'text-zinc-900',
    footer: 'text-zinc-900',
  },
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl shadow-sm', cardVariants[variant].base, className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, variant = 'default', as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        cardVariants[variant].title,
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm leading-relaxed', cardVariants[variant].description, className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', cardVariants[variant].content, className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', cardVariants[variant].footer, className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

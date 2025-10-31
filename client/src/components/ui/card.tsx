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
    base: 'bg-foreground ',
    title: 'text-text',
    description: 'text-muted',
    content: 'text-text',
    footer: 'text-text',
  },
  sky: {
    base: 'bg-blue-light',
    title: 'text-dark',
    description: 'text-muted',
    content: 'text-dark',
    footer: 'text-dark',
  },
  purple: {
    base: 'bg-purple-lightest',
    title: 'text-dark',
    description: 'text-muted',
    content: 'text-dark',
    footer: 'text-dark',
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

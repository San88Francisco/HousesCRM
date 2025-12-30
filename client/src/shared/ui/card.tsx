import * as React from 'react';
import { cn } from '../utils/cn';

export type CardVariant = 'default' | 'sky' | 'purple';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: CardVariant;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: CardVariant;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

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
      className={cn('rounded-xl shadow-sm ', cardVariants[variant].base, className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex sm:flex-row flex-col sm:gap-5 gap-3  justify-between space-y-1.5 sm:p-6 p-3',
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, variant = 'default', as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'md:text-2xl  font-semibold leading-none tracking-tight',
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
      className={cn(
        'md:text-sm text-xs leading-relaxed',
        cardVariants[variant].description,
        className,
      )}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('sm:p-6 p-3 pt-0 flex-1', cardVariants[variant].content, className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center sm:p-6 p-3  pt-0', cardVariants[variant].footer, className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

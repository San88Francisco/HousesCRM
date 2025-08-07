import * as React from 'react';

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

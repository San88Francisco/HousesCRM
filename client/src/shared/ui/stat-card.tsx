import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardVariant } from './card';

export interface StatCardProps {
  variant: CardVariant;
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}

export const StatCard = ({ variant, icon: Icon, label, value, description }: StatCardProps) => (
  <Card variant={variant}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-text" />
        <CardDescription variant={variant} className="font-medium">
          {label}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent variant={variant}>
      <CardTitle variant={variant} as="div" className="md:text-3xl text-2xl font-bold">
        {value}
      </CardTitle>
      <p className="text-xs mt-1 text-muted dark:text-text">{description}</p>
    </CardContent>
  </Card>
);

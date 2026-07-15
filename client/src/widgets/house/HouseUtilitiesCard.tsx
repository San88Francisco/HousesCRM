'use client';

import { UTILITIES_TAB_PARAM, UTILITY_TABS } from '@/shared/constants/utilities';
import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const HouseUtilitiesCard = () => {
  const { id } = useParams<{ id: string }>();

  const utilitiesUrl = `${ROUTES.HOUSE}/${id}/utilities`;

  return (
    <Card>
      <CardHeader className="items-center">
        <div className="flex flex-col gap-3">
          <CardTitle>Комунальні послуги</CardTitle>
          <CardDescription>
            Показники лічильників, тарифи та вартість по цій квартирі.
          </CardDescription>

          <div className="flex flex-wrap gap-2">
            {UTILITY_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.key}
                  href={`${utilitiesUrl}?${UTILITIES_TAB_PARAM}=${tab.key}`}
                  title={`Відкрити: ${tab.label}`}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-text transition-opacity hover:opacity-75',
                    tab.softBgClass,
                  )}
                >
                  <Icon size={16} className={tab.colorClass} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <Button asChild size="sm" className="shrink-0 self-start sm:self-center">
          <Link href={utilitiesUrl}>
            Відкрити
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
};

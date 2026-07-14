'use client';

import { UTILITIES_TAB_PARAM, UTILITY_CONFIG, UTILITY_TABS } from '@/shared/constants/utilities';
import { ROUTES } from '@/shared/routes';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { UtilitiesSummaryChart } from './UtilitiesSummaryChart';
import { UtilityMetersCard } from './UtilityMetersCard';

export const UtilitiesShell = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get(UTILITIES_TAB_PARAM);
  const activeTab = UTILITY_TABS.find(tab => tab.key === tabParam) ?? UTILITY_TABS[0];

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(UTILITIES_TAB_PARAM, key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href={`${ROUTES.HOUSE}/${id}`}
          className="flex w-fit items-center gap-1 text-sm text-muted-text transition-colors hover:text-text"
        >
          <ChevronLeft size={16} />
          Назад до квартири
        </Link>
        <h1 className="text-2xl font-semibold">Комунальні послуги</h1>
      </div>

      <UtilitiesSummaryChart houseId={id} />

      <Tabs value={activeTab.key} onValueChange={handleTabChange}>
        <TabsList className="h-auto min-h-0 w-full flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
          {UTILITY_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="shrink-0 rounded-none gap-1.5">
                <Icon size={16} className={tab.colorClass} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        {activeTab.types.map(type => (
          <UtilityMetersCard key={type} houseId={id} config={UTILITY_CONFIG[type]} />
        ))}
      </div>
    </div>
  );
};

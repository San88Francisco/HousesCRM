'use client';

import { ROUTES } from '@/shared/routes';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const tabs = [
  { value: 'personal', href: ROUTES.PROFILE_PERSONAL, label: 'Особисті дані' },
  { value: 'contracts', href: ROUTES.PROFILE_CONTRACTS, label: 'Інформація для контрактів' },
  { value: 'password', href: ROUTES.PROFILE_PASSWORD, label: 'Змінити пароль' },
] as const;

export const ProfileShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const active = tabs.find(t => pathname === t.href)?.value ?? 'personal';

  return (
    <div className="flex w-full  flex-col gap-6">
      <h1 className="text-2xl font-semibold">Профіль</h1>
      <Tabs value={active}>
        <TabsList className="h-auto min-h-0 w-full flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
          {tabs.map(t => (
            <TabsTrigger key={t.value} value={t.value} asChild className="shrink-0 rounded-none">
              <Link href={t.href}>{t.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>{children}</div>
    </div>
  );
};

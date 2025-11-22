'use client';

import { SidebarProvider } from '@/shared/ui/sidebar';
import { AppSidebar } from '../sidebar/AppSidebar';
import Header from '@/widgets/header';
import { ReactNode, Suspense } from 'react';

export const LayoutContent = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 px-2 sm:px-8 py-5">{children}</main>
        </div>
      </Suspense>
    </SidebarProvider>
  );
};

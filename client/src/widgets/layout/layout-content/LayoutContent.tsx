'use client';

import { ModalRoot } from '@/components/modals';
import { SidebarProvider } from '@/shared/ui/sidebar';
import Header from '@/widgets/header';
import { ReactNode, Suspense } from 'react';
import { AppSidebar } from '../sidebar/AppSidebar';

export const LayoutContent = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="px-2 sm:px-8 min-w-0 w-full">{children}</main>
        </div>
      </Suspense>
      <ModalRoot />
    </SidebarProvider>
  );
};

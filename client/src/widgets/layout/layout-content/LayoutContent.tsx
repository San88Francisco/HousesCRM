'use client';

import { SidebarProvider } from '@/shared/ui/sidebar';
import { AppSidebar } from '../sidebar/AppSidebar';
import Header from '@/widgets/header';
import { ReactNode, Suspense } from 'react';
import { ModalRoot } from '@/components/modals';

export const LayoutContent = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          <main className="px-2 sm:px-8">{children}</main>
        </div>
      </Suspense>
      <ModalRoot />
    </SidebarProvider>
  );
};

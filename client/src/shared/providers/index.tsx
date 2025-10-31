'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import store from '@/store/store';

import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '@/widgets/Layout/Sidebar/AppSidebar';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  const mainContent = (
    <main className="flex-1 overflow-x-hidden px-2 sm:px-8 py-5">{children}</main>
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      <Provider store={store}>
        <SidebarProvider>
          <AppSidebar label="some-usergamil.com" />
          {mainContent}
        </SidebarProvider>
      </Provider>
    </ThemeProvider>
  );
};

'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import store from '@/store/store';
import { SidebarProvider } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/layout/sidebar/AppSidebar';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
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
          <AppSidebar />
          {children}
        </SidebarProvider>
      </Provider>
    </ThemeProvider>
  );
};

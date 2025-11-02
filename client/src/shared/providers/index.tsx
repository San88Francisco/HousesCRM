'use client';

import { ReactNode, Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import store from '@/store/store';
import { SidebarProvider } from '@/shared/ui/sidebar';

type Props = {
  children: ReactNode;
  shouldHideSidebar?: boolean;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
};

export const Providers = ({ children, sidebarOpen = false, onSidebarOpenChange }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      <Provider store={store}>
        <SidebarProvider open={sidebarOpen} onOpenChange={onSidebarOpenChange}>
          {children}
        </SidebarProvider>
      </Provider>
    </ThemeProvider>
  );
};

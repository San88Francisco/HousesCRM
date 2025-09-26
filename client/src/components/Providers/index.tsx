'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import store from '@/store/store';

type Props = {
  children: ReactNode;
  shouldHideSidebar?: boolean;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
};

export const Providers = ({
  children,
  shouldHideSidebar = false,
  sidebarOpen = false,
  onSidebarOpenChange,
}: Props) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={store}>
        <CurrencyProvider>
          {shouldHideSidebar ? (
            children
          ) : (
            <SidebarProvider open={sidebarOpen} onOpenChange={onSidebarOpenChange}>
              {children}
            </SidebarProvider>
          )}
        </CurrencyProvider>
      </Provider>
    </ThemeProvider>
  );
};

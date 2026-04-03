'use client';

import { SessionKeepAlive } from '@/shared/components/session-keep-alive';
import store from '@/store/store';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';

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
        <SessionKeepAlive />
        {children}
      </Provider>
    </ThemeProvider>
  );
};

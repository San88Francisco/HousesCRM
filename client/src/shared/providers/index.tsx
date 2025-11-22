'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import store from '@/store/store';

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
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};

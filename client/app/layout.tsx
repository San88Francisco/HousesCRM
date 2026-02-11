import { ThemeScript } from '@/scripts';
import { Providers } from '@/shared/providers';
import { Toaster } from '@/shared/ui/sonner';
import { LayoutContent } from '@/widgets/layout/layout-content';
import { ReactNode } from 'react';
import './globals.css';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Toaster />
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

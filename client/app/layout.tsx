import { ThemeScript } from '@/scripts';
import { Providers } from '@/shared/providers';
import { Toaster } from '@/shared/ui/sonner';
import { LayoutContent } from '@/widgets/layout/layout-content';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'houses-crm',
  icons: {
    icon: [
      { url: '/logo/light-logo.png', media: '(prefers-color-scheme: light)' },
      { url: '/logo/dark-logo.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

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

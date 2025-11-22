import './globals.css';
import { ReactNode } from 'react';
import { ThemeScript } from '@/scripts/ThemeScript';
import { Providers } from '@/shared/providers';
import { Toaster } from '@/shared/ui/sonner';
import { LayoutContent } from '@/widgets/layout/layout-content/LayoutContent';

export default function RootLayout({ children }: { children: ReactNode }) {
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
}
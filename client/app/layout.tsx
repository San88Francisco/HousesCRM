import './globals.css';
import { ReactNode } from 'react';
import { ThemeScript } from '@/scripts/ThemeScript';
import { Providers } from '@/shared/providers';
import { Toaster } from '@/shared/ui/sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Toaster />

          {children}
        </Providers>
      </body>
    </html>
  );
}

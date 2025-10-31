'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeScript } from '@/scripts/ThemeScript';
import { noSidebarRoutes } from '@/shared/constants/sidebar/noSidebarRoutes';
import { Providers } from '@/shared/providers';
import { Toaster } from '@/shared/ui/sonner';
import { AppSidebar } from '@/widgets/Layout/Sidebar/AppSidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shouldHideSidebar = noSidebarRoutes.includes(pathname);

  const mainContent = (
    <main className="flex-1 overflow-x-hidden px-2 sm:px-8 py-5">{children}</main>
  );

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
        <Providers
          shouldHideSidebar={shouldHideSidebar}
          sidebarOpen={open}
          onSidebarOpenChange={setOpen}
        >
          {shouldHideSidebar ? (
            mainContent
          ) : (
            <>
              <AppSidebar label="some-usergamil.com" />
              {mainContent}
            </>
          )}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

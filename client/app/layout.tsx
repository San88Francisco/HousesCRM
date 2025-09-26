'use client';

import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { noSidebarRoutes } from '@/constants/sidebar/noSidebarRoutes';
import cookies from 'js-cookie';
import { ROUTES } from '@/routes';
import { AppSidebar } from '@/components/Sidebar';
import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const shouldHideSidebar = noSidebarRoutes.includes(pathname);

  useEffect(() => {
    const token = cookies.get('accessToken');

    if (!token) {
      router.push(ROUTES.UIKIT);
    }
  }, [router]);

  const mainContent = (
    <main className="flex-1 overflow-x-hidden px-2 sm:px-8 py-5">{children}</main>
  );

  return (
    <html lang="en" suppressHydrationWarning>
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

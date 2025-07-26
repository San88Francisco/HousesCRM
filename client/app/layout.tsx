'use client';

import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ReactNode, useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { noSidebarRoutes } from '@/constants/noSidebarRoutes';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Provider } from 'react-redux';
import store from '@/store/store';
import cookies from 'js-cookie';

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
      router.push('/login');
    }
  }, [router]);

  const mainContent = (
    <main className="flex-1 overflow-x-hidden px-2 sm:px-8 py-5">
      {!shouldHideSidebar && (
        <div className="flex h-16 items-center absolute">
          <SidebarTrigger className="-ml-8" />
        </div>
      )}
      {children}
    </main>
  );

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <CurrencyProvider>
            {shouldHideSidebar ? (
              mainContent
            ) : (
              <SidebarProvider open={open} onOpenChange={setOpen}>
                <AppSidebar />
                {mainContent}
              </SidebarProvider>
            )}
            <Toaster />
          </CurrencyProvider>
        </Provider>
      </body>
    </html>
  );
}

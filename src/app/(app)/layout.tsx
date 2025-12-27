'use client';

import AppSidebar from '@/components/app-shell/app-sidebar';
import AppHeader from '@/components/app-shell/header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
       <div className="flex min-h-screen w-full">
        <aside className="hidden w-16 flex-col border-r bg-card lg:flex p-2 gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 mt-4 space-y-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <div className="mt-auto space-y-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </aside>
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
                <Skeleton className="h-8 w-48" />
                <div className="ml-auto flex gap-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

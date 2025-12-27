'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AppHeader from '@/components/app-shell/header';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full flex-col">
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
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}

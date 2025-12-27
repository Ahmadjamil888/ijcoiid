'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { GitBranch, Play, Cpu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDoc, useUser } from '@/firebase';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ projectId: string }>();
  const firestore = useFirestore();
  const { user } = useUser();

  const projectId = params.projectId;

  const projectRef = useMemoFirebase(
    () =>
      user && projectId
        ? doc(firestore, `users/${user.uid}/projects/${projectId}`)
        : null,
    [firestore, user, projectId]
  );

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-5 w-3/4 mt-2" />
        </div>
        <nav className="border-b">
          <div className="flex space-x-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </nav>
        <div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const navItems = [
    {
      name: 'Pipelines',
      href: `/projects/${project.id}`,
      icon: GitBranch,
      exact: true,
    },
    { name: 'Runs', href: `/projects/${project.id}/runs`, icon: Play },
    { name: 'Models', href: `/projects/${project.id}/models`, icon: Cpu },
    {
      name: 'Settings',
      href: `/projects/${project.id}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {project.name}
        </h1>
        <p className="text-muted-foreground mt-1">{project.goal}</p>
      </div>
      <nav>
        <div className="border-b">
          <div className="-mb-px flex space-x-6">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'border-primary text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}

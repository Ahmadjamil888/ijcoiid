'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/dashboard/project-card';
import CreateProjectDialog from '@/components/dashboard/create-project-dialog';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Skeleton className="h-[250px] w-full" />
    <Skeleton className="h-[250px] w-full" />
    <Skeleton className="h-[250px] w-full" />
  </div>
);

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(
    () =>
      user ? collection(firestore, 'users', user.uid, 'projects') : null,
    [firestore, user]
  );

  const { data: projects, isLoading } = useCollection<Omit<Project, 'id'>>(projectsQuery);

  return (
    <div className="container mx-auto px-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your AI projects or create a new one.
          </p>
        </div>
        <CreateProjectDialog>
          <Button>
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

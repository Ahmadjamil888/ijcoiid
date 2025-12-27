'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, GitBranch, Play, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Pipeline } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import CreatePipelineDialog from '@/components/project/create-pipeline-dialog';

export default function ProjectPipelinesPage() {
  const params = useParams<{ projectId: string }>();
  const { user } = useUser();
  const firestore = useFirestore();

  const pipelinesQuery = useMemoFirebase(
    () =>
      user && params.projectId
        ? collection(
            firestore,
            `users/${user.uid}/projects/${params.projectId}/pipelines`
          )
        : null,
    [firestore, user, params.projectId]
  );

  const { data: pipelines, isLoading } = useCollection<Pipeline>(pipelinesQuery);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pipelines</h2>
        <CreatePipelineDialog>
          <Button>
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Pipeline
          </Button>
        </CreatePipelineDialog>
      </div>
      <div className="mt-6 grid gap-6">
        {isLoading && (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        )}
        {pipelines?.map((pipeline) => (
          <Card key={pipeline.id}>
            <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>
                  <Link
                    href={`/projects/${params.projectId}/pipelines/${pipeline.id}`}
                    className="hover:underline"
                  >
                    {pipeline.name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  Updated{' '}
                  {pipeline.updatedAt ? formatDistanceToNow(new Date(pipeline.updatedAt), {
                    addSuffix: true,
                  }) : 'never'}
                </CardDescription>
              </div>
               <div className="flex items-center gap-2 rounded-lg bg-secondary p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <GitBranch className="mr-1 h-3 w-3" />
                  {pipeline.runCount} runs
                </div>
                <div className="flex items-center gap-2">
                  Last run:
                  {pipeline.lastRunStatus ? (
                    <Badge
                      variant={
                        pipeline.lastRunStatus === 'success'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="capitalize"
                    >
                      {pipeline.lastRunStatus}
                    </Badge>
                  ) : (
                    'Never'
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

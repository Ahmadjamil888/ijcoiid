'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useDoc,
  useUser,
  useFirestore,
  useMemoFirebase,
  useCollection,
} from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import { doc, collection } from 'firebase/firestore';
import type { Project, Pipeline } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, GitBranch, Play, CheckCircle, Loader, XCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import CreatePipelineDialog from '@/components/project/create-pipeline-dialog';

const PipelineStatusIcon = ({
  status,
}: {
  status: Pipeline['status'];
}) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'FAILED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'TRAINING':
      return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    default:
      return <GitBranch className="h-4 w-4 text-muted-foreground" />;
  }
};

const PipelineList = () => {
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

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!pipelines || pipelines.length === 0) {
    return (
      <Card className="flex h-48 flex-col items-center justify-center text-center">
        <CardHeader>
          <CardTitle>No Pipelines Yet</CardTitle>
          <CardDescription>
            Create your first pipeline to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePipelineDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Pipeline
            </Button>
          </CreatePipelineDialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-left">
            <th>Name</th>
            <th>Status</th>
            <th>Runs</th>
            <th>Last Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pipelines.map(pipeline => (
            <tr key={pipeline.id} className="border-b last:border-none">
              <td className="p-4 font-medium">{pipeline.name}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <PipelineStatusIcon status={pipeline.status} />
                  <span>{pipeline.status}</span>
                </div>
              </td>
              <td className="p-4">{pipeline.runCount}</td>
              <td className="p-4 text-muted-foreground">
                {formatDistanceToNow(new Date(pipeline.updatedAt), {
                  addSuffix: true,
                })}
              </td>
              <td className="p-4 text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/projects/${params.projectId}/pipelines/${pipeline.id}`}
                  >
                    <Play className="mr-2 h-4 w-4" /> Run
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function ProjectOverviewPage() {
  const params = useParams<{ projectId: string }>();
  const { user } = useUser();
  const firestore = useFirestore();

  const projectRef = useMemoFirebase(
    () =>
      user && params.projectId
        ? doc(firestore, `users/${user.uid}/projects/${params.projectId}`)
        : null,
    [firestore, user, params.projectId]
  );

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex justify-between pt-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground">
            The project you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">{project.goal}</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pipelines</h2>
        <CreatePipelineDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Pipeline
          </Button>
        </CreatePipelineDialog>
      </div>

      <PipelineList />
    </div>
  );
}

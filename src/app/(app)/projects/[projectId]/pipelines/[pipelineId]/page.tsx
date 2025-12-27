'use client';

import NodeSidebar from '@/components/pipeline/node-sidebar';
import PipelineCanvas from '@/components/pipeline/pipeline-canvas';
import PropertiesPanel from '@/components/pipeline/properties-panel';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { Pipeline, Project } from '@/lib/types';
import { Play, Save, Wand2 } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function PipelineBuilderPage({
  params,
}: {
  params: { projectId: string; pipelineId: string };
}) {
  const { user } = useUser();
  const firestore = useFirestore();

  const pipelineRef = useMemoFirebase(
    () =>
      user
        ? doc(
            firestore,
            `users/${user.uid}/projects/${params.projectId}/pipelines/${params.pipelineId}`
          )
        : null,
    [firestore, user, params.projectId, params.pipelineId]
  );
  const { data: pipeline, isLoading: isPipelineLoading } = useDoc<Pipeline>(pipelineRef);

  if (isPipelineLoading) {
    return (
       <div className="flex h-[calc(100vh-12rem)] flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
             <Skeleton className="h-7 w-48" />
             <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-[280px_1fr_320px] gap-2 pt-4">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }


  if (!pipeline) {
    return <div>Pipeline not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold">{pipeline.name}</h2>
          <p className="text-sm text-muted-foreground">
            Visually construct your ML pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Wand2 className="mr-2 h-4 w-4" />
            AI Assist
          </Button>
          <Button variant="secondary">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-[280px_1fr_320px] gap-2 pt-4">
        <NodeSidebar />
        <PipelineCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}

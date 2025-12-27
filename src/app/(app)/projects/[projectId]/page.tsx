import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockPipelines } from '@/lib/data';
import { Plus, GitBranch, Play, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectPipelinesPage({
  params,
}: {
  params: { projectId: string };
}) {
  const pipelines = mockPipelines.filter(
    (p) => p.projectId === params.projectId
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pipelines</h2>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </div>
      <div className="mt-6 grid gap-6">
        {pipelines.map((pipeline) => (
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
                  {formatDistanceToNow(new Date(pipeline.updatedAt), {
                    addSuffix: true,
                  })}
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

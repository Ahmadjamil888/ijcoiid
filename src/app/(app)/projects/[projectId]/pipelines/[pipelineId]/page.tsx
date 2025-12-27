import NodeSidebar from '@/components/pipeline/node-sidebar';
import PipelineCanvas from '@/components/pipeline/pipeline-canvas';
import PropertiesPanel from '@/components/pipeline/properties-panel';
import { Button } from '@/components/ui/button';
import { mockPipelines, mockProjects } from '@/lib/data';
import { Play, Save, Wand2 } from 'lucide-react';

export default function PipelineBuilderPage({
  params,
}: {
  params: { projectId: string; pipelineId: string };
}) {
  const project = mockProjects.find((p) => p.id === params.projectId);
  const pipeline = mockPipelines.find((p) => p.id === params.pipelineId);

  if (!project || !pipeline) {
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

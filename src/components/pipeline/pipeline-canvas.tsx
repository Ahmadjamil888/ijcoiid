import { Card, CardContent } from '../ui/card';
import { GitBranch } from 'lucide-react';

export default function PipelineCanvas() {
  return (
    <Card className="flex h-full items-center justify-center bg-background">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <GitBranch className="h-16 w-16" />
        <h3 className="mt-4 text-lg font-semibold">Pipeline Canvas</h3>
        <p className="mt-2 text-sm">
          Drag and drop nodes from the left sidebar to build your pipeline.
        </p>
      </CardContent>
    </Card>
  );
}

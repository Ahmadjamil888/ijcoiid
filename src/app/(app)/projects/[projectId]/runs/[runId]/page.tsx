import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRuns } from '@/lib/data';
import { formatDistance } from 'date-fns';
import { CheckCircle, Clock, Loader, Terminal, XCircle } from 'lucide-react';

const LogViewer = () => (
    <Card className="flex-1 bg-black">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Terminal className="h-4 w-4" />
                <span>Live Logs</span>
            </div>
             <Badge variant="secondary">Streaming...</Badge>
        </CardHeader>
        <CardContent className="p-4 font-mono text-xs text-green-400 overflow-y-auto h-full">
            <p>&gt; Starting pipeline run: run-3...</p>
            <p>&gt; Agent Planner: Goal analyzed. Execution plan created.</p>
            <p>&gt; Agent Dataset: Fetching dataset 'imdb' from Hugging Face...</p>
            <p className="text-gray-400">[INFO] Found 25000 examples in train split.</p>
            <p className="text-gray-400">[INFO] Found 25000 examples in test split.</p>
            <p>&gt; Agent Dataset: Dataset validation complete. Schema is valid.</p>
            <p>&gt; Agent Data Engineer: Generating preprocessing script...</p>
            <p>&gt; Agent Data Engineer: Applying tokenization and padding...</p>
            <p className="text-yellow-400">[WARN] 12 samples have unusual length. Clamping.</p>
            <p>&gt; Agent Model Architect: Selected 'distilbert-base-uncased' for efficiency.</p>
            <p>&gt; Agent Training: Starting model training for 3 epochs...</p>
        </CardContent>
    </Card>
);

const RunSummaryCard = ({ run }: { run: (typeof mockRuns)[0] }) => {
    const duration = run.endedAt
    ? formatDistance(new Date(run.endedAt), new Date(run.startedAt))
    : formatDistance(new Date(), new Date(run.startedAt));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Run Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={run.status === 'completed' ? 'secondary' : run.status === 'failed' ? 'destructive' : 'default'} className="capitalize flex gap-2">
                        {run.status === 'running' && <Loader className="h-3 w-3 animate-spin" />}
                        {run.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {run.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {run.status}
                    </Badge>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{duration}</span>
                </div>
                {run.metrics && Object.entries(run.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-mono">{value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};


export default function RunMonitorPage({ params }: { params: { runId: string } }) {
  const run = mockRuns.find((r) => r.id === params.runId);

  if (!run) {
    return <div>Run not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col gap-6">
        <div>
            <h2 className="text-xl font-semibold">Run Monitor</h2>
            <p className="text-sm text-muted-foreground">run-id: <span className="font-mono">{run.id}</span></p>
        </div>
        <div className="grid flex-1 gap-6 md:grid-cols-[1fr_340px]">
            <LogViewer />
            <RunSummaryCard run={run} />
        </div>
    </div>
  );
}

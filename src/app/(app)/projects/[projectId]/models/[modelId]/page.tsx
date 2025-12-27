import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockModels } from '@/lib/data';
import { format } from 'date-fns';
import { Copy, Rocket, Send } from 'lucide-react';

const InferenceWidget = () => (
    <Card>
        <CardHeader>
            <CardTitle>Inference</CardTitle>
            <CardDescription>Test your model with sample inputs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="inference-input">Input</Label>
                <Textarea id="inference-input" placeholder="e.g., 'I love this product, it's amazing!'" />
            </div>
            <Button>
                <Send className="mr-2 h-4 w-4" /> Run Inference
            </Button>
            <div className="grid gap-2">
                <Label>Output</Label>
                <div className="min-h-[80px] w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm">
                    <pre>
                        <code>{JSON.stringify({ label: 'POSITIVE', score: 0.9987 }, null, 2)}</code>
                    </pre>
                </div>
            </div>
        </CardContent>
    </Card>
);

const DeploymentInfo = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5" /> Deployment</CardTitle>
            <CardDescription>Use this model in your applications via the API endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="grid gap-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <div className="flex gap-2">
                    <Input id="api-endpoint" value="https://api.pipeline.ai/v1/infer/model-1" readOnly />
                    <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
                </div>
            </div>
             <div className="grid gap-2">
                <Label>Example cURL</Label>
                <div className="w-full rounded-md border bg-secondary/50 p-3 text-sm font-mono">
                    <pre><code>curl -X POST ...</code></pre>
                </div>
            </div>
        </CardContent>
    </Card>
)

export default function ModelViewerPage({ params }: { params: { modelId: string } }) {
  const model = mockModels.find((m) => m.id === params.modelId);

  if (!model) {
    return <div>Model not found.</div>;
  }

  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">{model.name} <Badge variant="outline">v{model.version}</Badge></h2>
            <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Model Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground">Model ID: </span>
                    <span className="font-mono">{model.id}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Created At: </span>
                    <span>{format(new Date(model.createdAt), 'PPP')}</span>
                </div>
                 <div className="md:col-span-2 space-y-2">
                    <span className="text-muted-foreground">Metrics: </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(model.metrics).map(([key, value]) => (
                            <div key={key} className="rounded-md border p-3">
                                <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                                <p className="text-lg font-bold font-mono">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
            <InferenceWidget />
            <DeploymentInfo />
        </div>
    </div>
  );
}

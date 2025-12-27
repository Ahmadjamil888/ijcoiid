import {
  Database,
  ShieldCheck,
  SlidersHorizontal,
  BrainCircuit,
  TestTube2,
  Sparkles,
  Rocket,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const nodeTypes = [
  { name: 'Dataset Fetch', icon: <Database className="h-5 w-5" />, type: 'input' },
  { name: 'Data Validation', icon: <ShieldCheck className="h-5 w-5" /> },
  { name: 'Preprocessing', icon: <SlidersHorizontal className="h-5 w-5" /> },
  { name: 'Model Selection', icon: <BrainCircuit className="h-5 w-5" /> },
  { name: 'Training', icon: <Wrench className="h-5 w-5" /> },
  { name: 'Evaluation', icon: <TestTube2 className="h-5 w-5" /> },
  { name: 'Optimization', icon: <Sparkles className="h-5 w-5" /> },
  { name: 'Deployment', icon: <Rocket className="h-5 w-5" />, type: 'output' },
];

export default function NodeSidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {nodeTypes.map((node) => (
            <div
              key={node.name}
              className="flex cursor-grab items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
              draggable
            >
              <div className="text-primary">{node.icon}</div>
              <span className="text-sm font-medium">{node.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

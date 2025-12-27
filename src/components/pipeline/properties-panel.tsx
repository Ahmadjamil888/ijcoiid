import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function PropertiesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>Select a node to view its properties.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="node-name">Node Name</Label>
            <Input id="node-name" placeholder="Dataset Fetch" />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="node-description">Description</Label>
            <Textarea id="node-description" placeholder="Fetches data from Hugging Face." />
        </div>
         <div className="grid gap-2">
            <Label htmlFor="dataset-name">Hugging Face Dataset</Label>
            <Input id="dataset-name" placeholder="imdb" />
        </div>
      </CardContent>
    </Card>
  );
}

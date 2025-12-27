import { mockModels } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Cpu } from 'lucide-react';
import Link from 'next/link';

export default function ProjectModelsPage({ params }: { params: { projectId: string } }) {
  const models = mockModels.filter((m) => m.projectId === params.projectId);

  return (
    <div>
      <h2 className="text-xl font-semibold">Models</h2>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">Model Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Version</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Accuracy</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Created</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                      <Link href={`/projects/${params.projectId}/models/${model.id}`} className="hover:text-primary hover:underline flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground"/>
                        {model.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        <Badge variant="outline">v{model.version}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground font-mono">{model.metrics.accuracy}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{formatDistanceToNow(new Date(model.createdAt), { addSuffix: true })}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/projects/${params.projectId}/models/${model.id}`} className="text-primary hover:text-primary/80">View<span className="sr-only">, {model.name}</span></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

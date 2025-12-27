import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockRuns } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Terminal, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

const StatusIcon = ({ status }: { status: 'running' | 'completed' | 'failed' }) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'failed':
            return <XCircle className="h-4 w-4 text-red-500" />;
        case 'running':
            return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    }
}


export default function ProjectRunsPage({ params }: { params: { projectId: string } }) {
  const runs = mockRuns.filter((r) => r.projectId === params.projectId);

  return (
    <div>
        <h2 className="text-xl font-semibold">All Runs</h2>
        <div className="mt-6 flow-root">
             <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-border">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">Run ID</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Pipeline</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Started</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {runs.map(run => (
                                <tr key={run.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                                        <Link href={`/projects/${params.projectId}/runs/${run.id}`} className="hover:text-primary hover:underline">
                                        {run.id}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon status={run.status} />
                                            <span className="capitalize">{run.status}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{run.pipelineId}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{formatDistanceToNow(new Date(run.startedAt), { addSuffix: true })}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <Link href={`/projects/${params.projectId}/runs/${run.id}`} className="text-primary hover:text-primary/80">View<span className="sr-only">, {run.id}</span></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

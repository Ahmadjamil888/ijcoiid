import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { Button } from '../ui/button';
import { ArrowRight, Bot, Cpu, GitBranch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TaskTypeIcon = ({ type }: { type: Project['taskType'] }) => {
  switch (type) {
    case 'NLP':
      return <Bot className="h-4 w-4 text-muted-foreground" />;
    case 'CV':
      return <Cpu className="h-4 w-4 text-muted-foreground" />;
    default:
      return <GitBranch className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <TaskTypeIcon type={project.taskType} />
            {project.taskType}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 h-10">{project.goal}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold">{project.pipelineCount || 0}</p>
                <p className="text-xs text-muted-foreground">Pipelines</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{project.runCount || 0}</p>
                <p className="text-xs text-muted-foreground">Runs</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{project.modelCount || 0}</p>
                <p className="text-xs text-muted-foreground">Models</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/projects/${project.id}`}>
            View Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
         <p className="text-xs text-muted-foreground w-full text-center">
          Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProjects } from '@/lib/data';
import ProjectCard from '@/components/dashboard/project-card';
import CreateProjectDialog from '@/components/dashboard/create-project-dialog';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your AI projects or create a new one.
          </p>
        </div>
        <CreateProjectDialog>
          <Button>
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

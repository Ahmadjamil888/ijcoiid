'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitBranch, Play, Cpu, Settings, Folder } from 'lucide-react';
import { mockProjects } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const pathname = usePathname();
  const project = mockProjects.find((p) => p.id === params.projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const navItems = [
    { name: 'Pipelines', href: `/projects/${project.id}`, icon: GitBranch, exact: true },
    { name: 'Runs', href: `/projects/${project.id}/runs`, icon: Play },
    { name: 'Models', href: `/projects/${project.id}/models`, icon: Cpu },
    { name: 'Settings', href: `/projects/${project.id}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {project.name}
            </h1>
            <p className="text-muted-foreground mt-1">{project.goal}</p>
        </div>
      <nav>
        <div className="border-b">
          <div className="-mb-px flex space-x-6">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'border-primary text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}

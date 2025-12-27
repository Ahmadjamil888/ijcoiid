'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Folder,
  PanelLeft,
  ChevronDown,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockProjects, mockUser } from '@/lib/data';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo inApp />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-1">
             <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === '/dashboard' && 'bg-primary/10 text-primary'
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                 pathname.startsWith('/settings') && 'bg-primary/10 text-primary'
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
              Projects
            </h3>
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm',
                  pathname.startsWith(`/projects/${project.id}`) && 'bg-primary/10 text-primary'
                )}
              >
                <Folder className="h-4 w-4" />
                {project.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-auto w-full items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={mockUser.image ?? undefined} alt={mockUser.name ?? ''} />
                            <AvatarFallback>{mockUser.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{mockUser.name}</span>
                            <span className="text-xs text-muted-foreground">{mockUser.email}</span>
                        </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

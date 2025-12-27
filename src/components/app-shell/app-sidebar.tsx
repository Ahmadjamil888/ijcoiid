'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Folder,
  ChevronDown,
  LogOut,
  Search,
  Star,
  Users,
  Box,
  CircleHelp,
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navTopItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/projects', icon: Folder, label: 'Projects' },
  { href: '/favorites', icon: Star, label: 'Favorites' },
  { href: '/team', icon: Users, label: 'Team' },
];

const navBottomItems = [
  { href: '/deployments', icon: Box, label: 'Deployments' },
  { href: '/help', icon: CircleHelp, label: 'Help & Support' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  const userImage = user?.photoURL;
  const userName = user?.displayName || user?.email;

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden w-16 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <Logo inApp hideText />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-4 p-2">
          {navTopItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'rounded-lg',
                      pathname.startsWith(item.href) &&
                        'bg-primary/20 text-primary'
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4 p-2">
          {navBottomItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'rounded-lg',
                      pathname.startsWith(item.href) &&
                        'bg-primary/20 text-primary'
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleLogout}>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={userImage ?? undefined} alt={userName ?? ''} />
                  <AvatarFallback>
                    {userName?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Log out
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

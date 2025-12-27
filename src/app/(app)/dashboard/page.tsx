'use client';

import { useUser } from '@/firebase';
import { ArrowUp, Paperclip, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
  const { user } = useUser();

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.3), transparent), radial-gradient(ellipse 80% 50% at 50% 120%, hsl(var(--accent) / 0.3), transparent)',
        }}
      ></div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Ready to build, {userName}?
        </h1>
      </div>
      <div className="w-full max-w-3xl pb-8">
        <div className="relative rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur-sm">
          <Input
            placeholder="Ask Pipeline AI to create an ML model for you..."
            className="h-12 border-none bg-transparent pl-4 pr-32 text-base ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent"
          />
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="hidden sm:flex">
              <Sparkles className="mr-2 h-4 w-4" />
              Theme
            </Button>
            <Button size="icon" className="rounded-full">
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

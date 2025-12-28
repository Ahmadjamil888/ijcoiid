'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ArrowUp, Paperclip, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { collection, doc } from 'firebase/firestore';
import { generatePipelineFromPrompt } from '@/ai/flows/generate-pipeline-from-prompt';
import { classifyProjectPrompt } from '@/ai/flows/classify-project-prompt';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/dashboard/project-card';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectGrid = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const projectsQuery = useMemoFirebase(() => (
        user ? collection(firestore, `users/${user.uid}/projects`) : null
    ), [firestore, user]);

    const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

    if (isLoading) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-sm">Use the prompt above to create your first AI project.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !user) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a goal for your ML model.',
      });
      return;
    }

    setIsCreating(true);

    try {
      const sessionRef = doc(collection(firestore, `users/${user.uid}/build-sessions`));

      await setDocumentNonBlocking(sessionRef, {
        id: sessionRef.id,
        prompt,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'initializing',
        messages: [],
        currentStep: 'starting',
      });

      toast({
        title: 'Starting AI Builder!',
        description: 'Redirecting to the build interface...',
      });

      router.push(`/build/${sessionRef.id}`);

    } catch (error: any) {
      console.error("Failed to start build session:", error);
      const description = error.message.includes('GEMINI_API_KEY')
        ? 'Please provide a Gemini API key to enable AI features.'
        : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error Starting Build',
        description,
      });
    } finally {
      setIsCreating(false);
      setPrompt('');
    }
  };


  return (
    <div className="flex h-full flex-col">
       <div
        className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.3), transparent), radial-gradient(ellipse 80% 50% at 50% 120%, hsl(var(--accent) / 0.3), transparent)',
        }}
      ></div>

      <div className="flex-1 space-y-8 p-8 md:space-y-12 md:p-12">
        <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Ready to build, {userName}?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Describe your ML goal. AI Console will autonomously generate the pipeline, write the code, and train your model.
            </p>
        </div>

        <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handlePromptSubmit}>
            <div className="relative rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur-sm">
                <Input
                placeholder="e.g., Build a sentiment analysis model for customer reviews..."
                className="h-12 border-none bg-transparent pl-4 pr-32 text-base ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isCreating}
                />
                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <Button variant="ghost" size="icon" type="button" disabled={isCreating}>
                    <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" type="button" disabled={isCreating}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Button size="icon" className="rounded-full" type="submit" disabled={isCreating}>
                    <ArrowUp className={`h-5 w-5 ${isCreating ? 'animate-spin' : ''}`} />
                </Button>
                </div>
            </div>
            </form>
        </div>
        
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
          <div className="mt-6">
            <ProjectGrid />
          </div>
        </div>

      </div>
    </div>
  );
}

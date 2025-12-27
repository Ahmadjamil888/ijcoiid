'use client';

import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ArrowUp, Paperclip, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { collection, doc } from 'firebase/firestore';
import { generatePipelineFromPrompt } from '@/ai/flows/generate-pipeline-from-prompt';
import { z } from 'zod';
import { suggestNextPipelineStep } from '@/ai/flows/suggest-next-pipeline-step';
import { ai } from '@/ai/genkit';

const TaskTypeSchema = z.enum(['NLP', 'CV', 'Audio', 'Tabular']);

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
      // 1. Use AI to determine task type and name
      const classificationPrompt = await ai.generate({
        prompt: `Classify the following user prompt into one of the task types (NLP, CV, Audio, Tabular) and suggest a short, descriptive project name (3-5 words).

User Prompt: "${prompt}"

Output your response as a JSON object with "taskType" and "projectName" as keys.`,
        output: {
          schema: z.object({
            taskType: TaskTypeSchema,
            projectName: z.string(),
          }),
        },
      });

      const { taskType, projectName } = classificationPrompt.output!;
      
      if (!taskType || !projectName) {
        throw new Error('AI failed to classify the project.');
      }

      // 2. Add the project document to Firestore
      const projectsCollection = collection(firestore, `users/${user.uid}/projects`);
      const newProjectRef = doc(projectsCollection); // Create ref with new ID
      
      await addDocumentNonBlocking(collection(firestore, `users/${user.uid}/projects`), {
        id: newProjectRef.id,
        name: projectName,
        taskType,
        goal: prompt,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        pipelineCount: 1,
        runCount: 0,
        modelCount: 0,
      });

      // 3. Generate the pipeline with AI
      const { pipelineDefinition } = await generatePipelineFromPrompt({ prompt });
      
      // 4. Add the generated pipeline to the project's subcollection
      const pipelinesCollection = collection(firestore, `users/${user.uid}/projects/${newProjectRef.id}/pipelines`);
      const newPipelineRef = doc(pipelinesCollection);
      await addDocumentNonBlocking(pipelinesCollection, {
          id: newPipelineRef.id,
          name: 'Initial AI-Generated Pipeline',
          nodes: pipelineDefinition,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: newProjectRef.id,
          runCount: 0,
          lastRunStatus: undefined,
      });
      
      toast({
        title: 'Project Created!',
        description: `Navigating to your new project: ${projectName}`,
      });

      // 5. Navigate to the new project page
      router.push(`/projects/${newProjectRef.id}`);

    } catch (error: any) {
      console.error("Failed to create project from prompt:", error);
      const description = error.message.includes('GEMINI_API_KEY') 
        ? 'Please provide a Gemini API key to enable AI features.'
        : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error Creating Project',
        description,
      });
    } finally {
      setIsCreating(false);
    }
  };


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
        <form onSubmit={handlePromptSubmit}>
          <div className="relative rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur-sm">
            <Input
              placeholder="Ask Pipeline AI to create an ML model for you..."
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
              <Button variant="ghost" className="hidden sm:flex" type="button" disabled={isCreating}>
                <Sparkles className="mr-2 h-4 w-4" />
                Theme
              </Button>
              <Button size="icon" className="rounded-full" type="submit" disabled={isCreating}>
                <ArrowUp className={`h-5 w-5 ${isCreating ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

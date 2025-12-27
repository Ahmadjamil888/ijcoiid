'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { generatePipelineFromPrompt } from '@/ai/flows/generate-pipeline-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';

export default function CreatePipelineDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const params = useParams<{ projectId: string }>();

  const handleCreatePipeline = async () => {
    if (!user || !params.projectId || !name || !goal) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to create a pipeline.',
      });
      return;
    }

    setIsCreating(true);

    try {
      // 1. Generate the pipeline with AI
      const { pipelineDefinition } = await generatePipelineFromPrompt({
        prompt: goal,
      });

      // 2. Add the generated pipeline to the project's subcollection
      const pipelinesCollection = collection(
        firestore,
        `users/${user.uid}/projects/${params.projectId}/pipelines`
      );
      await addDocumentNonBlocking(pipelinesCollection, {
        name: name,
        nodes: pipelineDefinition, // Assuming the flow returns a parsable JSON string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId: params.projectId,
        runCount: 0,
      });

      toast({
        title: 'Pipeline Created!',
        description: `${name} has been created with AI.`,
      });

      // Reset form and close dialog
      setName('');
      setGoal('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create pipeline:', error);
      if ((error as any).message.includes('GEMINI_API_KEY')) {
        toast({
          variant: 'destructive',
          title: 'AI Feature Disabled',
          description:
            'Please provide a Gemini API key in your environment to enable AI-powered pipeline generation.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Creating Pipeline',
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Pipeline</DialogTitle>
          <DialogDescription>
            Define your pipeline goal. An AI agent will create a baseline
            pipeline for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Pipeline Name</Label>
            <Input
              id="name"
              placeholder="e.g., Data Augmentation v1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal">Pipeline Goal</Label>
            <Textarea
              id="goal"
              placeholder="Describe what this pipeline should do. For example: 'Tokenize text and then train a sentiment analysis model.'"
              className="min-h-[100px]"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreatePipeline} disabled={isCreating}>
            {isCreating ? (
              'Creating...'
            ) : (
              <>
                <Wand2 className="-ml-1 mr-2 h-4 w-4" />
                Create with AI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

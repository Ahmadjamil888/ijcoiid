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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { TaskType } from '@/lib/types';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { generatePipelineFromPrompt } from '@/ai/flows/generate-pipeline-from-prompt';
import { useToast } from '@/hooks/use-toast';

export default function CreateProjectDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setName] = useState('');
  const [taskType, setTaskType] = useState<TaskType | ''>('');
  const [goal, setGoal] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleCreateProject = async () => {
    if (!user || !name || !taskType || !goal) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to create a project.',
      });
      return;
    }
    
    setIsCreating(true);

    try {
      // 1. Add the project document to Firestore
      const projectsCollection = collection(firestore, `users/${user.uid}/projects`);
      const newProjectRef = await addDocumentNonBlocking(projectsCollection, {
        name,
        taskType,
        goal,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        pipelineCount: 1,
        runCount: 0,
        modelCount: 0,
      });

      // 2. Generate the pipeline with AI
      const { pipelineDefinition } = await generatePipelineFromPrompt({ prompt: goal });
      
      // 3. Add the generated pipeline to the project's subcollection
      const pipelinesCollection = collection(firestore, `users/${user.uid}/projects/${newProjectRef.id}/pipelines`);
      await addDocumentNonBlocking(pipelinesCollection, {
          name: 'Initial AI-Generated Pipeline',
          nodes: pipelineDefinition, // Assuming the flow returns a parsable JSON string
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: newProjectRef.id,
          runCount: 0,
          lastRunStatus: undefined,
      });
      
      toast({
        title: 'Project Created!',
        description: `${name} and its initial pipeline have been created with AI.`,
      });

      // Reset form and close dialog
      setName('');
      setTaskType('');
      setGoal('');
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        variant: 'destructive',
        title: 'Error Creating Project',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Define your AI project to get started. An AI agent will create a
            baseline pipeline from your goal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" placeholder="e.g., Customer Churn Predictor" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-type">Task Type</Label>
            <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
              <SelectTrigger id="task-type">
                <SelectValue placeholder="Select a task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NLP">NLP</SelectItem>
                <SelectItem value="CV">Computer Vision (CV)</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Tabular">Tabular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal">Project Goal</Label>
            <Textarea
              id="goal"
              placeholder="Describe your project goal in natural language. For example: 'Analyze customer feedback to find popular feature requests.'"
              className="min-h-[100px]"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject} disabled={isCreating}>
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

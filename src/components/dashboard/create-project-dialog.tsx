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

export default function CreateProjectDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
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
            <Input id="name" placeholder="e.g., Customer Churn Predictor" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-type">Task Type</Label>
            <Select>
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            <Wand2 className="-ml-1 mr-2 h-4 w-4" />
            Create with AI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

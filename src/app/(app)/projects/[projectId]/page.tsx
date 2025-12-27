'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowUp,
  Bot,
  CheckCircle,
  Code,
  FileText,
  Paperclip,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import PipelineCanvas from '@/components/pipeline/pipeline-canvas';
import { useDoc, useUser } from '@/firebase';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useParams } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const TaskItem = ({
  icon,
  title,
  isDone,
}: {
  icon: React.ReactNode;
  title: string;
  isDone: boolean;
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
        isDone
          ? 'bg-primary/20 text-primary'
          : 'bg-secondary text-secondary-foreground'
      }`}
    >
      {icon}
    </div>
    <p
      className={`flex-1 text-sm ${
        isDone ? 'font-medium text-foreground' : 'text-muted-foreground'
      }`}
    >
      {title}
    </p>
    {isDone && <CheckCircle className="h-5 w-5 text-primary" />}
  </div>
);

const ChatMessage = ({
  isUser,
  message,
}: {
  isUser: boolean;
  message: string;
}) => (
  <div className={`flex items-start gap-3 ${isUser ? 'ml-auto' : ''}`}>
    {!isUser && (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bot className="h-5 w-5" />
      </div>
    )}
    <div
      className={`max-w-xs rounded-lg p-3 text-sm ${
        isUser
          ? 'rounded-br-none bg-secondary text-secondary-foreground'
          : 'rounded-bl-none bg-muted'
      }`}
    >
      {message}
    </div>
  </div>
);

const ConsoleSidebar = () => {
  return (
    <aside className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">AI Console</h2>
        <p className="text-sm text-muted-foreground">
          Chat with the agent to build your pipeline.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TaskItem
                icon={<FileText className="h-5 w-5" />}
                title="Analyze Project Goal"
                isDone
              />
              <TaskItem
                icon={<Code className="h-5 w-5" />}
                title="Generate Pipeline Structure"
                isDone
              />
              <TaskItem
                icon={<Wand2 className="h-5 w-5" />}
                title="Select Base Model"
                isDone={false}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 p-4">
          <ChatMessage
            isUser={false}
            message="Hello! I've analyzed your goal and created an initial pipeline structure. What's next?"
          />
          <ChatMessage isUser message="What model did you select?" />
          <ChatMessage
            isUser={false}
            message="Based on your goal of sentiment analysis, I've selected 'distilbert-base-uncased' as a starting point due to its balance of performance and efficiency."
          />
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        <form>
          <div className="relative rounded-lg border bg-background p-2">
            <Input
              placeholder="Ask the AI to make a change..."
              className="border-none bg-transparent pr-20 ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button size="icon" className="rounded-full" type="submit">
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default function ProjectConsolePage() {
  const params = useParams<{ projectId: string }>();
  const { user } = useUser();
  const firestore = useFirestore();

  const projectRef = useMemoFirebase(
    () =>
      user && params.projectId
        ? doc(firestore, `users/${user.uid}/projects/${params.projectId}`)
        : null,
    [firestore, user, params.projectId]
  );

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
      <div className="grid h-full grid-cols-[380px_1fr]">
        <div className="flex flex-col border-r">
          <div className="border-b p-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="border-t p-4">
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground">
            The project you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[380px_1fr]">
      <ConsoleSidebar />
      <div className="flex flex-col p-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.goal}</p>
        </div>
        <div className="flex-1">
          <PipelineCanvas />
        </div>
      </div>
    </div>
  );
}

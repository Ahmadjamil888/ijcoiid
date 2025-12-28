'use client';

import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ChatInterface from '@/components/build/chat-interface';
import BuildStudio from '@/components/build/build-studio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BuildSession = {
  id: string;
  prompt: string;
  userId: string;
  createdAt: string;
  status: string;
  messages: any[];
  currentStep: string;
  pipeline?: any[];
};

export default function BuildPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const sessionRef = useMemo(
    () => (user ? doc(firestore, `users/${user.uid}/build-sessions`, sessionId) : null),
    [firestore, user, sessionId]
  );

  const { data: session, isLoading } = useDoc<BuildSession>(sessionRef);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="w-80 border-l p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Session not found</h2>
          <p className="text-muted-foreground">The build session you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Tabs defaultValue="studio" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="studio">AI Studio</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="studio" className="h-full m-0">
          <BuildStudio
            sessionId={sessionId}
            prompt={session.prompt}
            status={session.status}
            currentStep={session.currentStep}
            pipeline={session.pipeline}
          />
        </TabsContent>
        <TabsContent value="chat" className="h-full m-0">
          <div className="h-full p-4 bg-background">
            <ChatInterface sessionId={sessionId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
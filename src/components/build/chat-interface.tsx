'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, addDoc, onSnapshot, orderBy, query, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { suggestNextPipelineStep } from '@/ai/flows/suggest-next-pipeline-step';
import { plannerAgent } from '@/ai/flows/planner-agent';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export default function ChatInterface({ sessionId }: { sessionId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(firestore, `users/${user.uid}/build-sessions/${sessionId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
    });

    return unsubscribe;
  }, [firestore, user, sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    setIsLoading(true);

    try {
      const messagesRef = collection(firestore, `users/${user.uid}/build-sessions/${sessionId}/messages`);

      // Add user message
      await addDoc(messagesRef, {
        text: input,
        isUser: true,
        timestamp: new Date().toISOString(),
      });

      setInput('');

      // Check if user wants to start the pipeline
      if (input.toLowerCase().includes('start') || input.toLowerCase().includes('build') || input.toLowerCase().includes('run')) {
        // Start the planner agent
        const sessionRef = doc(firestore, `users/${user.uid}/build-sessions`, sessionId);
        const sessionDoc = await getDoc(sessionRef);
        const sessionData = sessionDoc.data();

        if (sessionData) {
          // Add status message
          await addDoc(messagesRef, {
            text: "Starting the AI pipeline... This may take a few minutes.",
            isUser: false,
            timestamp: new Date().toISOString(),
          });

          try {
            // Run planner agent
            const result = await plannerAgent({
              userPrompt: sessionData.prompt || input,
              sessionId,
              userId: user.uid,
            });

            // Add completion message
            await addDoc(messagesRef, {
              text: `Pipeline completed! Model "${result.finalModel.name}" has been trained and deployed.`,
              isUser: false,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Pipeline failed:', error);
            await addDoc(messagesRef, {
              text: "Pipeline failed. Please try again or contact support.",
              isUser: false,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } else {
        // Get AI response
        const response = await suggestNextPipelineStep({
          history: messages.map(m => ({ isUser: m.isUser, text: m.text })),
          projectGoal: 'Build an AI model based on user prompt',
          taskType: 'NLP', // This should be dynamic
        });

        // Add AI response
        await addDoc(messagesRef, {
          text: response.response,
          isUser: false,
          timestamp: new Date().toISOString(),
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                AI is thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your pipeline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
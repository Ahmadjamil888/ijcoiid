'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Code, Database, Cpu, TestTube, Rocket } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface BuildSession {
  id: string;
  prompt: string;
  userId: string;
  createdAt: string;
  status: string;
  messages: any[];
  currentStep: string;
  datasetInfo?: any;
  architectureInfo?: any;
  trainingStats?: any;
  testResults?: any;
  deploymentInfo?: any;
}

interface PreviewSectionProps {
  session: BuildSession;
}

export default function PreviewSection({ session }: PreviewSectionProps) {
  const firestore = useFirestore();
  const [currentSession, setCurrentSession] = useState<BuildSession>(session);

  useEffect(() => {
    const sessionRef = doc(firestore, `users/${session.userId}/build-sessions`, session.id);
    const unsubscribe = onSnapshot(sessionRef, (doc) => {
      if (doc.exists()) {
        setCurrentSession(doc.data() as BuildSession);
      }
    });

    return unsubscribe;
  }, [firestore, session.id, session.userId]);

  const renderStepContent = () => {
    switch (currentSession.currentStep) {
      case 'searching_datasets':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Searching Datasets</h3>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'examining_dataset':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Examining Dataset</h3>
            </div>
            {currentSession.datasetInfo && (
              <div className="space-y-2">
                <p><strong>Dataset:</strong> {currentSession.datasetInfo.name}</p>
                <p><strong>Source:</strong> {currentSession.datasetInfo.source}</p>
                <p><strong>Size:</strong> {currentSession.datasetInfo.size}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sample Values</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSession.datasetInfo.columns?.map((col: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{col.name}</TableCell>
                        <TableCell>{col.type}</TableCell>
                        <TableCell>{col.sample?.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );

      case 'generating_architecture':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Generating Architecture</h3>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Training Model</h3>
            </div>
            {currentSession.trainingStats && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Epoch {currentSession.trainingStats.currentEpoch} / {currentSession.trainingStats.totalEpochs}</span>
                    <span>{Math.round((currentSession.trainingStats.currentEpoch / currentSession.trainingStats.totalEpochs) * 100)}%</span>
                  </div>
                  <Progress value={(currentSession.trainingStats.currentEpoch / currentSession.trainingStats.totalEpochs) * 100} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Loss</p>
                      <p className="text-2xl font-bold">{currentSession.trainingStats.loss?.toFixed(4)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold">{(currentSession.trainingStats.accuracy * 100)?.toFixed(2)}%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Testing Model</h3>
            </div>
            {currentSession.testResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Test Accuracy</p>
                      <p className="text-2xl font-bold">{(currentSession.testResults.accuracy * 100)?.toFixed(2)}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">F1 Score</p>
                      <p className="text-2xl font-bold">{currentSession.testResults.f1Score?.toFixed(4)}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case 'deploying':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Deploying to Hugging Face</h3>
            </div>
            {currentSession.deploymentInfo && (
              <div className="space-y-2">
                <p><strong>Model Name:</strong> {currentSession.deploymentInfo.modelName}</p>
                <p><strong>Status:</strong> <Badge variant="secondary">{currentSession.deploymentInfo.status}</Badge></p>
                {currentSession.deploymentInfo.url && (
                  <p><strong>URL:</strong> <a href={currentSession.deploymentInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{currentSession.deploymentInfo.url}</a></p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Preview will appear here as the AI builds your model</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full p-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <Badge variant="outline" className="w-fit">
            {currentSession.currentStep.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
}

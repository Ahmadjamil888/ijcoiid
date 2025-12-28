'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, AlertCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { plannerAgent } from '@/ai/flows/planner-agent';
import { useUser } from '@/firebase';

type PipelineStep = {
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  logs?: string[];
};

type BuildStudioProps = {
  sessionId: string;
  prompt: string;
  status: string;
  currentStep?: string;
  pipeline?: PipelineStep[];
};

const stepLabels = {
  classify: 'Classify Project',
  dataset: 'Fetch Dataset',
  examine_dataset: 'Examine Dataset',
  preprocessing: 'Preprocessing',
  model_builder: 'Build Model',
  training: 'Training',
  evaluation: 'Evaluation',
  deployment: 'Deployment',
};

export default function BuildStudio({ sessionId, prompt, status, currentStep, pipeline }: BuildStudioProps) {
  const { user } = useUser();
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (pipeline && pipeline.length > 0) {
      setPipelineSteps(pipeline);
    } else {
      // Default pipeline steps
      const steps: PipelineStep[] = [
        { step: 'classify', status: 'pending' },
        { step: 'dataset', status: 'pending' },
        { step: 'examine_dataset', status: 'pending' },
        { step: 'preprocessing', status: 'pending' },
        { step: 'model_builder', status: 'pending' },
        { step: 'training', status: 'pending' },
        { step: 'evaluation', status: 'pending' },
        { step: 'deployment', status: 'pending' },
      ];

      // Update status based on currentStep
      if (currentStep) {
        const currentIndex = steps.findIndex(s => s.step === currentStep);
        if (currentIndex !== -1) {
          steps.forEach((step, index) => {
            if (index < currentIndex) step.status = 'completed';
            else if (index === currentIndex) step.status = 'in_progress';
          });
        }
      }

      setPipelineSteps(steps);
    }
  }, [currentStep, pipeline]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const startPipeline = async () => {
    if (!user) return;

    setIsRunning(true);
    try {
      await plannerAgent({
        userPrompt: prompt,
        sessionId,
        userId: user.uid,
      });

      // The pipeline will be updated via real-time listener in the parent component
    } catch (error) {
      console.error('Pipeline failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const progress = (pipelineSteps.filter(s => s.status === 'completed').length / pipelineSteps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Pipeline Studio</h2>
            <p className="text-slate-300 mb-4">{prompt}</p>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(status)}>{status}</Badge>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span>Progress:</span>
                <Progress value={progress} className="w-32" />
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
          <Button
            onClick={startPipeline}
            disabled={isRunning || status === 'completed'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Start Pipeline'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Pipeline Steps */}
        <div className="w-80 border-r border-slate-700 p-4">
          <h3 className="text-lg font-semibold mb-4">Pipeline Steps</h3>
          <div className="space-y-3">
            {pipelineSteps.map((step, index) => (
              <Card key={step.step} className="bg-slate-800 border-slate-600">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stepLabels[step.step as keyof typeof stepLabels]}</p>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(step.status)}`}>
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Logs and Metrics */}
        <div className="flex-1 p-4">
          <Card className="h-full bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Logs & Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {pipelineSteps.filter(s => s.status !== 'pending').map((step) => (
                    <div key={step.step} className="border-l-2 border-slate-600 pl-4">
                      <h4 className="font-medium text-white mb-2">
                        {stepLabels[step.step as keyof typeof stepLabels]}
                      </h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        {step.logs ? step.logs.map((log, i) => (
                          <p key={i}>{log}</p>
                        )) : (
                          <p>Step {step.status === 'completed' ? 'completed successfully' : 'in progress...'}</p>
                        )}
                      </div>
                      {step.result && (
                        <div className="mt-2 p-2 bg-slate-700 rounded text-xs">
                          <pre className="text-slate-300">{JSON.stringify(step.result, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                  {pipelineSteps.every(s => s.status === 'pending') && (
                    <p className="text-slate-400 text-center">Click "Start Pipeline" to begin building your AI model.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
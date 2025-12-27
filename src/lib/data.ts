import type { Project, Pipeline, PipelineRun, Model, User, ApiKey } from './types';

// This file contains mock data and is no longer the primary source of truth.
// The application now fetches data from Firestore in real-time.
// This data is kept for reference or as a fallback if needed.

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Sentiment Analysis Bot',
    taskType: 'NLP',
    goal: 'Analyze customer feedback from social media to identify common themes and sentiment trends.',
    createdAt: '2024-05-20T10:00:00Z',
    pipelineCount: 2,
    runCount: 15,
    modelCount: 3,
    userId: 'user-1'
  },
  {
    id: 'proj-2',
    name: 'Image Classifier for Manufacturing',
    taskType: 'CV',
    goal: 'Detect defects in product images from a manufacturing line with at least 99% accuracy.',
    createdAt: '2024-05-18T14:30:00Z',
    pipelineCount: 1,
    runCount: 8,
    modelCount: 2,
    userId: 'user-1'
  },
  {
    id: 'proj-3',
    name: 'Customer Churn Prediction',
    taskType: 'Tabular',
    goal: 'Predict which customers are likely to churn in the next quarter based on their usage data and demographics.',
    createdAt: '2024-05-15T09:00:00Z',
    pipelineCount: 3,
    runCount: 22,
    modelCount: 5,
    userId: 'user-1'
  },
];

export const mockPipelines: Pipeline[] = [
  {
    id: 'pipe-1',
    projectId: 'proj-1',
    name: 'BERT Fine-Tuning Pipeline',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2024-05-22T15:00:00Z',
    runCount: 10,
    lastRunStatus: 'success',
  },
  {
    id: 'pipe-2',
    projectId: 'proj-1',
    name: 'DistilBERT Experiment',
    createdAt: '2024-05-21T16:00:00Z',
    updatedAt: '2024-05-21T18:00:00Z',
    runCount: 5,
    lastRunStatus: 'failed',
  },
  {
    id: 'pipe-3',
    projectId: 'proj-2',
    name: 'ResNet50 Transfer Learning',
    createdAt: '2024-05-18T15:00:00Z',
    updatedAt: '2024-05-19T10:00:00Z',
    runCount: 8,
    lastRunStatus: 'success',
  },
];

export const mockRuns: PipelineRun[] = [
  {
    id: 'run-1',
    pipelineId: 'pipe-1',
    projectId: 'proj-1',
    status: 'completed',
    startedAt: '2024-05-22T14:30:00Z',
    endedAt: '2024-05-22T15:00:00Z',
    logCount: 234,
    metrics: { accuracy: 0.92, f1_score: 0.91 },
  },
  {
    id: 'run-2',
    pipelineId: 'pipe-2',
    projectId: 'proj-1',
    status: 'failed',
    startedAt: '2024-05-21T17:50:00Z',
    endedAt: '2024-05-21T18:00:00Z',
    logCount: 150,
  },
  {
    id: 'run-3',
    pipelineId: 'pipe-1',
    projectId: 'proj-1',
    status: 'running',
    startedAt: '2024-05-23T10:00:00Z',
    logCount: 98,
  },
];

export const mockModels: Model[] = [
  {
    id: 'model-1',
    projectId: 'proj-1',
    name: 'sentiment-bert-v3',
    version: '3.0.1',
    createdAt: '2024-05-22T15:00:00Z',
    description: 'Fine-tuned BERT model on latest customer feedback data.',
    metrics: { accuracy: 0.92, f1_score: 0.91, precision: 0.9, recall: 0.92 },
  },
  {
    id: 'model-2',
    projectId: 'proj-2',
    name: 'defect-resnet-v2',
    version: '2.1.0',
    createdAt: '2024-05-19T10:00:00Z',
    description: 'ResNet50 with transfer learning, trained on an augmented dataset.',
    metrics: { accuracy: 0.992, f1_score: 0.99, precision: 0.995, recall: 0.985 },
  },
];

export const mockApiKeys: ApiKey[] = [
    {
        id: 'key-1',
        name: 'Hugging Face',
        hasKey: true,
    },
    {
        id: 'key-2',
        name: 'AWS',
        hasKey: false,
    },
    {
        id: 'key-3',
        name: 'OpenAI',
        hasKey: true,
    }
]

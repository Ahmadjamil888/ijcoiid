export type TaskType = 'NLP' | 'CV' | 'Audio' | 'Tabular';

export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  taskType: TaskType;
  goal: string;
  createdAt: string;
  pipelineCount: number;
  runCount: number;
  modelCount: number;
};

export type PipelineNode = {
  id: string;
  type: string; // e.g., 'datasetNode', 'modelNode'
  data: { label: string; [key: string]: any };
  position: { x: number; y: number };
};

export type Pipeline = {
  id:string;
  name: string;
  projectId: string;
  nodes?: string; // JSON representation of nodes
  createdAt: string;
  updatedAt: string;
  runCount: number;
  lastRunStatus?: 'success' | 'failed' | 'running';
};

export type PipelineRun = {
  id:string;
  pipelineId: string;
  projectId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  endedAt?: string;
  metrics?: Record<string, number | string>;
  logCount: number;
};

export type Model = {
  id: string;
  name: string;
  projectId: string;
  version: string;
  createdAt: string;
  description: string;
  metrics: Record<string, number | string>;
};

export type ApiKey = {
  id: string;
  name: 'Hugging Face' | 'AWS' | 'OpenAI';
  hasKey: boolean;
};

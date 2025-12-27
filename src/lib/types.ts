import { z } from 'zod';

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

// AI Flow Schemas
const TaskTypeSchema = z.enum(['NLP', 'CV', 'Audio', 'Tabular']);

export const ClassifyProjectPromptInputSchema = z.object({
  prompt: z.string().describe("The user's prompt describing the project goal."),
});
export type ClassifyProjectPromptInput = z.infer<typeof ClassifyProjectPromptInputSchema>;

export const ClassifyProjectPromptOutputSchema = z.object({
  taskType: TaskTypeSchema.describe('The classified machine learning task type.'),
  projectName: z.string().describe('A short, descriptive project name (3-5 words).'),
});
export type ClassifyProjectPromptOutput = z.infer<typeof ClassifyProjectPromptOutputSchema>;

// suggest-next-pipeline-step schemas
export const SuggestNextStepInputSchema = z.object({
  history: z
    .array(z.object({ isUser: z.boolean(), text: z.string() }))
    .describe('The conversation history between the user and the AI.'),
  projectGoal: z.string().describe('The overall goal of the AI project.'),
  taskType: TaskTypeSchema.describe('The type of task for the AI project.'),
});
export type SuggestNextStepInput = z.infer<typeof SuggestNextStepInputSchema>;

export const SuggestNextStepOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user query.'),
});
export type SuggestNextStepOutput = z.infer<typeof SuggestNextStepOutputSchema>;

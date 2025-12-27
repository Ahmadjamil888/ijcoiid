'use server';

/**
 * @fileOverview A flow to classify a user prompt for a new project.
 *
 * - classifyProjectPrompt - A function that takes a user prompt and returns the task type and a suggested project name.
 * - ClassifyProjectPromptInput - The input type for the classifyProjectPrompt function.
 * - ClassifyProjectPromptOutput - The return type for the classifyProjectPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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

const classificationPrompt = ai.definePrompt({
  name: 'classifyProjectPrompt',
  input: { schema: ClassifyProjectPromptInputSchema },
  output: { schema: ClassifyProjectPromptOutputSchema },
  prompt: `Classify the following user prompt into one of the task types (NLP, CV, Audio, Tabular) and suggest a short, descriptive project name (3-5 words).

User Prompt: "{{prompt}}"`,
});

export async function classifyProjectPrompt(
  input: ClassifyProjectPromptInput
): Promise<ClassifyProjectPromptOutput> {
  const result = await classificationPrompt(input);
  const output = result.output;
  if (!output) {
    throw new Error('Failed to classify project prompt.');
  }
  return output;
}

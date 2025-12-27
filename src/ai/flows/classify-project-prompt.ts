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
  prompt: z.string().describe('The user\'s prompt describing the project goal.'),
});
export type ClassifyProjectPromptInput = z.infer<typeof ClassifyProjectPromptInputSchema>;

export const ClassifyProjectPromptOutputSchema = z.object({
  taskType: TaskTypeSchema.describe('The classified machine learning task type.'),
  projectName: z.string().describe('A short, descriptive project name (3-5 words).'),
});
export type ClassifyProjectPromptOutput = z.infer<typeof ClassifyProjectPromptOutputSchema>;

export async function classifyProjectPrompt(
  input: ClassifyProjectPromptInput
): Promise<ClassifyProjectPromptOutput> {
  return classifyProjectPromptFlow(input);
}

const classifyProjectPromptFlow = ai.defineFlow(
  {
    name: 'classifyProjectPromptFlow',
    inputSchema: ClassifyProjectPromptInputSchema,
    outputSchema: ClassifyProjectPromptOutputSchema,
  },
  async ({ prompt }) => {
    const classificationPrompt = await ai.generate({
      prompt: `Classify the following user prompt into one of the task types (NLP, CV, Audio, Tabular) and suggest a short, descriptive project name (3-5 words).

User Prompt: "${prompt}"

Output your response as a JSON object with "taskType" and "projectName" as keys.`,
      output: {
        schema: ClassifyProjectPromptOutputSchema,
      },
    });

    const result = classificationPrompt.output;
    if (!result) {
      throw new Error('Failed to classify project prompt.');
    }
    return result;
  }
);

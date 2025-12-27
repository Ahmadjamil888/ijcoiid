'use server';

/**
 * @fileOverview A flow to classify a user prompt for a new project.
 *
 * - classifyProjectPrompt - A function that takes a user prompt and returns the task type and a suggested project name.
 */

import { ai } from '@/ai/genkit';
import {
  ClassifyProjectPromptInputSchema,
  type ClassifyProjectPromptInput,
  ClassifyProjectPromptOutputSchema,
  type ClassifyProjectPromptOutput,
} from '@/lib/types';

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

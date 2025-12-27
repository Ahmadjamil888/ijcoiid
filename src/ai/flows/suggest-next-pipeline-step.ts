'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the next logical step in an ML pipeline.
 *
 * The flow takes the current pipeline state as input and suggests the next step to the user.
 * It exports the SuggestNextPipelineStep function, along with its input and output types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestNextPipelineStepInputSchema = z.object({
  currentPipelineSteps: z
    .array(z.string())
    .describe('The list of current steps in the pipeline.'),
  projectGoal: z.string().describe('The overall goal of the AI project.'),
  taskType: z
    .enum(['NLP', 'CV', 'Audio', 'Tabular'])
    .describe('The type of task for the AI project.'),
});
export type SuggestNextPipelineStepInput = z.infer<
  typeof SuggestNextPipelineStepInputSchema
>;

// Define the output schema
const SuggestNextPipelineStepOutputSchema = z.object({
  suggestedNextStep: z.string().describe('The suggested next step in the pipeline.'),
  reasoning: z.string().describe('The reasoning behind the suggestion.'),
});
export type SuggestNextPipelineStepOutput = z.infer<
  typeof SuggestNextPipelineStepOutputSchema
>;

// Exported function to call the flow
export async function suggestNextPipelineStep(
  input: SuggestNextPipelineStepInput
): Promise<SuggestNextPipelineStepOutput> {
  return suggestNextPipelineStepFlow(input);
}

// Define the prompt
const suggestNextPipelineStepPrompt = ai.definePrompt({
  name: 'suggestNextPipelineStepPrompt',
  input: {schema: SuggestNextPipelineStepInputSchema},
  output: {schema: SuggestNextPipelineStepOutputSchema},
  prompt: `You are an AI pipeline expert. Given the current steps in the pipeline, the project goal, and the task type, suggest the next logical step in the pipeline.

Project Goal: {{{projectGoal}}}
Task Type: {{{taskType}}}
Current Pipeline Steps:
{{#if currentPipelineSteps}}
  {{#each currentPipelineSteps}}- {{{this}}}
  {{/each}}
{{else}}
  None
{{/if}}

Suggest the next step and explain your reasoning.

Output in the following JSON format:
{
  "suggestedNextStep": "<next_step_name>",
  "reasoning": "<reasoning_for_the_suggestion>"
}
`,
});

// Define the flow
const suggestNextPipelineStepFlow = ai.defineFlow(
  {
    name: 'suggestNextPipelineStepFlow',
    inputSchema: SuggestNextPipelineStepInputSchema,
    outputSchema: SuggestNextPipelineStepOutputSchema,
  },
  async input => {
    const {output} = await suggestNextPipelineStepPrompt(input);
    return output!;
  }
);

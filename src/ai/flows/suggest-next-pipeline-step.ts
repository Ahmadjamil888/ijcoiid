'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the next logical step in an ML pipeline.
 *
 * The flow takes the current pipeline state as input and suggests the next step to the user.
 * It exports the suggestNextStep function, along with its input and output types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
export const SuggestNextStepInputSchema = z.object({
  history: z
    .array(z.object({ isUser: z.boolean(), text: z.string() }))
    .describe('The conversation history between the user and the AI.'),
  projectGoal: z.string().describe('The overall goal of the AI project.'),
  taskType: z
    .enum(['NLP', 'CV', 'Audio', 'Tabular'])
    .describe('The type of task for the AI project.'),
});
export type SuggestNextStepInput = z.infer<
  typeof SuggestNextStepInputSchema
>;

// Define the output schema
export const SuggestNextStepOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user query.'),
});
export type SuggestNextStepOutput = z.infer<
  typeof SuggestNextStepOutputSchema
>;

// Exported function to call the flow
export async function suggestNextStep(
  input: SuggestNextStepInput
): Promise<SuggestNextStepOutput> {
  return suggestNextStepFlow(input);
}

// Define the prompt
const suggestNextStepPrompt = ai.definePrompt({
  name: 'suggestNextStepPrompt',
  input: {schema: SuggestNextStepInputSchema},
  output: {schema: SuggestNextStepOutputSchema},
  prompt: `You are an expert AI engineering assistant. Your goal is to guide a user in building an ML pipeline.
You are in a chat interface. Based on the conversation history, project goal, and task type, provide a helpful and concise response to the user's last message.
Guide them on the next logical step.

Project Goal: {{{projectGoal}}}
Task Type: {{{taskType}}}

Conversation History:
{{#each history}}
  {{#if this.isUser}}User: {{else}}AI: {{/if}}{{this.text}}
{{/each}}

Based on the last user message, what is your response?
`,
});

// Define the flow
const suggestNextStepFlow = ai.defineFlow(
  {
    name: 'suggestNextStepFlow',
    inputSchema: SuggestNextStepInputSchema,
    outputSchema: SuggestNextStepOutputSchema,
  },
  async input => {
    const {output} = await suggestNextStepPrompt(input);
    return output!;
  }
);

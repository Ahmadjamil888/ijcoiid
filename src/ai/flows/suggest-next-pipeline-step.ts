'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the next logical step in an ML pipeline.
 *
 * The flow takes the current pipeline state as input and suggests the next step to the user.
 * It exports the suggestNextStep function, along with its input and output types.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestNextStepInputSchema,
  SuggestNextStepOutputSchema,
  type SuggestNextStepInput,
  type SuggestNextStepOutput,
} from '@/lib/types';

// Exported function to call the flow
export async function suggestNextStep(
  input: SuggestNextStepInput
): Promise<SuggestNextStepOutput> {
  const result = await suggestNextStepFlow(input);
  return result;
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
    if (!output) {
      throw new Error('AI failed to provide a response.');
    }
    return output;
  }
);

export async function suggestNextPipelineStep(
  input: SuggestNextStepInput
): Promise<SuggestNextStepOutput> {
  return suggestNextStepFlow(input);
}

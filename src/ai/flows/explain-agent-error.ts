'use server';

/**
 * @fileOverview This flow explains AI agent errors and proposes solutions.
 *
 * - explainAgentError - A function that takes an error message and returns an explanation and proposed solution.
 * - ExplainAgentErrorInput - The input type for the explainAgentError function.
 * - ExplainAgentErrorOutput - The return type for the explainAgentError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAgentErrorInputSchema = z.object({
  errorMessage: z.string().describe('The error message from the AI agent.'),
  codeContext: z.string().optional().describe('The surrounding code context where the error occurred.'),
});
export type ExplainAgentErrorInput = z.infer<typeof ExplainAgentErrorInputSchema>;

const ExplainAgentErrorOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the error.'),
  proposedSolution: z.string().describe('A proposed solution to fix the error.'),
});
export type ExplainAgentErrorOutput = z.infer<typeof ExplainAgentErrorOutputSchema>;

export async function explainAgentError(input: ExplainAgentErrorInput): Promise<ExplainAgentErrorOutput> {
  return explainAgentErrorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAgentErrorPrompt',
  input: {schema: ExplainAgentErrorInputSchema},
  output: {schema: ExplainAgentErrorOutputSchema},
  prompt: `You are an expert AI debugging assistant. Given an error message and code context, explain the error and propose a solution.

Error Message: {{{errorMessage}}}

Code Context (if available): {{{codeContext}}}

Explanation:
Proposed Solution:`,
});

const explainAgentErrorFlow = ai.defineFlow(
  {
    name: 'explainAgentErrorFlow',
    inputSchema: ExplainAgentErrorInputSchema,
    outputSchema: ExplainAgentErrorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

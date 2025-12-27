'use server';

/**
 * @fileOverview Summarizes pipeline run logs, including key metrics and errors.
 *
 * - summarizeRunLogs - A function that summarizes the logs of a pipeline run.
 * - SummarizeRunLogsInput - The input type for the summarizeRunLogs function.
 * - SummarizeRunLogsOutput - The return type for the summarizeRunLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRunLogsInputSchema = z.object({
  logs: z.string().describe('The complete logs from a pipeline run.'),
});
export type SummarizeRunLogsInput = z.infer<typeof SummarizeRunLogsInputSchema>;

const SummarizeRunLogsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the pipeline run logs, including key metrics and errors.'),
});
export type SummarizeRunLogsOutput = z.infer<typeof SummarizeRunLogsOutputSchema>;

export async function summarizeRunLogs(input: SummarizeRunLogsInput): Promise<SummarizeRunLogsOutput> {
  return summarizeRunLogsFlow(input);
}

const summarizeRunLogsPrompt = ai.definePrompt({
  name: 'summarizeRunLogsPrompt',
  input: {schema: SummarizeRunLogsInputSchema},
  output: {schema: SummarizeRunLogsOutputSchema},
  prompt: `You are an AI assistant that specializes in summarizing logs from machine learning pipeline runs.

  Your goal is to provide a concise summary of the run, highlighting key metrics, any errors that occurred, and potential areas for improvement.

  Here are the logs from the pipeline run:
  {{logs}}
  `,
});

const summarizeRunLogsFlow = ai.defineFlow(
  {
    name: 'summarizeRunLogsFlow',
    inputSchema: SummarizeRunLogsInputSchema,
    outputSchema: SummarizeRunLogsOutputSchema,
  },
  async input => {
    const {output} = await summarizeRunLogsPrompt(input);
    return output!;
  }
);

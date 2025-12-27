'use server';

/**
 * @fileOverview An AI agent that suggests improvements to a trained model.
 *
 * - suggestModelImprovements - A function that suggests improvements to a trained model.
 * - SuggestModelImprovementsInput - The input type for the suggestModelImprovements function.
 * - SuggestModelImprovementsOutput - The return type for the suggestModelImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestModelImprovementsInputSchema = z.object({
  taskType: z.enum(['NLP', 'CV', 'Audio', 'Tabular']).describe('The type of ML task.'),
  modelArchitecture: z.string().describe('The architecture of the model that was trained.'),
  currentPerformance: z.string().describe('A description of the current performance of the model, including metrics.'),
  datasetDescription: z.string().describe('A description of the dataset used to train the model.'),
});
export type SuggestModelImprovementsInput = z.infer<typeof SuggestModelImprovementsInputSchema>;

const SuggestModelImprovementsOutputSchema = z.object({
  suggestedImprovements: z.array(z.string()).describe('A list of suggested improvements to the model.'),
  justification: z.string().describe('A justification for the suggested improvements.'),
});
export type SuggestModelImprovementsOutput = z.infer<typeof SuggestModelImprovementsOutputSchema>;

export async function suggestModelImprovements(input: SuggestModelImprovementsInput): Promise<SuggestModelImprovementsOutput> {
  return suggestModelImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestModelImprovementsPrompt',
  input: {schema: SuggestModelImprovementsInputSchema},
  output: {schema: SuggestModelImprovementsOutputSchema},
  prompt: `You are an expert machine learning engineer. You are helping a user improve the performance of their trained model.

Based on the following information, suggest a list of improvements to the model, and justify your suggestions.

Task Type: {{{taskType}}}
Model Architecture: {{{modelArchitecture}}}
Current Performance: {{{currentPerformance}}}
Dataset Description: {{{datasetDescription}}}

Be specific and actionable in your suggestions.
`,
});

const suggestModelImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestModelImprovementsFlow',
    inputSchema: SuggestModelImprovementsInputSchema,
    outputSchema: SuggestModelImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Generates a basic ML pipeline from a natural language prompt.
 *
 * - generatePipelineFromPrompt - A function that generates an ML pipeline based on a user prompt.
 * - GeneratePipelineFromPromptInput - The input type for the generatePipelineFromPrompt function.
 * - GeneratePipelineFromPromptOutput - The return type for the generatePipelineFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePipelineFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A natural language prompt describing the desired ML pipeline.'
    ),
});
export type GeneratePipelineFromPromptInput = z.infer<
  typeof GeneratePipelineFromPromptInputSchema
>;

const GeneratePipelineFromPromptOutputSchema = z.object({
  pipelineDefinition: z
    .string()
    .describe(
      'A JSON string representing the generated ML pipeline definition.'
    ),
});
export type GeneratePipelineFromPromptOutput = z.infer<
  typeof GeneratePipelineFromPromptOutputSchema
>;

export async function generatePipelineFromPrompt(
  input: GeneratePipelineFromPromptInput
): Promise<GeneratePipelineFromPromptOutput> {
  return generatePipelineFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePipelineFromPromptPrompt',
  input: {schema: GeneratePipelineFromPromptInputSchema},
  output: {schema: GeneratePipelineFromPromptOutputSchema},
  prompt: `You are an AI pipeline generator.  You will take a natural language prompt and generate a JSON string representing the ML pipeline definition.

  The pipeline definition should include nodes for:
  - Dataset Fetch
  - Data Validation
  - Preprocessing
  - Model Selection
  - Training
  - Evaluation
  - Optimization
  - Deployment

  Make sure that the JSON is valid and can be parsed.

  Here is the prompt:
  {{{prompt}}} `,
});

const generatePipelineFromPromptFlow = ai.defineFlow(
  {
    name: 'generatePipelineFromPromptFlow',
    inputSchema: GeneratePipelineFromPromptInputSchema,
    outputSchema: GeneratePipelineFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

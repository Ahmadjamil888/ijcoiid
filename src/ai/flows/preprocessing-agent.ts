import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PreprocessingAgentInputSchema = z.object({
  datasetInfo: z.object({
    columns: z.array(z.object({})),
    dtypes: z.record(z.string()),
  }),
  taskType: z.string(),
  suggestedPreprocessing: z.array(z.string()),
});

const PreprocessingAgentOutputSchema = z.object({
  preprocessingSteps: z.array(z.object({
    name: z.string(),
    config: z.record(z.any()),
  })),
  processedDatasetInfo: z.object({
    columns: z.array(z.object({})),
    shape: z.array(z.number()),
  }),
});

export const preprocessingAgent = ai.defineFlow(
  {
    name: 'preprocessingAgent',
    inputSchema: PreprocessingAgentInputSchema,
    outputSchema: PreprocessingAgentOutputSchema,
  },
  async ({ datasetInfo, taskType, suggestedPreprocessing }) => {
    // Use AI to determine preprocessing steps
    const prompt = ai.definePrompt({
      name: 'preprocessingAgentPrompt',
      input: { schema: PreprocessingAgentInputSchema },
      output: { schema: PreprocessingAgentOutputSchema },
      prompt: `You are a Preprocessing Agent. Based on the dataset info and task type, define the preprocessing pipeline.

Dataset Columns: {{datasetInfo.columns}}
Data Types: {{datasetInfo.dtypes}}
Task Type: "{{taskType}}"
Suggested Steps: {{suggestedPreprocessing}}

Define preprocessingSteps as an array of objects with name and config.
Names can be: 'normalize', 'tokenize', 'encode_labels', 'handle_missing', 'scale_features', etc.

Return valid JSON.`,
    });

    const result = await prompt({ datasetInfo, taskType, suggestedPreprocessing });
    return result.output!;
  }
);
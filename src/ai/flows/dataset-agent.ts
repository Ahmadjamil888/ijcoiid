import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DatasetAgentInputSchema = z.object({
  userPrompt: z.string(),
  taskType: z.string(),
});

const DatasetAgentOutputSchema = z.object({
  datasetSource: z.string(), // 'upload', 'hf', 'kaggle', etc.
  datasetName: z.string(),
  datasetUrl: z.string().optional(),
  suggestedPreprocessing: z.array(z.string()),
});

export const datasetAgent = ai.defineFlow(
  {
    name: 'datasetAgent',
    inputSchema: DatasetAgentInputSchema,
    outputSchema: DatasetAgentOutputSchema,
  },
  async ({ userPrompt, taskType }) => {
    // Use AI to determine dataset source and suggestions
    const prompt = ai.definePrompt({
      name: 'datasetAgentPrompt',
      input: { schema: DatasetAgentInputSchema },
      output: { schema: DatasetAgentOutputSchema },
      prompt: `You are a Dataset Agent. Based on the user's prompt and task type, suggest an appropriate dataset.

User Prompt: "{{userPrompt}}"
Task Type: "{{taskType}}"

Suggest:
- datasetSource: 'hf' for Hugging Face, 'upload' for user upload, 'kaggle' for Kaggle, etc.
- datasetName: The name of the dataset
- datasetUrl: URL if applicable
- suggestedPreprocessing: Array of preprocessing steps like 'normalize', 'tokenize', 'encode_labels', etc.

Return valid JSON.`,
    });

    const result = await prompt({ userPrompt, taskType });
    return result.output!;
  }
);
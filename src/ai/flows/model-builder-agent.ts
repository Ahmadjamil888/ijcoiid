import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ModelBuilderAgentInputSchema = z.object({
  taskType: z.string(),
  datasetInfo: z.object({
    shape: z.array(z.number()),
    dtypes: z.record(z.string()),
  }),
  preprocessingSteps: z.array(z.object({
    name: z.string(),
    config: z.record(z.any()),
  })),
});

const ModelBuilderAgentOutputSchema = z.object({
  modelType: z.string(), // 'transformer', 'cnn', 'rnn', 'mlp', etc.
  modelConfig: z.record(z.any()),
  hyperparameters: z.record(z.any()),
  framework: z.string(), // 'pytorch', 'tensorflow', 'sklearn'
});

export const modelBuilderAgent = ai.defineFlow(
  {
    name: 'modelBuilderAgent',
    inputSchema: ModelBuilderAgentInputSchema,
    outputSchema: ModelBuilderAgentOutputSchema,
  },
  async ({ taskType, datasetInfo, preprocessingSteps }) => {
    // Use AI to suggest model architecture
    const prompt = ai.definePrompt({
      name: 'modelBuilderAgentPrompt',
      input: { schema: ModelBuilderAgentInputSchema },
      output: { schema: ModelBuilderAgentOutputSchema },
      prompt: `You are a Model Builder Agent. Based on the task type and dataset info, suggest the best model architecture.

Task Type: "{{taskType}}"
Dataset Shape: {{datasetInfo.shape}}
Data Types: {{datasetInfo.dtypes}}
Preprocessing Steps: {{preprocessingSteps}}

Suggest:
- modelType: The type of model (e.g., 'bert', 'cnn', 'lstm', 'xgboost')
- modelConfig: Model configuration parameters
- hyperparameters: Training hyperparameters like learning_rate, batch_size, epochs
- framework: 'pytorch', 'tensorflow', or 'sklearn'

Return valid JSON.`,
    });

    const result = await prompt({ taskType, datasetInfo, preprocessingSteps });
    return result.output!;
  }
);
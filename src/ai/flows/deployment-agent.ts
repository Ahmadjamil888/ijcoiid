import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DeploymentAgentInputSchema = z.object({
  modelPath: z.string(),
  modelConfig: z.record(z.any()),
  taskType: z.string(),
});

const DeploymentAgentOutputSchema = z.object({
  deploymentType: z.string(), // 'api', 'serverless', 'edge'
  endpointUrl: z.string(),
  apiKey: z.string().optional(),
  usageInstructions: z.string(),
  sdkCode: z.string(),
});

export const deploymentAgent = ai.defineFlow(
  {
    name: 'deploymentAgent',
    inputSchema: DeploymentAgentInputSchema,
    outputSchema: DeploymentAgentOutputSchema,
  },
  async ({ modelPath, modelConfig, taskType }) => {
    // Use AI to determine deployment strategy
    const prompt = ai.definePrompt({
      name: 'deploymentAgentPrompt',
      input: { schema: DeploymentAgentInputSchema },
      output: { schema: DeploymentAgentOutputSchema },
      prompt: `You are a Deployment Agent. Plan the model deployment.

Model Path: "{{modelPath}}"
Model Config: {{modelConfig}}
Task Type: "{{taskType}}"

Suggest:
- deploymentType: 'api' for REST API, 'serverless' for cloud functions, 'edge' for edge deployment
- endpointUrl: The URL where the model will be accessible
- apiKey: If authentication is needed
- usageInstructions: How to use the deployed model
- sdkCode: Sample code for calling the API

Return valid JSON.`,
    });

    const result = await prompt({ modelPath, modelConfig, taskType });
    return result.output!;
  }
);
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ErrorHandlerAgentInputSchema = z.object({
  errorMessage: z.string(),
  context: z.object({
    currentStep: z.string(),
    modelConfig: z.record(z.any()).optional(),
    datasetInfo: z.record(z.any()).optional(),
  }),
});

const ErrorHandlerAgentOutputSchema = z.object({
  diagnosis: z.string(),
  suggestedFix: z.string(),
  retryAction: z.boolean(),
  alternativeConfig: z.record(z.any()).optional(),
});

export const errorHandlerAgent = ai.defineFlow(
  {
    name: 'errorHandlerAgent',
    inputSchema: ErrorHandlerAgentInputSchema,
    outputSchema: ErrorHandlerAgentOutputSchema,
  },
  async ({ errorMessage, context }) => {
    // Use AI to diagnose and suggest fixes for errors
    const prompt = ai.definePrompt({
      name: 'errorHandlerAgentPrompt',
      input: { schema: ErrorHandlerAgentInputSchema },
      output: { schema: ErrorHandlerAgentOutputSchema },
      prompt: `You are an Error Handler Agent. Analyze the error and suggest a fix.

Error: "{{errorMessage}}"
Current Step: "{{context.currentStep}}"
Context: {{context}}

Provide:
- diagnosis: Brief explanation of the error
- suggestedFix: How to fix it
- retryAction: true if should retry after fix, false if need manual intervention
- alternativeConfig: New config if needed

Return valid JSON.`,
    });

    const result = await prompt({ errorMessage, context });
    return result.output!;
  }
);
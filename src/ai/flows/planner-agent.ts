import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { classifyProjectPrompt } from './classify-project-prompt';
import { datasetAgent } from './dataset-agent';
import { examineDataset } from './examine-dataset';
import { preprocessingAgent } from './preprocessing-agent';
import { modelBuilderAgent } from './model-builder-agent';
import { trainModel } from './train-model';
import { testModel } from './test-model';
import { deploymentAgent } from './deployment-agent';

const PlannerAgentInputSchema = z.object({
  userPrompt: z.string(),
  sessionId: z.string(),
  userId: z.string(),
});

const PlannerAgentOutputSchema = z.object({
  pipeline: z.array(z.object({
    step: z.string(),
    status: z.string(),
    result: z.record(z.any()),
  })),
  finalModel: z.record(z.any()),
  deployment: z.record(z.any()),
});

export const plannerAgent = ai.defineFlow(
  {
    name: 'plannerAgent',
    inputSchema: PlannerAgentInputSchema,
    outputSchema: PlannerAgentOutputSchema,
  },
  async ({ userPrompt, sessionId, userId }) => {
    const { firestore } = initializeFirebase();
    const sessionRef = doc(firestore, `users/${userId}/build-sessions`, sessionId);

    const pipeline = [];

    try {
      // Update status to running
      await updateDoc(sessionRef, { status: 'running', currentStep: 'classify' });

      // Step 1: Classify project
      const classification = await classifyProjectPrompt({ prompt: userPrompt });
      pipeline.push({
        step: 'classify',
        status: 'completed',
        result: classification,
      });
      await updateDoc(sessionRef, { currentStep: 'dataset', pipeline });


      // Step 2: Get dataset
      await updateDoc(sessionRef, { currentStep: 'dataset' });
      const datasetResult = await datasetAgent({
        userPrompt,
        taskType: classification.taskType,
      });
      pipeline.push({
        step: 'dataset',
        status: 'completed',
        result: datasetResult,
      });
      await updateDoc(sessionRef, { currentStep: 'preprocessing', pipeline });

      // Step 3: Examine dataset (simulate)
      const datasetInfo = {
        columns: [],
        shape: [1000, 10],
        dtypes: {},
        statistics: {},
      };
      pipeline.push({
        step: 'examine_dataset',
        status: 'completed',
        result: datasetInfo,
      });

      // Step 4: Preprocessing
      const preprocessingResult = await preprocessingAgent({
        datasetInfo,
        taskType: classification.taskType,
        suggestedPreprocessing: datasetResult.suggestedPreprocessing,
      });
      pipeline.push({
        step: 'preprocessing',
        status: 'completed',
        result: preprocessingResult,
      });

      // Step 5: Model building
      const modelResult = await modelBuilderAgent({
        taskType: classification.taskType,
        datasetInfo,
        preprocessingSteps: preprocessingResult.preprocessingSteps,
      });
      pipeline.push({
        step: 'model_builder',
        status: 'completed',
        result: modelResult,
      });

      // Step 6: Training
      await updateDoc(sessionRef, { currentStep: 'training' });
      const trainingResult = await trainModel({
        architecture: { hyperparameters: modelResult.hyperparameters },
        datasetInfo: { name: datasetResult.datasetName, source: datasetResult.datasetSource },
        sessionId,
        userId,
      });
      pipeline.push({
        step: 'training',
        status: 'completed',
        result: trainingResult,
      });
      await updateDoc(sessionRef, { currentStep: 'deployment', pipeline });

      // Step 7: Evaluation
      const evaluationResult = await testModel({
        modelPath: trainingResult.modelPath,
        datasetInfo: { name: datasetResult.datasetName },
        sessionId,
      });
      pipeline.push({
        step: 'evaluation',
        status: 'completed',
        result: evaluationResult,
      });

      // Step 8: Deployment
      const deploymentResult = await deploymentAgent({
        modelPath: trainingResult.modelPath,
        modelConfig: modelResult.modelConfig,
        taskType: classification.taskType,
      });
      pipeline.push({
        step: 'deployment',
        status: 'completed',
        result: deploymentResult,
      });

      await updateDoc(sessionRef, { status: 'completed', currentStep: 'completed' });

      return {
        pipeline,
        finalModel: {
          name: classification.projectName,
          path: trainingResult.modelPath,
          metrics: evaluationResult,
          config: modelResult,
        },
        deployment: deploymentResult,
      };

    } catch (error: any) {
      pipeline.push({
        step: 'error',
        status: 'failed',
        result: { error: error.message },
      });

      await updateDoc(sessionRef, { status: 'failed', currentStep: 'error' });

      return {
        pipeline,
        finalModel: {},
        deployment: {},
      };
    }
  }
);
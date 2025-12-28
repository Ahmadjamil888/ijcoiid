import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PythonShell } from 'python-shell';
import path from 'path';
import { getFirestore } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';

const TrainModelInputSchema = z.object({
  architecture: z.object({
    hyperparameters: z.object({
      epochs: z.number().optional(),
    }).optional(),
  }),
  datasetInfo: z.object({
    name: z.string(),
    source: z.string(),
  }),
  sessionId: z.string(),
  userId: z.string(),
});

const TrainModelOutputSchema = z.object({
  trainingStats: z.object({
    currentEpoch: z.number(),
    totalEpochs: z.number(),
    loss: z.number(),
    accuracy: z.number(),
    history: z.array(z.object({
      epoch: z.number(),
      loss: z.number(),
      accuracy: z.number(),
    })),
  }),
  modelPath: z.string(),
  logs: z.array(z.string()),
});

export const trainModel = ai.defineFlow(
  {
    name: 'trainModel',
    inputSchema: TrainModelInputSchema,
    outputSchema: TrainModelOutputSchema,
  },
  async ({ architecture, datasetInfo, sessionId, userId }) => {
    const firestore = getFirestore();

    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'train_model.py');

      const options = {
        mode: 'json' as const,
        pythonPath: 'python3',
        pythonOptions: ['-u'], // unbuffered output
        scriptPath: path.dirname(scriptPath),
        args: [datasetInfo.name, datasetInfo.source],
      };

      const pyshell = new PythonShell(path.basename(scriptPath), options);

      let trainingStats = {
        currentEpoch: 0,
        totalEpochs: architecture.hyperparameters?.epochs || 50,
        loss: 0,
        accuracy: 0,
        history: [] as { epoch: number; loss: number; accuracy: number }[],
      };

      const logs: string[] = [];

      pyshell.on('message', async (message) => {
        if (message.type === 'training_update') {
          // Update training stats
          trainingStats.currentEpoch = message.epoch;
          trainingStats.loss = message.loss;
          trainingStats.accuracy = message.accuracy;
          trainingStats.history.push({
            epoch: message.epoch,
            loss: message.loss,
            accuracy: message.accuracy,
          });

          logs.push(`Epoch ${message.epoch}/${trainingStats.totalEpochs} - Loss: ${message.loss.toFixed(4)}, Accuracy: ${message.accuracy.toFixed(4)}`);

          // Update Firestore with real-time progress
          const sessionRef = doc(firestore, `users/${userId}/build-sessions`, sessionId);
          await updateDoc(sessionRef, {
            trainingStats,
          });
        }
      });

      pyshell.on('error', (error) => {
        console.error('Python script error:', error);
        logs.push(`Error: ${error.message}`);
      });

      pyshell.on('close', (code: number) => {
        if (code === 0) {
          // Script completed successfully
          logs.push('Training completed successfully');
        } else {
          logs.push(`Training failed with exit code ${code}`);
        }
      });

      pyshell.end((err, code, signal) => {
        if (err) {
          reject(err);
        } else {
          // For now, return simulated results since we can't easily parse the JSON output
          // In production, you'd parse the actual output from the Python script
          resolve({
            trainingStats,
            modelPath: `/tmp/trained_models/${datasetInfo.name.replace(' ', '_').toLowerCase()}`,
            logs,
          });
        }
      });
    });
  }
);

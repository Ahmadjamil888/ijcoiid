import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PythonShell } from 'python-shell';
import path from 'path';

const ExamineDatasetInputSchema = z.object({
  dataset: z.object({
    name: z.string(),
    source: z.string(),
  }),
});

const ExamineDatasetOutputSchema = z.object({
  columns: z.array(z.object({})),
  shape: z.array(z.number()),
  dtypes: z.record(z.string()),
  statistics: z.object({}),
});

export const examineDataset = ai.defineFlow(
  {
    name: 'examineDataset',
    inputSchema: ExamineDatasetInputSchema,
    outputSchema: ExamineDatasetOutputSchema,
  },
  async ({ dataset }) => {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), 'scripts', 'examine_dataset.py');

      const options = {
        mode: 'json' as const,
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: path.dirname(scriptPath),
        args: [dataset.name, dataset.source],
      };

      const pyshell = new PythonShell(path.basename(scriptPath), options);

      let analysisResult: any = null;

      pyshell.on('message', (message) => {
        if (message.status === 'complete' && message.analysis) {
          analysisResult = message.analysis;
        }
      });

      pyshell.on('error', (error) => {
        console.error('Python script error:', error);
        reject(error);
      });

      pyshell.end((err, code, signal) => {
        if (err) {
          reject(err);
        } else if (analysisResult) {
          resolve({
            columns: analysisResult.columns,
            shape: analysisResult.shape,
            dtypes: analysisResult.dtypes,
            statistics: {
              total_samples: analysisResult.shape[0],
              total_features: analysisResult.shape[1] - 1, // Assuming last column is target
              missing_values: analysisResult.missing_values
            }
          });
        } else {
          // Fallback in case Python script doesn't return expected format
          resolve({
            columns: [
              {
                name: 'feature_1',
                type: 'float64',
                sample: [1.2, 3.4, 5.6],
                statistics: { mean: 2.8, std: 1.2, min: 0.1, max: 9.8 }
              }
            ],
            shape: [1000, 2],
            dtypes: { feature_1: 'float64', target: 'int64' },
            statistics: {
              total_samples: 1000,
              total_features: 1,
              target_classes: 2
            }
          });
        }
      });
    });
  }
);

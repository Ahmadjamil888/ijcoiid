import { defineFlow } from '@genkit-ai/core';
import { gemini15Flash } from '@genkit-ai/google-genai';

export const generateArchitecture = defineFlow(
  {
    name: 'generateArchitecture',
    inputSchema: {
      prompt: { type: 'string' },
      datasetInfo: { type: 'object' },
      taskType: { type: 'string' },
    },
    outputSchema: {
      modelType: { type: 'string' },
      layers: { type: 'array', items: { type: 'object' } },
      hyperparameters: { type: 'object' },
      codeSnippet: { type: 'string' },
    },
  },
  async ({ prompt, datasetInfo, taskType }) => {
    // Use AI to generate the model architecture based on the task and dataset

    const llm = gemini15Flash;
    const response = await llm.generate({
      prompt: `Generate a neural network architecture for this ML task: "${prompt}". Task type: ${taskType}. Dataset info: ${JSON.stringify(datasetInfo)}. Return the model type, layers configuration, hyperparameters, and a Python code snippet using PyTorch or TensorFlow in JSON format.`,
    });

    try {
      const architecture = JSON.parse(response.text());
      return architecture;
    } catch (e) {
      // Fallback architecture based on task type
      let fallback = {
        modelType: 'Unknown',
        layers: [],
        hyperparameters: {},
        codeSnippet: '# Generated model code will appear here',
      };

      if (taskType === 'classification') {
        fallback = {
          modelType: 'Feedforward Neural Network',
          layers: [
            { type: 'Linear', input_size: 10, output_size: 64 },
            { type: 'ReLU' },
            { type: 'Linear', input_size: 64, output_size: 32 },
            { type: 'ReLU' },
            { type: 'Linear', input_size: 32, output_size: 2 },
          ],
          hyperparameters: {
            learning_rate: 0.001,
            batch_size: 32,
            epochs: 100,
            optimizer: 'Adam',
          },
          codeSnippet: `
import torch.nn as nn

class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
        self.layers = nn.Sequential(
            nn.Linear(10, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 2)
        )

    def forward(self, x):
        return self.layers(x)
          `,
        };
      } else if (taskType === 'regression') {
        fallback = {
          modelType: 'Regression Neural Network',
          layers: [
            { type: 'Linear', input_size: 10, output_size: 64 },
            { type: 'ReLU' },
            { type: 'Linear', input_size: 64, output_size: 32 },
            { type: 'ReLU' },
            { type: 'Linear', input_size: 32, output_size: 1 },
          ],
          hyperparameters: {
            learning_rate: 0.001,
            batch_size: 32,
            epochs: 100,
            optimizer: 'Adam',
            loss: 'MSELoss',
          },
          codeSnippet: `
import torch.nn as nn

class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
        self.layers = nn.Sequential(
            nn.Linear(10, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        return self.layers(x)
          `,
        };
      }

      return fallback;
    }
  }
);

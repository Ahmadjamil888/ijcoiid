import { defineFlow } from '@genkit-ai/core';
import { gemini15Flash } from '@genkit-ai/google-genai';

export const searchDatasets = defineFlow(
  {
    name: 'searchDatasets',
    inputSchema: {
      prompt: { type: 'string' },
    },
    outputSchema: {
      name: { type: 'string' },
      source: { type: 'string' },
      url: { type: 'string' },
      description: { type: 'string' },
    },
  },
  async ({ prompt }) => {
    // In a real implementation, this would search actual datasets from HF Hub, Kaggle, etc.
    // For now, we'll simulate based on the prompt

    const promptLower = prompt.toLowerCase();

    let dataset = {
      name: 'Unknown Dataset',
      source: 'Unknown',
      url: '',
      description: 'Dataset found based on your prompt',
    };

    if (promptLower.includes('sentiment') || promptLower.includes('review')) {
      dataset = {
        name: 'IMDB Movie Reviews',
        source: 'Hugging Face Hub',
        url: 'https://huggingface.co/datasets/imdb',
        description: 'Large movie review dataset for binary sentiment classification',
      };
    } else if (promptLower.includes('cricket') || promptLower.includes('match') || promptLower.includes('winner')) {
      dataset = {
        name: 'Cricket Match Dataset',
        source: 'Kaggle',
        url: 'https://www.kaggle.com/datasets',
        description: 'Historical cricket match data with team statistics and outcomes',
      };
    } else if (promptLower.includes('iris') || promptLower.includes('flower')) {
      dataset = {
        name: 'Iris Dataset',
        source: 'UCI Machine Learning Repository',
        url: 'https://archive.ics.uci.edu/dataset/53/iris',
        description: 'Classic dataset for classification with 3 classes of iris flowers',
      };
    } else {
      // Use AI to suggest a dataset
      const llm = gemini15Flash;
      const response = await llm.generate({
        prompt: `Based on this ML task: "${prompt}", suggest an appropriate dataset. Return only the dataset name, source, and brief description in JSON format.`,
      });

      try {
        const suggested = JSON.parse(response.text());
        dataset = {
          name: suggested.name || 'Suggested Dataset',
          source: suggested.source || 'Online Repository',
          url: suggested.url || '',
          description: suggested.description || 'Dataset suggested for your task',
        };
      } catch (e) {
        // Fallback
      }
    }

    return dataset;
  }
);

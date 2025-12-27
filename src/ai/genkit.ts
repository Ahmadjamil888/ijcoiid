import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { Plugin } from 'genkit';

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const plugins: Plugin[] = [];

if (geminiApiKey) {
  plugins.push(googleAI({ apiKey: geminiApiKey }));
}


export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});

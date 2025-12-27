import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-run-logs.ts';
import '@/ai/flows/suggest-next-pipeline-step.ts';
import '@/ai/flows/suggest-model-improvements.ts';
import '@/ai/flows/generate-pipeline-from-prompt.ts';
import '@/ai/flows/explain-agent-error.ts';
import '@/ai/flows/classify-project-prompt.ts';

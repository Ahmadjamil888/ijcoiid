# **App Name**: Pipeline AI

## Core Features:

- AI Project Creation: Create a new AI project with project name, task type, and a goal defined in natural language.
- Pipeline Builder: Visually construct ML pipelines with nodes for dataset fetching, preprocessing, model selection, training, evaluation, optimization, and deployment; Nodes will also have input/output/logs and be AI-assisted.
- Autonomous AI Agents: Implement a system of autonomous agents each with specialized roles such as Dataset Agent (fetches real datasets), Data Engineer Agent (cleans data, handles missing values), Training Agent (generates Python training scripts), and Deployment Agent (packages models, deploys to various platforms) which use reasoning tool to incorporate datasets.
- Dynamic Code Generation: Dynamically generate executable Python scripts for data preprocessing, model training, and evaluation without placeholders, utilizing real libraries, and saving outputs properly.
- Realtime Execution Engine: Execute pipelines step-by-step, displaying live logs, and implementing retry logic and failure recovery mechanisms to keep pipelines alive.
- Model Deployment and Inference: Deploy trained models and allow users to test the model within the browser and use the export API endpoint for external use.
- User Authentication and Workspace: Provide secure login using Firebase Auth, allowing users to create and manage AI projects, pipelines, models, and runs in their dedicated workspace.

## Style Guidelines:

- Primary color: Vivid orange (#FF7A00) to convey energy, aligning with the requested design.
- Background color: Near-black (#080605), creating a stark contrast and terminal-like feel.
- Accent color: Light orange (#FF9C35), for interactive elements and highlights to guide the user.
- Body and headline font: 'Inter', a grotesque sans-serif font, will be used for both headlines and body text, providing a modern and neutral aesthetic.
- Minimalist icons, consistent with the terminal-meets-modern aesthetic, will be used to represent different pipeline nodes and actions.
- A dashboard-style layout will be used to present project overviews, pipeline visualizations, and run monitoring interfaces.
- Subtle animations, like progress bars and status indicators, will provide real-time feedback during pipeline execution and AI agent decision-making processes.
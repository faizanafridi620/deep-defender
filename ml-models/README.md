# ML Models for DeepDefender

This directory contains machine learning models and utilities for enhanced malware detection.

## URL Scanner ML Model

Place your trained IPYNB file in this directory and update the configuration in `ml-config.ts`.

### How to use:

1. Add your IPYNB file to this directory
2. Update the API endpoint and key in the environment variables
3. Configure model settings in `ml-config.ts`
4. The URL scanner will automatically combine results from both VirusTotal and your ML model
\`\`\`

Now, let's create a configuration file for the ML model:

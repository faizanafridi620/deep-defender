# Environment Setup for DeepDefender

## Setting Up Your Environment Variables

To run DeepDefender properly, you need to set up your environment variables. Follow these steps:

### 1. Create a `.env` file

Create a file named `.env` in the root directory of your project with the following content:

\`\`\`
# VirusTotal API Key
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here

# ML Model API Configuration
ML_MODEL_API_KEY=demo_ml_model_api_key_123456
ML_MODEL_API_ENDPOINT=https://demo-ml-api-endpoint.com/predict

# Debug mode (set to true to enable debug logging)
DEBUG=true
\`\`\`

### 2. Add Your VirusTotal API Key

Replace `your_virustotal_api_key_here` with your actual VirusTotal API key. You can get a free API key by:

1. Going to [VirusTotal](https://www.virustotal.com/)
2. Creating an account or signing in
3. Clicking on your profile picture in the top-right corner
4. Selecting "API Key" from the dropdown menu
5. Copying your API key

### 3. ML Model API Key

For testing purposes, you can leave the demo ML model API key as is. The application will detect this and use mock data for ML model predictions.

When you're ready to use your own ML model:

1. Replace `demo_ml_model_api_key_123456` with your actual ML model API key
2. Update `https://demo-ml-api-endpoint.com/predict` with your actual ML model API endpoint

### 4. Debug Mode

Set `DEBUG=true` to enable detailed logging, which can help with troubleshooting. In production, you may want to set this to `false`.

## Verifying Your Setup

After setting up your environment variables:

1. Restart your development server
2. Try scanning a URL or file
3. Check the console logs to verify that your API keys are being used correctly

If you see a message about using a demo ML model API key, that's expected if you're using the provided demo key.

## Using Demo Mode

If you don't have a VirusTotal API key or want to test the application without making actual API calls:

1. Leave the `VIRUSTOTAL_API_KEY` empty or use an invalid key
2. The application will automatically use mock data in development and preview environments

This allows you to test the UI and functionality without consuming your API quota.

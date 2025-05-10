# Setting Up Your ML Model API

To integrate your custom ML model with DeepDefender, follow these steps:

## 1. Environment Variables

Add the following environment variables to your Vercel project:

\`\`\`
ML_MODEL_API_KEY=your_ml_model_api_key
ML_MODEL_API_ENDPOINT=https://your-ml-api-endpoint.com/predict
\`\`\`

## 2. API Requirements

Your ML model API should:

- Accept POST requests with JSON body
- Expect a URL parameter in the request body
- Return a JSON response with the following structure:

\`\`\`json
{
  "success": true,
  "prediction": {
    "is_malicious": true|false,
    "confidence": 0.95, // 0-1 value
    "category": "phishing", // optional
    "features": { // optional feature importance
      "feature1": 0.8,
      "feature2": 0.5
    }
  }
}
\`\`\`

## 3. Deploying Your IPYNB File

There are several ways to deploy your notebook as an API:

1. **Jupyter Notebook + Flask**: Convert your notebook to a Flask API
2. **Paperspace**: Deploy directly from notebook
3. **Google Colab + ngrok**: Expose notebook as API
4. **Hugging Face Spaces**: Host notebook with API endpoint
5. **AWS SageMaker**: Deploy as managed endpoint

## 4. Configuration

Update the `ml-config.ts` file to adjust:

- Feature weights between VirusTotal and your ML model
- Malicious threshold
- Category mappings

## 5. Testing

Test your integration by scanning URLs and verifying that both VirusTotal and your ML model results are displayed.

# Setting Up Your VirusTotal API Key

To use the file and URL scanning features in DeepDefender, you need to set up a VirusTotal API key. Follow these steps to get your API key and configure it in the application.

## Getting a VirusTotal API Key

1. Go to [VirusTotal](https://www.virustotal.com/) and create an account or sign in if you already have one.
2. Once logged in, click on your profile picture in the top-right corner and select "API Key" from the dropdown menu.
3. Copy your API key.

## Adding the API Key to Your Project

### For Local Development

1. Create a `.env` file in the root directory of your project by copying the template:

\`\`\`bash
cp .env.template .env
\`\`\`

2. Open the `.env` file and add your VirusTotal API key:

\`\`\`
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
\`\`\`

3. Save the file and restart your development server.

### For Production Deployment

When deploying to Vercel, add the API key as an environment variable:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add a new variable with the name `VIRUSTOTAL_API_KEY` and your API key as the value
4. Save and redeploy your application

## Troubleshooting

If you encounter the "Wrong API key" error:

1. Double-check that you've copied the API key correctly without any extra spaces
2. Ensure the environment variable is named exactly `VIRUSTOTAL_API_KEY`
3. Restart your development server after adding the API key
4. Check if your API key has any usage limitations or has expired

## API Key Limitations

The free VirusTotal API key has some limitations:

- Maximum of 4 requests per minute
- Maximum of 500 requests per day
- Limited to non-commercial use

If you need higher limits, consider upgrading to a premium VirusTotal API plan.

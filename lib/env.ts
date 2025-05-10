/**
 * Environment variable utility
 * Provides a consistent way to access environment variables in both development and production
 */

// Helper function to get environment variables with fallbacks
export function getEnv(key: string, defaultValue = ""): string {
  // For server-side code
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue
  }

  // For client-side code (should only be used with NEXT_PUBLIC_ prefixed variables)
  if (typeof window !== "undefined" && (window as any).__ENV && (window as any).__ENV[key]) {
    return (window as any).__ENV[key]
  }

  return defaultValue
}

// Get VirusTotal API key with validation
export function getVirusTotalApiKey(): string {
  // First try to get from environment variable
  let apiKey = getEnv("VIRUSTOTAL_API_KEY")

  // If not found, try to get from VERCEL_VIRUSTOTAL_API_KEY (sometimes used in Vercel deployments)
  if (!apiKey) {
    apiKey = getEnv("VERCEL_VIRUSTOTAL_API_KEY")
  }

  // If still not found, check for any environment variable that might contain the API key
  if (!apiKey) {
    // Look for any environment variable containing "VIRUSTOTAL" and "API"
    for (const key in process.env) {
      if (key.includes("VIRUSTOTAL") && key.includes("API") && process.env[key]) {
        apiKey = process.env[key] || ""
        console.log(`[ENV] Found potential VirusTotal API key in ${key}`)
        break
      }
    }
  }

  // Log a more helpful error message in debug mode
  if (!apiKey && isDebugMode()) {
    console.error(
      "[ENV] VirusTotal API key is missing. Make sure VIRUSTOTAL_API_KEY is set in your .env file or environment variables.",
    )
  }

  return apiKey
}

// Get ML Model API key
export function getMlModelApiKey(): string {
  const apiKey = getEnv("ML_MODEL_API_KEY")

  // If the API key starts with "demo_", log a message
  if (apiKey && apiKey.startsWith("demo_") && isDebugMode()) {
    console.log("[ENV] Using demo ML Model API key. This will only work with the mock service.")
  }

  return apiKey
}

// Check if using demo ML API key
export function isUsingDemoMlApiKey(): boolean {
  const apiKey = getMlModelApiKey()
  return apiKey && apiKey.startsWith("demo_")
}

// Get ML Model API endpoint
export function getMlModelApiEndpoint(): string {
  return getEnv("ML_MODEL_API_ENDPOINT", "https://your-ml-api-endpoint.com/predict")
}

// Check if debug mode is enabled
export function isDebugMode(): boolean {
  return getEnv("DEBUG", "false").toLowerCase() === "true"
}

// Check if we're in a development environment
export function isDevelopment(): boolean {
  return getEnv("NODE_ENV") === "development" || getEnv("VERCEL_ENV") === "development"
}

// Check if we're in a preview environment
export function isPreview(): boolean {
  return getEnv("VERCEL_ENV") === "preview"
}

// Check if we're in a production environment
export function isProduction(): boolean {
  return getEnv("NODE_ENV") === "production" || getEnv("VERCEL_ENV") === "production"
}

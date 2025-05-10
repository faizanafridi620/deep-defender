import { urlScannerConfig, normalizeScore, categoryMapping } from "./ml-config"
import { getMlModelApiKey, getMlModelApiEndpoint, isDebugMode, isUsingDemoMlApiKey } from "@/lib/env"

/**
 * Interface for ML model response
 */
interface MLModelResponse {
  success: boolean
  prediction: {
    is_malicious: boolean
    confidence: number
    category?: string
    features?: Record<string, number>
  }
  error?: string
}

/**
 * Call the custom ML model API for URL scanning
 */
export async function scanUrlWithML(url: string): Promise<{
  success: boolean
  data?: any
  error?: string
  isDemo?: boolean
}> {
  try {
    // Check if ML model integration is enabled
    if (!urlScannerConfig.enabled) {
      return {
        success: false,
        error: "ML model integration is disabled",
      }
    }

    // Get API key from environment variables
    const apiKey = getMlModelApiKey()
    if (!apiKey) {
      return {
        success: false,
        error: "ML model API key is not configured",
      }
    }

    // Check if using demo API key
    const isDemo = isUsingDemoMlApiKey()
    if (isDemo) {
      if (isDebugMode()) {
        console.log(`[ML Model] Using demo API key for URL scan: ${url}`)
      }

      // Return mock ML model results for demo mode
      return {
        success: true,
        data: getMockMlResults(url),
        isDemo: true,
      }
    }

    // Get API endpoint from environment variables or use default
    const apiEndpoint = getMlModelApiEndpoint()

    // Debug logging
    if (isDebugMode()) {
      console.log(`[ML Model] Scanning URL: ${url}`)
      console.log(`[ML Model] API Endpoint: ${apiEndpoint}`)
    }

    // Call the ML model API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        features: ["url_length", "domain_age", "has_ip", "has_at_symbol", "redirects", "prefix_suffix", "ssl_valid"],
        // Add any other parameters your ML model expects
      }),
    })

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`)
    }

    const result: MLModelResponse = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Unknown error from ML model")
    }

    // Format the ML model results to match our application's format
    const { confidence } = result.prediction
    const { threatLevel } = normalizeScore(confidence)

    // Map the category if available
    const categories = []
    if (result.prediction.category && categoryMapping[result.prediction.category]) {
      categories.push(categoryMapping[result.prediction.category])
    }

    // Generate recommendations based on the prediction
    const recommendations = []
    if (result.prediction.is_malicious) {
      recommendations.push("ML model detected this URL as potentially malicious")
      if (threatLevel === "High") {
        recommendations.push("Strongly advise against visiting this website")
      } else if (threatLevel === "Medium") {
        recommendations.push("Exercise caution when visiting this website")
      } else {
        recommendations.push("Consider the risks before visiting this website")
      }
    } else {
      recommendations.push("ML model indicates this URL is likely safe")
    }

    // Debug logging
    if (isDebugMode()) {
      console.log(`[ML Model] Result:`, {
        is_malicious: result.prediction.is_malicious,
        confidence,
        threatLevel,
      })
    }

    return {
      success: true,
      data: {
        threatDetected: result.prediction.is_malicious,
        threatLevel,
        confidence,
        categories,
        recommendations,
        featureImportance: result.prediction.features || {},
        rawPrediction: result.prediction,
      },
    }
  } catch (error: any) {
    console.error("Error calling ML model:", error)
    return {
      success: false,
      error: error.message || "Failed to get prediction from ML model",
    }
  }
}

/**
 * Generate mock ML model results for demo mode
 */
function getMockMlResults(url: string) {
  // Determine if the URL should be considered malicious based on keywords
  const isMalicious =
    url.includes("malware") ||
    url.includes("phishing") ||
    url.includes("hack") ||
    url.includes("virus") ||
    Math.random() < 0.2 // 20% chance of being flagged as malicious

  // Generate a confidence score
  const confidence = isMalicious
    ? 0.7 + Math.random() * 0.3 // Between 0.7 and 1.0 for malicious
    : Math.random() * 0.3 // Between 0.0 and 0.3 for safe

  // Determine threat level based on confidence
  const { threatLevel } = normalizeScore(confidence)

  // Generate mock feature importance
  const featureImportance = {
    url_length: Math.random() * 0.5,
    domain_age: Math.random() * 0.7,
    has_suspicious_tld: Math.random() * 0.8,
    has_ip_address: Math.random() * 0.9,
    has_at_symbol: Math.random() * 0.4,
    has_double_slash: Math.random() * 0.6,
    has_dash: Math.random() * 0.3,
    has_multiple_subdomains: Math.random() * 0.5,
  }

  // Generate categories
  const categories = []
  if (isMalicious) {
    if (url.includes("phishing") || Math.random() > 0.5) {
      categories.push("Phishing")
    }
    if (url.includes("malware") || Math.random() > 0.7) {
      categories.push("Malware Distribution")
    }
    if (Math.random() > 0.8) {
      categories.push("Scam")
    }
  }

  // Generate recommendations
  const recommendations = []
  if (isMalicious) {
    recommendations.push("ML model detected this URL as potentially malicious")
    if (threatLevel === "High") {
      recommendations.push("Strongly advise against visiting this website")
    } else if (threatLevel === "Medium") {
      recommendations.push("Exercise caution when visiting this website")
    } else {
      recommendations.push("Consider the risks before visiting this website")
    }
  } else {
    recommendations.push("ML model indicates this URL is likely safe")
  }

  return {
    threatDetected: isMalicious,
    threatLevel,
    confidence,
    categories,
    recommendations,
    featureImportance,
    rawPrediction: {
      is_malicious: isMalicious,
      confidence,
      category: categories[0] || null,
    },
  }
}

/**
 * Combine results from VirusTotal and ML model
 */
export function combineResults(vtResults: any, mlResults: any): any {
  // If ML results aren't available, just return VirusTotal results
  if (!mlResults || !mlResults.success) {
    return vtResults
  }

  const mlData = mlResults.data
  const vtData = vtResults.data

  // Calculate combined threat detection using configured weights
  const vtWeight = urlScannerConfig.weights.virusTotal
  const mlWeight = urlScannerConfig.weights.mlModel

  // Calculate VT detection ratio
  const vtDetectionRatio = vtData.detectionEngines.detected / vtData.detectionEngines.total

  // Calculate combined score
  const combinedScore = vtDetectionRatio * vtWeight + mlData.confidence * mlWeight
  const isThreatDetected = combinedScore >= urlScannerConfig.maliciousThreshold || vtData.threatDetected

  // Determine threat level based on combined score
  let threatLevel = "None"
  if (combinedScore >= 0.7) threatLevel = "High"
  else if (combinedScore >= 0.4) threatLevel = "Medium"
  else if (combinedScore >= 0.2) threatLevel = "Low"

  // Combine categories (unique values only)
  const allCategories = [...new Set([...vtData.categories, ...mlData.categories])]

  // Combine recommendations (unique values only)
  const allRecommendations = [...new Set([...vtData.recommendations, ...mlData.recommendations])]

  // Debug logging
  if (isDebugMode()) {
    console.log(`[Combined Results] VT Score: ${vtDetectionRatio}, ML Score: ${mlData.confidence}`)
    console.log(`[Combined Results] Combined Score: ${combinedScore}, Threat Detected: ${isThreatDetected}`)
  }

  // Return combined results
  return {
    ...vtData,
    threatDetected: isThreatDetected,
    threatLevel,
    categories: allCategories,
    recommendations: allRecommendations,
    mlAnalysis: {
      enabled: true,
      confidence: mlData.confidence,
      featureImportance: mlData.featureImportance,
      isDemo: mlResults.isDemo,
    },
    combinedScore,
  }
}

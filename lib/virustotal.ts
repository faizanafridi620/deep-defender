// VirusTotal API utilities
import { getVirusTotalApiKey, isDebugMode, isDevelopment } from "./env"

// Base URL for VirusTotal API v3
const VIRUSTOTAL_API_BASE = "https://www.virustotal.com/api/v3"

// Demo API key for development/preview environments when no real key is available
// This is a placeholder and won't work with the real API
const DEMO_API_KEY = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

// Helper function to get API key from environment variables
export function getApiKey() {
  const apiKey = getVirusTotalApiKey()

  if (!apiKey) {
    if (isDevelopment()) {
      console.warn("[VirusTotal] No API key found. Using demo key for development.")
      return DEMO_API_KEY
    }
    throw new Error("VirusTotal API key is not configured. Please add it to your environment variables.")
  }

  // Log the first few characters of the API key in debug mode
  if (isDebugMode() && apiKey) {
    const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4)
    console.log(`[VirusTotal] Using API key: ${maskedKey}`)
  }

  return apiKey
}

// Helper to validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  // Most VirusTotal API keys are 64 characters long
  if (apiKey.length !== 64) {
    return false
  }

  // Should only contain hexadecimal characters
  const hexRegex = /^[a-f0-9]+$/i
  return hexRegex.test(apiKey)
}

// Helper to format scan results from VirusTotal API
export function formatScanResults(data: any, type: "file" | "url") {
  const attributes = data.attributes
  const stats = attributes.stats || attributes.last_analysis_stats

  // Calculate detection rate
  const detected = stats.malicious + stats.suspicious
  const total = stats.malicious + stats.suspicious + stats.undetected + stats.harmless

  // Get scan date
  const scanDate = attributes.last_analysis_date
    ? new Date(attributes.last_analysis_date * 1000).toISOString()
    : new Date().toISOString()

  // Determine if threat was detected
  const threatDetected = detected > 0

  // Determine threat level based on detection ratio
  let threatLevel = "None"
  const detectionRatio = detected / total
  if (detectionRatio > 0.4) threatLevel = "High"
  else if (detectionRatio > 0.1) threatLevel = "Medium"
  else if (detectionRatio > 0) threatLevel = "Low"

  // Get categories from popular threat categories
  const categories: string[] = []
  if (attributes.popular_threat_classification?.suggested_threat_label) {
    categories.push(attributes.popular_threat_classification.suggested_threat_label)
  }

  if (attributes.popular_threat_classification?.popular_threat_category) {
    attributes.popular_threat_classification.popular_threat_category.forEach((cat: any) => {
      if (!categories.includes(cat.value)) {
        categories.push(cat.value)
      }
    })
  }

  // Generate recommendations based on threat level
  const recommendations = []
  if (threatDetected) {
    if (type === "file") {
      recommendations.push("Delete or quarantine this file immediately")
      recommendations.push("Run a full system scan")
      if (threatLevel === "High") {
        recommendations.push("Consider restoring from a backup if available")
      }
    } else {
      recommendations.push("Avoid visiting this website")
      recommendations.push("Check your system for malware")
      if (threatLevel === "High") {
        recommendations.push("Report this URL to browser security teams")
      }
    }
  } else {
    recommendations.push("No action needed")
  }

  // Common result structure
  const result = {
    scanId: data.id,
    scanDate,
    threatDetected,
    threatLevel,
    detectionEngines: {
      total,
      detected,
    },
    categories: categories.length > 0 ? categories : [],
    recommendations,
    engines: {},
    rawData: data,
  }

  // Add type-specific fields
  if (type === "file") {
    return {
      ...result,
      fileName: attributes.meaningful_name || data.meta?.file_info?.name || "Unknown file",
      fileSize: attributes.size || 0,
      fileType: attributes.type_description || "Unknown",
      md5: attributes.md5 || "",
      sha1: attributes.sha1 || "",
      sha256: attributes.sha256 || "",
      threatName: attributes.popular_threat_classification?.suggested_threat_label || null,
    }
  } else {
    // Extract HTTP response details for URLs
    const httpResponse = attributes.last_http_response || {}
    const htmlInfo = attributes.html_meta || {}

    // Extract cookies (especially PHPSESSID)
    const cookies: Record<string, string> = {}
    if (httpResponse.headers && httpResponse.headers.set_cookie) {
      const cookieHeader = Array.isArray(httpResponse.headers.set_cookie)
        ? httpResponse.headers.set_cookie
        : [httpResponse.headers.set_cookie]

      cookieHeader.forEach((cookie: string) => {
        const parts = cookie.split(";")[0].split("=")
        if (parts.length >= 2) {
          cookies[parts[0].trim()] = parts.slice(1).join("=").trim()
        }
      })
    }

    // Extract meta tags
    const metaTags: Record<string, string> = {}
    if (htmlInfo) {
      Object.keys(htmlInfo).forEach((key) => {
        if (Array.isArray(htmlInfo[key])) {
          metaTags[key] = htmlInfo[key][0]
        } else {
          metaTags[key] = htmlInfo[key]
        }
      })
    }

    return {
      ...result,
      url: attributes.url || data.meta?.url_info?.url || "",
      finalUrl: attributes.last_final_url || attributes.url || "",
      threatType: threatDetected ? "Malicious Website" : null,
      categories: [...categories, ...(attributes.categories ? Object.values(attributes.categories) : [])],

      // HTTP response details
      httpResponse: {
        statusCode: httpResponse.code || null,
        servingIp: attributes.last_serving_ip_address || null,
        bodyLength: httpResponse.body_size || null,
        headers: httpResponse.headers || {},
      },

      // HTML information
      htmlInfo: {
        title: htmlInfo.title ? htmlInfo.title[0] : null,
        metaTags,
        cookies,
      },
    }
  }
}

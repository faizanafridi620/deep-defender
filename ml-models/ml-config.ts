/**
 * Configuration for ML model integration
 */

export const urlScannerConfig = {
  // Enable or disable ML model integration
  enabled: true,

  // Model weights for combined scoring
  weights: {
    virusTotal: 0.6, // Weight for VirusTotal results
    mlModel: 0.4, // Weight for custom ML model results
  },

  // Threshold for ML model to consider a URL malicious (0-1)
  maliciousThreshold: 0.7,

  // Feature importance for explainability
  showFeatureImportance: true,
}

// Map ML model categories to standardized categories
export const categoryMapping: Record<string, string> = {
  phishing: "Phishing",
  malware: "Malware Distribution",
  spam: "Spam",
  scam: "Scam",
  cryptojacking: "Cryptojacking",
  suspicious: "Suspicious",
  // Add more mappings as needed
}

// Helper function to normalize ML model scores to match VirusTotal format
export function normalizeScore(score: number): {
  threatLevel: string
  confidence: number
} {
  let threatLevel = "None"

  if (score >= 0.9) threatLevel = "High"
  else if (score >= 0.7) threatLevel = "Medium"
  else if (score >= 0.5) threatLevel = "Low"

  return {
    threatLevel,
    confidence: score,
  }
}

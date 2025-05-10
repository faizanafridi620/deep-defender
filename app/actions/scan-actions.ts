"use server"

import { getApiKey, formatScanResults, isValidApiKeyFormat } from "@/lib/virustotal"
import { scanUrlWithML, combineResults } from "@/ml-models/url-scanner-ml"
import { urlScannerConfig } from "@/ml-models/ml-config"
import { isDebugMode, isDevelopment, isPreview } from "@/lib/env"
import { getMockFileScanResults, getMockUrlScanResults } from "@/lib/mock-virustotal"

// Base URL for VirusTotal API v3
const VIRUSTOTAL_API_BASE = "https://www.virustotal.com/api/v3"

// Flag to use mock data when API key is missing or in development/preview
const USE_MOCK_DATA = true

/**
 * Scan a URL using both VirusTotal API and custom ML model
 */
export async function scanUrl(url: string) {
  try {
    // Check if we should use mock data
    let apiKey
    try {
      apiKey = getApiKey()
    } catch (error) {
      if (USE_MOCK_DATA && (isDevelopment() || isPreview())) {
        console.log("[scanUrl] Using mock data for URL scan")
        return {
          success: true,
          data: getMockUrlScanResults(url),
          isMock: true,
        }
      } else {
        throw error
      }
    }

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      if (USE_MOCK_DATA && (isDevelopment() || isPreview())) {
        console.log("[scanUrl] Invalid API key format. Using mock data for URL scan")
        return {
          success: true,
          data: getMockUrlScanResults(url),
          isMock: true,
        }
      } else {
        throw new Error("Invalid VirusTotal API key format. Please check your API key.")
      }
    }

    // Step 1: Scan with VirusTotal
    const vtResult = await scanUrlWithVirusTotal(url)

    // Step 2: If ML model is enabled, scan with ML model and combine results
    if (urlScannerConfig.enabled) {
      try {
        const mlResult = await scanUrlWithML(url)

        if (vtResult.success && mlResult.success) {
          // Combine results from both sources
          const combinedResults = combineResults(vtResult, mlResult)
          return {
            success: true,
            data: combinedResults,
            mlEnabled: true,
          }
        }
      } catch (mlError) {
        console.error("Error with ML model scan:", mlError)
        // If ML scan fails, continue with just VirusTotal results
      }
    }

    // Return VirusTotal results if ML is disabled or failed
    return vtResult
  } catch (error: any) {
    console.error("Error scanning URL:", error)
    return {
      success: false,
      error: error.message || "Failed to scan URL",
    }
  }
}

/**
 * Scan a URL using VirusTotal API
 */
async function scanUrlWithVirusTotal(url: string) {
  try {
    // Get API key with validation
    let apiKey
    try {
      apiKey = getApiKey()
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "API key error",
      }
    }

    // Step 1: Submit URL for scanning
    const submitResponse = await fetch(`${VIRUSTOTAL_API_BASE}/urls`, {
      method: "POST",
      headers: {
        "x-apikey": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `url=${encodeURIComponent(url)}`,
    })

    if (!submitResponse.ok) {
      let errorMessage = `Failed to submit URL: ${submitResponse.statusText}`
      try {
        const errorData = await submitResponse.json()
        errorMessage = `Failed to submit URL: ${errorData.error?.message || submitResponse.statusText}`
      } catch (e) {
        // If we can't parse the error JSON, just use the status text
      }
      throw new Error(errorMessage)
    }

    const submitData = await submitResponse.json()
    const analysisId = submitData.data.id

    // Step 2: Wait for analysis to complete (with timeout)
    let analysisComplete = false
    let analysisData
    let attempts = 0
    const maxAttempts = 20
    const baseDelay = 1000

    while (!analysisComplete && attempts < maxAttempts) {
      attempts++
      if(attempts > 0){
        // Wait before checking status
        const delay = baseDelay * Math.pow(2, attempts - 1) // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 3000))) // Max delay of 3 seconds
      }

      const analysisResponse = await fetch(`${VIRUSTOTAL_API_BASE}/analyses/${analysisId}`, {
        headers: {
          "x-apikey": apiKey,
        },
      })

      if (!analysisResponse.ok) {
        let errorMessage = `Failed to get analysis: ${analysisResponse.statusText}`
        try {
          const errorData = await analysisResponse.json()
          errorMessage = `Failed to get analysis: ${errorData.error?.message || analysisResponse.statusText}`
        } catch (e) {
          // If we can't parse the error JSON, just use the status text
        }
        throw new Error(errorMessage)
      }

      analysisData = await analysisResponse.json()

      if (analysisData.data.attributes.status === "completed") {
        analysisComplete = true
      }
    }

    if (!analysisComplete) {
      throw new Error("Analysis timed out. Please try again later.")
    }

    // Step 3: Get the URL report using the URL ID
    const urlId = analysisData.meta.url_info.id
    const urlResponse = await fetch(`${VIRUSTOTAL_API_BASE}/urls/${urlId}`, {
      headers: {
        "x-apikey": apiKey,
      },
    })

    if (!urlResponse.ok) {
      let errorMessage = `Failed to get URL report: ${urlResponse.statusText}`
      try {
        const errorData = await urlResponse.json()
        errorMessage = `Failed to get URL report: ${errorData.error?.message || urlResponse.statusText}`
      } catch (e) {
        // If we can't parse the error JSON, just use the status text
      }
      throw new Error(errorMessage)
    }

    const urlData = await urlResponse.json()

    // Format the results
    return {
      success: true,
      data: formatScanResults(urlData.data, "url"),
    }
  } catch (error: any) {
    console.error("Error scanning URL with VirusTotal:", error)
    return {
      success: false,
      error: error.message || "Failed to scan URL with VirusTotal",
    }
  }
}

/**
 * Get a file report using VirusTotal API
 */
export async function getFileReport(hash: string) {
  try {
    // Get API key with validation
    let apiKey
    try {
      apiKey = getApiKey()
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "API key error",
      }
    }

    const response = await fetch(`${VIRUSTOTAL_API_BASE}/files/${hash}`, {
      headers: {
        "x-apikey": apiKey,
      },
    })

    if (response.status === 404) {
      return { success: false, error: "File not found in VirusTotal database" }
    }

    if (!response.ok) {
      let errorMessage = `Failed to get file report: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = `Failed to get file report: ${errorData.error?.message || response.statusText}`
      } catch (e) {
        // If we can't parse the error JSON, just use the status text
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()

    return {
      success: true,
      data: formatScanResults(data.data, "file"),
    }
  } catch (error: any) {
    console.error("Error getting file report:", error)
    return {
      success: false,
      error: error.message || "Failed to get file report",
    }
  }
}

/**
 * Upload and scan a file using VirusTotal API
 */
export async function scanFile(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Check if we should use mock data
    let apiKey
    try {
      apiKey = getApiKey()
    } catch (error) {
      if (USE_MOCK_DATA && (isDevelopment() || isPreview())) {
        console.log("[scanFile] Using mock data for file scan")
        return {
          success: true,
          data: getMockFileScanResults(file),
          isMock: true,
        }
      } else {
        throw error
      }
    }

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      if (USE_MOCK_DATA && (isDevelopment() || isPreview())) {
        console.log("[scanFile] Invalid API key format. Using mock data for file scan")
        return {
          success: true,
          data: getMockFileScanResults(file),
          isMock: true,
        }
      } else {
        throw new Error("Invalid VirusTotal API key format. Please check your API key.")
      }
    }

    // Debug logging
    if (isDebugMode()) {
      console.log(`[scanFile] Scanning file: ${file.name}, size: ${file.size} bytes`)
    }

    // Step 1: Get upload URL
    if (isDebugMode()) {
      console.log("[scanFile] Getting upload URL...")
    }

    const urlResponse = await fetch(`${VIRUSTOTAL_API_BASE}/files/upload_url`, {
      headers: {
        "x-apikey": apiKey,
      },
    })

    // Debug response status
    if (isDebugMode()) {
      console.log(`[scanFile] Upload URL response status: ${urlResponse.status} ${urlResponse.statusText}`)
    }

    if (!urlResponse.ok) {
      let errorMessage = `Failed to get upload URL: ${urlResponse.statusText}`
      try {
        const errorData = await urlResponse.json()
        errorMessage = `Failed to get upload URL: ${errorData.error?.message || urlResponse.statusText}`

        // Debug error details
        if (isDebugMode()) {
          console.error("[scanFile] Error details:", errorData)
        }
      } catch (e) {
        // If we can't parse the error JSON, just use the status text
        if (isDebugMode()) {
          console.error("[scanFile] Could not parse error response:", e)
        }
      }
      throw new Error(errorMessage)
    }

    const urlData = await urlResponse.json()
    const uploadUrl = urlData.data

    // Debug upload URL
    if (isDebugMode()) {
      console.log(`[scanFile] Got upload URL: ${uploadUrl.substring(0, 30)}...`)
    }

    // Step 2: Upload file
    if (isDebugMode()) {
      console.log("[scanFile] Uploading file...")
    }

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "x-apikey": apiKey,
      },
      body: uploadFormData,
    })

    // Debug response status
    if (isDebugMode()) {
      console.log(`[scanFile] Upload response status: ${uploadResponse.status} ${uploadResponse.statusText}`)
    }

    if (!uploadResponse.ok) {
      let errorMessage = `Failed to upload file: ${uploadResponse.statusText}`
      try {
        const errorData = await uploadResponse.json()
        errorMessage = `Failed to upload file: ${errorData.error?.message || uploadResponse.statusText}`

        // Debug error details
        if (isDebugMode()) {
          console.error("[scanFile] Error details:", errorData)
        }
      } catch (e) {
        // If we can't parse the error JSON, just use the status text
        if (isDebugMode()) {
          console.error("[scanFile] Could not parse error response:", e)
        }
      }
      throw new Error(errorMessage)
    }

    const uploadData = await uploadResponse.json()
    const analysisId = uploadData.data.id

    // Debug analysis ID
    if (isDebugMode()) {
      console.log(`[scanFile] Analysis ID: ${analysisId}`)
    }

    // Step 3: Wait for analysis to complete (with timeout)
    if (isDebugMode()) {
      console.log("[scanFile] Waiting for analysis to complete...")
    }

    let analysisComplete = false
    let analysisData
    let attempts = 0
    const maxAttempts = 20 // More attempts for file analysis
    const baseDelay = 1000 // Base delay for exponential backoff

    while (!analysisComplete && attempts < maxAttempts) {
      attempts++
      if(attempts > 0){
        // Wait before checking status
        const delay = baseDelay * Math.pow(2, attempts - 1) // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 3000))) // Max delay of 3 seconds
      }

      // Debug attempt number
      if (isDebugMode()) {
        console.log(`[scanFile] Checking analysis status, attempt ${attempts}/${maxAttempts}`)
      }

      const analysisResponse = await fetch(`${VIRUSTOTAL_API_BASE}/analyses/${analysisId}`, {
        headers: {
          "x-apikey": apiKey,
        },
      })

      // Debug response status
      if (isDebugMode()) {
        console.log(`[scanFile] Analysis status response: ${analysisResponse.status} ${analysisResponse.statusText}`)
      }

      if (!analysisResponse.ok) {
        let errorMessage = `Failed to get analysis: ${analysisResponse.statusText}`
        try {
          const errorData = await analysisResponse.json()
          errorMessage = `Failed to get analysis: ${errorData.error?.message || analysisResponse.statusText}`

          // Debug error details
          if (isDebugMode()) {
            console.error("[scanFile] Error details:", errorData)
          }
        } catch (e) {
          // If we can't parse the error JSON, just use the status text
          if (isDebugMode()) {
            console.error("[scanFile] Could not parse error response:", e)
          }
        }
        throw new Error(errorMessage)
      }

      analysisData = await analysisResponse.json()

      // Debug analysis status
      if (isDebugMode()) {
        console.log(`[scanFile] Analysis status: ${analysisData.data.attributes.status}`)
      }

      if (analysisData.data.attributes.status === "completed") {
        analysisComplete = true
      }
    }

    if (!analysisComplete) {
      throw new Error("Analysis timed out. Please try again later.")
    }

    // Step 4: Get the file hash and retrieve the full report
    const fileHash = analysisData.meta.file_info.sha256

    // Debug file hash
    if (isDebugMode()) {
      console.log(`[scanFile] File hash: ${fileHash}`)
    }

    return await getFileReport(fileHash)
  } catch (error: any) {
    console.error("Error scanning file:", error)
    return {
      success: false,
      error: error.message || "Failed to scan file",
    }
  }
}

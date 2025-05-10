/**
 * Mock VirusTotal service for development and preview environments
 * This allows testing the UI without a real VirusTotal API key
 */

// Mock file scan results
export function getMockFileScanResults(file: File) {
  const isMalicious =
    file.name.toLowerCase().includes("malware") || file.name.toLowerCase().includes("virus") || Math.random() < 0.2 // 20% chance of being flagged as malicious

  const fileType = getFileType(file.name)
  const scanDate = new Date().toISOString()

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType,
    scanDate,
    threatDetected: isMalicious,
    threatLevel: isMalicious ? (Math.random() < 0.5 ? "High" : "Medium") : "None",
    detectionEngines: {
      total: 70,
      detected: isMalicious ? Math.floor(Math.random() * 30) + 10 : 0,
    },
    categories: isMalicious ? ["Trojan", "Spyware"] : [],
    recommendations: isMalicious
      ? ["Delete or quarantine this file immediately", "Run a full system scan"]
      : ["No action needed"],
    md5: generateRandomHash(32),
    sha1: generateRandomHash(40),
    sha256: generateRandomHash(64),
    threatName: isMalicious ? "Generic.Malware.Detection" : null,
  }
}

// Mock URL scan results
export function getMockUrlScanResults(url: string) {
  const isMalicious = url.includes("malware") || url.includes("phishing") || Math.random() < 0.2 // 20% chance of being flagged as malicious

  const scanDate = new Date().toISOString()

  return {
    url,
    finalUrl: url,
    scanDate,
    threatDetected: isMalicious,
    threatLevel: isMalicious ? (Math.random() < 0.5 ? "High" : "Medium") : "None",
    detectionEngines: {
      total: 70,
      detected: isMalicious ? Math.floor(Math.random() * 30) + 10 : 0,
    },
    categories: isMalicious ? ["Phishing", "Malware"] : [],
    recommendations: isMalicious
      ? ["Avoid visiting this website", "Check your system for malware"]
      : ["No action needed"],
    threatType: isMalicious ? "Malicious Website" : null,
    httpResponse: {
      statusCode: 200,
      servingIp: "192.168.1.1",
      bodyLength: 45678,
      headers: {
        "content-type": "text/html",
        server: "Apache",
        "x-powered-by": "PHP/7.4.3",
      },
    },
    htmlInfo: {
      title: "Example Website",
      metaTags: {
        description: "This is a mock website description",
        keywords: "mock, example, test",
      },
      cookies: {
        session: "abc123",
        user_id: "12345",
      },
    },
  }
}

// Helper functions
function getFileType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "exe":
      return "Win32 EXE"
    case "pdf":
      return "PDF document"
    case "doc":
    case "docx":
      return "Microsoft Word Document"
    case "xls":
    case "xlsx":
      return "Microsoft Excel Document"
    case "zip":
      return "ZIP archive"
    case "rar":
      return "RAR archive"
    case "js":
      return "JavaScript file"
    case "html":
      return "HTML document"
    default:
      return "Unknown"
  }
}

function generateRandomHash(length: number): string {
  const characters = "abcdef0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

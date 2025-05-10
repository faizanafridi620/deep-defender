"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileUp, Loader2, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardHeader from "@/components/dashboard-header"
import { ScanResults } from "@/components/scan-results"
import { scanFile } from "@/app/actions/scan-actions"
import { isDevelopment, isPreview } from "@/lib/env"

export default function FileScannerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults(null)
      setError(null)
      setApiKeyMissing(false)
      setUsingMockData(false)
    }
  }

  const handleScan = async () => {
    if (!file) return

    try {
      setScanning(true)
      setProgress(0)
      setError(null)
      setApiKeyMissing(false)
      setUsingMockData(false)

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Cap at 90% until we get actual results
          if (prev >= 90) return 90
          return prev + (100 - prev) * 0.05
        })
      }, 500)

      // Create form data with the file
      const formData = new FormData()
      formData.append("file", file)

      // Call the server action to scan the file
      const response = await scanFile(formData)

      clearInterval(progressInterval)

      if (response.success) {
        setResults(response.data)
        setActiveTab("results")
        setProgress(100)

        // Check if we're using mock data
        if (response.isMock) {
          setUsingMockData(true)
        }
      } else {
        // Check if the error is related to API key
        if (
          response.error &&
          (response.error.includes("API key") ||
            response.error.includes("Wrong API key") ||
            response.error.includes("not configured"))
        ) {
          setApiKeyMissing(true)
        }

        setError(response.error || "Failed to scan file")
        setProgress(0)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setProgress(0)
    } finally {
      setScanning(false)
    }
  }

  const resetScan = () => {
    setFile(null)
    setResults(null)
    setProgress(0)
    setError(null)
    setApiKeyMissing(false)
    setUsingMockData(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResults(null)
      setError(null)
      setApiKeyMissing(false)
      setUsingMockData(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">File Scanner</h1>
            <p className="text-muted-foreground">Upload files to scan for malware and other security threats</p>
          </div>

          {apiKeyMissing && (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Key Missing or Invalid</AlertTitle>
              <AlertDescription>
                <p>The VirusTotal API key is missing or invalid. Please check your environment variables.</p>
                <p className="mt-2">
                  Make sure you have added the <code className="bg-muted px-1 py-0.5 rounded">VIRUSTOTAL_API_KEY</code>{" "}
                  to your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file.
                </p>
                {(isDevelopment() || isPreview()) && (
                  <p className="mt-2">
                    In development and preview environments, mock data will be used for demonstration purposes.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {usingMockData && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Using Demo Mode</AlertTitle>
              <AlertDescription>
                <p>
                  DeepDefender is currently running in demo mode with simulated scan results. For full functionality,
                  please add a valid VirusTotal API key to your environment variables.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>
                Results
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Scan File</CardTitle>
                  <CardDescription>Upload a file to scan for malware, viruses, and other threats</CardDescription>
                </CardHeader>
                <CardContent>
                  {!file ? (
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop a file here, or click to select
                      </p>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">Select File</label>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileUp className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={resetScan}>
                          Change
                        </Button>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {scanning && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Scanning...</p>
                            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetScan} disabled={!file || scanning}>
                    Reset
                  </Button>
                  <Button className="bg-lime-800 hover:bg-lime-700 text-white" onClick={handleScan} disabled={!file || scanning}>
                    {scanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning
                      </>
                    ) : (
                      "Start Scan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="results">
              {results && <ScanResults results={results} type="file" isMock={usingMockData} />}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

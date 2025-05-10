import {
  AlertTriangle,
  CheckCircle,
  Shield,
  FileText,
  Globe,
  Calendar,
  AlertCircle,
  ExternalLink,
  Server,
  Code,
  FileCode,
  BarChart,
  Brain,
  Info,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ScanResultsProps {
  results: any
  type: "file" | "url"
  isMock?: boolean
}

export function ScanResults({ results, type, isMock = false }: ScanResultsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  const detectionRate = (results.detectionEngines.detected / results.detectionEngines.total) * 100

  // Check if ML analysis is available
  const hasMLAnalysis = type === "url" && results.mlAnalysis && results.mlAnalysis.enabled

  return (
    <div className="space-y-6">
      {isMock && (
        <Alert variant="default" className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You are viewing simulated scan results. For real scanning, please add a valid VirusTotal API key.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className={`rounded-full p-2 ${results.threatDetected ? "bg-red-100" : "bg-green-100"}`}>
            {results.threatDetected ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">
              {results.threatDetected ? "Threat Detected" : "No Threats Found"}
            </CardTitle>
            <CardDescription>
              {results.threatDetected
                ? `This ${type} contains potentially harmful content`
                : `This ${type} appears to be safe`}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Badge
              variant={
                results.threatLevel === "High"
                  ? "destructive"
                  : results.threatLevel === "Medium"
                    ? "default"
                    : results.threatLevel === "Low"
                      ? "outline"
                      : "outline"
              }
            >
              {results.threatLevel} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">{type === "file" ? "File Name" : "URL"}</div>
              <div className="flex items-center gap-2 font-medium">
                {type === "file" ? (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="break-all">{type === "file" ? results.fileName : results.url}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Scan Date</div>
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(results.scanDate)}
              </div>
            </div>
          </div>

          {type === "file" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">File Size</div>
                <div className="font-medium">{(results.fileSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">File Type</div>
                <div className="font-medium">{results.fileType || "Unknown"}</div>
              </div>
            </div>
          )}

          {type === "url" && (
            <Tabs defaultValue={hasMLAnalysis ? "combined-analysis" : "http-response"} className="w-full">
              <TabsList>
                {hasMLAnalysis && <TabsTrigger value="combined-analysis">Combined Analysis</TabsTrigger>}
                <TabsTrigger value="http-response">HTTP Response</TabsTrigger>
                <TabsTrigger value="html-info">HTML Info</TabsTrigger>
              </TabsList>

              {hasMLAnalysis && (
                <TabsContent value="combined-analysis" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium">ML Model Enhanced Analysis</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">ML Confidence Score</div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={results.mlAnalysis.confidence * 100}
                          className="h-2"
                          indicatorClassName={
                            results.mlAnalysis.confidence > 0.7
                              ? "bg-red-500"
                              : results.mlAnalysis.confidence > 0.4
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }
                        />
                        <span className="text-sm font-medium">{Math.round(results.mlAnalysis.confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Combined Risk Score</div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={results.combinedScore * 100}
                          className="h-2"
                          indicatorClassName={
                            results.combinedScore > 0.7
                              ? "bg-red-500"
                              : results.combinedScore > 0.4
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }
                        />
                        <span className="text-sm font-medium">{Math.round(results.combinedScore * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {results.mlAnalysis.featureImportance &&
                    Object.keys(results.mlAnalysis.featureImportance).length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="feature-importance">
                          <AccordionTrigger className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <BarChart className="h-4 w-4" />
                              Feature Importance
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {Object.entries(results.mlAnalysis.featureImportance)
                                .sort((a, b) => b[1] - a[1])
                                .map(([feature, importance]) => (
                                  <div key={feature} className="flex items-center gap-2">
                                    <div className="w-40 truncate text-sm">{feature}</div>
                                    <Progress value={Number(importance) * 100} className="h-2 flex-1" />
                                    <div className="text-xs w-10 text-right">
                                      {(Number(importance) * 100).toFixed(1)}%
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                </TabsContent>
              )}

              <TabsContent value="http-response" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Final URL</div>
                    <div className="font-medium break-all">{results.finalUrl || results.url}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Serving IP Address</div>
                    <div className="font-medium">{results.httpResponse?.servingIp || "Not available"}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Status Code</div>
                    <div className="font-medium">{results.httpResponse?.statusCode || "Not available"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Body Length</div>
                    <div className="font-medium">
                      {results.httpResponse?.bodyLength ? `${results.httpResponse.bodyLength} bytes` : "Not available"}
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="headers">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        HTTP Headers
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {results.httpResponse?.headers && Object.keys(results.httpResponse.headers).length > 0 ? (
                        <div className="bg-muted rounded-md p-3 overflow-x-auto">
                          <pre className="text-xs">
                            {Object.entries(results.httpResponse.headers).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <span className="font-semibold">{key}:</span> {value}
                              </div>
                            ))}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No headers available</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="html-info" className="space-y-4 mt-4">
                {results.htmlInfo && (
                  <>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Page Title</div>
                      <div className="font-medium">{results.htmlInfo.title || "Not available"}</div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="meta-tags">
                        <AccordionTrigger className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4" />
                            Meta Tags
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {results.htmlInfo.metaTags && Object.keys(results.htmlInfo.metaTags).length > 0 ? (
                            <div className="bg-muted rounded-md p-3 overflow-x-auto">
                              <pre className="text-xs">
                                {Object.entries(results.htmlInfo.metaTags).map(([key, value]) => (
                                  <div key={key} className="mb-1">
                                    <span className="font-semibold">{key}:</span> {value}
                                  </div>
                                ))}
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No meta tags available</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cookies">
                        <AccordionTrigger className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Cookies
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {results.htmlInfo.cookies && Object.keys(results.htmlInfo.cookies).length > 0 ? (
                            <div className="bg-muted rounded-md p-3 overflow-x-auto">
                              <pre className="text-xs">
                                {Object.entries(results.htmlInfo.cookies).map(([key, value]) => (
                                  <div key={key} className="mb-1">
                                    <span className="font-semibold">{key}:</span> {value}
                                    {key.toLowerCase() === "phpsessid" && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Session Cookie
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No cookies available</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Detection Rate</div>
              <div className="text-sm text-muted-foreground">
                {results.detectionEngines.detected} / {results.detectionEngines.total} engines
              </div>
            </div>
            <Progress
              value={detectionRate}
              className={`h-2 ${results.threatDetected ? "bg-red-100" : "bg-green-100"}`}
              indicatorClassName={
                detectionRate > 50
                  ? "bg-red-500"
                  : detectionRate > 20
                    ? "bg-amber-500"
                    : detectionRate > 0
                      ? "bg-yellow-500"
                      : "bg-green-500"
              }
            />
          </div>

          {results.threatDetected && (
            <>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Threat Details</div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {type === "file" ? results.threatName : results.threatType}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Recommendations</div>
            <ul className="space-y-1 pl-6 list-disc">
              {results.recommendations.map((recommendation: string, index: number) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          {type === "file" && results.md5 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">File Hashes</div>
              <div className="space-y-1 text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto">
                <div>
                  <span className="font-semibold">MD5:</span> {results.md5}
                </div>
                <div>
                  <span className="font-semibold">SHA-1:</span> {results.sha1}
                </div>
                <div>
                  <span className="font-semibold">SHA-256:</span> {results.sha256}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

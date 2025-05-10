import type { Metadata } from "next"
import Link from "next/link"
import { FileText, Globe, AlertTriangle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Scan History - DeepDefender",
  description: "View your malware scan history",
}

// Mock data for scan history
const mockHistory = [
  {
    id: "scan-005",
    type: "url",
    name: "https://google.com",
    date: "2025-04-30T09:00:00Z",
    threatDetected: false,
    threatLevel: "None",
  },
  {
    id: "scan-000",
    type: "url",
    name: "hxxp://malshare.com/",
    date: "2025-04-30T07:00:00Z",
    threatDetected: true,
    threatLevel: "Critical",
  },
  {
    id: "scan-001",
    type: "file",
    name: "invoice-april-2023.pdf",
    date: "2025-04-15T14:30:00Z",
    threatDetected: false,
    threatLevel: "None",
  },
  {
    id: "scan-002",
    type: "url",
    name: "https://example-shop.com",
    date: "2025-04-14T10:15:00Z",
    threatDetected: true,
    threatLevel: "High",
  },
  {
    id: "scan-003",
    type: "file",
    name: "setup-installer.exe",
    date: "2025-04-12T09:45:00Z",
    threatDetected: true,
    threatLevel: "Medium",
  },
  {
    id: "scan-004",
    type: "url",
    name: "https://news-site.org",
    date: "2025-04-10T16:20:00Z",
    threatDetected: false,
    threatLevel: "None",
  },
]

export default function HistoryPage() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
            <p className="text-muted-foreground">
              View your previous scan results and detailed threat analysis reports
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Your most recent file and URL scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 divide-y">
                  {mockHistory.length > 0 ? (
                    mockHistory.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full p-2 ${scan.threatDetected ? "bg-red-100" : "bg-green-100"}`}>
                            {scan.type === "file" ? (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Globe className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{scan.name}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(scan.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={scan.threatDetected ? "destructive" : "outline"}>
                            {scan.threatLevel} Risk
                          </Badge>
                          <div>
                            {scan.threatDetected ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/history/${scan.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No scan history available. Start by scanning a file or URL.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

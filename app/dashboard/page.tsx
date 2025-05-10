import type { Metadata } from "next"
import Link from "next/link"
import { FileSearch, Globe, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "DeepDefender Dashboard",
  description: "ML-based malware detection dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to DeepDefender. Choose a scanning tool to get started.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">File Scanner</CardTitle>
                <FileSearch className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Upload and scan files to detect malware, viruses, and other threats.
                </CardDescription>
                <Button asChild className="w-full bg-lime-800 hover:bg-lime-700 text-white">
                  <Link href="/dashboard/file-scanner">Scan Files</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">URL Scanner</CardTitle>
                <Globe className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Check websites for phishing attempts, malicious content, and security vulnerabilities.
                </CardDescription>
                <Button asChild className="w-full bg-lime-800 hover:bg-lime-700 text-white">
                  <Link href="/dashboard/url-scanner">Scan URLs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Scan History</CardTitle>
                <BarChart3 className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  View your previous scan results and detailed threat analysis reports.
                </CardDescription>
                <Button asChild className="w-full bg-lime-800 hover:bg-lime-700 text-white">
                  <Link href="/dashboard/history">View History</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent scanning activity and detected threats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4 text-center text-muted-foreground">
                    No recent scanning activity. Start by scanning a file or URL.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

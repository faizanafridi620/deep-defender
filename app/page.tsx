"use client"

import Link from "next/link"
import { ArrowRight, Shield, FileSearch, Globe, BarChart3, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AuthModal from "@/components/auth-modal"
import ThemeSwitcher from "@/components/theme-switcher"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [open,setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleLoginClick = () => {
    const token = sessionStorage.getItem("authtoken");
    if(token) {
      console.log("Token found, redirecting to dashboard");
      
      router.push("/dashboard");
    }else {
      console.log("Token not found, opening modal");
      setIsModalOpen(true);
    }
  }

  const handleOpen = () =>{
    setOpen(false)
  }

  const routes = [
    {
      href: "/about",
      label: "About",
    },
    {
      href: "/#key-features",
      label: "Features",
    },
    {
      href: "/#benefits",
      label: "Benefits",
    }
  ]
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="mr-4 flex items-center gap-2 md:mr-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="flex gap-2 items-center text-xl font-bold mb-8">
                  <Shield className="h-6 w-6 text-green-600" />
                  <span>DeepDefender</span>
                </div>
                <div className="grid gap-2 py-6">
                  {routes.map((route) => (
                    <Button key={route.href} 
                    asChild 
                    variant="ghost" 
                    onClick={handleOpen}
                    className="justify-start">
                      <Link href={route.href}>{route.label}</Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex gap-2 items-center text-xl font-bold">
            <Shield className="h-6 w-6 text-green-600" />
            <span>DeepDefender</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="hidden md:flex items-center space-x-2">
              {routes.map((route) => (
                <Button key={route.href}
                asChild
                variant="ghost">
                  <Link href={route.href}>{route.label}</Link>
                </Button>
              ))}
              {/* <Button variant="ghost" size="sm">
                Pricing
              </Button> */}
            </nav>
            <ThemeSwitcher  />
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <Button className="bg-lime-800 hover:bg-lime-700 text-white"
              onClick={handleLoginClick}
              >
                {/* <Link href="/dashboard">Login</Link> */}
                Login
              </Button>
            </AuthModal>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Advanced Malware Detection <span className="text-lime-800">Powered by ML</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    DeepDefender uses machine learning algorithms to detect and protect against the latest malware
                    threats. Scan files and URLs to ensure your digital safety.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-lime-800 hover:bg-lime-700 gap-1 text-white">
                    <Link href="/dashboard">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-6 shadow-lg">
                  <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                  <div className="relative flex h-full flex-col items-center justify-center gap-8">
                    <Shield className="h-24 w-24 text-green-600" />
                    <div className="space-y-2 text-center">
                      <h2 className="text-2xl font-bold text-black">Intelligent Protection</h2>
                      <p className="text-muted-foreground">
                        Our advanced algorithms analyze patterns and behaviors to identify even the most sophisticated
                        threats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="key-features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2  className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comprehensive protection against digital threats with our advanced scanning tools
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <FileSearch className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">File Scanner</h3>
                <p className="text-center text-muted-foreground">
                  Upload and scan files to detect malware, viruses, and other threats with our advanced detection
                  engine.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <Globe className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">URL Scanner</h3>
                <p className="text-center text-muted-foreground">
                  Check websites for phishing attempts, malicious content, and security vulnerabilities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <BarChart3 className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Detailed Reports</h3>
                <p className="text-center text-muted-foreground">
                  Get comprehensive analysis with threat intelligence, risk scores, and remediation recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                {/* <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Benefits</div> */}
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose DeepDefender</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our Web Application Firewall provides numerous benefits to keep your applications secure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Enhanced Security</h3>
                <p className="text-muted-foreground">
                  Protect your web applications from common vulnerabilities like SQL injection, XSS, and CSRF attacks.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Real-time Protection</h3>
                <p className="text-muted-foreground">
                  Detect and block malicious traffic in real-time before it reaches your application.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Compliance</h3>
                <p className="text-muted-foreground">
                  Help meet security compliance requirements like GDPR, PCI DSS, and HIPAA.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Reduced Risk</h3>
                <p className="text-muted-foreground">
                  Minimize the risk of data breaches and the associated financial and reputational damage.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Visibility</h3>
                <p className="text-muted-foreground">
                  Gain insights into your traffic patterns and potential security threats.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">Customization</h3>
                <p className="text-muted-foreground">
                  Tailor security rules to your specific application needs and risk profile.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 DeepDefender. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

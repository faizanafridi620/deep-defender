import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button"
import ThemeSwitcher from "@/components/theme-switcher";


export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 px-6 items-center text-xl font-bold">
            <Shield className="h-6 w-6 text-green-600" />
            <span>DeepDefender</span>
          </div>
          <div className="flex flex-1 items-center justify-end px-6 space-x-4">
            <nav className="flex items-center space-x-2">
              <ThemeSwitcher />
              <Button variant="ghost" size="sm">
              <Link href="/">
                Home
              </Link></Button>
              {/* <Link href="#key-features" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Features
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                About
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Dashboard
              </Link> */}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-6xl">About DeepDefender</h1>
              <p className="max-w-[800px] text-muted-foreground md:text-xl">
                DeepDefender is an advanced malware detection platform powered by machine learning. Our mission is to
                provide comprehensive protection against digital threats by leveraging cutting-edge technology to scan
                files, URLs, and more.
              </p>
              <p className="max-w-[800px] text-muted-foreground md:text-xl">
                With DeepDefender, you can ensure your digital safety with tools designed to detect and mitigate even
                the most sophisticated malware and phishing attempts.
              </p>
              <Link href="/dashboard">
                <button className="px-6 py-3 text-lg font-semibold text-white bg-lime-800 rounded-lg hover:bg-lime-700">
                  Get Started
                </button>
              </Link>
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
  );
}
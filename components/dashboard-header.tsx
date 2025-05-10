"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "./theme-switcher"
import { useState } from "react"

export default function DashboardHeader() {
  const pathname = usePathname()
  const [open,setOpen] = useState(false)

  const handleOpen = () =>{
    setOpen(false)
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/file-scanner",
      label: "File Scanner",
      active: pathname === "/dashboard/file-scanner",
    },
    {
      href: "/dashboard/url-scanner",
      label: "URL Scanner",
      active: pathname === "/dashboard/url-scanner",
    },
    {
      href: "/dashboard/history",
      label: "History",
      active: pathname === "/dashboard/history",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
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
                  <Button
                    key={route.href}
                    asChild
                    onClick={handleOpen}
                    variant={route.active ? "default" : "ghost"}
                    className="justify-start"
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 text-lg font-bold">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="hidden md:inline-block">DeepDefender</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`transition-colors hover:text-foreground/80 ${
                route.active ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <ThemeSwitcher />
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-lime-800 hover:bg-lime-700">
                <User className="h-5 w-5 text-white" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/" className="w-full">
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

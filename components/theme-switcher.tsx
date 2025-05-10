"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    if (!mounted) return null;


  return (
    <button
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className="flex items-center justify-center w-10 h-10 rounded-full border bg-muted hover:bg-muted/80 transition-colors duration-200"
    aria-label="Toggle theme"
    >
        {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-800" />
        ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
        )}
    </button>
  )
}


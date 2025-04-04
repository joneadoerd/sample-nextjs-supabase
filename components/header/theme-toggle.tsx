"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle({ variant = "ghost", showLabel = false }) {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <Button
      variant={variant as any}
      size={showLabel ? "sm" : "icon"}
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {showLabel ? (
        <>
          {theme === "dark" ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          {theme === "dark" ? "Light" : "Dark"}
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </>
      )}
    </Button>
  );
}

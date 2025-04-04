"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: (Error & { digest?: string }) | null
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Safe access to error properties
  const errorMessage = error?.message || "Unknown error occurred"
  const errorDigest = error?.digest

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertOctagon className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Critical Error</CardTitle>
              <CardDescription>The application has encountered a critical error.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-destructive/10 p-4 text-sm">
                <p className="font-mono text-destructive">{errorDigest ? `Error ID: ${errorDigest}` : errorMessage}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => {
                  // Ensure reset is called properly
                  if (typeof reset === "function") {
                    reset()
                  }
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Application
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}

